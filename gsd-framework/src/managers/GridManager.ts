// src/managers/GridManager.ts - Manages 2D tile array and selection state
/**
 * GridManager handles the tile grid and selection state.
 * It provides methods to access tiles, manage selection, and emit events.
 */

import { Tile } from '../models/Tile';
import { TilePosition, GameEvents } from '../types';
import { TypedEventEmitter } from '../game/EventEmitter';
import { CONFIG } from '../config';

export class GridManager {
  private tiles: Tile[][] = [];
  private selectedTiles: Tile[] = [];
  private events: TypedEventEmitter<GameEvents>;

  constructor(events?: TypedEventEmitter<GameEvents>) {
    // Allow optional events parameter for testing
    this.events = events || new TypedEventEmitter<GameEvents>();
  }

  /**
   * Initialize the grid with tiles based on CONFIG dimensions
   */
  initializeGrid(): void {
    this.tiles = [];

    for (let row = 0; row < CONFIG.grid.rows; row++) {
      const rowTiles: Tile[] = [];
      for (let col = 0; col < CONFIG.grid.cols; col++) {
        const id = `tile-${row}-${col}`;
        // Assign types 0-15 repeating to create pairs
        const type = (row * CONFIG.grid.cols + col) % 16;
        const position: TilePosition = { row, col };
        const tile = new Tile(id, type, position);
        rowTiles.push(tile);
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
}
