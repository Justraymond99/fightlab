import type { NormalizedInput } from '../../types/input';

export class InputBuffer {
  private readonly capacity: number;
  private readonly items: Array<NormalizedInput | undefined>;
  private head = 0;
  private count = 0;

  constructor(capacity = 240) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('InputBuffer capacity must be a positive integer.');
    }

    this.capacity = capacity;
    this.items = new Array<NormalizedInput | undefined>(capacity);
  }

  push(input: NormalizedInput): void {
    this.items[this.head] = input;
    this.head = (this.head + 1) % this.capacity;
    this.count = Math.min(this.count + 1, this.capacity);
  }

  toArray(): NormalizedInput[] {
    const result: NormalizedInput[] = [];
    const start = (this.head - this.count + this.capacity) % this.capacity;

    for (let offset = 0; offset < this.count; offset += 1) {
      const item = this.items[(start + offset) % this.capacity];
      if (item) result.push(item);
    }

    return result;
  }

  recentWithin(timestamp: number, windowMs: number): NormalizedInput[] {
    return this.toArray().filter(
      (input) => input.timestamp <= timestamp && timestamp - input.timestamp <= windowMs,
    );
  }

  clear(): void {
    this.items.fill(undefined);
    this.head = 0;
    this.count = 0;
  }

  get size(): number {
    return this.count;
  }
}