import { z } from 'zod';

const nullableStringArray = z
  .array(z.string())
  .nullable()
  .optional()
  .transform((v) => v ?? []);

export const AnalysisResultSchema = z.object({
  id: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  emotion: z.string().min(1),
  themes: nullableStringArray,
  painPoints: nullableStringArray,
  shoppingHabit: z.string().nullable().optional(),
  barrier: z.string().nullable().optional(),
  experimentLikelihood: z.enum(['high', 'medium', 'low']).nullable().optional(),
  featureRequests: nullableStringArray,
  category: z.string().optional().nullable(),
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const AnalysisResultArraySchema = z.array(AnalysisResultSchema);

export type ValidatedAnalysisResult = z.infer<typeof AnalysisResultSchema>;
