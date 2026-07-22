import { z } from 'zod';

export const AnalysisResultSchema = z.object({
  id: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  emotion: z.string().min(1),
  themes: z.array(z.string()),
  painPoints: z.array(z.string()),
  shoppingHabit: z.string().nullable().optional(),
  barrier: z.string().nullable().optional(),
  experimentLikelihood: z.enum(['high', 'medium', 'low']).nullable().optional(),
  featureRequests: z.array(z.string()),
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const AnalysisResultArraySchema = z.array(AnalysisResultSchema);

export type ValidatedAnalysisResult = z.infer<typeof AnalysisResultSchema>;
