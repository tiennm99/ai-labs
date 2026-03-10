// src/game/GameLoop.ts - requestAnimationFrame-based game loop
/**
 * GameLoop provides a fixed-timestep game loop using requestAnimationFrame.
 * It accumulates delta time and calls the update callback at 60fps.
 */

export class GameLoop {
  private readonly tickLength: number = 1000 / 60; // 60 FPS target
  private lastTick: number = 0;
  private rafId: number = 0;
  private running: boolean = false;

  /**
   * Creates a new GameLoop
   * @param update - Callback function called with delta time in milliseconds
   */
  constructor(private update: (deltaTime: number) => void) {}

  /**
   * Starts the game loop
   */
  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTick = performance.now();
    this.rafId = requestAnimationFrame(this.main);
  }

  /**
   * Stops the game loop
   */
  stop(): void {
    if (!this.running) return;

    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  /**
   * Checks if the loop is currently running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Gets the current requestAnimationFrame ID
   */
  getRafId(): number {
    return this.rafId;
  }

  /**
   * Gets the tick length in milliseconds
   */
  getTickLength(): number {
    return this.tickLength;
  }

  /**
   * Main loop callback - called by requestAnimationFrame
   */
  private main = (timestamp: number): void => {
    if (!this.running) return;

    this.rafId = requestAnimationFrame(this.main);

    // Calculate how many ticks have passed
    const nextTick = this.lastTick + this.tickLength;
    let numTicks = 0;

    if (timestamp > nextTick) {
      const timeSinceTick = timestamp - this.lastTick;
      numTicks = Math.floor(timeSinceTick / this.tickLength);
    }

    // Process accumulated ticks
    this.queueUpdates(numTicks);
  };

  /**
   * Calls update for each accumulated tick
   */
  private queueUpdates(numTicks: number): void {
    for (let i = 0; i < numTicks; i++) {
      this.lastTick += this.tickLength;
      this.update(this.tickLength);
    }
  }
}
