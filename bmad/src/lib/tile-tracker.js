import { GRID_SIZE, DIRECTIONS } from './constants.js';

let nextId = 1;

export function resetTracker() {
  nextId = 1;
}

/** Create tile objects with unique IDs from a grid */
export function createTilesFromGrid(grid) {
  const tiles = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== 0) {
        tiles.push({ id: nextId++, value: grid[row][col], row, col, isNew: true, isMerged: false });
      }
    }
  }
  return tiles;
}

/**
 * Track tile movements through a move.
 * Simulates the slide/merge to map old tile IDs to new positions.
 * Returns new tile array with preserved IDs for moved tiles, new IDs for spawned tiles.
 */
export function computeTilesAfterMove(prevTiles, prevGrid, newGrid, direction) {
  // Build position → tile lookup from previous tiles
  const posMap = new Map();
  for (const tile of prevTiles) {
    posMap.set(`${tile.row}-${tile.col}`, tile);
  }

  // Simulate the move to track tile ID mappings
  const resultTiles = [];
  const processLine = (cells) => simulateLine(cells, posMap, resultTiles);

  if (direction === DIRECTIONS.LEFT) {
    for (let row = 0; row < GRID_SIZE; row++) {
      const cells = [];
      for (let col = 0; col < GRID_SIZE; col++) cells.push({ row, col });
      processLine(cells);
    }
  } else if (direction === DIRECTIONS.RIGHT) {
    for (let row = 0; row < GRID_SIZE; row++) {
      const cells = [];
      for (let col = GRID_SIZE - 1; col >= 0; col--) cells.push({ row, col });
      processLine(cells);
    }
  } else if (direction === DIRECTIONS.UP) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cells = [];
      for (let row = 0; row < GRID_SIZE; row++) cells.push({ row, col });
      processLine(cells);
    }
  } else if (direction === DIRECTIONS.DOWN) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cells = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) cells.push({ row, col });
      processLine(cells);
    }
  }

  // Find the spawned tile: cell in newGrid that has a value but no resultTile at that position
  const resultPosSet = new Set(resultTiles.map(t => `${t.row}-${t.col}`));
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (newGrid[row][col] !== 0 && !resultPosSet.has(`${row}-${col}`)) {
        resultTiles.push({
          id: nextId++,
          value: newGrid[row][col],
          row,
          col,
          isNew: true,
          isMerged: false,
        });
      }
    }
  }

  return resultTiles;
}

/**
 * Simulate slide+merge for one line of cells (in movement direction order).
 * Matches game-logic.js: slide → merge → pad.
 */
function simulateLine(cells, posMap, resultTiles) {
  // Gather non-zero tiles in order (slide)
  const lineTiles = [];
  for (const { row, col } of cells) {
    const tile = posMap.get(`${row}-${col}`);
    if (tile) lineTiles.push(tile);
  }

  // Merge adjacent equal tiles (leading-edge order, once-per-move)
  let outIdx = 0;
  let i = 0;
  while (i < lineTiles.length) {
    if (i + 1 < lineTiles.length && lineTiles[i].value === lineTiles[i + 1].value) {
      // Merge: leading tile survives with doubled value
      const target = cells[outIdx];
      resultTiles.push({
        id: lineTiles[i].id,
        value: lineTiles[i].value * 2,
        row: target.row,
        col: target.col,
        isNew: false,
        isMerged: true,
      });
      i += 2;
    } else {
      // Slide: tile moves to new position
      const target = cells[outIdx];
      resultTiles.push({
        id: lineTiles[i].id,
        value: lineTiles[i].value,
        row: target.row,
        col: target.col,
        isNew: false,
        isMerged: false,
      });
      i += 1;
    }
    outIdx++;
  }
}
