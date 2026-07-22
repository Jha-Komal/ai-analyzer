import { Request, Response } from 'express';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class RecommendationController {
  constructor(private recommendationRepo: RecommendationRepository) {}

  getRecommendations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendations = await this.recommendationRepo.findAll();
      sendSuccess(res, recommendations);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
