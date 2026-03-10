// src/__tests__/GameLoop.test.ts - Unit tests for GameLoop class
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { GameLoop } from '../game/GameLoop';

describe('GameLoop', () => {
  let gameLoop: GameLoop;
  let updateCallback: Mock<(deltaTime: number) => void>;
  let originalRaf: typeof globalThis.requestAnimationFrame;
  let originalCancelRaf: typeof globalThis.cancelAnimationFrame;

  beforeEach(() => {
    updateCallback = vi.fn<(deltaTime: number) => void>();
    originalRaf = globalThis.requestAnimationFrame;
    originalCancelRaf = globalThis.cancelAnimationFrame;

    // Mock requestAnimationFrame and cancelAnimationFrame on global
    let rafId = 0;
    const rafCallbacks: Map<number, FrameRequestCallback> = new Map();

    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
      rafId++;
      rafCallbacks.set(rafId, cb);
      return rafId;
    });

    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    gameLoop.stop();
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancelRaf;
    vi.restoreAllMocks();
  });

  describe('start()', () => {
    it('should set running to true', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      expect(gameLoop.isRunning()).toBe(true);
    });

    it('should call requestAnimationFrame', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start again if already running', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      const callCount = (globalThis.requestAnimationFrame as Mock).mock.calls.length;
      gameLoop.start(); // Should be ignored
      expect((globalThis.requestAnimationFrame as Mock).mock.calls.length).toBe(callCount);
    });
  });

  describe('stop()', () => {
    it('should set running to false', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      gameLoop.stop();
      expect(gameLoop.isRunning()).toBe(false);
    });

    it('should cancel the animation frame', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      const rafId = gameLoop.getRafId();
      gameLoop.stop();
      expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(rafId);
    });

    it('should be safe to call stop without start', () => {
      gameLoop = new GameLoop(updateCallback);
      expect(() => gameLoop.stop()).not.toThrow();
      expect(gameLoop.isRunning()).toBe(false);
    });

    it('should be safe to call stop multiple times', () => {
      gameLoop = new GameLoop(updateCallback);
      gameLoop.start();
      gameLoop.stop();
      gameLoop.stop();
      expect(gameLoop.isRunning()).toBe(false);
    });
  });

  describe('update callback', () => {
    it('should call update with deltaTime when time has passed', () => {
      vi.useFakeTimers();

      const capturedCallbacks: FrameRequestCallback[] = [];
      globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
        capturedCallbacks.push(cb);
        return 1;
      });

      const callback = vi.fn<(deltaTime: number) => void>();
      gameLoop = new GameLoop(callback);
      gameLoop.start();

      // Simulate a frame with enough time for one tick (~16.67ms)
      if (capturedCallbacks.length > 0) {
        capturedCallbacks[0](20); // 20ms passed
      }

      // One tick should have been called
      expect(callback).toHaveBeenCalledWith(1000 / 60);

      vi.useRealTimers();
    });

    it('should not call update when no time has passed', () => {
      vi.useFakeTimers();

      const capturedCallbacks: FrameRequestCallback[] = [];
      globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
        capturedCallbacks.push(cb);
        return 1;
      });

      const callback = vi.fn<(deltaTime: number) => void>();
      gameLoop = new GameLoop(callback);
      gameLoop.start();

      // Simulate a frame with no time passed
      if (capturedCallbacks.length > 0) {
        capturedCallbacks[0](0); // No time passed
      }

      expect(callback).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('loop lifecycle', () => {
    it('should be able to start and stop multiple times', () => {
      gameLoop = new GameLoop(updateCallback);

      gameLoop.start();
      expect(gameLoop.isRunning()).toBe(true);

      gameLoop.stop();
      expect(gameLoop.isRunning()).toBe(false);

      gameLoop.start();
      expect(gameLoop.isRunning()).toBe(true);

      gameLoop.stop();
      expect(gameLoop.isRunning()).toBe(false);
    });
  });

  describe('delta time accumulation', () => {
    it('should accumulate multiple ticks correctly', () => {
      vi.useFakeTimers();

      const capturedCallbacks: FrameRequestCallback[] = [];
      globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
        capturedCallbacks.push(cb);
        return 1;
      });

      const callback = vi.fn<(deltaTime: number) => void>();
      gameLoop = new GameLoop(callback);
      gameLoop.start();

      // Simulate a frame with enough time for 3 ticks (~50ms)
      if (capturedCallbacks.length > 0) {
        capturedCallbacks[0](50);
      }

      // Three ticks should have been called
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(1000 / 60);

      vi.useRealTimers();
    });
  });

  describe('tickLength', () => {
    it('should target 60fps (16.67ms per tick)', () => {
      gameLoop = new GameLoop(updateCallback);
      expect(gameLoop.getTickLength()).toBeCloseTo(1000 / 60, 2);
    });
  });
});
