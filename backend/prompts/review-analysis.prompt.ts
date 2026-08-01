export function buildReviewAnalysisPrompt(reviews: Array<{ id: string; review: string; source: string }>): string {
  const reviewsJson = JSON.stringify(reviews, null, 2);

  return `You are an expert e-commerce review analyst. Analyze the following user reviews and return a JSON array with one analysis object per review.

For each review, extract:
- sentiment: "positive", "neutral", or "negative"
- emotion: primary emotion (e.g., "happy", "frustrated", "confused", "disappointed", "excited", "neutral")
- themes: array of topic themes mentioned (e.g., ["delivery", "pricing", "customer_service", "product_quality", "app_usability"])
- painPoints: array of specific pain points mentioned by the user
- shoppingHabit: description of shopping habit if mentioned (or null)
- barrier: what prevents the user from buying more/exploring (or null)
- experimentLikelihood: likelihood of trying new categories ("high", "medium", "low", or null)
- featureRequests: array of features the user wants
- summary: one-sentence summary of the review
- category: product category the review is about. Must be one of: "Fresh & Grocery", "Electronics", "Home & Kitchen", "Personal Care", "Baby Care", "Snacks & Beverages", "Dairy & Breakfast", "Cleaning Essentials", "Pharmacy", "Pet Care", "Other". Infer from context — if unclear, use "Other".
- confidence: confidence score of the analysis (0.0 to 1.0)

Reviews to analyze:
${reviewsJson}

Return ONLY a valid JSON array in this exact format:
[
  {
    "id": "<review_id>",
    "sentiment": "positive|neutral|negative",
    "emotion": "<emotion>",
    "themes": ["<theme1>", "<theme2>"],
    "painPoints": ["<pain1>", "<pain2>"],
    "shoppingHabit": "<habit or null>",
    "barrier": "<barrier or null>",
    "experimentLikelihood": "high|medium|low|null",
    "featureRequests": ["<feature1>"],
    "category": "<category>",
    "summary": "<one sentence summary>",
    "confidence": 0.95
  }
]`;
}
