import { z } from 'zod';

export const InsightSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  confidence: z.number().min(0).max(1),
  supportingReviewIds: z.array(z.string()),
});

export const InsightArraySchema = z.array(InsightSchema);

export type ValidatedInsight = z.infer<typeof InsightSchema>;

const KeyFindingSchema = z.object({
  rank: z.number(),
  finding: z.string().min(1),
  explanation: z.string().min(1),
});

const QuestionInsightSchema = z.object({
  question: z.string().min(1),
  direct_answer: z.string().min(1),
  key_findings: z.array(KeyFindingSchema),
  supporting_review_ids: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
});

export const InsightGenerationResponseSchema = z
  .object({
    question_insights: z.array(QuestionInsightSchema),
  })
  .passthrough();

export type ValidatedQuestionInsight = z.infer<typeof QuestionInsightSchema>;
