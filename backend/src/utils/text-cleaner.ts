/**
 * Remove HTML tags from a string
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Collapse excessive whitespace (tabs, newlines, multiple spaces)
 */
export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Check if a string is only stars, numbers, or punctuation (not meaningful review)
 */
export function isOnlyStarsOrNumbers(text: string): boolean {
  const cleaned = text.trim();
  return /^[\d\s★☆*.,!?-]+$/.test(cleaned);
}

/**
 * Normalize date to ISO format
 * Accepts Unix timestamps (number strings), ISO strings, or common date strings
 */
export function normalizeDate(dateStr: string | undefined): Date | undefined {
  if (!dateStr) return undefined;

  // Unix timestamp (seconds)
  const asNumber = parseFloat(dateStr);
  if (!isNaN(asNumber) && asNumber > 1000000000) {
    return new Date(asNumber * 1000);
  }

  // Try native parsing
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return undefined;
}

/**
 * Simple language detection heuristic
 * Returns 'en' for ASCII-dominant text, 'unknown' otherwise
 */
export function detectLanguage(text: string): string {
  const asciiChars = text.replace(/[^\x00-\x7F]/g, '').length;
  const ratio = asciiChars / text.length;
  return ratio > 0.85 ? 'en' : 'unknown';
}

/**
 * Clean a single review text
 */
export function cleanReviewText(text: string): string {
  return collapseWhitespace(stripHtml(text));
}
