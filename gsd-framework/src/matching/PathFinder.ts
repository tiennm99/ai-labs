// src/matching/PathFinder.ts - BFS pathfinding algorithm with turn counting
import { TilePosition, Tile, PathNode } from '../types';
import { CONFIG } from '../config';

/**
 * PathFinder implements BFS pathfinding with turn constraints
 * Finds paths between two tiles with maximum 2 turns (3 straight lines)
 */
export class PathFinder {
  /**
   * Direction encoding: 0=up, 1=right, 2=down, 3=left
   * Using these deltas: row changes by -1/+1, col changes by -1/+1
   */
  private static readonly DIRECTIONS = [
    { row: -1, col: 0 },  // 0: up
    { row: 0, col: 1 },   // 1: right
    { row: 1, col: 0 },   // 2: down
    { row: 0, col: -1 }   // 3: left
  ];

  /**
   * Finds a valid path between two tiles with maximum turns constraint
   * @param start - Starting tile position
   * @param end - Ending tile position
   * @param grid - 2D array of tiles
   * @param maxTurns - Maximum allowed turns (default: 2)
   * @returns PathNode if valid path found, null otherwise
   */
  static findPath(
    start: TilePosition,
    end: TilePosition,
    grid: Tile[][],
    maxTurns: number = 2
  ): PathNode | null {
    // Initialize BFS queue with start node
    // Start with direction=-1 (no direction yet), 0 turns, path containing start position
    const queue: PathNode[] = [{
      row: start.row,
      col: start.col,
      direction: -1,  // No direction yet (first move doesn't count as turn)
      turns: 0,
      path: [{ row: start.row, col: start.col }]
    }];

    // Track visited states to avoid cycles
    // State key: "row,col,direction" - same position with different direction is different state
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      const { row, col, direction, turns, path } = currentNode;

      // Check if we reached the destination
      if (row === end.row && col === end.col) {
        return currentNode;
      }

      // Skip if already exceeded max turns
      if (turns > maxTurns) {
        continue;
      }

      // Try all 4 directions
      for (let newDirection = 0; newDirection < 4; newDirection++) {
        const newRow = row + PathFinder.DIRECTIONS[newDirection].row;
        const newCol = col + PathFinder.DIRECTIONS[newDirection].col;

        // Check bounds
        if (newRow < 0 || newRow >= CONFIG.grid.rows ||
            newCol < 0 || newCol >= CONFIG.grid.cols) {
          continue;
        }

        // Check if passable (tile must be cleared)
        const tile = grid[newRow][newCol];
        if (!tile.cleared) {
          continue;
        }

        // Calculate turn increment
        // First move (direction=-1) doesn't count as turn
        // Changing direction counts as turn, continuing straight doesn't
        let turnIncrement = 0;
        if (direction !== -1 && newDirection !== direction) {
          turnIncrement = 1;
        }

        const newTurns = turns + turnIncrement;

        // Create state key for visited tracking
        const stateKey = `${newRow},${newCol},${newDirection}`;

        // Skip if this state already visited
        if (visited.has(stateKey)) {
          continue;
        }

        // Mark as visited
        visited.add(stateKey);

        // Add to queue with extended path
        queue.push({
          row: newRow,
          col: newCol,
          direction: newDirection,
          turns: newTurns,
          path: [...path, { row: newRow, col: newCol }]
        });
      }
    }

    // No valid path found
    return null;
  }
}
