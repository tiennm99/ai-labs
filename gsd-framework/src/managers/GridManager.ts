// src/managers/GridManager.ts - Manages 2D tile array and selection state
/**
 * GridManager handles the tile grid and selection state.
 * It provides methods to access tiles, manage selection, and emit events.
 */

import { Tile } from '../models/Tile';
import { TilePosition, GameEvents } from '../types';
import { TypedEventEmitter } from '../game/EventEmitter';
import { CONFIG } from '../config';
import { NoMovesDetector } from '../detection/NoMovesDetector';

export class GridManager {
  private tiles: Tile[][] = [];
  private selectedTiles: Tile[] = [];
  private events: TypedEventEmitter<GameEvents>;

  constructor(events?: TypedEventEmitter<GameEvents>) {
    // Allow optional events parameter for testing
    this.events = events || new TypedEventEmitter<GameEvents>();
  }

  /**
   * Initialize the grid with randomized tiles and verify solvability
   * Retries up to 100 times to find a solvable board
   */
  initializeGrid(): void {
    const maxAttempts = 100;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Generate random board
      this.generateRandomGrid();

      // Verify solvability using existing NoMovesDetector
      if (NoMovesDetector.hasValidMoves(this.tiles)) {
        // Solvable board found
        this.events.emit('board:generated', { solvable: true, attempts: attempt });
        return;
      }
    }

    // Fallback: accept last generated board (rely on auto-shuffle to recover)
    console.warn('Board generation: max attempts reached, accepting board');
    this.events.emit('board:generated', { solvable: false, attempts: maxAttempts });
  }

  /**
   * Generate a randomized grid using Fisher-Yates shuffle
   * Creates 16 types x 10 pairs = 160 tiles with random arrangement
   */
  private generateRandomGrid(): void {
    // 1. Create flat array of tile types (16 types x 10 pairs = 160 tiles)
    const types: number[] = [];
    for (let type = 0; type < 16; type++) {
      for (let pair = 0; pair < CONFIG.grid.pairsPerType; pair++) {
        types.push(type);
      }
    }

    // 2. Shuffle using Fisher-Yates algorithm
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    // 3. Place shuffled types in grid
    this.tiles = [];
    let typeIndex = 0;
    for (let row = 0; row < CONFIG.grid.rows; row++) {
      const rowTiles: Tile[] = [];
      for (let col = 0; col < CONFIG.grid.cols; col++) {
        const id = `tile-${row}-${col}`;
        const type = types[typeIndex++];
        const position: TilePosition = { row, col };
        rowTiles.push(new Tile(id, type, position));
      }
      this.tiles.push(rowTiles);
    }
  }

  /**
   * Get tile at specific grid coordinates
   * @param row - Row index (0-9)
   * @param col - Column index (0-15)
   * @returns Tile or null if out of bounds
   */
  getTileAt(row: number, col: number): Tile | null {
    if (row < 0 || row >= CONFIG.grid.rows || col < 0 || col >= CONFIG.grid.cols) {
      return null;
    }
    return this.tiles[row][col];
  }

  /**
   * Select or deselect a tile
   * Implements toggle behavior: clicking selected tile deselects it
   * Ignores cleared tiles
   * Emits tilesSelected event when 2 tiles are selected
   * @param tile - Tile to select/deselect
   */
  selectTile(tile: Tile): void {
    // Ignore cleared tiles
    if (tile.cleared) {
      return;
    }

    // Check if tile is already selected
    const selectedIndex = this.selectedTiles.findIndex(t => t.id === tile.id);

    if (selectedIndex !== -1) {
      // Toggle deselect: remove from selection
      this.selectedTiles.splice(selectedIndex, 1);
    } else if (this.selectedTiles.length < 2) {
      // Add to selection if less than 2 selected
      this.selectedTiles.push(tile);

      // Emit event when 2 tiles selected
      if (this.selectedTiles.length === 2) {
        this.events.emit('tilesSelected', {
          tile1: this.selectedTiles[0],
          tile2: this.selectedTiles[1]
        });
      }
    }
    // If 2 tiles already selected, ignore (input blocked)
  }

  /**
   * Deselect all tiles
   */
  deselectAll(): void {
    this.selectedTiles = [];
  }

  /**
   * Get currently selected tiles
   * @returns Copy of selected tiles array
   */
  get selectedTilesList(): Tile[] {
    return [...this.selectedTiles];
  }

  /**
   * Get all tiles in the grid
   * @returns 2D array of tiles
   */
  getAllTiles(): Tile[][] {
    return this.tiles;
  }

  /**
   * Clear tiles (mark as cleared and emit events)
   * @param tiles - Array of tiles to clear
   */
  clearTiles(tiles: Tile[]): void {
    tiles.forEach(tile => {
      tile.cleared = true;
      this.events.emit('tile:cleared', { tile });
    });

    // Clear selection after clearing tiles
    this.deselectAll();
  }

  /**
   * Get the event emitter for external subscription
   */
  getEvents(): TypedEventEmitter<GameEvents> {
    return this.events;
  }

  /**
   * Shuffle remaining tiles by redistributing types while preserving positions
   * Clears selection and emits events for UI feedback
   */
  shuffleTiles(): void {
    // 1. Collect uncleared tiles and their positions
    const unclearedTiles: Tile[] = [];

    for (let row = 0; row < CONFIG.grid.rows; row++) {
      for (let col = 0; col < CONFIG.grid.cols; col++) {
        const tile = this.tiles[row][col];
        if (!tile.cleared) {
          unclearedTiles.push(tile);
        }
      }
    }

    const tilesRemaining = unclearedTiles.length;

    // 2. Emit shuffling event before modification
    this.events.emit('board:shuffling', { tilesRemaining });

    // 3. Extract types from uncleared tiles
    const types = unclearedTiles.map(t => t.type);

    // 4. Shuffle types using Fisher-Yates
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    // 5. Reassign shuffled types back to tiles (positions preserved)
    for (let i = 0; i < unclearedTiles.length; i++) {
      unclearedTiles[i].type = types[i];
    }

    // 6. Clear selection to prevent stale references
    this.deselectAll();

    // 7. Emit shuffled event after completion
    this.events.emit('board:shuffled', { tilesRemaining });
  }
}
