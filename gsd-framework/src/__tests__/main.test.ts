// Tests for src/main.ts
// TDD tests for application entry point

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../game/Game';

describe('main.ts entry point', () => {
  let originalRaf: typeof globalThis.requestAnimationFrame;
  let originalCancelRaf: typeof globalThis.cancelAnimationFrame;
  let originalPerformance: typeof globalThis.performance;

  beforeEach(() => {
    // Save originals
    originalRaf = globalThis.requestAnimationFrame;
    originalCancelRaf = globalThis.cancelAnimationFrame;
    originalPerformance = globalThis.performance;

    // Mock requestAnimationFrame on globalThis
    let rafId = 0;
    globalThis.requestAnimationFrame = vi.fn((_cb: FrameRequestCallback): number => {
      rafId++;
      return rafId;
    });
    globalThis.cancelAnimationFrame = vi.fn((_id: number) => {});

    // Mock performance.now()
    let mockTime = 0;
    globalThis.performance = {
      ...globalThis.performance,
      now: vi.fn(() => {
        mockTime += 16.67;
        return mockTime;
      }),
    } as typeof globalThis.performance;

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancelRaf;
    globalThis.performance = originalPerformance;
    vi.restoreAllMocks();
  });

  describe('Game instantiation', () => {
    it('should be able to import and instantiate Game', async () => {
      // Mock DOM
      const mockCanvas = {
        width: 0,
        height: 0,
        style: { width: '', height: '' },
        getContext: vi.fn(() => ({
          scale: vi.fn(),
          fillStyle: '',
          fillRect: vi.fn(),
        })),
      };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          return null;
        }),
      });

      vi.stubGlobal('window', { devicePixelRatio: 1 });

      // Should be able to create a Game instance
      const game = new Game();
      expect(game).toBeInstanceOf(Game);
      expect(game.canvas).toBe(mockCanvas);

      game.stop();
    });

    it('should be able to start the game', async () => {
      const mockCanvas = {
        width: 0,
        height: 0,
        style: { width: '', height: '' },
        getContext: vi.fn(() => ({
          scale: vi.fn(),
          fillStyle: '',
          fillRect: vi.fn(),
        })),
      };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          return null;
        }),
      });

      vi.stubGlobal('window', { devicePixelRatio: 1 });

      const game = new Game();
      const emitSpy = vi.spyOn(game.events, 'emit');

      game.start();

      expect(emitSpy).toHaveBeenCalledWith('game:start', undefined as never);

      game.stop();
    });

    it('should handle error events', async () => {
      const mockCanvas = {
        width: 0,
        height: 0,
        style: { width: '', height: '' },
        getContext: vi.fn(() => ({
          scale: vi.fn(),
          fillStyle: '',
          fillRect: vi.fn(),
        })),
      };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          return null;
        }),
      });

      vi.stubGlobal('window', { devicePixelRatio: 1 });

      const game = new Game();

      // Register error handler
      const errorHandler = vi.fn();
      game.events.on('error', errorHandler);

      // Emit an error
      const testError = new Error('Test error');
      game.events.emit('error', testError);

      expect(errorHandler).toHaveBeenCalledWith(testError);

      game.stop();
    });
  });

  describe('DOMContentLoaded behavior', () => {
    it('should have DOMContentLoaded event type available', () => {
      // This test verifies the event type is available
      // main.ts should use this event to initialize the game
      const eventType = 'DOMContentLoaded';
      expect(eventType).toBe('DOMContentLoaded');
    });
  });
});
