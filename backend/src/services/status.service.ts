import { PipelineStatus, SourceProgress, StatusState } from '../types';

class StatusService {
  private state: StatusState = {
    status: 'idle',
    progress: undefined,
    message: undefined,
    sourceProgress: undefined,
  };

  getStatus(): StatusState {
    return { ...this.state };
  }

  setStatus(status: PipelineStatus, progress?: number, message?: string): void {
    this.state = { ...this.state, status, progress, message };
  }

  setSourceProgress(sourceProgress: SourceProgress[]): void {
    this.state = { ...this.state, sourceProgress };
  }

  clearSourceProgress(): void {
    this.state = { ...this.state, sourceProgress: undefined };
  }

  reset(): void {
    this.state = { status: 'idle' };
  }
}

// Singleton
export const statusService = new StatusService();
