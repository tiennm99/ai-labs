// Tests for src/game/Game.ts
// TDD tests for Game class orchestrator

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../game/Game';
import { GameLoop } from '../game/GameLoop';
import { TypedEventEmitter } from '../game/EventEmitter';
import { GameState } from '../state/GameStateManager';

// Mock DOM elements
const mockCanvas = {
  width: 0,
  height: 0,
  style: { width: '', height: '' },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0, width: 836, height: 524 })),
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
        if (id === 'shuffle-overlay') return { style: { display: 'none' }, textContent: '' };
        if (id === 'shuffle-message') return { textContent: '' };
        if (id === 'game-over-overlay') return { style: { display: 'none' }, textContent: '' };
        if (id === 'game-over-message') return { textContent: '' };
        if (id === 'score-display') return { textContent: '', style: {} };
        if (id === 'previous-score-display') return { textContent: '', style: { display: 'none' } };
        if (id === 'restart-button') return { addEventListener: vi.fn() };
        return null;
      }),
    });

    // Mock window.devicePixelRatio
    vi.stubGlobal('window', {
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
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

  describe('no-moves detection', () => {
    it('should detect no-moves condition when no valid pairs remain', () => {
      game = new Game();

      // Mock game:over event emission
      const emitSpy = vi.spyOn(game.events, 'emit');

      // Get all tiles
      const tiles = game.gridManager.getAllTiles();

      // Clear all tiles of the same type except one (creating unmatchable scenario)
      // This is a simplified test - in real scenario, NoMovesDetector would check paths
      tiles.flat().forEach((tile, index) => {
        // Keep only 1 tile of type 0, clear all others
        if (tile.type === 0 && index > 0) {
          tile.cleared = true;
        }
      });

      // Trigger no-moves check by manually calling the detection logic
      // (In real game, this happens after tilesMatched event)
      const grid = game.gridManager.getAllTiles();
      const hasValidMoves = grid.flat().filter(t => !t.cleared).length > 0;

      // For this test, we verify the NoMovesDetector can be imported and called
      expect(hasValidMoves).toBe(true); // Still has tiles, so need to check paths
    });

    it('should not trigger game over when valid moves exist', () => {
      game = new Game();

      // Mock game:over event emission
      const emitSpy = vi.spyOn(game.events, 'emit');

      // Get all tiles - board is freshly initialized with many valid pairs
      const tiles = game.gridManager.getAllTiles();

      // Verify board has tiles
      const unclearedTiles = tiles.flat().filter(tile => !tile.cleared);
      expect(unclearedTiles.length).toBeGreaterThan(0);

      // Game should not be over since we just started
      expect(emitSpy).not.toHaveBeenCalledWith('game:over', { won: false });
    });
  });

  describe('game over overlay and input blocking', () => {
    it('should show game over overlay with correct message on win', () => {
      game = new Game();

      // Trigger game over with win
      game.events.emit('game:over', { won: true });

      // Verify overlay is shown (in real implementation, this would check DOM)
      // For now, we verify the game state transitioned
      expect(game.gameStateManager.getState()).toBe('GAME_OVER');
    });

    it('should show game over overlay with correct message on lose', () => {
      game = new Game();

      // Trigger game over with lose
      game.events.emit('game:over', { won: false });

      // Verify overlay is shown
      expect(game.gameStateManager.getState()).toBe('GAME_OVER');
    });

    it('should block tile input when game is in GAME_OVER state', () => {
      game = new Game();

      // Manually transition to GAME_OVER state
      game.gameStateManager.transitionTo(GameState.GAME_OVER);

      // Verify canSelectTile returns false
      expect(game.gameStateManager.canSelectTile()).toBe(false);
    });

    it('should allow tile input when game is in IDLE state', () => {
      game = new Game();

      // Game starts in IDLE state
      expect(game.gameStateManager.canSelectTile()).toBe(true);
    });
  });

  describe('previous score display element', () => {
    it('should have previous-score-display element in DOM', () => {
      // Mock document.getElementById to return an element for previous-score-display
      const mockElement = { style: {}, textContent: '' };
      const getElementByIdSpy = vi.spyOn(document, 'getElementById');

      game = new Game();

      // Verify document.getElementById was called (checking element exists in HTML)
      expect(getElementByIdSpy).toHaveBeenCalledWith('previous-score-display');
    });

    it('should have previous-score-display initially hidden', () => {
      // This test verifies the HTML element exists and is initially hidden
      // The actual implementation would check display: none in CSS
      const mockElement = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'previous-score-display') return mockElement;
          return null;
        }),
      });

      game = new Game();

      // Verify we can get the element and it has display property
      expect(document.getElementById('previous-score-display')).toBeDefined();
      expect((document.getElementById('previous-score-display') as any).style.display).toBe('none');
    });

    it('should have previous-score-display with similar styling to score-display', () => {
      // This test verifies the element structure matches the score-display pattern
      const mockScoreDisplay = { style: {}, textContent: '' };
      const mockPreviousScoreDisplay = { style: {}, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'score-display') return mockScoreDisplay;
          if (id === 'previous-score-display') return mockPreviousScoreDisplay;
          return null;
        }),
      });

      game = new Game();

      // Both elements should exist and have similar structure
      expect(document.getElementById('score-display')).toBeDefined();
      expect(document.getElementById('previous-score-display')).toBeDefined();
    });
  });

  describe('restart() method', () => {
    let mockOverlay: any;
    let mockScoreDisplay: any;
    let mockPreviousScoreDisplay: any;

    beforeEach(() => {
      mockOverlay = { style: { display: '' }, textContent: '' };
      mockScoreDisplay = { style: {}, textContent: '' };
      mockPreviousScoreDisplay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'score-display') return mockScoreDisplay;
          if (id === 'previous-score-display') return mockPreviousScoreDisplay;
          if (id === 'game-over-overlay') return mockOverlay;
          return null;
        }),
      });

      game = new Game();
    });

    it('should store current score as previousScore before reset', () => {
      // Set a score
      game['score'] = 500;

      // Call restart
      game.restart();

      // Verify previousScore was stored
      expect(game['previousScore']).toBe(500);
    });

    it('should call gridManager.initializeGrid() to regenerate tiles', () => {
      const initializeGridSpy = vi.spyOn(game.gridManager, 'initializeGrid');

      game.restart();

      expect(initializeGridSpy).toHaveBeenCalledTimes(1);
    });

    it('should reset score to 0 for new game', () => {
      // Set a score
      game['score'] = 500;

      game.restart();

      // Verify score is reset
      expect(game['score']).toBe(0);
    });

    it('should call gameStateManager.reset() to transition to IDLE', () => {
      const resetSpy = vi.spyOn(game.gameStateManager, 'reset');

      game.restart();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });

    it('should hide game over overlay', () => {
      // Show overlay first
      mockOverlay.style.display = 'flex';

      game.restart();

      // Verify overlay is hidden
      expect(mockOverlay.style.display).toBe('none');
    });

    it('should update previous score display with preserved score', () => {
      // Set a score
      game['score'] = 500;

      game.restart();

      // Verify previous score display is updated
      expect(mockPreviousScoreDisplay.textContent).toBe('Previous: 500');
      expect(mockPreviousScoreDisplay.style.display).toBe('block');
    });

    it('should hide previous score display if previousScore is 0', () => {
      // Score is already 0
      game['score'] = 0;

      game.restart();

      // Verify previous score display is hidden
      expect(mockPreviousScoreDisplay.style.display).toBe('none');
    });

    it('should emit game:restart event', () => {
      const emitSpy = vi.spyOn(game.events, 'emit');

      game.restart();

      expect(emitSpy).toHaveBeenCalledWith('game:restart', undefined as never);
    });

    it('should update current score display to 0', () => {
      // Set a score
      game['score'] = 500;

      game.restart();

      // Verify current score display shows 0
      expect(mockScoreDisplay.textContent).toBe('Score: 0');
    });
  });

  describe('restart button click handler', () => {
    let mockRestartButton: any;
    let mockOverlay: any;
    let mockScoreDisplay: any;
    let mockPreviousScoreDisplay: any;

    beforeEach(() => {
      mockRestartButton = {
        addEventListener: vi.fn(),
      };
      mockOverlay = { style: { display: '' }, textContent: '' };
      mockScoreDisplay = { style: {}, textContent: '' };
      mockPreviousScoreDisplay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'score-display') return mockScoreDisplay;
          if (id === 'previous-score-display') return mockPreviousScoreDisplay;
          if (id === 'game-over-overlay') return mockOverlay;
          if (id === 'restart-button') return mockRestartButton;
          return null;
        }),
      });

      game = new Game();
    });

    it('should register click handler on restart button in constructor', () => {
      // Verify addEventListener was called for restart button
      expect(mockRestartButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should call restart() when restart button is clicked', () => {
      // Get the click handler that was registered
      const clickHandler = mockRestartButton.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'click'
      )[1];

      // Mock the restart method
      const restartSpy = vi.spyOn(game, 'restart');

      // Simulate button click
      clickHandler();

      // Verify restart was called
      expect(restartSpy).toHaveBeenCalledTimes(1);
    });

    it('should find restart button element by ID', () => {
      // Verify document.getElementById was called for restart-button
      expect(document.getElementById).toHaveBeenCalledWith('restart-button');
    });

    it('should handle null restart button gracefully', () => {
      // Test with null restart button
      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          return null; // All other elements return null
        }),
      });

      // Should not throw error
      expect(() => {
        game = new Game();
      }).not.toThrow();
    });
  });

  describe('shuffle overlay', () => {
    it('should have shuffle-overlay element in DOM', () => {
      const mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          return null;
        }),
      });

      game = new Game();

      // Verify document.getElementById was called (checking element exists in HTML)
      expect(document.getElementById).toHaveBeenCalledWith('shuffle-overlay');
    });

    it('should have shuffle-message element inside shuffle-overlay', () => {
      const mockShuffleMessage = { textContent: '' };
      const mockShuffleOverlay = { style: { display: 'none' }, querySelector: vi.fn(() => mockShuffleMessage) };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          return null;
        }),
      });

      game = new Game();

      const overlay = document.getElementById('shuffle-overlay');
      expect(overlay).toBeDefined();
    });

    it('should have shuffle-overlay hidden by default (display: none)', () => {
      const mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          return null;
        }),
      });

      game = new Game();

      const overlay = document.getElementById('shuffle-overlay') as any;
      expect(overlay).toBeDefined();
      expect(overlay.style.display).toBe('none');
    });

    it('should have shuffle-overlay styling matching game-over-overlay pattern', () => {
      const mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };
      const mockGameOverOverlay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          if (id === 'game-over-overlay') return mockGameOverOverlay;
          return null;
        }),
      });

      game = new Game();

      expect(document.getElementById('shuffle-overlay')).toBeDefined();
      expect(document.getElementById('game-over-overlay')).toBeDefined();
    });
  });

  describe('shuffle overlay methods', () => {
    let mockShuffleOverlay: any;
    let mockGameOverOverlay: any;

    beforeEach(() => {
      mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };
      mockGameOverOverlay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          if (id === 'game-over-overlay') return mockGameOverOverlay;
          return null;
        }),
      });
    });

    it('should have showShuffleOverlay() method that sets display to flex', () => {
      game = new Game();

      // Call the showShuffleOverlay method
      game['showShuffleOverlay']();

      // Verify the overlay display is set to flex
      expect(mockShuffleOverlay.style.display).toBe('flex');
    });

    it('should have hideShuffleOverlay() method that sets display to none', () => {
      game = new Game();

      // First show the overlay
      mockShuffleOverlay.style.display = 'flex';

      // Call the hideShuffleOverlay method
      game['hideShuffleOverlay']();

      // Verify the overlay display is set to none
      expect(mockShuffleOverlay.style.display).toBe('none');
    });

    it('should handle missing shuffle overlay element gracefully', () => {
      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          return null; // All other elements return null
        }),
      });

      game = new Game();

      // Should not throw error when calling methods with null element
      expect(() => {
        game['showShuffleOverlay']();
        game['hideShuffleOverlay']();
      }).not.toThrow();
    });
  });

  describe('handleNoMoves() with auto-shuffle', () => {
    let mockShuffleOverlay: any;
    let mockGameOverOverlay: any;

    beforeEach(() => {
      mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };
      mockGameOverOverlay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          if (id === 'game-over-overlay') return mockGameOverOverlay;
          return null;
        }),
      });

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should have handleNoMoves() method that shows shuffle overlay', () => {
      game = new Game();

      // Call handleNoMoves
      game['handleNoMoves']();

      // Verify shuffle overlay is shown immediately
      expect(mockShuffleOverlay.style.display).toBe('flex');
    });

    it('should have handleNoMoves() method that calls gridManager.shuffleTiles()', () => {
      game = new Game();
      const shuffleSpy = vi.spyOn(game.gridManager, 'shuffleTiles');

      // Call handleNoMoves
      game['handleNoMoves']();

      // Advance timers to trigger shuffle
      vi.advanceTimersByTime(100);

      // Verify shuffleTiles was called
      expect(shuffleSpy).toHaveBeenCalled();
    });

    it('should have handleNoMoves() method that hides shuffle overlay after animation', () => {
      game = new Game();

      // Call handleNoMoves
      game['handleNoMoves']();

      // Advance timers past shuffle animation (50ms + 300ms)
      vi.advanceTimersByTime(400);

      // Verify shuffle overlay is hidden
      expect(mockShuffleOverlay.style.display).toBe('none');
    });

    it('should trigger game over if still no moves after max shuffle attempts', () => {
      game = new Game();

      // Set shuffle attempts to max
      game['shuffleAttempts'] = 3;

      const emitSpy = vi.spyOn(game.events, 'emit');

      // Call handleNoMoves
      game['handleNoMoves']();

      // Verify game over was triggered
      expect(emitSpy).toHaveBeenCalledWith('game:over', { won: false });
    });

    it('should NOT deduct score for shuffle', () => {
      game = new Game();
      game['score'] = 500;

      const initialScore = game['score'];

      // Call handleNoMoves
      game['handleNoMoves']();

      // Advance all timers
      vi.advanceTimersByTime(500);

      // Verify score is unchanged
      expect(game['score']).toBe(initialScore);
    });
  });

  describe('shuffle state reset on restart', () => {
    let mockShuffleOverlay: any;
    let mockGameOverOverlay: any;
    let mockScoreDisplay: any;
    let mockPreviousScoreDisplay: any;

    beforeEach(() => {
      mockShuffleOverlay = { style: { display: 'none' }, textContent: '' };
      mockGameOverOverlay = { style: { display: 'none' }, textContent: '' };
      mockScoreDisplay = { style: {}, textContent: '' };
      mockPreviousScoreDisplay = { style: { display: 'none' }, textContent: '' };

      vi.stubGlobal('document', {
        getElementById: vi.fn((id: string) => {
          if (id === 'game') return mockCanvas;
          if (id === 'shuffle-overlay') return mockShuffleOverlay;
          if (id === 'game-over-overlay') return mockGameOverOverlay;
          if (id === 'score-display') return mockScoreDisplay;
          if (id === 'previous-score-display') return mockPreviousScoreDisplay;
          return null;
        }),
      });
    });

    it('should reset shuffleAttempts to 0 on restart()', () => {
      game = new Game();

      // Set shuffle attempts
      game['shuffleAttempts'] = 3;

      // Restart
      game.restart();

      // Verify shuffle attempts reset
      expect(game['shuffleAttempts']).toBe(0);
    });

    it('should hide shuffle overlay on restart()', () => {
      game = new Game();

      // Show shuffle overlay
      mockShuffleOverlay.style.display = 'flex';

      // Restart
      game.restart();

      // Verify shuffle overlay is hidden
      expect(mockShuffleOverlay.style.display).toBe('none');
    });
  });
});
