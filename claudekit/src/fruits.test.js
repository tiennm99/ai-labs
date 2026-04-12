import { describe, it, expect } from 'vitest';
import { FRUITS, DROPPABLE_MAX_TIER, getRandomDroppableTier } from './fruits.js';

describe('fruits definitions', () => {
  it('defines exactly 11 fruit tiers (0-10)', () => {
    expect(FRUITS).toHaveLength(11);
    FRUITS.forEach((fruit, i) => {
      expect(fruit.tier).toBe(i);
    });
  });

  it('has monotonically increasing radii', () => {
    for (let i = 1; i < FRUITS.length; i++) {
      expect(FRUITS[i].radius).toBeGreaterThan(FRUITS[i - 1].radius);
    }
  });

  it('has monotonically increasing points', () => {
    for (let i = 1; i < FRUITS.length; i++) {
      expect(FRUITS[i].points).toBeGreaterThan(FRUITS[i - 1].points);
    }
  });

  it('every fruit has required properties', () => {
    for (const fruit of FRUITS) {
      expect(fruit).toHaveProperty('tier');
      expect(fruit).toHaveProperty('name');
      expect(fruit).toHaveProperty('radius');
      expect(fruit).toHaveProperty('color');
      expect(fruit).toHaveProperty('points');
      expect(typeof fruit.name).toBe('string');
      expect(fruit.radius).toBeGreaterThan(0);
      expect(fruit.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('DROPPABLE_MAX_TIER is 4', () => {
    expect(DROPPABLE_MAX_TIER).toBe(4);
  });

  it('getRandomDroppableTier returns tier 0-4', () => {
    for (let i = 0; i < 100; i++) {
      const tier = getRandomDroppableTier();
      expect(tier).toBeGreaterThanOrEqual(0);
      expect(tier).toBeLessThanOrEqual(DROPPABLE_MAX_TIER);
      expect(Number.isInteger(tier)).toBe(true);
    }
  });
});
