import { Review, ReviewAnalysis } from '@prisma/client';
import { AggregationStats, SentimentTrendPoint } from '../types';
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
    const categoryFrequency: Record<string, number> = {};
    const sourceDistribution: Record<string, number> = {};
    const trendByMonth: Record<string, { positive: number; neutral: number; negative: number }> = {};

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

      // Sentiment trend by month
      if (review.reviewDate) {
        const d = new Date(review.reviewDate);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (!trendByMonth[key]) trendByMonth[key] = { positive: 0, neutral: 0, negative: 0 };
          if (analysis.sentiment === 'positive') trendByMonth[key].positive++;
          else if (analysis.sentiment === 'neutral') trendByMonth[key].neutral++;
          else if (analysis.sentiment === 'negative') trendByMonth[key].negative++;
        }
      }

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

      // Category
      if (analysis.category) {
        categoryFrequency[analysis.category] = (categoryFrequency[analysis.category] || 0) + 1;
      }
    }

    void analyzed; // suppress unused warning

    const TREND_START = '2026-05';
    const TREND_END = '2026-07';
    const REQUIRED_MONTHS = ['2026-05', '2026-06', '2026-07'];
    for (const m of REQUIRED_MONTHS) {
      if (!trendByMonth[m]) trendByMonth[m] = { positive: 0, neutral: 0, negative: 0 };
    }

    const sentimentTrend: SentimentTrendPoint[] = Object.entries(trendByMonth)
      .filter(([month]) => month >= TREND_START && month <= TREND_END)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({ month, ...counts }));

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
      categoryFrequency,
      sentimentTrend,
    };
  }

  toCacheData(stats: AggregationStats & { sourceDistribution: Record<string, number> }): DashboardCacheData {
    return {
      totalCount: stats.totalCount,
      positiveCount: stats.positiveCount,
      neutralCount: stats.neutralCount,
      negativeCount: stats.negativeCount,
      averageRating: stats.averageRating,
      themeDistribution: stats.themeFrequency,
      emotionDistribution: stats.emotionFrequency,
      categoryDistribution: stats.categoryFrequency,
      painPointDistribution: stats.painPointFrequency,
      sourceDistribution: stats.sourceDistribution,
      shoppingHabitDistribution: stats.shoppingHabitDistribution,
      barrierDistribution: stats.barrierDistribution,
      sentimentTrend: stats.sentimentTrend,
    };
  }
}
