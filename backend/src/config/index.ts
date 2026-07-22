import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'openai',
};
