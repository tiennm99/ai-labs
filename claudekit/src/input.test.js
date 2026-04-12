import { describe, it, expect } from 'vitest';
import { clampX } from './input.js';
import { FRUITS } from './fruits.js';
import { CONTAINER_X, CONTAINER_WIDTH } from './constants.js';

describe('input clampX', () => {
  it('clamps X to stay within container for tier 0 (Cherry)', () => {
    const radius = FRUITS[0].radius;
    const minX = CONTAINER_X + radius;
    const maxX = CONTAINER_X + CONTAINER_WIDTH - radius;

    expect(clampX(0, 0)).toBe(minX);
    expect(clampX(1000, 0)).toBe(maxX);
    expect(clampX(250, 0)).toBe(250); // center is fine
  });

  it('clamps differently for larger fruits', () => {
    const tier4Radius = FRUITS[4].radius; // Persimmon, radius 32
    const minX = CONTAINER_X + tier4Radius;
    const maxX = CONTAINER_X + CONTAINER_WIDTH - tier4Radius;

    expect(clampX(0, 4)).toBe(minX);
    expect(clampX(1000, 4)).toBe(maxX);
  });

  it('does not change X when within bounds', () => {
    const x = CONTAINER_X + CONTAINER_WIDTH / 2;
    expect(clampX(x, 2)).toBe(x);
  });
});
