/**
 * Deterministic mulberry32 PRNG — fixed seed so sampling is reproducible run-to-run.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Evenly-spaced ("systematic") selection of `count` items from a sorted array,
 * so within-stratum selection isn't biased toward original insertion order.
 */
function systematicSelect<T>(sorted: T[], count: number): T[] {
  if (count >= sorted.length) return sorted;
  if (count <= 0) return [];
  const selected: T[] = [];
  for (let j = 0; j < count; j++) {
    const idx = Math.min(sorted.length - 1, Math.floor((j * sorted.length) / count));
    selected.push(sorted[idx]);
  }
  return selected;
}

/**
 * Build a stratified sample of `items`, grouped by `keyFn`, sized to `targetSize`.
 *
 * - Every stratum with >=2 members reserves up to 2 slots so small-but-real
 *   segments survive proportional rounding.
 * - Remaining slots are distributed proportional to stratum size using the
 *   largest-remainder method, so the total always sums to `targetSize`
 *   (capped by each stratum's actual size).
 * - Within a stratum, items are selected via systematic (evenly spaced)
 *   sampling over ids sorted by `idFn`, not "first N" — removes any bias
 *   from original load/insertion order.
 * - The final combined list is shuffled with a fixed seed for presentation
 *   order only; selection itself is fully deterministic.
 */
export function buildStratifiedSample<T>(
  items: T[],
  keyFn: (item: T) => string,
  idFn: (item: T) => string,
  targetSize: number
): T[] {
  if (items.length <= targetSize) return items;

  const strata = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const bucket = strata.get(key);
    if (bucket) bucket.push(item);
    else strata.set(key, [item]);
  }

  const strataEntries = [...strata.entries()];
  const reservePerStratum = new Map<string, number>();
  let totalReserved = 0;
  for (const [key, bucket] of strataEntries) {
    const reserve = Math.min(2, bucket.length);
    reservePerStratum.set(key, reserve);
    totalReserved += reserve;
  }

  // Pathological case: reserving 2/stratum alone exceeds the target — fall
  // back to pure proportional allocation with no reserve.
  const useReserve = totalReserved <= targetSize;
  if (!useReserve) {
    for (const key of reservePerStratum.keys()) reservePerStratum.set(key, 0);
    totalReserved = 0;
  }

  const remaining = targetSize - totalReserved;
  const totalPoolSize = items.length;

  const rawAllocations = strataEntries.map(([key, bucket]) => {
    const reserve = reservePerStratum.get(key) ?? 0;
    const eligible = bucket.length - reserve;
    const proportional = totalPoolSize > 0 ? (remaining * bucket.length) / totalPoolSize : 0;
    const floorAlloc = Math.min(eligible, Math.max(0, Math.floor(proportional)));
    return { key, bucket, reserve, floorAlloc, remainder: proportional - Math.floor(proportional), eligible };
  });

  let allocatedSoFar = rawAllocations.reduce((sum, a) => sum + a.floorAlloc, 0);
  let leftover = remaining - allocatedSoFar;

  // Largest-remainder method: hand out leftover slots to strata with the
  // biggest fractional remainder first, respecting each stratum's headroom.
  const byRemainderDesc = [...rawAllocations].sort((a, b) => b.remainder - a.remainder);
  const finalAlloc = new Map<string, number>();
  for (const a of rawAllocations) finalAlloc.set(a.key, a.floorAlloc);

  for (const a of byRemainderDesc) {
    if (leftover <= 0) break;
    const current = finalAlloc.get(a.key) ?? 0;
    const headroom = a.eligible - current;
    if (headroom > 0) {
      finalAlloc.set(a.key, current + 1);
      leftover--;
    }
  }

  const sample: T[] = [];
  for (const a of rawAllocations) {
    const sortedBucket = [...a.bucket].sort((x, y) => idFn(x).localeCompare(idFn(y)));
    const reserveCount = a.reserve;
    const allocCount = finalAlloc.get(a.key) ?? 0;
    const totalTake = Math.min(sortedBucket.length, reserveCount + allocCount);
    sample.push(...systematicSelect(sortedBucket, totalTake));
  }

  return shuffleWithSeed(sample, 42);
}
