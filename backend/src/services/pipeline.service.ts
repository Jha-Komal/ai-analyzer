import { ReviewRepository } from '../repositories/review.repository';
import { ReviewAnalysisRepository } from '../repositories/review-analysis.repository';
import { DashboardCacheRepository } from '../repositories/dashboard-cache.repository';
import { InsightRepository } from '../repositories/insight.repository';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { CsvLoaderService } from './csv-loader.service';
import { ReviewCleanerService } from './review-cleaner.service';
import { AIService } from './ai.service';
import { AggregationService } from './aggregation.service';
import { statusService } from './status.service';
import { ANALYSIS_BATCH_SIZE } from '../constants';

export class PipelineService {
  constructor(
    private reviewRepo: ReviewRepository,
    private analysisRepo: ReviewAnalysisRepository,
    private dashboardRepo: DashboardCacheRepository,
    private insightRepo: InsightRepository,
    private recommendationRepo: RecommendationRepository,
    private csvLoader: CsvLoaderService,
    private cleaner: ReviewCleanerService,
    private aiService: AIService,
    private aggregationService: AggregationService
  ) {}

  async loadReviews(): Promise<{ loaded: number; skipped: number }> {
    statusService.setStatus('loading', 0, 'Loading CSV files');

    const rawReviews = await this.csvLoader.loadAll();

    if (rawReviews.length === 0) {
      statusService.setStatus('idle', undefined, 'No CSV files found in data directory');
      return { loaded: 0, skipped: 0 };
    }

    statusService.setStatus('cleaning', 10, 'Cleaning reviews');
    const cleaned = this.cleaner.clean(rawReviews);

    let loaded = 0;
    let skipped = 0;

    for (const review of cleaned) {
      try {
        await this.reviewRepo.upsertReview(review);
        loaded++;
      } catch {
        skipped++;
      }
    }

    statusService.setStatus('idle', 100, `Loaded ${loaded} reviews`);
    return { loaded, skipped };
  }

  async runFullPipeline(): Promise<void> {
    try {
      // Step 1: Load & clean
      statusService.setStatus('loading', 0, 'Loading CSV files');
      const rawReviews = await this.csvLoader.loadAll();

      statusService.setStatus('cleaning', 10, 'Cleaning reviews');
      const cleaned = this.cleaner.clean(rawReviews);

      for (const review of cleaned) {
        await this.reviewRepo.upsertReview(review);
      }

      // Step 2: Analyze reviews in batches
      statusService.setStatus('analyzing', 20, 'Analyzing reviews with AI');
      const unanalyzed = await this.reviewRepo.findUnanalyzed();

      const batches: typeof unanalyzed[] = [];
      for (let i = 0; i < unanalyzed.length; i += ANALYSIS_BATCH_SIZE) {
        batches.push(unanalyzed.slice(i, i + ANALYSIS_BATCH_SIZE));
      }

      for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        const batch = batches[batchIdx];
        const progress = 20 + Math.floor(((batchIdx + 1) / batches.length) * 40);
        statusService.setStatus('analyzing', progress, `Analyzing batch ${batchIdx + 1}/${batches.length}`);

        const batchInput = batch.map((r) => ({
          id: r.id,
          review: r.review,
          source: r.source,
        }));

        try {
          const results = await this.aiService.analyzeReviews(batchInput);
          for (const { id, result } of results) {
            const existing = await this.analysisRepo.findByReviewId(id);
            if (!existing) {
              await this.analysisRepo.create(id, result);
            }
          }
        } catch (err) {
          console.error(`[Pipeline] Batch ${batchIdx + 1} failed:`, err);
        }
      }

      // Step 3: Aggregate
      statusService.setStatus('aggregating', 65, 'Computing aggregation stats');
      const allReviews = await this.reviewRepo.findAllWithAnalysis();
      const stats = this.aggregationService.compute(allReviews);
      const cacheData = this.aggregationService.toCacheData(stats);
      await this.dashboardRepo.upsert(cacheData);

      // Step 4: Generate insights
      statusService.setStatus('generating_insights', 80, 'Generating insights');
      const representativeReviews = allReviews
        .filter((r) => r.analysis !== null)
        .slice(0, 20)
        .map((r) => ({
          id: r.id,
          review: r.review,
          sentiment: r.analysis!.sentiment,
        }));

      const insights = await this.aiService.generateInsights(stats, representativeReviews);
      await this.insightRepo.createMany(insights);

      // Step 5: Generate recommendations
      statusService.setStatus('generating_insights', 90, 'Generating recommendations');
      const recommendations = await this.aiService.generateRecommendations(
        stats,
        insights.map((i) => ({ question: i.question, answer: i.answer }))
      );
      await this.recommendationRepo.createMany(recommendations);

      statusService.setStatus('completed', 100, 'Pipeline completed successfully');
    } catch (err) {
      statusService.setStatus('error' as 'idle', undefined, `Pipeline error: ${String(err)}`);
      throw err;
    }
  }
}
