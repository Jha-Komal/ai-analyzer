import { Request, Response } from 'express';
import { DashboardCacheRepository } from '../repositories/dashboard-cache.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class DashboardController {
  constructor(private dashboardRepo: DashboardCacheRepository) {}

  getDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cache = await this.dashboardRepo.findLatest();
      if (!cache) {
        sendSuccess(res, null, 'No dashboard data yet. Run /api/analyze first.');
        return;
      }

      sendSuccess(res, {
        totalCount: cache.totalCount,
        positiveCount: cache.positiveCount,
        neutralCount: cache.neutralCount,
        negativeCount: cache.negativeCount,
        averageRating: cache.averageRating,
        themeDistribution: JSON.parse(cache.themeDistribution),
        emotionDistribution: JSON.parse(cache.emotionDistribution),
        categoryDistribution: JSON.parse(cache.categoryDistribution),
        painPointDistribution: JSON.parse(cache.painPointDistribution),
        sourceDistribution: JSON.parse(cache.sourceDistribution),
        shoppingHabitDistribution: JSON.parse(cache.shoppingHabitDistribution),
        barrierDistribution: JSON.parse(cache.barrierDistribution),
        sentimentTrend: JSON.parse(cache.sentimentTrend),
        recommendationSummary: cache.recommendationSummary,
        updatedAt: cache.updatedAt,
      });
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
