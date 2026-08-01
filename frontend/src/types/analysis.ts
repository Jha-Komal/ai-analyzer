export type PipelineStatus =
  | 'idle'
  | 'ingesting'
  | 'loading'
  | 'cleaning'
  | 'analyzing'
  | 'aggregating'
  | 'generating_insights'
  | 'completed'
  | 'error';

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
