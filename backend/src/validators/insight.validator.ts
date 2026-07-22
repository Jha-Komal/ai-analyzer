import { z } from 'zod';

export const InsightSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  confidence: z.number().min(0).max(1),
  supportingReviewIds: z.array(z.string()),
});

export const InsightArraySchema = z.array(InsightSchema);

export type ValidatedInsight = z.infer<typeof InsightSchema>;
