// src/rendering/Renderer.ts - Canvas rendering logic for tiles and selection highlights
/**
 * Renderer handles all canvas drawing operations for the game grid.
 * It draws tiles, emojis, selection highlights, and fade-in animations.
 */

import { GridManager } from '../managers/GridManager';
import { Tile } from '../models/Tile';
import { CONFIG } from '../config';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private gridManager: GridManager;
  private canvas: HTMLCanvasElement;
  private fadeAnimationStartTimes: Map<string, number> = new Map();
  private readonly FADE_DURATION = 100; // ms per CONTEXT.md

  constructor(ctx: CanvasRenderingContext2D, gridManager: GridManager) {
    this.ctx = ctx;
    this.gridManager = gridManager;

    // Create a mock canvas for size calculations
    // In real usage, this would be passed from Game.ts
    this.canvas = {
      width: 800,
      height: 600
    } as HTMLCanvasElement;
  }

  /**
   * Main render loop - draws all tiles and selection highlights
   */
  render(): void {
    // Clear canvas with background color
    this.ctx.fillStyle = CONFIG.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate grid dimensions
    const gridWidth = CONFIG.grid.cols * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
    const gridHeight = CONFIG.grid.rows * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;

    // Center the grid within canvas
    const offsetX = (this.canvas.width - gridWidth) / 2;
    const offsetY = (this.canvas.height - gridHeight) / 2;

    // Get selected tiles for highlight rendering
    const selectedTiles = this.gridManager.selectedTilesList;
    const selectedTileIds = new Set(selectedTiles.map(t => t.id));

    // Iterate all tiles and render them
    for (let row = 0; row < CONFIG.grid.rows; row++) {
      for (let col = 0; col < CONFIG.grid.cols; col++) {
        const tile = this.gridManager.getTileAt(row, col);

        if (!tile) continue;

        // Skip cleared tiles
        if (tile.cleared) {
          continue;
        }

        // Draw the tile
        this.renderTile(this.ctx, tile, offsetX, offsetY);

        // Draw selection highlight if tile is selected
        if (selectedTileIds.has(tile.id)) {
          this.renderSelection(this.ctx, tile, offsetX, offsetY);
        }
      }
    }
  }

  /**
   * Draw a single tile with background and emoji
   * @param ctx - Canvas rendering context
   * @param tile - Tile to render
   * @param offsetX - Grid offset X (for centering)
   * @param offsetY - Grid offset Y (for centering)
   */
  private renderTile(
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    offsetX: number,
    offsetY: number
  ): void {
    // Calculate tile position
    const x = offsetX + tile.position.col * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
    const y = offsetY + tile.position.row * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;

    // Draw rounded rectangle background
    this.drawRoundedRect(ctx, x, y, CONFIG.tile.size, CONFIG.tile.size, CONFIG.tile.cornerRadius);
    ctx.fillStyle = CONFIG.colors.tile;
    ctx.fill();

    // Draw emoji centered in tile
    ctx.font = '32px sans-serif';
    ctx.fillStyle = CONFIG.colors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tile.emoji, x + CONFIG.tile.size / 2, y + CONFIG.tile.size / 2);
  }

  /**
   * Draw selection highlight with fade-in animation
   * @param ctx - Canvas rendering context
   * @param tile - Tile to highlight
   * @param offsetX - Grid offset X (for centering)
   * @param offsetY - Grid offset Y (for centering)
   */
  private renderSelection(
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    offsetX: number,
    offsetY: number
  ): void {
    // Calculate tile position
    const x = offsetX + tile.position.col * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
    const y = offsetY + tile.position.row * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;

    // Get or create fade animation start time
    let startTime = this.fadeAnimationStartTimes.get(tile.id);
    if (!startTime) {
      startTime = performance.now();
      this.fadeAnimationStartTimes.set(tile.id, startTime);
    }

    // Calculate fade progress
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / this.FADE_DURATION, 1);
    const alpha = 0.3 * progress; // 30% max opacity per CONTEXT.md

    // Draw selection border
    ctx.strokeStyle = CONFIG.colors.selection;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, CONFIG.tile.size, CONFIG.tile.size);

    // Draw background tint with fade-in
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = CONFIG.colors.selection;
    ctx.fillRect(x, y, CONFIG.tile.size, CONFIG.tile.size);
    ctx.restore();
  }

  /**
   * Draw a rounded rectangle
   * @param ctx - Canvas rendering context
   * @param x - X position
   * @param y - Y position
   * @param width - Rectangle width
   * @param height - Rectangle height
   * @param radius - Corner radius
   */
  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Get the current alpha value for selection fade-in animation
   * Exposed for testing purposes
   * @param tile - Tile to get alpha for
   * @param elapsedMs - Elapsed time since selection started
   * @returns Alpha value (0-0.3)
   */
  getSelectionAlpha(tile: Tile, elapsedMs: number): number {
    const progress = Math.min(elapsedMs / this.FADE_DURATION, 1);
    return 0.3 * progress;
  }

  /**
   * Reset fade animation for a tile (when deselected)
   * @param tileId - ID of tile to reset animation for
   */
  resetFadeAnimation(tileId: string): void {
    this.fadeAnimationStartTimes.delete(tileId);
  }

  /**
   * Update the canvas reference (for resize handling)
   * @param canvas - New canvas element
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }
}
