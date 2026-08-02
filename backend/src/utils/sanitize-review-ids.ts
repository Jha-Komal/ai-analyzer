/**
 * Strip any review ID that isn't a member of `validIds` from every array
 * found at `paths` within `obj`, mutating in place. Mechanically enforces
 * "don't cite a review ID that wasn't actually supplied" instead of trusting
 * the model's own self-reported compliance.
 *
 * Returns the number of ids stripped, so callers can log/warn with a count.
 */
export function stripUnknownReviewIds(ids: string[], validIds: Set<string>): { kept: string[]; strippedCount: number } {
  const kept = ids.filter((id) => validIds.has(id));
  return { kept, strippedCount: ids.length - kept.length };
}
