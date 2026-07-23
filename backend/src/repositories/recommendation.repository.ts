import { prisma } from '../lib/prisma';
import { Recommendation } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class RecommendationRepository {
  async createMany(
    recommendations: Array<{
      priority: string;
      title: string;
      description: string;
    }>
  ): Promise<void> {
    // Clear old recommendations before inserting new ones
    await prisma.recommendation.deleteMany();

    await prisma.recommendation.createMany({
      data: recommendations.map((r) => ({
        id: uuidv4(),
        priority: r.priority,
        title: r.title,
        description: r.description,
      })),
    });
  }

  async findAll(): Promise<Recommendation[]> {
    return prisma.recommendation.findMany({
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findByPriority(priority: string): Promise<Recommendation[]> {
    return prisma.recommendation.findMany({
      where: { priority },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteAll(): Promise<void> {
    await prisma.recommendation.deleteMany();
  }
}
