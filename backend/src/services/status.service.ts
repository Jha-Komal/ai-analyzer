import { PipelineStatus, StatusState } from '../types';

class StatusService {
  private state: StatusState = {
    status: 'idle',
    progress: undefined,
    message: undefined,
  };

  getStatus(): StatusState {
    return { ...this.state };
  }

  setStatus(status: PipelineStatus, progress?: number, message?: string): void {
    this.state = { status, progress, message };
  }

  reset(): void {
    this.state = { status: 'idle' };
  }
}

// Singleton
export const statusService = new StatusService();
