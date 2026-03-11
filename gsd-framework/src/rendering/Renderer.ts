// src/rendering/Renderer.ts - Canvas rendering logic for tiles and selection highlights
/**
 * Renderer handles all canvas drawing operations for the game grid.
 * It draws tiles, emojis, selection highlights, and fade-in animations.
 */

import { GridManager } from '../managers/GridManager';
import { Tile } from '../models/Tile';
import { TilePosition } from '../types';
import { CONFIG } from '../config';

/**
 * ShakeAnimation class for animating tile shake effects
 * Used for visual feedback on failed matches
 */
class ShakeAnimation {
  private startTime: number;
  private readonly duration: number;
  private readonly intensity: number;
  private readonly pattern: 'horizontal' | 'circular';

  constructor(pattern: 'horizontal' | 'circular', duration: number = 200, intensity: number = 5) {
    this.startTime = 0;
    this.duration = duration;
    this.intensity = intensity;
    this.pattern = pattern;
  }

  /**
   * Start the shake animation
   */
  start(): void {
    this.startTime = performance.now();
  }

  /**
   * Get current shake offset based on elapsed time
   * @returns { x, y } offset in pixels
   */
  getOffset(): { x: number; y: number } {
    const elapsed = performance.now() - this.startTime;

    // Animation complete - return zero offset
    if (elapsed > this.duration) {
      return { x: 0, y: 0 };
    }

    // Calculate decay (1 to 0 over duration)
    const decay = 1 - (elapsed / this.duration);

    // Calculate oscillation angle
    const angle = elapsed * 0.05;

    // Calculate offset based on pattern
    if (this.pattern === 'horizontal') {
      return {
        x: Math.sin(angle) * this.intensity * decay,
        y: 0
      };
    } else {
      // Circular pattern
      return {
        x: Math.cos(angle) * this.intensity * decay,
        y: Math.sin(angle) * this.intensity * decay
      };
    }
  }

  /**
   * Check if animation is complete
   */
  isComplete(): boolean {
    return performance.now() - this.startTime > this.duration;
  }
}

/**
 * RippleAnimation class for touch feedback effect
 * Creates expanding circle at touch point
 */
class RippleAnimation {
  private startTime: number;
  private readonly x: number;
  private readonly y: number;
  private readonly duration: number = 300;
  private readonly maxRadius: number = 40;

  constructor(x: number, y: number) {
    this.startTime = performance.now();
    this.x = x;
    this.y = y;
  }

  /**
   * Render ripple and return whether animation is still active
   * @returns true if still animating, false if complete
   */
  render(ctx: CanvasRenderingContext2D): boolean {
    const elapsed = performance.now() - this.startTime;
    if (elapsed > this.duration) return false;

    const progress = elapsed / this.duration;
    const radius = this.maxRadius * progress;
    const alpha = 0.3 * (1 - progress); // Fade out

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(233, 69, 96, ${alpha})`; // Selection color
    ctx.fill();
    ctx.restore();

    return true;
  }
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private gridManager: GridManager;
  private canvas: HTMLCanvasElement;
  private fadeAnimationStartTimes: Map<string, number> = new Map();
  private readonly FADE_DURATION = 100; // ms per CONTEXT.md
  private shakeAnimations: Map<string, ShakeAnimation> = new Map();
  private rippleAnimations: RippleAnimation[] = [];
  private pathAnimation: { path: TilePosition[], startTime: number } | null = null;
  private readonly PATH_DISPLAY_DURATION = 300; // ms per CONTEXT.md

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

    // Draw path animation if active
    this.renderPathAnimation();

    // Draw ripple animations
    this.rippleAnimations = this.rippleAnimations.filter(ripple =>
      ripple.render(this.ctx)
    );

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
    // Get shake offset if animation is active
    const shakeOffset = this.getShakeOffset(tile);

    // Calculate tile position
    const x = offsetX + tile.position.col * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
    const y = offsetY + tile.position.row * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;

    // Save context before applying shake
    ctx.save();

    // Apply shake offset
    ctx.translate(shakeOffset.x, shakeOffset.y);

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

    // Restore context after shake
    ctx.restore();
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

  /**
   * Start shake animation for specified tiles
   * @param tiles - Tiles to shake
   * @param reason - Failure reason ('too-many-turns' → circular, else → horizontal)
   */
  animateShake(tiles: Tile[], reason: string): void {
    const pattern = reason === 'too-many-turns' ? 'circular' : 'horizontal';

    for (const tile of tiles) {
      const animation = new ShakeAnimation(pattern);
      animation.start();
      this.shakeAnimations.set(tile.id, animation);
    }
  }

  /**
   * Add ripple effect at touch/click coordinates
   * @param x - Canvas X coordinate
   * @param y - Canvas Y coordinate
   */
  addRipple(x: number, y: number): void {
    this.rippleAnimations.push(new RippleAnimation(x, y));
  }

  /**
   * Get shake offset for a tile if it has an active animation
   * @param tile - Tile to get offset for
   * @returns { x, y } offset in pixels (0, 0 if no animation)
   */
  private getShakeOffset(tile: Tile): { x: number; y: number } {
    const animation = this.shakeAnimations.get(tile.id);
    if (!animation) {
      return { x: 0, y: 0 };
    }

    const offset = animation.getOffset();

    // Clean up completed animations
    if (animation.isComplete()) {
      this.shakeAnimations.delete(tile.id);
    }

    return offset;
  }

  /**
   * Start path drawing animation
   * @param path - Array of tile positions to draw connection line through
   */
  drawPath(path: TilePosition[]): void {
    this.pathAnimation = {
      path,
      startTime: performance.now()
    };
  }

  /**
   * Render path animation if active
   */
  private renderPathAnimation(): void {
    if (!this.pathAnimation) {
      return;
    }

    const elapsed = performance.now() - this.pathAnimation.startTime;

    // Check if animation is complete
    if (elapsed >= this.PATH_DISPLAY_DURATION) {
      this.pathAnimation = null;
      return;
    }

    // Draw the path
    this.drawPathLine(this.pathAnimation.path);
  }

  /**
   * Draw connection line through tile centers
   * @param path - Array of tile positions to connect
   */
  private drawPathLine(path: TilePosition[]): void {
    if (path.length < 2) {
      return;
    }

    // Calculate grid offset
    const { size, gap } = CONFIG.tile;
    const gridWidth = CONFIG.grid.cols * (size + gap) + gap;
    const gridHeight = CONFIG.grid.rows * (size + gap) + gap;
    const offsetX = (this.canvas.width - gridWidth) / 2;
    const offsetY = (this.canvas.height - gridHeight) / 2;

    // Set path style
    this.ctx.strokeStyle = '#00ff00'; // Green color per CONTEXT.md
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Begin path
    this.ctx.beginPath();

    // Move to first point center
    const firstPoint = path[0];
    const firstX = offsetX + firstPoint.col * (size + gap) + gap + size / 2;
    const firstY = offsetY + firstPoint.row * (size + gap) + gap + size / 2;
    this.ctx.moveTo(firstX, firstY);

    // Line to each subsequent point center
    for (let i = 1; i < path.length; i++) {
      const point = path[i];
      const x = offsetX + point.col * (size + gap) + gap + size / 2;
      const y = offsetY + point.row * (size + gap) + gap + size / 2;
      this.ctx.lineTo(x, y);
    }

    // Stroke path
    this.ctx.stroke();
  }
}
