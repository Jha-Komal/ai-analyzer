import { Request, Response } from 'express';
import { PipelineService } from '../services/pipeline.service';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class PipelineController {
  constructor(private pipelineService: PipelineService) {}

  loadReviews = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.pipelineService.loadReviews();
      sendSuccess(res, result, `Loaded ${result.loaded} reviews (${result.skipped} skipped)`);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  analyze = async (_req: Request, res: Response): Promise<void> => {
    // Kick off the pipeline asynchronously, respond immediately
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Pipeline started. Poll /api/status for progress.',
    });

    // Run in background
    this.pipelineService.runFullPipeline().catch((err) => {
      console.error('[Pipeline] Fatal error:', err);
    });
  };

  resetAnalysis = async (_req: Request, res: Response): Promise<void> => {
    try {
      await this.pipelineService.resetAnalysis();
      sendSuccess(res, null, 'Analysis reset. All reviews will be re-analyzed on the next run.');
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
