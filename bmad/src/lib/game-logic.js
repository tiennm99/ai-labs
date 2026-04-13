import { GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS } from './constants.js';

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function getEmptyCells(grid) {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

export function addRandomTile(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;

  const { row, col } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < SPAWN_PROBABILITY ? 2 : 4;

  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = value;
  return newGrid;
}

export function initGame() {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return {
    grid,
    score: 0,
    won: false,
    keepPlaying: false,
  };
}

function slideRow(row) {
  return row.filter(v => v !== 0);
}

function mergeRow(row) {
  const merged = [];
  let score = 0;
  let i = 0;
  while (i < row.length) {
    if (i + 1 < row.length && row[i] === row[i + 1]) {
      const val = row[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(row[i]);
      i += 1;
    }
  }
  return { merged, score };
}

function processRow(row) {
  const slid = slideRow(row);
  const { merged, score } = mergeRow(slid);
  const result = [...merged];
  while (result.length < GRID_SIZE) {
    result.push(0);
  }
  return { result, score };
}

function transpose(grid) {
  return grid[0].map((_, col) => grid.map(row => row[col]));
}

function reverseRows(grid) {
  return grid.map(row => [...row].reverse());
}

function gridsEqual(a, b) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function move(state, direction) {
  let grid = state.grid.map(r => [...r]);
  let totalScore = 0;

  // Normalize to "process left"
  if (direction === DIRECTIONS.RIGHT) {
    grid = reverseRows(grid);
  } else if (direction === DIRECTIONS.UP) {
    grid = transpose(grid);
  } else if (direction === DIRECTIONS.DOWN) {
    grid = reverseRows(transpose(grid));
  }

  // Process each row
  const newGrid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const { result, score } = processRow(grid[r]);
    newGrid.push(result);
    totalScore += score;
  }

  // Reverse normalization
  let finalGrid;
  if (direction === DIRECTIONS.RIGHT) {
    finalGrid = reverseRows(newGrid);
  } else if (direction === DIRECTIONS.UP) {
    finalGrid = transpose(newGrid);
  } else if (direction === DIRECTIONS.DOWN) {
    finalGrid = transpose(reverseRows(newGrid));
  } else {
    finalGrid = newGrid;
  }

  // Check if anything moved
  if (gridsEqual(state.grid, finalGrid)) {
    return state;
  }

  // Add random tile
  finalGrid = addRandomTile(finalGrid);

  // Check for win
  let won = state.won;
  if (!won && !state.keepPlaying) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (finalGrid[r][c] === WIN_VALUE) {
          won = true;
        }
      }
    }
  }

  return {
    grid: finalGrid,
    score: state.score + totalScore,
    won,
    keepPlaying: state.keepPlaying,
  };
}

export function canMove(grid) {
  // Check for empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
    }
  }

  // Check for adjacent matches (horizontal)
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) return true;
    }
  }

  // Check for adjacent matches (vertical)
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === grid[r + 1][c]) return true;
    }
  }

  return false;
}

export function isGameOver(state) {
  return !canMove(state.grid);
}
