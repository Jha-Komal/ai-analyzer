function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

/**
 * Recursively converts snake_case object keys to camelCase, leaving array
 * items and primitive values untouched aside from recursing into them.
 * Used to translate LLM/prompt-shaped JSON (snake_case, matching the prompt
 * schema) into the camelCase shape the frontend types expect.
 */
export function deepCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => deepCamelCase(item));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[snakeToCamelKey(key)] = deepCamelCase(val);
    }
    return out;
  }
  return value;
}
