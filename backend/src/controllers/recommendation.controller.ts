import { Request, Response } from 'express';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { deepCamelCase } from '../utils/case-convert';

export class RecommendationController {
  constructor(private recommendationRepo: RecommendationRepository) {}

  getRecommendations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendations = await this.recommendationRepo.findAll();
      const parsed = recommendations.map((r) => ({
        id: r.id,
        priority: r.priority,
        title: r.title,
        description: r.description,
        categoryExpansionRelevance: r.categoryExpansionRelevance,
        basedOnQuestionIds: JSON.parse(r.basedOnQuestionIds) as number[],
        supportingFindingRefs: deepCamelCase(JSON.parse(r.supportingFindingRefs)),
        supportingReviewIds: JSON.parse(r.supportingReviewIds) as string[],
        createdAt: r.createdAt,
      }));
      sendSuccess(res, parsed);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
