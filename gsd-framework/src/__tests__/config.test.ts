// Tests for src/config.ts
// Test 1: CONFIG.grid.rows equals 10
// Test 2: CONFIG.grid.cols equals 16
// Test 3: CONFIG.emojis has exactly 16 emojis
// Test 4: CONFIG.tile.size and gap are positive numbers

import { describe, it, expect } from 'vitest';
import { CONFIG } from '../config';

describe('CONFIG', () => {
  describe('grid', () => {
    it('should have rows equal to 10', () => {
      expect(CONFIG.grid.rows).toBe(10);
    });

    it('should have cols equal to 16', () => {
      expect(CONFIG.grid.cols).toBe(16);
    });

    it('should have totalTiles equal to rows * cols', () => {
      expect(CONFIG.grid.totalTiles).toBe(CONFIG.grid.rows * CONFIG.grid.cols);
      expect(CONFIG.grid.totalTiles).toBe(160);
    });

    it('should have pairsPerType equal to 10', () => {
      expect(CONFIG.grid.pairsPerType).toBe(10);
    });
  });

  describe('tile', () => {
    it('should have positive size', () => {
      expect(CONFIG.tile.size).toBeGreaterThan(0);
    });

    it('should have positive gap', () => {
      expect(CONFIG.tile.gap).toBeGreaterThan(0);
    });

    it('should have positive cornerRadius', () => {
      expect(CONFIG.tile.cornerRadius).toBeGreaterThanOrEqual(0);
    });
  });

  describe('emojis', () => {
    it('should have exactly 16 emojis', () => {
      expect(CONFIG.emojis).toHaveLength(16);
    });

    it('should contain the correct emoji set', () => {
      const expectedEmojis = [
        '🌟', '⭐', '💫', '✨', '🌙', '☀️', '🔥', '💧',
        '🌿', '⚡', '🧊', '🪨', '🌸', '🍃', '🌊', '🍄'
      ];
      expect(CONFIG.emojis).toEqual(expectedEmojis);
    });
  });

  describe('colors', () => {
    it('should have valid hex background color', () => {
      expect(CONFIG.colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have valid hex tile color', () => {
      expect(CONFIG.colors.tile).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have valid hex tileHover color', () => {
      expect(CONFIG.colors.tileHover).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have valid hex selection color', () => {
      expect(CONFIG.colors.selection).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have valid hex text color', () => {
      expect(CONFIG.colors.text).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have the correct color values', () => {
      expect(CONFIG.colors.background).toBe('#1a1a2e');
      expect(CONFIG.colors.tile).toBe('#16213e');
      expect(CONFIG.colors.tileHover).toBe('#0f3460');
      expect(CONFIG.colors.selection).toBe('#e94560');
      expect(CONFIG.colors.text).toBe('#eaeaea');
    });
  });
});
