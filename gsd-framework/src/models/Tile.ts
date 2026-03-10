// src/models/Tile.ts - Tile data model
/**
 * Tile represents a single tile in the game grid.
 * It contains position, type, and state information.
 */

import { TilePosition, Tile as TileInterface } from '../types';
import { CONFIG } from '../config';

export class Tile implements TileInterface {
  /**
   * Whether this tile has been cleared from the board
   */
  public cleared: boolean = false;

  /**
   * Creates a new Tile
   * @param id - Unique identifier for this tile
   * @param type - Tile type (0-15 for emoji index)
   * @param position - Grid position (row, col)
   */
  constructor(
    public readonly id: string,
    public readonly type: number,
    public readonly position: TilePosition
  ) {}

  /**
   * Gets the emoji for this tile's type
   */
  get emoji(): string {
    return CONFIG.emojis[this.type];
  }

  /**
   * Checks if this tile is orthogonally adjacent to another tile
   * @param other - The other tile to check
   * @returns true if tiles are adjacent (not diagonal)
   */
  isAdjacent(other: Tile): boolean {
    const rowDiff = Math.abs(this.position.row - other.position.row);
    const colDiff = Math.abs(this.position.col - other.position.col);

    // Orthogonally adjacent means exactly one row OR one column difference, but not both
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }
}
