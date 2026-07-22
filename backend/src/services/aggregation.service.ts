import { Review, ReviewAnalysis } from '@prisma/client';
import { AggregationStats } from '../types';
import { DashboardCacheData } from '../repositories/dashboard-cache.repository';

type ReviewWithAnalysis = Review & { analysis: ReviewAnalysis | null };

export class AggregationService {
  compute(reviews: ReviewWithAnalysis[]): AggregationStats & { sourceDistribution: Record<string, number> } {
    const analyzed = reviews.filter((r) => r.analysis !== null);

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    const themeFrequency: Record<string, number> = {};
    const painPointFrequency: Record<string, number> = {};
    const emotionFrequency: Record<string, number> = {};
    const shoppingHabitDistribution: Record<string, number> = {};
    const barrierDistribution: Record<string, number> = {};
    const sourceDistribution: Record<string, number> = {};

    let ratingSum = 0;
    let ratingCount = 0;

    for (const review of reviews) {
      // Source distribution
      sourceDistribution[review.source] = (sourceDistribution[review.source] || 0) + 1;

      // Rating
      if (review.rating !== null && review.rating !== undefined) {
        ratingSum += review.rating;
        ratingCount++;
      }

      const analysis = review.analysis;
      if (!analysis) continue;

      // Sentiment
      if (analysis.sentiment === 'positive') positiveCount++;
      else if (analysis.sentiment === 'neutral') neutralCount++;
      else if (analysis.sentiment === 'negative') negativeCount++;

      // Themes
      try {
        const themes = JSON.parse(analysis.themes) as string[];
        for (const theme of themes) {
          themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
        }
      } catch {
        // ignore
      }

      // Pain points
      try {
        const painPoints = JSON.parse(analysis.painPoints) as string[];
        for (const pp of painPoints) {
          painPointFrequency[pp] = (painPointFrequency[pp] || 0) + 1;
        }
      } catch {
        // ignore
      }

      // Emotions
      emotionFrequency[analysis.emotion] = (emotionFrequency[analysis.emotion] || 0) + 1;

      // Shopping habit
      if (analysis.shoppingHabit) {
        shoppingHabitDistribution[analysis.shoppingHabit] =
          (shoppingHabitDistribution[analysis.shoppingHabit] || 0) + 1;
      }

      // Barrier
      if (analysis.barrier) {
        barrierDistribution[analysis.barrier] = (barrierDistribution[analysis.barrier] || 0) + 1;
      }
    }

    void analyzed; // suppress unused warning

    return {
      totalCount: reviews.length,
      positiveCount,
      neutralCount,
      negativeCount,
      averageRating: ratingCount > 0 ? ratingSum / ratingCount : 0,
      sourceDistribution,
      themeFrequency,
      painPointFrequency,
      emotionFrequency,
      shoppingHabitDistribution,
      barrierDistribution,
    };
  }

  toCacheData(stats: AggregationStats & { sourceDistribution: Record<string, number> }): DashboardCacheData {
    return {
      positiveCount: stats.positiveCount,
      neutralCount: stats.neutralCount,
      negativeCount: stats.negativeCount,
      themeDistribution: stats.themeFrequency,
      emotionDistribution: stats.emotionFrequency,
      categoryDistribution: stats.sourceDistribution,
      painPointDistribution: stats.painPointFrequency,
    };
  }
}
