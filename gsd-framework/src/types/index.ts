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
 * Represents a node in the BFS pathfinding algorithm
 * Tracks position, direction, turn count, and path history
 */
export interface PathNode {
  /** Current row in grid */
  row: number;
  /** Current column in grid */
  col: number;
  /** Direction of movement (-1=none/start, 0=up, 1=right, 2=down, 3=left) */
  direction: number;
  /** Number of direction changes (turns) taken to reach this node */
  turns: number;
  /** Path taken to reach this node (including start and current position) */
  path: TilePosition[];
}

/**
 * Represents the result of a match validation
 * Provides feedback on whether tiles can be matched and why/why not
 */
export interface MatchResult {
  /** Whether the match is valid */
  valid: boolean;
  /** Reason for invalidity (e.g., "wrong type", "path too long", "no path") */
  reason?: string;
  /** Path connecting the tiles (if valid) */
  path?: TilePosition[];
  /** Number of turns in the path (if valid) */
  turns?: number;
}

/**
 * Represents a game state in the state machine
 * String enum for better debugging and logging
 */
export enum GameState {
  /** Waiting for player input */
  IDLE = 'IDLE',
  /** One tile selected, waiting for second tile */
  SELECTING = 'SELECTING',
  /** Processing match, input blocked */
  MATCHING = 'MATCHING',
  /** Game ended (win or no moves) */
  GAME_OVER = 'GAME_OVER',
}

/**
 * Represents a state transition event
 * Emitted when game state changes
 */
export interface StateChangeEvent {
  /** Previous state */
  from: GameState;
  /** New state */
  to: GameState;
}

/**
 * Maps event names to their payload types
 * Used for type-safe event emission and handling
 */
export interface GameEvents {
  'game:start': void;
  'game:restart': void;
  'game:tick': { deltaTime: number };
  'game:stateChange': StateChangeEvent;
  'tilesSelected': { tile1: Tile; tile2: Tile };
  'tile:selected': { tile: Tile; row: number; col: number };
  'tile:cleared': { tile: Tile };
  'game:score': { points: number };
  'game:over': { won: boolean };
  'error': Error;
  'tilesMatched': { tile1: Tile; tile2: Tile; path: TilePosition[]; turns: number; score: number };
  'matchFailed': { tile1: Tile; tile2: Tile; reason: string };
  'board:generated': { solvable: boolean; attempts: number };
  'board:shuffling': { tilesRemaining: number };
  'board:shuffled': { tilesRemaining: number };
}
