export type PipelineStatus =
  | 'idle'
  | 'loading'
  | 'cleaning'
  | 'analyzing'
  | 'aggregating'
  | 'generating_insights'
  | 'completed';

export interface StatusResponse {
  status: PipelineStatus;
  progress?: number;
  message?: string;
}
