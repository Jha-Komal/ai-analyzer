export interface DashboardData {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalCount: number;
  averageRating: number;
  themeDistribution: Record<string, number>;
  emotionDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  painPointDistribution: Record<string, number>;
  sourceDistribution?: Record<string, number>;
  shoppingHabitDistribution?: Record<string, number>;
  barrierDistribution?: Record<string, number>;
}
