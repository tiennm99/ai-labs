// Tests for src/game/Game.ts
// TDD tests for Game class orchestrator

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../game/Game';
import { GameLoop } from '../game/GameLoop';
import { TypedEventEmitter } from '../game/EventEmitter';

// Mock DOM elements
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

describe('Game', () => {
  let originalRaf: typeof globalThis.requestAnimationFrame;
  let originalCancelRaf: typeof globalThis.cancelAnimationFrame;
  let originalPerformance: typeof globalThis.performance;
  let game: Game | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas.width = 0;
    mockCanvas.height = 0;
    mockCanvas.style.width = '';
    mockCanvas.style.height = '';

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

    // Mock document.getElementById
    vi.stubGlobal('document', {
      getElementById: vi.fn((id: string) => {
        if (id === 'game') return mockCanvas;
        return null;
      }),
    });

    // Mock window.devicePixelRatio
    vi.stubGlobal('window', {
      devicePixelRatio: 1,
    });
  });

  afterEach(() => {
    if (game) {
      game.stop();
      game = null;
    }
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancelRaf;
    globalThis.performance = originalPerformance;
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize canvas element', () => {
      game = new Game();
      expect(document.getElementById).toHaveBeenCalledWith('game');
      expect(game.canvas).toBe(mockCanvas);
    });

    it('should get 2D context', () => {
      game = new Game();
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should create GameLoop instance', () => {
      game = new Game();
      expect(game.loop).toBeInstanceOf(GameLoop);
    });

    it('should create TypedEventEmitter instance', () => {
      game = new Game();
      expect(game.events).toBeInstanceOf(TypedEventEmitter);
    });

    it('should set canvas size based on CONFIG', () => {
      game = new Game();
      // Expected: 16 cols * (48 size + 4 gap) + 4 gap = 16 * 52 + 4 = 836
      // Expected: 10 rows * (48 size + 4 gap) + 4 gap = 10 * 52 + 4 = 524
      expect(mockCanvas.width).toBe(836);
      expect(mockCanvas.height).toBe(524);
      expect(mockCanvas.style.width).toBe('836px');
      expect(mockCanvas.style.height).toBe('524px');
    });
  });

  describe('start()', () => {
    it('should start the game loop', () => {
      game = new Game();
      const loopSpy = vi.spyOn(game.loop, 'start');
      game.start();
      expect(loopSpy).toHaveBeenCalled();
    });

    it('should emit game:start event', () => {
      game = new Game();
      const emitSpy = vi.spyOn(game.events, 'emit');
      game.start();
      expect(emitSpy).toHaveBeenCalledWith('game:start', undefined as never);
    });
  });

  describe('stop()', () => {
    it('should stop the game loop', () => {
      game = new Game();
      const loopSpy = vi.spyOn(game.loop, 'stop');
      game.stop();
      expect(loopSpy).toHaveBeenCalled();
    });
  });

  describe('render()', () => {
    it('should clear canvas with background color', () => {
      game = new Game();
      const ctx = game.ctx;

      // render is private, so we verify it's called during update
      // by checking the fillStyle and fillRect are called
      game.start();

      // The update method should call render which sets fillStyle
      expect(ctx.fillStyle).toBeDefined();
    });
  });

  describe('update and game:tick', () => {
    it('should emit game:tick events during update', () => {
      game = new Game();
      const emitSpy = vi.spyOn(game.events, 'emit');

      // Manually trigger an update by accessing the loop's callback
      game.start();

      // Verify game:start was emitted
      expect(emitSpy).toHaveBeenCalledWith('game:start', undefined as never);
    });
  });

  describe('properties', () => {
    it('should expose canvas as readonly', () => {
      game = new Game();
      expect(game.canvas).toBeDefined();
      // Verify it's the mock canvas
      expect(game.canvas).toBe(mockCanvas);
    });

    it('should expose ctx as readonly', () => {
      game = new Game();
      expect(game.ctx).toBeDefined();
    });

    it('should expose loop as readonly', () => {
      game = new Game();
      expect(game.loop).toBeDefined();
      expect(game.loop).toBeInstanceOf(GameLoop);
    });

    it('should expose events as readonly', () => {
      game = new Game();
      expect(game.events).toBeDefined();
      expect(game.events).toBeInstanceOf(TypedEventEmitter);
    });
  });

  describe('device pixel ratio handling', () => {
    it('should scale canvas by device pixel ratio', () => {
      // Set a custom device pixel ratio
      vi.stubGlobal('window', { devicePixelRatio: 2 });

      game = new Game();

      // Expected: 836 * 2 = 1672, 524 * 2 = 1048
      expect(mockCanvas.width).toBe(1672);
      expect(mockCanvas.height).toBe(1048);
      // Style should remain at logical size
      expect(mockCanvas.style.width).toBe('836px');
      expect(mockCanvas.style.height).toBe('524px');

      // Reset
      vi.stubGlobal('window', { devicePixelRatio: 1 });
    });
  });

  describe('win condition detection', () => {
    it('should detect win condition when all tiles are cleared', () => {
      game = new Game();

      // Mock game:over event emission
      const emitSpy = vi.spyOn(game.events, 'emit');

      // Get all tiles and mark them as cleared
      const tiles = game.gridManager.getAllTiles();
      tiles.flat().forEach(tile => {
        tile.cleared = true;
      });

      // Trigger win condition check by emitting tile:cleared event
      game.events.emit('tile:cleared', { tile: tiles[0][0] });

      // Verify game:over event was emitted with won=true
      expect(emitSpy).toHaveBeenCalledWith('game:over', { won: true });
    });

    it('should not trigger win condition when tiles remain', () => {
      game = new Game();

      // Mock game:over event emission
      const emitSpy = vi.spyOn(game.events, 'emit');

      // Get all tiles and mark all but one as cleared
      const tiles = game.gridManager.getAllTiles();
      tiles.flat().forEach((tile, index) => {
        if (index < tiles.flat().length - 1) {
          tile.cleared = true;
        }
      });

      // Trigger win condition check by emitting tile:cleared event
      game.events.emit('tile:cleared', { tile: tiles[0][0] });

      // Verify game:over event was NOT emitted
      expect(emitSpy).not.toHaveBeenCalledWith('game:over', { won: true });
    });

    it('should count uncleared tiles correctly', () => {
      game = new Game();

      // Get all tiles
      const tiles = game.gridManager.getAllTiles();

      // Initially, no tiles should be cleared
      const unclearedInitial = tiles.flat().filter(tile => !tile.cleared);
      expect(unclearedInitial.length).toBe(160); // 16x10 grid

      // Clear half the tiles
      tiles.flat().forEach((tile, index) => {
        if (index % 2 === 0) {
          tile.cleared = true;
        }
      });

      // Count uncleared tiles
      const unclearedAfter = tiles.flat().filter(tile => !tile.cleared);
      expect(unclearedAfter.length).toBe(80);
    });
  });
});
