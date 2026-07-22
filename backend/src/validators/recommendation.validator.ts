import { z } from 'zod';

export const RecommendationSchema = z.object({
  priority: z.enum(['quick_win', 'medium', 'high', 'long_term']),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const RecommendationArraySchema = z.array(RecommendationSchema);

export type ValidatedRecommendation = z.infer<typeof RecommendationSchema>;
