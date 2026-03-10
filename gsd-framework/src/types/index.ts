// src/types/index.ts - Shared type definitions
// This file contains all TypeScript interfaces and types used throughout the game.

/**
 * Represents a position in the grid
 */
export interface TilePosition {
  row: number;
  col: number;
}

/**
 * Represents a single tile in the game grid
 */
export interface Tile {
  id: string;
  type: number;        // 0-15 for emoji index
  position: TilePosition;
  cleared: boolean;
}

/**
 * Maps event names to their payload types
 * Used for type-safe event emission and handling
 */
export interface GameEvents {
  'game:start': void;
  'game:tick': { deltaTime: number };
  'tile:selected': { tile: Tile; row: number; col: number };
  'tile:cleared': { tile: Tile };
  'game:score': { points: number };
  'game:over': { won: boolean };
  'error': Error;
}
