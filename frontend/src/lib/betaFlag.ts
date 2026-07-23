const BETA_FLAG_KEY = 'betaFlag';

export function isBetaEnabled(): boolean {
  return localStorage.getItem(BETA_FLAG_KEY) === 'true';
}
