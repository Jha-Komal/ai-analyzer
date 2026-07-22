import express from 'express';
import cors from 'cors';
import { createRouter } from './routes';
import { requestLogger } from './middlewares/request-logger';
import { errorHandler } from './middlewares/error-handler';

export function createApp(): express.Application {
  const app = express();

  // CORS
  app.use(cors({ origin: '*' }));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLogger);

  // API routes
  app.use('/api', createRouter());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
