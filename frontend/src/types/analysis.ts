export type PipelineStatus =
  | 'idle'
  | 'loading'
  | 'cleaning'
  | 'analyzing'
  | 'aggregating'
  | 'generating_insights'
  | 'completed';

export interface SourceProgress {
  source: string;
  label: string;
  status: 'pending' | 'connecting' | 'fetching' | 'done';
  count: number;
}

export interface StatusResponse {
  status: PipelineStatus;
  progress?: number;
  message?: string;
  sourceProgress?: SourceProgress[];
}
