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

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly loop: GameLoop;
  readonly events: TypedEventEmitter<GameEvents>;
  readonly gridManager: GridManager;
  readonly renderer: Renderer;

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

    // Setup canvas size and scale
    this.setupCanvas();

    // Initialize renderer with canvas reference
    this.renderer = new Renderer(this.ctx, this.gridManager);
    this.renderer.setCanvas(this.canvas);

    // Create game loop with update callback
    this.loop = new GameLoop(this.update.bind(this));

    // Listen for tilesSelected event (log for now - Phase 3 will handle matching logic)
    this.events.on('tilesSelected', ({ tile1, tile2 }) => {
      console.log('Two tiles selected:', tile1.id, tile2.id);
    });
  }

  /**
   * Sets up canvas dimensions and handles device pixel ratio for sharp rendering
   */
  private setupCanvas(): void {
    const { cols, rows } = CONFIG.grid;
    const { size, gap } = CONFIG.tile;
    const dpr = window.devicePixelRatio || 1;

    // Calculate logical canvas size
    const width = cols * (size + gap) + gap;
    const height = rows * (size + gap) + gap;

    // Set actual canvas size (accounting for device pixel ratio)
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    // Set display size (CSS)
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Scale context to account for device pixel ratio
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
}
