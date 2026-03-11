// src/matching/MatchEngine.ts - Match validation pipeline
/**
 * MatchEngine validates tile matches using a multi-stage pipeline
 * Stage 1: Type check (fast fail)
 * Stage 2: Position check (same tile)
 * Stage 3: Pathfinding (expensive - only if types match)
 */

import { Tile, MatchResult, GameEvents } from '../types';
import { GridManager } from '../managers/GridManager';
import { TypedEventEmitter } from '../game/EventEmitter';
import { PathFinder } from './PathFinder';
import { Scoring } from './Scoring';

export class MatchEngine {
  constructor(
    private gridManager: GridManager,
    private events: TypedEventEmitter<GameEvents>
  ) {}

  /**
   * Validate if two tiles can be matched
   * Uses fail-fast pipeline: type check → position check → pathfinding
   * @param tile1 - First tile
   * @param tile2 - Second tile
   * @returns MatchResult with validity, reason, path, turns, and score
   */
  validateMatch(tile1: Tile, tile2: Tile): MatchResult {
    // Stage 1: Type check (cheap - fail fast)
    if (tile1.type !== tile2.type) {
      return { valid: false, reason: 'different-type' };
    }

    // Stage 2: Position check (prevent matching same tile)
    if (tile1.id === tile2.id) {
      return { valid: false, reason: 'same-tile' };
    }

    // Stage 3: Pathfinding (expensive - only if types match)
    const grid = this.gridManager.getAllTiles();
    const pathResult = PathFinder.findPath(
      tile1.position,
      tile2.position,
      grid,
      2 // max 2 turns
    );

    // Stage 3a: No path found
    if (!pathResult) {
      return { valid: false, reason: 'no-path' };
    }

    // Stage 3b: Path has too many turns
    if (pathResult.turns > 2) {
      return {
        valid: false,
        reason: 'too-many-turns',
        turns: pathResult.turns
      };
    }

    // Stage 4: Success - calculate score
    const score = Scoring.calculate(pathResult.turns);

    return {
      valid: true,
      path: pathResult.path,
      turns: pathResult.turns,
      score
    };
  }
}
