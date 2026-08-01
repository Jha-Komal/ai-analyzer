import { z } from 'zod';

export const ReviewQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20))
    .pipe(z.number().int().positive().max(100)),
  source: z
    .string()
    .optional()
    .transform((v) =>
      v ? v.split(',').filter((s) => ['reddit', 'playstore', 'appstore', 'x'].includes(s)) : undefined
    )
    .pipe(z.array(z.enum(['reddit', 'playstore', 'appstore', 'x'])).optional()),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  theme: z.string().optional(),
  keyword: z.string().optional(),
  rating: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined))
    .pipe(z.number().min(0).max(5).optional()),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ReviewQuery = z.infer<typeof ReviewQuerySchema>;
