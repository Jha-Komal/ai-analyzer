import { Request, Response } from 'express';
import { InsightRepository } from '../repositories/insight.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class InsightController {
  constructor(private insightRepo: InsightRepository) {}

  getInsights = async (_req: Request, res: Response): Promise<void> => {
    try {
      const insights = await this.insightRepo.findAll();
      const parsed = insights.map((i) => ({
        ...i,
        supportingReviewIds: JSON.parse(i.supportingReviewIds) as string[],
      }));
      sendSuccess(res, parsed);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
