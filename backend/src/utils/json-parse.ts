/**
 * Attempt to extract and parse JSON from a string that may contain extra text or markdown fences
 */
export function parseJsonSafe<T>(raw: string): T | null {
  try {
    // First try direct parse
    return JSON.parse(raw) as T;
  } catch {
    // Try to extract JSON array or object from text
    const arrayMatch = raw.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]) as T;
      } catch {
        // continue
      }
    }
    const objectMatch = raw.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]) as T;
      } catch {
        // continue
      }
    }
    return null;
  }
}
