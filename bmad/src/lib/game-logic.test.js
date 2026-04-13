import { describe, it, expect, vi } from 'vitest';
import { GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS, TILE_COLORS } from './constants.js';
import {
  createEmptyGrid,
  getEmptyCells,
  addRandomTile,
  initGame,
  move,
  canMove,
  isGameOver,
} from './game-logic.js';

describe('constants', () => {
  it('should have correct grid size', () => {
    expect(GRID_SIZE).toBe(4);
  });

  it('should have correct win value', () => {
    expect(WIN_VALUE).toBe(2048);
  });

  it('should have correct spawn probability', () => {
    expect(SPAWN_PROBABILITY).toBe(0.9);
  });

  it('should have all four directions', () => {
    expect(DIRECTIONS).toEqual({
      UP: 'up',
      DOWN: 'down',
      LEFT: 'left',
      RIGHT: 'right',
    });
  });

  it('should have 12 tile color tiers', () => {
    const keys = Object.keys(TILE_COLORS);
    expect(keys).toHaveLength(12);
    expect(TILE_COLORS[2].bg).toBe('#eee4da');
    expect(TILE_COLORS[2048].bg).toBe('#edc22e');
    expect(TILE_COLORS.super.bg).toBe('#3c3a32');
  });
});

describe('createEmptyGrid', () => {
  it('should create a 4x4 grid of zeros', () => {
    const grid = createEmptyGrid();
    expect(grid).toHaveLength(4);
    grid.forEach(row => {
      expect(row).toHaveLength(4);
      row.forEach(cell => expect(cell).toBe(0));
    });
  });
});

describe('getEmptyCells', () => {
  it('should return all cells for empty grid', () => {
    const grid = createEmptyGrid();
    expect(getEmptyCells(grid)).toHaveLength(16);
  });

  it('should return correct empty cells', () => {
    const grid = [
      [2, 0, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(getEmptyCells(grid)).toHaveLength(14);
  });

  it('should return empty array for full grid', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 32],
    ];
    expect(getEmptyCells(grid)).toHaveLength(0);
  });
});

describe('addRandomTile', () => {
  it('should add exactly one tile to an empty grid', () => {
    const grid = createEmptyGrid();
    const newGrid = addRandomTile(grid);
    const nonZero = newGrid.flat().filter(v => v !== 0);
    expect(nonZero).toHaveLength(1);
    expect([2, 4]).toContain(nonZero[0]);
  });

  it('should not mutate the original grid', () => {
    const grid = createEmptyGrid();
    const original = grid.map(r => [...r]);
    addRandomTile(grid);
    expect(grid).toEqual(original);
  });

  it('should return same grid if no empty cells', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 32],
    ];
    const result = addRandomTile(grid);
    expect(result).toEqual(grid);
  });
});

describe('initGame', () => {
  it('should return a valid game state', () => {
    const state = initGame();
    expect(state.grid).toHaveLength(4);
    expect(state.score).toBe(0);
    expect(state.won).toBe(false);
    expect(state.keepPlaying).toBe(false);
  });

  it('should have exactly 2 tiles', () => {
    const state = initGame();
    const nonZero = state.grid.flat().filter(v => v !== 0);
    expect(nonZero).toHaveLength(2);
  });

  it('should only spawn 2s and 4s', () => {
    for (let i = 0; i < 20; i++) {
      const state = initGame();
      const tiles = state.grid.flat().filter(v => v !== 0);
      tiles.forEach(v => expect([2, 4]).toContain(v));
    }
  });
});

