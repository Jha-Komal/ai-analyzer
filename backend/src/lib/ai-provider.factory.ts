import { AIProvider } from './ai-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { config } from '../config';

export function createAIProvider(): AIProvider {
  switch (config.aiProvider) {
    case 'openai':
      return new OpenAIProvider();
    default:
      return new OpenAIProvider();
  }
}
