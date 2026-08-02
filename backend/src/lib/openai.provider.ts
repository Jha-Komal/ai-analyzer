import OpenAI from 'openai';
import { AICompleteOptions, AIProvider } from './ai-provider.interface';
import { config } from '../config';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async complete(prompt: string, options?: AICompleteOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert AI analyst specializing in user review analysis. Always respond with valid JSON only, no markdown, no explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: options?.maxTokens ?? 6000,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '';
  }
}
