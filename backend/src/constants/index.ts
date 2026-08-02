import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'data');

export const CSV_SOURCE_MAP: Record<string, string> = {
  'redditReviews.csv': 'reddit',
  'playStoreReviews.csv': 'playstore',
  'appStoreReviews.csv': 'appstore',
  'xReviews.csv': 'x',
  'twitterReviews.csv': 'x',   // alias — users may name it either way
  'communityReviews.csv': 'community',
};

// Default mapping matches the actual CSV schema:
// id,source,country,author,rating,title,review,date,likes,version,url
const DEFAULT_COLUMN_MAP = {
  review: 'review',
  rating: 'rating',
  username: 'author',
  reviewDate: 'date',
};

export const CSV_COLUMN_MAP: Record<string, Record<string, string>> = {
  reddit: DEFAULT_COLUMN_MAP,
  playstore: DEFAULT_COLUMN_MAP,
  appstore: DEFAULT_COLUMN_MAP,
  x: DEFAULT_COLUMN_MAP,
  community: DEFAULT_COLUMN_MAP,
};

export const ANALYSIS_BATCH_SIZE = 10;

export interface InsightQuestion {
  id: number;
  question: string;
}

export const INSIGHT_QUESTIONS: InsightQuestion[] = [
  { id: 1, question: 'Why do users repeatedly buy from the same categories?' },
  { id: 2, question: 'What prevents users from exploring new categories?' },
  { id: 3, question: 'How do users discover products today?' },
  { id: 4, question: 'What role do habits play in purchasing behavior?' },
  { id: 5, question: 'What information do users need before trying a new category?' },
  { id: 6, question: 'What frustrations emerge repeatedly across reviews?' },
  { id: 7, question: 'Which types of users experiment more with new products?' },
  { id: 8, question: 'What unmet needs appear consistently in user feedback?' },
];

export const QUESTIONS_PER_BATCH = 2;

// How many analyzed reviews to feed into insight generation. Kept well below
// the full corpus for token-budget reasons, but large + stratified enough
// (see stratified-sample.ts) that source/sentiment diversity is meaningful.
export const SAMPLE_TARGET_SIZE = 150;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
