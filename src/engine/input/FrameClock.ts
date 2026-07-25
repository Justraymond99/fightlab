export class FrameClock {
  private frameNumber = 0;
  private lastTimestamp: number | null = null;
  private readonly frameDurationMs: number;

  constructor(targetFps = 60) {
    this.frameDurationMs = 1000 / targetFps;
  }

  tick(timestamp: number): number {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return this.frameNumber;
    }

    const elapsed = Math.max(0, timestamp - this.lastTimestamp);
    const elapsedFrames = Math.max(1, Math.round(elapsed / this.frameDurationMs));
    this.frameNumber += elapsedFrames;
    this.lastTimestamp = timestamp;
    return this.frameNumber;
  }

  reset(): void {
    this.frameNumber = 0;
    this.lastTimestamp = null;
  }

  get current(): number {
    return this.frameNumber;
  }
}