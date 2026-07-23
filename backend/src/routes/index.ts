import { Router } from 'express';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewAnalysisRepository } from '../repositories/review-analysis.repository';
import { DashboardCacheRepository } from '../repositories/dashboard-cache.repository';
import { InsightRepository } from '../repositories/insight.repository';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { CsvLoaderService } from '../services/csv-loader.service';
import { ReviewCleanerService } from '../services/review-cleaner.service';
import { AIService } from '../services/ai.service';
import { AggregationService } from '../services/aggregation.service';
import { PipelineService } from '../services/pipeline.service';
import { ReviewController } from '../controllers/review.controller';
import { PipelineController } from '../controllers/pipeline.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { InsightController } from '../controllers/insight.controller';
import { RecommendationController } from '../controllers/recommendation.controller';
import { StatsController } from '../controllers/stats.controller';
import { StatusController } from '../controllers/status.controller';

export function createRouter(): Router {
  const router = Router();

  // Repositories
  const reviewRepo = new ReviewRepository();
  const analysisRepo = new ReviewAnalysisRepository();
  const dashboardRepo = new DashboardCacheRepository();
  const insightRepo = new InsightRepository();
  const recommendationRepo = new RecommendationRepository();

  // Services
  const csvLoader = new CsvLoaderService();
  const cleaner = new ReviewCleanerService();
  const aiService = new AIService();
  const aggregationService = new AggregationService();
  const pipelineService = new PipelineService(
    reviewRepo,
    analysisRepo,
    dashboardRepo,
    insightRepo,
    recommendationRepo,
    csvLoader,
    cleaner,
    aiService,
    aggregationService
  );

  // Controllers
  const reviewController = new ReviewController(reviewRepo);
  const pipelineController = new PipelineController(pipelineService);
  const dashboardController = new DashboardController(dashboardRepo);
  const insightController = new InsightController(insightRepo);
  const recommendationController = new RecommendationController(recommendationRepo);
  const statsController = new StatsController(dashboardRepo);
  const statusController = new StatusController();

  // Routes
  router.get('/load-reviews', pipelineController.loadReviews);
  router.post('/analyze', pipelineController.analyze);
  router.post('/reset-analysis', pipelineController.resetAnalysis);
  router.get('/dashboard', dashboardController.getDashboard);
  router.get('/insights', insightController.getInsights);
  router.get('/recommendations', recommendationController.getRecommendations);
  router.get('/reviews', reviewController.getReviews);
  router.get('/reviews/:id', reviewController.getReviewById);
  router.get('/themes', statsController.getThemes);
  router.get('/pain-points', statsController.getPainPoints);
  router.get('/emotions', statsController.getEmotions);
  router.get('/categories', statsController.getCategories);
  router.get('/status', statusController.getStatus);

  return router;
}
