import { Badge } from '../ui/badge';
import type { CategoryExpansionRelevance } from '../../types/insight';

const RELEVANCE_VARIANT: Record<CategoryExpansionRelevance, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  direct_category_expansion: 'default',
  indirect_category_expansion: 'secondary',
  general_platform_issue: 'outline',
  not_relevant: 'outline',
  unclear: 'outline',
};

const RELEVANCE_LABEL: Record<CategoryExpansionRelevance, string> = {
  direct_category_expansion: 'Direct category-expansion signal',
  indirect_category_expansion: 'Indirect category-expansion signal',
  general_platform_issue: 'General platform issue',
  not_relevant: 'Not relevant to category expansion',
  unclear: 'Relevance unclear',
};

export function CategoryExpansionBadge({ relevance }: { relevance: CategoryExpansionRelevance }) {
  return <Badge variant={RELEVANCE_VARIANT[relevance]}>{RELEVANCE_LABEL[relevance]}</Badge>;
}
