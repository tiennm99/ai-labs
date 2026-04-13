import { describe, it, expect } from 'vitest';
import { GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS, TILE_COLORS } from './constants.js';

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
