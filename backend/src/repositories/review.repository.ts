import { prisma } from '../lib/prisma';
import { Review, ReviewAnalysis } from '@prisma/client';
import { RawReview } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ReviewRepository {
  async upsertReview(raw: RawReview): Promise<Review> {
    // Use a deterministic check: find by review text + source to avoid duplicates
    const existing = await prisma.review.findFirst({
      where: {
        review: raw.review,
        source: raw.source,
      },
    });

    if (existing) return existing;

    return prisma.review.create({
      data: {
        id: uuidv4(),
        review: raw.review,
        rating: raw.rating,
        source: raw.source,
        username: raw.username,
        reviewDate: raw.reviewDate ? new Date(raw.reviewDate) : undefined,
        language: undefined,
      },
    });
  }

  async findById(id: string): Promise<(Review & { analysis: ReviewAnalysis | null }) | null> {
    return prisma.review.findUnique({
      where: { id },
      include: { analysis: true },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    source?: string[];
    sentiment?: string;
    theme?: string;
    keyword?: string;
    rating?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<{ reviews: (Review & { analysis: ReviewAnalysis | null })[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (params.source?.length) where['source'] = { in: params.source };
    if (params.rating !== undefined) where['rating'] = { gte: params.rating };
    if (params.dateFrom || params.dateTo) {
      where['reviewDate'] = {};
      if (params.dateFrom) (where['reviewDate'] as Record<string, unknown>)['gte'] = params.dateFrom;
      if (params.dateTo) (where['reviewDate'] as Record<string, unknown>)['lte'] = params.dateTo;
    }
    if (params.keyword) {
      where['review'] = { contains: params.keyword };
    }

    // For sentiment/theme filtering we need to join with analysis
    const analysisWhere: Record<string, unknown> = {};
    if (params.sentiment) analysisWhere['sentiment'] = params.sentiment;

    const includeAnalysis = params.sentiment || params.theme ? true : false;

    // Build nested where for analysis
    if (params.sentiment || params.theme) {
      where['analysis'] = { isNot: null };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: { analysis: true },
      }),
      prisma.review.count({ where }),
    ]);

    // Post-filter for sentiment and theme (stored as JSON string)
    let filtered = reviews;
    if (params.sentiment) {
      filtered = filtered.filter((r) => r.analysis?.sentiment === params.sentiment);
    }
    if (params.theme) {
      filtered = filtered.filter((r) => {
        if (!r.analysis) return false;
        try {
          const themes = JSON.parse(r.analysis.themes) as string[];
          return themes.some((t) => t.toLowerCase().includes(params.theme!.toLowerCase()));
        } catch {
          return false;
        }
      });
    }

    void includeAnalysis; // suppress unused warning

    return { reviews: filtered, total };
  }

  async findUnanalyzed(): Promise<Review[]> {
    return prisma.review.findMany({
      where: {
        analysis: null,
      },
    });
  }

  async updateLanguage(id: string, language: string): Promise<void> {
    await prisma.review.update({
      where: { id },
      data: { language },
    });
  }

  async countAll(): Promise<number> {
    return prisma.review.count();
  }

  async findAllWithAnalysis(): Promise<(Review & { analysis: ReviewAnalysis | null })[]> {
    return prisma.review.findMany({
      include: { analysis: true },
    });
  }
}