describe('move', () => {
  function makeState(grid, score = 0, won = false, keepPlaying = false) {
    return { grid, score, won, keepPlaying };
  }

  describe('slide left', () => {
    it('should slide tiles to the left', () => {
      const state = makeState([
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      // Mock random to control tile placement
      const result = move(state, DIRECTIONS.LEFT);
      expect(result.grid[0][0]).toBe(2);
      expect(result).not.toBe(state); // new object
    });

    it('should merge equal adjacent tiles', () => {
      const state = makeState([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.LEFT);
      expect(result.grid[0][0]).toBe(4);
      expect(result.score).toBe(4);
    });

    it('should enforce once-per-move merge rule [2,2,2,2] -> [4,4,0,0]', () => {
      const state = makeState([
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.LEFT);
      expect(result.grid[0][0]).toBe(4);
      expect(result.grid[0][1]).toBe(4);
      expect(result.score).toBe(8);
    });

    it('should use leading-edge merge order [4,2,2,0] -> [4,4,0,0]', () => {
      const state = makeState([
        [4, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.LEFT);
      expect(result.grid[0][0]).toBe(4);
      expect(result.grid[0][1]).toBe(4);
    });
  });

  describe('slide right', () => {
    it('should slide tiles to the right', () => {
      const state = makeState([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.RIGHT);
      expect(result.grid[0][3]).toBe(2);
    });

    it('should merge right [0,0,2,2] -> [0,0,0,4]', () => {
      const state = makeState([
        [0, 0, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.RIGHT);
      expect(result.grid[0][3]).toBe(4);
      expect(result.score).toBe(4);
    });
  });

  describe('slide up', () => {
    it('should slide tiles up', () => {
      const state = makeState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.UP);
      expect(result.grid[0][0]).toBe(2);
    });

    it('should merge up', () => {
      const state = makeState([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.UP);
      expect(result.grid[0][0]).toBe(4);
      expect(result.score).toBe(4);
    });
  });

  describe('slide down', () => {
    it('should slide tiles down', () => {
      const state = makeState([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.DOWN);
      expect(result.grid[3][0]).toBe(2);
    });

    it('should merge down', () => {
      const state = makeState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.DOWN);
      expect(result.grid[3][0]).toBe(4);
      expect(result.score).toBe(4);
    });
  });

  describe('no-op moves', () => {
    it('should return same state if no tiles can move', () => {
      const state = makeState([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.LEFT);
      // tile is already at left edge, can't move left
      expect(result).toBe(state);
    });
  });

  describe('immutability', () => {
    it('should never mutate the original state', () => {
      const state = makeState([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const originalGrid = state.grid.map(r => [...r]);
      move(state, DIRECTIONS.LEFT);
      expect(state.grid).toEqual(originalGrid);
      expect(state.score).toBe(0);
    });
  });

  describe('score accumulation', () => {
    it('should accumulate score across moves', () => {
      const state = makeState([
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], 10);
      const result = move(state, DIRECTIONS.LEFT);
      // 2+2=4, 4+4=8 → score delta = 12
      expect(result.score).toBe(22);
    });
  });

  describe('spawns new tile', () => {
    it('should add one new tile after a valid move', () => {
      const state = makeState([
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const result = move(state, DIRECTIONS.LEFT);
      const nonZero = result.grid.flat().filter(v => v !== 0);
      // Original 1 tile + 1 spawned = 2
      expect(nonZero.length).toBe(2);
    });
  });
});

describe('canMove', () => {
  it('should return true if empty cells exist', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 0],
      [4, 8, 16, 32],
    ];
    expect(canMove(grid)).toBe(true);
  });

  it('should return true if horizontal adjacent match exists', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 8, 32],
    ];
    expect(canMove(grid)).toBe(true);
  });

  it('should return true if vertical adjacent match exists', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 2],
    ];
    expect(canMove(grid)).toBe(true);
  });

  it('should return false if board full with no matches', () => {
    const grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 32],
    ];
    expect(canMove(grid)).toBe(false);
  });
});

describe('isGameOver', () => {
  it('should return false for a fresh game', () => {
    const state = initGame();
    expect(isGameOver(state)).toBe(false);
  });

  it('should return true for full board with no moves', () => {
    const state = {
      grid: [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 2],
        [4, 8, 16, 32],
      ],
      score: 0,
      won: false,
      keepPlaying: false,
    };
    expect(isGameOver(state)).toBe(true);
  });
});

describe('win detection', () => {
  it('should set won=true when 2048 is created', () => {
    const state = {
      grid: [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 0,
      won: false,
      keepPlaying: false,
    };
    const result = move(state, DIRECTIONS.LEFT);
    expect(result.won).toBe(true);
    expect(result.grid[0][0]).toBe(2048);
  });

  it('should not re-trigger won if already won', () => {
    const state = {
      grid: [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 0,
      won: true,
      keepPlaying: false,
    };
    const result = move(state, DIRECTIONS.LEFT);
    expect(result.won).toBe(true);
  });

  it('should not trigger won when keepPlaying is true', () => {
    const state = {
      grid: [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 0,
      won: false,
      keepPlaying: true,
    };
    const result = move(state, DIRECTIONS.LEFT);
    expect(result.won).toBe(false);
  });
});
