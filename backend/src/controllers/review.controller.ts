import { Request, Response } from 'express';
import { ReviewRepository } from '../repositories/review.repository';
import { sendSuccess, sendError } from '../utils/response';
import { ReviewQuerySchema } from '../validators/review-query.validator';
import { HTTP_STATUS } from '../constants';

export class ReviewController {
  constructor(private reviewRepo: ReviewRepository) {}

  getReviews = async (req: Request, res: Response): Promise<void> => {
    const parsed = ReviewQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.message, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { page, limit, source, sentiment, theme, keyword, rating, dateFrom, dateTo } = parsed.data;
    const skip = (page - 1) * limit;

    try {
      const { reviews, total } = await this.reviewRepo.findMany({
        skip,
        take: limit,
        source,
        sentiment,
        theme,
        keyword,
        rating,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
      });

      sendSuccess(res, {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getReviewsByIds = async (req: Request, res: Response): Promise<void> => {
    const raw = req.query.ids;
    if (!raw || typeof raw !== 'string') {
      sendError(res, 'ids query param is required', HTTP_STATUS.BAD_REQUEST);
      return;
    }
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      sendError(res, 'ids must not be empty', HTTP_STATUS.BAD_REQUEST);
      return;
    }
    try {
      const reviews = await this.reviewRepo.findByIds(ids);
      sendSuccess(res, reviews);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getReviewById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const review = await this.reviewRepo.findById(id);
      if (!review) {
        sendError(res, 'Review not found', HTTP_STATUS.NOT_FOUND);
        return;
      }
      sendSuccess(res, review);
    } catch (err) {
      sendError(res, String(err), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
