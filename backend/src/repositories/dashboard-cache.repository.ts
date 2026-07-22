import { prisma } from '../lib/prisma';
import { DashboardCache } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface DashboardCacheData {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  themeDistribution: Record<string, number>;
  emotionDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  painPointDistribution: Record<string, number>;
  recommendationSummary?: string;
}

export class DashboardCacheRepository {
  async upsert(data: DashboardCacheData): Promise<DashboardCache> {
    const existing = await prisma.dashboardCache.findFirst();

    const payload = {
      positiveCount: data.positiveCount,
      neutralCount: data.neutralCount,
      negativeCount: data.negativeCount,
      themeDistribution: JSON.stringify(data.themeDistribution),
      emotionDistribution: JSON.stringify(data.emotionDistribution),
      categoryDistribution: JSON.stringify(data.categoryDistribution),
      painPointDistribution: JSON.stringify(data.painPointDistribution),
      recommendationSummary: data.recommendationSummary,
    };

    if (existing) {
      return prisma.dashboardCache.update({
        where: { id: existing.id },
        data: payload,
      });
    }

    return prisma.dashboardCache.create({
      data: {
        id: uuidv4(),
        ...payload,
      },
    });
  }

  async findLatest(): Promise<DashboardCache | null> {
    return prisma.dashboardCache.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
  }
}
