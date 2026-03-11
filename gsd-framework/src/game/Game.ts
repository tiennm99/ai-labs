// src/game/Game.ts - Main game orchestrator class
/**
 * Game is the main orchestrator that coordinates all game components.
 * It manages the canvas, game loop, event system, grid, and rendering.
 */

import { GameLoop } from './GameLoop';
import { TypedEventEmitter } from './EventEmitter';
import { GameEvents } from '../types';
import { CONFIG } from '../config';
import { GridManager } from '../managers/GridManager';
import { Renderer } from '../rendering/Renderer';
import { MatchEngine } from '../matching/MatchEngine';
import { GameStateManager, GameState } from '../state/GameStateManager';
import { NoMovesDetector } from '../detection/NoMovesDetector';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly loop: GameLoop;
  readonly events: TypedEventEmitter<GameEvents>;
  readonly gridManager: GridManager;
  readonly renderer: Renderer;
  readonly matchEngine: MatchEngine;
  readonly gameStateManager: GameStateManager;
  private resizeTimeout: number | undefined;
  private score = 0;
  private previousScore = 0;
  private readonly MAX_SHUFFLE_ATTEMPTS = 3;
  private shuffleAttempts = 0;

  constructor() {
    // Get canvas element
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error('Canvas element with id "game" not found');
    }

    // Get 2D rendering context
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    // Initialize event emitter
    this.events = new TypedEventEmitter<GameEvents>();

    // Initialize grid manager and create grid
    this.gridManager = new GridManager(this.events);
    this.gridManager.initializeGrid();

    // Initialize match engine
    this.matchEngine = new MatchEngine(this.gridManager, this.events);

    // Initialize game state manager
    this.gameStateManager = new GameStateManager(this.events);

    // Setup canvas size and scale
    this.setupCanvas();

    // Initialize renderer with canvas reference
    this.renderer = new Renderer(this.ctx, this.gridManager);
    this.renderer.setCanvas(this.canvas);

    // Create game loop with update callback
    this.loop = new GameLoop(this.update.bind(this));

    // Listen for tilesSelected event from GridManager and validate matches
    this.gridManager.events.on('tilesSelected', ({ tile1, tile2 }) => {
      const result = this.matchEngine.validateMatch(tile1, tile2);

      if (result.valid) {
        // Successful match - draw path first
        this.renderer.drawPath(result.path!);

        // Start match animation (concurrent with path display)
        this.renderer.animateMatch([tile1, tile2]);

        // Emit tilesMatched event
        this.events.emit('tilesMatched', {
          tile1,
          tile2,
          path: result.path!,
          turns: result.turns!,
          score: result.score!
        });

        // Clear tiles from board after path animation completes
        setTimeout(() => {
          this.gridManager.clearTiles([tile1, tile2]);

          // Check for no-moves condition after tiles cleared
          const grid = this.gridManager.getAllTiles();
          const hasValidMoves = NoMovesDetector.hasValidMoves(grid);

          if (!hasValidMoves && this.gameStateManager.getState() !== GameState.GAME_OVER) {
            // No moves left - trigger auto-shuffle
            this.handleNoMoves();
          }
        }, 300); // Wait for path animation (300ms)

        // Update score immediately
        this.score += result.score!;
        this.updateScoreDisplay();

        // Emit score update event
        this.events.emit('game:score', { points: this.score });
      } else {
        // Failed match - emit matchFailed event
        this.events.emit('matchFailed', {
          tile1,
          tile2,
          reason: result.reason || 'unknown'
        });

        // Trigger shake animation for visual feedback
        this.renderer.animateShake([tile1, tile2], result.reason || 'unknown');

        // Deselect after shake animation completes
        setTimeout(() => {
          this.gridManager.deselectAll();
        }, 200); // Wait for shake animation (200ms)
      }
    });

    // Setup input listeners
    this.setupInputListeners();

    // Listen for tile:cleared events to check win condition
    this.events.on('tile:cleared', () => {
      this.checkWinCondition();
    });

    // Setup restart button handler
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.restart();
      });
    }
  }

  /**
   * Update score display in HTML overlay
   */
  private updateScoreDisplay(): void {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${this.score}`;
    }
  }

  /**
   * Sets up canvas dimensions with responsive scaling
   * Scales down to fit viewport on small screens, never scales up
   */
  private setupCanvas(): void {
    const { cols, rows } = CONFIG.grid;
    const { size, gap } = CONFIG.tile;
    const dpr = window.devicePixelRatio || 1;

    // Calculate native canvas size
    const nativeWidth = cols * (size + gap) + gap;  // 832px
    const nativeHeight = rows * (size + gap) + gap; // 528px

    // Get viewport dimensions (with padding for UI elements)
    const viewportWidth = window.innerWidth - 40;  // 20px padding each side
    const viewportHeight = window.innerHeight - 80; // Space for score display

    // Calculate scale (scale down only, never up)
    let scale = 1;
    if (viewportWidth < nativeWidth || viewportHeight < nativeHeight) {
      const scaleByWidth = viewportWidth / nativeWidth;
      const scaleByHeight = viewportHeight / nativeHeight;
      scale = Math.min(scaleByWidth, scaleByHeight, 1);
    }

    // Set canvas internal size (with DPR for sharp rendering)
    this.canvas.width = nativeWidth * dpr;
    this.canvas.height = nativeHeight * dpr;

    // Set display size via CSS (native size, scaled with transform)
    this.canvas.style.width = `${nativeWidth}px`;
    this.canvas.style.height = `${nativeHeight}px`;
    this.canvas.style.transform = `scale(${scale})`;
    this.canvas.style.transformOrigin = 'center center';

    // Scale context for DPR (reset first to avoid accumulation)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Starts the game
   */
  start(): void {
    // Emit game:start event
    this.events.emit('game:start', undefined as never);

    // Start the game loop
    this.loop.start();
  }

  /**
   * Stops the game
   */
  stop(): void {
    this.loop.stop();
  }

  /**
   * Update callback - called by GameLoop on each tick
   * @param deltaTime - Time since last update in milliseconds
   */
  private update(deltaTime: number): void {
    // Emit game:tick event
    this.events.emit('game:tick', { deltaTime });

    // Render the current frame
    this.render();
  }

  /**
   * Renders the game state to the canvas
   */
  private render(): void {
    this.renderer.render();
  }

  /**
   * Setup mouse and touch event listeners for tile selection
   */
  public setupInputListeners(): void {
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('touchstart', this.handleTouch, { passive: true });
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Handle click events on the canvas
   */
  private handleClick = (event: MouseEvent): void => {
    this.handleInput(event);
  };

  /**
   * Handle touch events on the canvas
   */
  private handleTouch = (event: TouchEvent): void => {
    this.handleInput(event);
  };

  /**
   * Handle input from mouse or touch events
   * Converts screen coordinates to canvas coordinates and selects the tile at that position
   * @param event - MouseEvent or TouchEvent
   */
  private handleInput(event: MouseEvent | TouchEvent): void {
    // Block input if game is in GAME_OVER state
    if (!this.gameStateManager.canSelectTile()) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Extract client coordinates
    let clientX: number, clientY: number;
    if ('changedTouches' in event) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Convert to canvas coordinates
    const x = (clientX - rect.left) * (this.canvas.width / rect.width / dpr);
    const y = (clientY - rect.top) * (this.canvas.height / rect.height / dpr);

    // Add ripple effect at touch/click point
    this.renderer.addRipple(x, y);

    // Find tile at coordinates
    const { size, gap } = CONFIG.tile;
    const col = Math.floor((x - gap) / (size + gap));
    const row = Math.floor((y - gap) / (size + gap));

    // Get tile and select it
    const tile = this.gridManager.getTileAt(row, col);
    if (tile) {
      this.gridManager.selectTile(tile);
    }
  }

  /**
   * Handle window resize events with debouncing
   * Recalculates canvas size and re-renders after debounce delay
   */
  private handleResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(() => {
      this.setupCanvas();
      this.renderer.render();
    }, 150); // 150ms debounce per RESEARCH.md
  };

  /**
   * Check win condition - triggers game over when all tiles are cleared
   */
  private checkWinCondition(): void {
    // Get all tiles from grid
    const tiles = this.gridManager.getAllTiles();

    // Count uncleared tiles
    const unclearedTiles = tiles.flat().filter(tile => !tile.cleared);

    // If no tiles remain, player wins!
    if (unclearedTiles.length === 0) {
      this.handleGameOver(true);
    }
  }

  /**
   * Handle game over - transition state and emit event
   * @param won - Whether the player won (true) or lost (false)
   */
  private handleGameOver(won: boolean): void {
    // Transition to GAME_OVER state
    this.gameStateManager.transitionTo(GameState.GAME_OVER);

    // Emit game:over event
    this.events.emit('game:over', { won });

    // Show game over overlay
    this.showGameOverOverlay(won);
  }

  /**
   * Show game over overlay with win/lose message
   * @param won - Whether the player won (true) or lost (false)
   */
  private showGameOverOverlay(won: boolean): void {
    const overlay = document.getElementById('game-over-overlay');
    const message = document.getElementById('game-over-message');

    if (overlay && message) {
      message.textContent = won ? 'You Win!' : 'No moves left!';
      overlay.style.display = 'flex';
    }
  }

  /**
   * Hide game over overlay
   */
  private hideGameOverOverlay(): void {
    const overlay = document.getElementById('game-over-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  /**
   * Show shuffle overlay with "Shuffling..." message
   */
  private showShuffleOverlay(): void {
    const overlay = document.getElementById('shuffle-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  }

  /**
   * Hide shuffle overlay
   */
  private hideShuffleOverlay(): void {
    const overlay = document.getElementById('shuffle-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  /**
   * Handle no-moves condition with automatic shuffle
   * Shuffles up to MAX_SHUFFLE_ATTEMPTS times before game over
   */
  private handleNoMoves(): void {
    // Check if we've exceeded max shuffle attempts
    if (this.shuffleAttempts >= this.MAX_SHUFFLE_ATTEMPTS) {
      // Truly stuck - game over
      this.handleGameOver(false);
      return;
    }

    // Increment shuffle attempts
    this.shuffleAttempts++;

    // Show shuffle overlay
    this.showShuffleOverlay();

    // Wait for animation (300-500ms per CONTEXT.md)
    setTimeout(() => {
      // Perform shuffle
      this.gridManager.shuffleTiles();

      // Hide overlay after brief display
      setTimeout(() => {
        this.hideShuffleOverlay();

        // Check if shuffle produced valid moves
        const grid = this.gridManager.getAllTiles();
        const hasValidMoves = NoMovesDetector.hasValidMoves(grid);

        if (!hasValidMoves) {
          // Still no moves - try again (recursive)
          this.handleNoMoves();
        }
        // If valid moves exist, game continues naturally
      }, 300); // Shuffle animation duration (300ms minimum)
    }, 50); // Brief delay before shuffle starts
  }

  /**
   * Update previous score display in HTML overlay
   */
  private updatePreviousScoreDisplay(): void {
    const previousScoreDisplay = document.getElementById('previous-score-display');
    if (previousScoreDisplay) {
      previousScoreDisplay.textContent = `Previous: ${this.previousScore}`;
      // Show the element if there's a previous score, hide if 0
      previousScoreDisplay.style.display = this.previousScore > 0 ? 'block' : 'none';
    }
  }

  /**
   * Restart the game - reset grid, score, state, and UI
   */
  restart(): void {
    // Store current score as previous score BEFORE reset
    this.previousScore = this.score;

    // Reset grid to initial state
    this.gridManager.initializeGrid();

    // Reset score to 0 for new game
    this.score = 0;

    // Reset state machine to IDLE
    this.gameStateManager.reset();

    // Reset shuffle attempts for new game
    this.shuffleAttempts = 0;

    // Hide all overlays
    this.hideGameOverOverlay();
    this.hideShuffleOverlay();

    // Update score displays (current = 0, previous = preserved)
    this.updateScoreDisplay();
    this.updatePreviousScoreDisplay();

    // Emit restart event for extensibility (future listeners can subscribe)
    this.events.emit('game:restart', undefined as never);
  }
}
