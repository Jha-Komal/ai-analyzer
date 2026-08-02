import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class AiCartController {
  constructor(private aiService: AIService) {}

  build = async (req: Request, res: Response): Promise<void> => {
    const { prompt, budget, products } = req.body as {
      prompt?: string;
      budget?: number;
      products?: Array<{ id: string; name: string; price: number; category: string }>;
    };

    if (!prompt || !products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ success: false, error: 'prompt and products required' });
      return;
    }

    try {
      const result = await this.aiService.buildAiCart(prompt, budget ?? 1000, products);
      res.json({ success: true, data: result });
    } catch (err) {
      console.error('[AiCart] Error:', err);
      res.status(500).json({ success: false, error: 'Failed to build cart' });
    }
  };
}
