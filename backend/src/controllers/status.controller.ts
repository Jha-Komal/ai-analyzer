import { Request, Response } from 'express';
import { statusService } from '../services/status.service';
import { sendSuccess } from '../utils/response';

export class StatusController {
  getStatus = (_req: Request, res: Response): void => {
    sendSuccess(res, statusService.getStatus());
  };
}
