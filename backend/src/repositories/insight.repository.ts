import { prisma } from '../lib/prisma';
import { Insight } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class InsightRepository {
  async createMany(
    insights: Array<{
      question: string;
      answer: string;
      confidence: number;
      supportingReviewIds: string[];
    }>
  ): Promise<void> {
    // Clear old insights before inserting new ones
    await prisma.insight.deleteMany();

    await prisma.insight.createMany({
      data: insights.map((i) => ({
        id: uuidv4(),
        question: i.question,
        answer: i.answer,
        confidence: i.confidence,
        supportingReviewIds: JSON.stringify(i.supportingReviewIds),
      })),
    });
  }

  async findAll(): Promise<Insight[]> {
    return prisma.insight.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
