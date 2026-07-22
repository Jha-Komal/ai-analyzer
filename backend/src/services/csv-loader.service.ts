import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { DATA_DIR, CSV_SOURCE_MAP } from '../constants';
import { RawReview, ReviewSource } from '../types';

// Maps CSV `source` column values → our internal ReviewSource enum
const SOURCE_NORMALIZER: Record<string, ReviewSource> = {
  reddit: 'reddit',
  playstore: 'playstore',
  'play store': 'playstore',
  'google play': 'playstore',
  appstore: 'appstore',
  'app store': 'appstore',
  'apple store': 'appstore',
  twitter: 'x',
  x: 'x',
  community: 'community',
  forum: 'community',
};

function normalizeSource(raw: string, filenameFallback: ReviewSource): ReviewSource {
  const key = raw?.trim().toLowerCase();
  return SOURCE_NORMALIZER[key] ?? filenameFallback;
}

export class CsvLoaderService {
  /**
   * Load all CSV files from the data directory.
   * Skips files that are missing — never throws if a file does not exist.
   */
  async loadAll(): Promise<RawReview[]> {
    const allReviews: RawReview[] = [];

    for (const [filename, fileSource] of Object.entries(CSV_SOURCE_MAP)) {
      const filePath = path.join(DATA_DIR, filename);

      if (!fs.existsSync(filePath)) {
        console.log(`[CsvLoader] Skipping missing file: ${filename}`);
        continue;
      }

      try {
        const reviews = await this.loadFile(filePath, fileSource as ReviewSource);
        allReviews.push(...reviews);
        console.log(`[CsvLoader] Loaded ${reviews.length} reviews from ${filename}`);
      } catch (err) {
        console.error(`[CsvLoader] Error reading ${filename}:`, err);
      }
    }

    return allReviews;
  }

  private loadFile(filePath: string, filenameFallbackSource: ReviewSource): Promise<RawReview[]> {
    return new Promise((resolve, reject) => {
      const reviews: RawReview[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: Record<string, string>) => {
          // Prefer the embedded `source` column; fall back to what the filename implies
          const source = normalizeSource(row['source'] ?? '', filenameFallbackSource);

          // Prefer the `review` column; fall back to common alternative column names
          const reviewText =
            row['review'] ??
            row['body'] ??
            row['content'] ??
            row['comment'] ??
            row['text'] ??
            '';

          if (!reviewText || reviewText.trim() === '') return;

          // Rating: prefer numeric `rating`, fall back to `score` or `likes`
          let rating: number | undefined;
          const rawRating =
            row['rating'] !== undefined && row['rating'] !== ''
              ? row['rating']
              : row['score'] !== undefined && row['score'] !== ''
              ? row['score']
              : undefined;

          if (rawRating !== undefined) {
            const parsed = parseFloat(rawRating);
            if (!isNaN(parsed)) rating = parsed;
          }

          // Username
          const username =
            row['author'] ?? row['userName'] ?? row['username'] ?? row['user'] ?? undefined;

          // Date
          const reviewDate =
            row['date'] ??
            row['at'] ??
            row['created_utc'] ??
            row['created_at'] ??
            row['timestamp'] ??
            undefined;

          reviews.push({
            review: reviewText,
            rating,
            username: username || undefined,
            reviewDate: reviewDate || undefined,
            source,
          });
        })
        .on('end', () => resolve(reviews))
        .on('error', reject);
    });
  }
}
