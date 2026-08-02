import { z } from 'zod';

const looseStringArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.filter((v): v is string => typeof v === 'string'));

const SupportingFindingRefSchema = z
  .object({
    question_id: z.number().catch(0),
    finding_rank: z.number().catch(0),
  })
  .nullable().catch(null);
const supportingFindingRefsArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => SupportingFindingRefSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null));

const categoryExpansionRelevance = z
  .enum(['direct_category_expansion', 'indirect_category_expansion', 'general_platform_issue', 'not_relevant', 'unclear'])
  .catch('unclear');

// priority/title/description are the hard-required fields — everything else
// is a citation field that degrades to a safe default rather than failing
// the whole item.
export const RecommendationSchema = z.object({
  priority: z.enum(['quick_win', 'medium', 'high', 'long_term']),
  title: z.string().min(1),
  description: z.string().min(1),
  category_expansion_relevance: categoryExpansionRelevance,
  based_on_question_ids: z.array(z.number()).catch([]),
  supporting_finding_refs: supportingFindingRefsArray,
  supporting_review_ids: looseStringArray,
});

export const RecommendationArraySchema = z.array(RecommendationSchema);

export type ValidatedRecommendation = z.infer<typeof RecommendationSchema>;
