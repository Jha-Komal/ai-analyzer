import { RawReview } from '../types';
import {
  cleanReviewText,
  isOnlyStarsOrNumbers,
  normalizeDate,
  detectLanguage,
} from '../utils/text-cleaner';

export class ReviewCleanerService {
  clean(reviews: RawReview[]): RawReview[] {
    const seen = new Set<string>();
    const cleaned: RawReview[] = [];

    for (const review of reviews) {
      // Clean the text
      const text = cleanReviewText(review.review);

      // Remove empty reviews
      if (!text || text.length === 0) continue;

      // Remove reviews with only stars/numbers
      if (isOnlyStarsOrNumbers(text)) continue;

      // Remove duplicates (by cleaned text + source)
      const key = `${review.source}::${text.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Normalize date
      const normalizedDate = review.reviewDate
        ? normalizeDate(review.reviewDate)?.toISOString()
        : undefined;

      // Detect language
      const language = detectLanguage(text);

      cleaned.push({
        ...review,
        review: text,
        reviewDate: normalizedDate,
        language,
      } as RawReview & { language?: string });
    }

    return cleaned;
  }
}
