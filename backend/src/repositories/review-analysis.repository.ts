import { prisma } from '../lib/prisma';
import { ReviewAnalysis } from '@prisma/client';
import { AnalysisResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ReviewAnalysisRepository {
  async create(reviewId: string, result: AnalysisResult): Promise<ReviewAnalysis> {
    return prisma.reviewAnalysis.create({
      data: {
        id: uuidv4(),
        reviewId,
        sentiment: result.sentiment,
        emotion: result.emotion,
        themes: JSON.stringify(result.themes),
        painPoints: JSON.stringify(result.painPoints),
        shoppingHabit: result.shoppingHabit ?? null,
        barrier: result.barrier ?? null,
        experimentLikelihood: result.experimentLikelihood ?? null,
        featureRequests: JSON.stringify(result.featureRequests),
        summary: result.summary,
        confidence: result.confidence,
      },
    });
  }

  async findByReviewId(reviewId: string): Promise<ReviewAnalysis | null> {
    return prisma.reviewAnalysis.findUnique({
      where: { reviewId },
    });
  }

  async findAll(): Promise<ReviewAnalysis[]> {
    return prisma.reviewAnalysis.findMany();
  }

  async deleteAll(): Promise<void> {
    await prisma.reviewAnalysis.deleteMany();
  }

  async countBySentiment(): Promise<{ positive: number; neutral: number; negative: number }> {
    const [positive, neutral, negative] = await Promise.all([
      prisma.reviewAnalysis.count({ where: { sentiment: 'positive' } }),
      prisma.reviewAnalysis.count({ where: { sentiment: 'neutral' } }),
      prisma.reviewAnalysis.count({ where: { sentiment: 'negative' } }),
    ]);
    return { positive, neutral, negative };
  }
}
