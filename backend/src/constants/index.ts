import path from 'path';

export const DATA_DIR = path.join(__dirname, '..', '..', 'data');

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

export const INSIGHT_QUESTIONS = [
  'Why do users repeatedly buy from the same categories?',
  'What prevents users from exploring new categories?',
  'How do users discover products today?',
  'What role do habits play in purchasing behavior?',
  'What information do users need before trying a new category?',
  'What frustrations emerge repeatedly across reviews?',
  'Which types of users experiment more with new products?',
  'What unmet needs appear consistently in user feedback?',
];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
