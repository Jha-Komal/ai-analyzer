import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class CartSuggestionController {
  constructor(private aiService: AIService) {}

  suggest = async (req: Request, res: Response): Promise<void> => {
    const { cartItems } = req.body as {
      cartItems?: Array<{ name: string; category: string; weight: string }>;
    };

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ success: false, error: 'cartItems required' });
      return;
    }

    try {
      const suggestion = await this.aiService.suggestCartComplement(cartItems);
      res.json({ success: true, data: suggestion });
    } catch (err) {
      console.error('[CartSuggestion] Error:', err);
      res.status(500).json({ success: false, error: 'Failed to generate suggestion' });
    }
  };
}
