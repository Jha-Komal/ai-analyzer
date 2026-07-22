import './config'; // Load env vars first
import { createApp } from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

async function main(): Promise<void> {
  // Verify database connection
  try {
    await prisma.$connect();
    console.log('[Server] Database connected');
  } catch (err) {
    console.error('[Server] Database connection failed:', err);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
    console.log(`[Server] AI Provider: ${config.aiProvider}`);
  });

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    console.log('[Server] Shutting down...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('[Server] Shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => { void shutdown(); });
  process.on('SIGTERM', () => { void shutdown(); });
}

main().catch((err) => {
  console.error('[Server] Fatal error:', err);
  process.exit(1);
});
