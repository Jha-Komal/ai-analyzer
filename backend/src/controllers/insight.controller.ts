import { Request, Response } from 'express';
import { InsightRepository } from '../repositories/insight.repository';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { deepCamelCase } from '../utils/case-convert';

export class InsightController {
  constructor(private insightRepo: InsightRepository) {}

  getInsights = async (_req: Request, res: Response): Promise<void> => {
    try {
      const run = await this.insightRepo.findLatestRun();
      if (!run) {
        sendSuccess(res, { insights: [], run: null }, 'No insights yet. Run analysis first.');
        return;
      }

      const insights = run.insights.map((row) => ({
        id: row.id,
        questionId: row.questionId,
        question: row.question,
        answerStatus: row.answerStatus,
        directAnswer: row.directAnswer,
        categoryExpansionConnection: deepCamelCase(JSON.parse(row.categoryExpansionConnection)),
        keyFindings: deepCamelCase(JSON.parse(row.keyFindings)),
        counterEvidence: deepCamelCase(JSON.parse(row.counterEvidence)),
        generalPlatformIssuesExcluded: deepCamelCase(JSON.parse(row.generalPlatformIssuesExcluded)),
        categoryEligibilityConsiderations: deepCamelCase(JSON.parse(row.categoryEligibilityConsiderations)),
        evidenceGaps: deepCamelCase(JSON.parse(row.evidenceGaps)),
        allSupportingReviewIds: JSON.parse(row.allSupportingReviewIds),
        evidenceStrengthScore: row.evidenceStrengthScore,
        evidenceStrengthBand: row.evidenceStrengthBand,
        evidenceStrengthDetail: deepCamelCase(JSON.parse(row.evidenceStrengthDetail)),
        primaryCategoryExpansionRelevance: row.primaryCategoryExpansionRelevance,
        createdAt: row.createdAt,
      }));

      sendSuccess(res, {
        insights,
        run: {
          id: run.id,
          sampleSize: run.sampleSize,
          totalReviewsConsidered: run.totalReviewsConsidered,
          batchSummaries: deepCamelCase(JSON.parse(run.batchSummaries)),
          crossQuestionPatterns: deepCamelCase(JSON.parse(run.crossQuestionPatterns)),
          behavioralSegments: deepCamelCase(JSON.parse(run.behavioralSegments)),
          researchLimitations: deepCamelCase(JSON.parse(run.researchLimitations)),
          qualityChecks: deepCamelCase(JSON.parse(run.qualityChecks)),
          createdAt: run.createdAt,
        },
      });
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
