import { describe, it, expect, beforeEach } from 'vitest';
import { createTilesFromGrid, computeTilesAfterMove, resetTracker } from './tile-tracker.js';
import { DIRECTIONS } from './constants.js';
import { move, initGame } from './game-logic.js';

beforeEach(() => {
  resetTracker();
});

describe('createTilesFromGrid', () => {
  it('assigns unique IDs to each non-zero cell', () => {
    const grid = [
      [2, 0, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const tiles = createTilesFromGrid(grid);
    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toMatchObject({ value: 2, row: 0, col: 0 });
    expect(tiles[1]).toMatchObject({ value: 4, row: 1, col: 1 });
    expect(tiles[0].id).not.toBe(tiles[1].id);
  });

  it('marks all tiles as isNew', () => {
    const grid = [[2, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const tiles = createTilesFromGrid(grid);
    expect(tiles.every(t => t.isNew)).toBe(true);
  });

  it('returns empty array for empty grid', () => {
    const grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    expect(createTilesFromGrid(grid)).toHaveLength(0);
  });
});

describe('computeTilesAfterMove', () => {
  it('preserves tile IDs when sliding left', () => {
    const prevGrid = [
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const originalId = prevTiles[0].id;

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.LEFT);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.LEFT);
    const movedTile = newTiles.find(t => t.id === originalId);
    expect(movedTile).toBeDefined();
    expect(movedTile.row).toBe(0);
    expect(movedTile.col).toBe(0);
    expect(movedTile.value).toBe(2);
    expect(movedTile.isNew).toBe(false);
  });

  it('marks merged tiles with isMerged flag', () => {
    const prevGrid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const leadingId = prevTiles[0].id;

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.LEFT);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.LEFT);
    const mergedTile = newTiles.find(t => t.id === leadingId);
    expect(mergedTile).toBeDefined();
    expect(mergedTile.value).toBe(4);
    expect(mergedTile.isMerged).toBe(true);
  });

  it('creates new ID for spawned tile', () => {
    const prevGrid = [
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const prevIds = new Set(prevTiles.map(t => t.id));

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.LEFT);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.LEFT);
    const newTile = newTiles.find(t => !prevIds.has(t.id));
    expect(newTile).toBeDefined();
    expect(newTile.isNew).toBe(true);
  });

  it('handles RIGHT direction correctly', () => {
    const prevGrid = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const originalId = prevTiles[0].id;

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.RIGHT);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.RIGHT);
    const movedTile = newTiles.find(t => t.id === originalId);
    expect(movedTile).toBeDefined();
    expect(movedTile.col).toBe(3);
  });

  it('handles UP direction correctly', () => {
    const prevGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const originalId = prevTiles[0].id;

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.UP);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.UP);
    const movedTile = newTiles.find(t => t.id === originalId);
    expect(movedTile).toBeDefined();
    expect(movedTile.row).toBe(0);
  });

  it('handles DOWN direction correctly', () => {
    const prevGrid = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);
    const originalId = prevTiles[0].id;

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.DOWN);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.DOWN);
    const movedTile = newTiles.find(t => t.id === originalId);
    expect(movedTile).toBeDefined();
    expect(movedTile.row).toBe(3);
  });

  it('handles chain merge [2,2,2,2] → [4,4] with correct IDs', () => {
    const prevGrid = [
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const prevTiles = createTilesFromGrid(prevGrid);

    const state = { grid: prevGrid, score: 0, won: false, keepPlaying: false };
    const newState = move(state, DIRECTIONS.LEFT);

    const newTiles = computeTilesAfterMove(prevTiles, prevGrid, newState.grid, DIRECTIONS.LEFT);
    const mergedTiles = newTiles.filter(t => t.isMerged);
    expect(mergedTiles).toHaveLength(2);
    expect(mergedTiles[0].value).toBe(4);
    expect(mergedTiles[1].value).toBe(4);
  });
});
