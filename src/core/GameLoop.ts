import { TICK_MS } from '../config';

export class GameLoop {
  private accumulator = 0;
  private lastTime = 0;
  private running = false;
  private rafId = 0;
  private tickFn: (dt: number) => void;
  private renderFn: (alpha: number) => void;

  constructor(tickFn: (dt: number) => void, renderFn: (alpha: number) => void) {
    this.tickFn = tickFn;
    this.renderFn = renderFn;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    let delta = now - this.lastTime;
    this.lastTime = now;

    if (delta > 200) delta = 200;

    this.accumulator += delta;

    while (this.accumulator >= TICK_MS) {
      this.tickFn(TICK_MS);
      this.accumulator -= TICK_MS;
    }

    this.renderFn(this.accumulator / TICK_MS);
  };
}
