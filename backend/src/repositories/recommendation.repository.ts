import { prisma } from '../lib/prisma';
import { Recommendation } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ValidatedRecommendation } from '../validators/recommendation.validator';

export class RecommendationRepository {
  async createMany(recommendations: ValidatedRecommendation[]): Promise<void> {
    await prisma.recommendation.deleteMany();

    await prisma.recommendation.createMany({
      data: recommendations.map((r) => ({
        id: uuidv4(),
        priority: r.priority,
        title: r.title,
        description: r.description,
        categoryExpansionRelevance: r.category_expansion_relevance,
        basedOnQuestionIds: JSON.stringify(r.based_on_question_ids),
        supportingFindingRefs: JSON.stringify(r.supporting_finding_refs),
        supportingReviewIds: JSON.stringify(r.supporting_review_ids),
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
