import { Request, Response } from 'express';
import { DashboardCacheRepository } from '../repositories/dashboard-cache.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class StatsController {
  constructor(private dashboardRepo: DashboardCacheRepository) {}

  getThemes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cache = await this.dashboardRepo.findLatest();
      if (!cache) {
        sendSuccess(res, {});
        return;
      }
      sendSuccess(res, JSON.parse(cache.themeDistribution));
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getPainPoints = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cache = await this.dashboardRepo.findLatest();
      if (!cache) {
        sendSuccess(res, {});
        return;
      }
      sendSuccess(res, JSON.parse(cache.painPointDistribution));
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getEmotions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cache = await this.dashboardRepo.findLatest();
      if (!cache) {
        sendSuccess(res, {});
        return;
      }
      sendSuccess(res, JSON.parse(cache.emotionDistribution));
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cache = await this.dashboardRepo.findLatest();
      if (!cache) {
        sendSuccess(res, {});
        return;
      }
      sendSuccess(res, JSON.parse(cache.categoryDistribution));
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
