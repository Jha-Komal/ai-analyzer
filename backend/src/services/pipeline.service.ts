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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loadReviews(): Promise<{ loaded: number; skipped: number }> {
    const LIVE_SOURCES = [
      { source: 'reddit',    label: 'Reddit',     apiLabel: 'Reddit API' },
      { source: 'playstore', label: 'Play Store',  apiLabel: 'Google Play API' },
      { source: 'appstore',  label: 'App Store',   apiLabel: 'App Store Connect' },
      { source: 'x',         label: 'X / Twitter', apiLabel: 'X API v2' },
    ];

    // Initialise all sources as pending
    statusService.setSourceProgress(
      LIVE_SOURCES.map((s) => ({ ...s, status: 'pending', count: 0 }))
    );
    statusService.setStatus('loading', 0, 'Initialising live data connections…');

    // Load all CSV data first (actual work)
    const rawReviews = await this.csvLoader.loadAll();
    const bySource: Record<string, typeof rawReviews> = {};
    for (const r of rawReviews) {
      bySource[r.source] = bySource[r.source] ?? [];
      bySource[r.source].push(r);
    }

    // Simulate per-source live fetching with animated status updates
    const progress: typeof LIVE_SOURCES[0] & { status: 'pending'|'connecting'|'fetching'|'done'; count: number }[] =
      LIVE_SOURCES.map((s) => ({ ...s, status: 'pending', count: 0 }));

    for (let i = 0; i < LIVE_SOURCES.length; i++) {
      const src = LIVE_SOURCES[i];
      const sourceReviews = bySource[src.source] ?? [];

      // Connecting phase
      progress[i] = { ...src, status: 'connecting', count: 0 };
      statusService.setSourceProgress([...progress]);
      statusService.setStatus('loading', Math.floor((i / LIVE_SOURCES.length) * 40), `Connecting to ${src.apiLabel}…`);
      await this.delay(800);

      // Fetching phase — simulate count ticking up
      progress[i] = { ...src, status: 'fetching', count: 0 };
      statusService.setSourceProgress([...progress]);
      statusService.setStatus('loading', Math.floor((i / LIVE_SOURCES.length) * 40 + 5), `Fetching discussions from ${src.apiLabel}…`);

      const steps = 3;
      for (let step = 1; step <= steps; step++) {
        await this.delay(500);
        const partial = Math.floor((sourceReviews.length * step) / steps);
        progress[i] = { ...src, status: 'fetching', count: partial };
        statusService.setSourceProgress([...progress]);
      }

      // Done
      progress[i] = { ...src, status: 'done', count: sourceReviews.length };
      statusService.setSourceProgress([...progress]);
      await this.delay(300);
    }

    if (rawReviews.length === 0) {
      statusService.setStatus('idle', undefined, 'No data files found');
      statusService.clearSourceProgress();
      return { loaded: 0, skipped: 0 };
    }

    statusService.setStatus('cleaning', 45, 'Deduplicating and cleaning reviews…');
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
    statusService.clearSourceProgress();
    return { loaded, skipped };
  }

  async resetAnalysis(): Promise<void> {
    await this.analysisRepo.deleteAll();
    await this.insightRepo.deleteAll();
    await this.recommendationRepo.deleteAll();
    await this.dashboardRepo.deleteAll();
    statusService.setStatus('idle', undefined, 'Analysis reset. Ready to re-analyze from scratch.');
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
          const validIds = new Set(batchInput.map((r) => r.id));
          const results = await this.aiService.analyzeReviews(batchInput);

          for (const { id, result } of results) {
            if (!validIds.has(id)) {
              console.warn(`[Pipeline] Batch ${batchIdx + 1}: AI returned unknown review id "${id}", skipping`);
              continue;
            }

            try {
              const existing = await this.analysisRepo.findByReviewId(id);
              if (!existing) {
                await this.analysisRepo.create(id, result);
              }
            } catch (err) {
              console.error(`[Pipeline] Batch ${batchIdx + 1}: failed to save analysis for review ${id}:`, err);
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
      const analyzedSample = allReviews.filter((r) => r.analysis !== null).slice(0, 20);

      const reviews = analyzedSample.map((r) => ({
        id: r.id,
        review: r.review,
      }));

      const reviewAnalysis = analyzedSample.map((r) => ({
        reviewId: r.id,
        sentiment: r.analysis!.sentiment,
        emotion: r.analysis!.emotion,
        themes: JSON.parse(r.analysis!.themes) as string[],
        painPoints: JSON.parse(r.analysis!.painPoints) as string[],
        shoppingHabit: r.analysis!.shoppingHabit ?? undefined,
        barrier: r.analysis!.barrier ?? undefined,
        experimentLikelihood: r.analysis!.experimentLikelihood ?? undefined,
        featureRequests: JSON.parse(r.analysis!.featureRequests) as string[],
        summary: r.analysis!.summary,
        confidence: r.analysis!.confidence,
      }));

      const insights = await this.aiService.generateInsights(stats, reviews, reviewAnalysis);
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
