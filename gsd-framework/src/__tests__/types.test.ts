// Tests for src/types/index.ts
// Test 1: TilePosition type has row and col as numbers
// Test 2: Tile interface has id, type, position, cleared
// Test 3: GameEvents type defines event names and payloads

import { describe, it, expect } from 'vitest';
import type { TilePosition, Tile, GameEvents, StateChangeEvent } from '../types';
import { GameState } from '../types';

describe('Type Definitions', () => {
  describe('TilePosition', () => {
    it('should accept object with row and col as numbers', () => {
      const position: TilePosition = { row: 5, col: 10 };
      expect(position.row).toBe(5);
      expect(position.col).toBe(10);
    });

    it('should allow row and col to be 0', () => {
      const position: TilePosition = { row: 0, col: 0 };
      expect(position.row).toBe(0);
      expect(position.col).toBe(0);
    });
  });

  describe('Tile', () => {
    it('should have id as string', () => {
      const tile: Tile = {
        id: 'tile-0-0',
        type: 0,
        position: { row: 0, col: 0 },
        cleared: false,
      };
      expect(typeof tile.id).toBe('string');
    });

    it('should have type as number (0-15 for emoji index)', () => {
      const tile: Tile = {
        id: 'tile-5-5',
        type: 7,
        position: { row: 5, col: 5 },
        cleared: false,
      };
      expect(typeof tile.type).toBe('number');
      expect(tile.type).toBeGreaterThanOrEqual(0);
      expect(tile.type).toBeLessThanOrEqual(15);
    });

    it('should have position as TilePosition', () => {
      const tile: Tile = {
        id: 'tile-1-2',
        type: 3,
        position: { row: 1, col: 2 },
        cleared: false,
      };
      expect(tile.position).toHaveProperty('row');
      expect(tile.position).toHaveProperty('col');
    });

    it('should have cleared as boolean', () => {
      const tile: Tile = {
        id: 'tile-2-3',
        type: 5,
        position: { row: 2, col: 3 },
        cleared: true,
      };
      expect(typeof tile.cleared).toBe('boolean');
      expect(tile.cleared).toBe(true);
    });
  });

  describe('GameEvents', () => {
    it('should define game:start event with void payload', () => {
      // Type check - if this compiles, the type is correct
      type StartPayload = GameEvents['game:start'];
      const payload: StartPayload = undefined;
      expect(payload).toBeUndefined();
    });

    it('should define game:tick event with deltaTime', () => {
      type TickPayload = GameEvents['game:tick'];
      const payload: TickPayload = { deltaTime: 16.67 };
      expect(payload.deltaTime).toBe(16.67);
    });

    it('should define tile:selected event with tile, row, col', () => {
      type SelectedPayload = GameEvents['tile:selected'];
      const tile: Tile = {
        id: 'test',
        type: 0,
        position: { row: 0, col: 0 },
        cleared: false,
      };
      const payload: SelectedPayload = { tile, row: 0, col: 0 };
      expect(payload.tile).toBe(tile);
      expect(payload.row).toBe(0);
      expect(payload.col).toBe(0);
    });

    it('should define tile:cleared event with tile', () => {
      type ClearedPayload = GameEvents['tile:cleared'];
      const tile: Tile = {
        id: 'test',
        type: 1,
        position: { row: 1, col: 1 },
        cleared: true,
      };
      const payload: ClearedPayload = { tile };
      expect(payload.tile).toBe(tile);
    });

    it('should define game:score event with points', () => {
      type ScorePayload = GameEvents['game:score'];
      const payload: ScorePayload = { points: 100 };
      expect(payload.points).toBe(100);
    });

    it('should define game:over event with won boolean', () => {
      type OverPayload = GameEvents['game:over'];
      const payload: OverPayload = { won: true };
      expect(payload.won).toBe(true);
    });

    it('should define error event with Error', () => {
      type ErrorPayload = GameEvents['error'];
      const payload: ErrorPayload = new Error('Test error');
      expect(payload).toBeInstanceOf(Error);
    });

    it('should define game:stateChange event with StateChangeEvent', () => {
      type StateChangePayload = GameEvents['game:stateChange'];
      const payload: StateChangePayload = {
        from: GameState.IDLE,
        to: GameState.SELECTING
      };
      expect(payload.from).toBe(GameState.IDLE);
      expect(payload.to).toBe(GameState.SELECTING);
    });

    it('should define board:shuffling event with tilesRemaining', () => {
      type ShufflingPayload = GameEvents['board:shuffling'];
      const payload: ShufflingPayload = { tilesRemaining: 50 };
      expect(payload.tilesRemaining).toBe(50);
    });

    it('should define board:shuffled event with tilesRemaining', () => {
      type ShuffledPayload = GameEvents['board:shuffled'];
      const payload: ShuffledPayload = { tilesRemaining: 50 };
      expect(payload.tilesRemaining).toBe(50);
    });
  });

  describe('GameState', () => {
    it('should have 4 string values', () => {
      expect(GameState.IDLE).toBe('IDLE');
      expect(GameState.SELECTING).toBe('SELECTING');
      expect(GameState.MATCHING).toBe('MATCHING');
      expect(GameState.GAME_OVER).toBe('GAME_OVER');
    });

    it('should have string enum values for debugging', () => {
      expect(typeof GameState.IDLE).toBe('string');
      expect(typeof GameState.SELECTING).toBe('string');
      expect(typeof GameState.MATCHING).toBe('string');
      expect(typeof GameState.GAME_OVER).toBe('string');
    });
  });

  describe('StateChangeEvent', () => {
    it('should have from and to properties of type GameState', () => {
      const event: StateChangeEvent = {
        from: GameState.IDLE,
        to: GameState.SELECTING
      };
      expect(event.from).toBe(GameState.IDLE);
      expect(event.to).toBe(GameState.SELECTING);
    });
  });
});
