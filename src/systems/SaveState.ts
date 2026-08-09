export interface CheckpointData {
  x: number;
  y: number;
}

class SaveStateStore {
  private checkpoint: CheckpointData | null = null;

  getCheckpoint(): CheckpointData | null {
    return this.checkpoint;
  }

  setCheckpoint(x: number, y: number): void {
    this.checkpoint = { x, y };
  }

  reset(): void {
    this.checkpoint = null;
  }
}

export const SaveState = new SaveStateStore();
