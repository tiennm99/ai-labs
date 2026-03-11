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
  private resizeTimeout: number | undefined;

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

    // Setup input listeners
    this.setupInputListeners();
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
}
