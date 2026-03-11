// src/__tests__/GameStateManager.test.ts - Unit tests for GameStateManager class
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { GameStateManager, GameState } from '../state/GameStateManager';
import { TypedEventEmitter } from '../game/EventEmitter';
import type { GameEvents } from '../types';

// Mock TypedEventEmitter for testing
vi.mock('../game/EventEmitter', () => ({
  TypedEventEmitter: class MockTypedEventEmitter {
    on = vi.fn();
    emit = vi.fn();
    off = vi.fn();
    removeAllListeners = vi.fn();
  },
}));

describe('GameStateManager', () => {
  let mockEventEmitter: TypedEventEmitter<GameEvents>;
  let stateManager: GameStateManager;

  beforeEach(() => {
    // Create fresh mock event emitter for each test
    mockEventEmitter = new TypedEventEmitter() as any;
    stateManager = new GameStateManager(mockEventEmitter);
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    test('should initialize in IDLE state', () => {
      expect(stateManager.getState()).toBe(GameState.IDLE);
    });
  });

  describe('state transitions', () => {
    test('should validate state transitions correctly', () => {
      // Valid transition: IDLE → SELECTING
      expect(stateManager.transitionTo(GameState.SELECTING)).toBe(true);
      expect(stateManager.getState()).toBe(GameState.SELECTING);

      // Valid transition: SELECTING → MATCHING
      expect(stateManager.transitionTo(GameState.MATCHING)).toBe(true);
      expect(stateManager.getState()).toBe(GameState.MATCHING);
    });

    test('should emit state change events on valid transition', () => {
      stateManager.transitionTo(GameState.SELECTING);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith('game:stateChange', {
        from: GameState.IDLE,
        to: GameState.SELECTING
      });
    });

    test('should return false for invalid transitions', () => {
      // Invalid: IDLE → GAME_OVER (must go through MATCHING first)
      expect(stateManager.transitionTo(GameState.GAME_OVER)).toBe(false);
      expect(stateManager.getState()).toBe(GameState.IDLE);

      // Invalid: SELECTING → IDLE is valid
      expect(stateManager.transitionTo(GameState.SELECTING)).toBe(true);
      expect(stateManager.transitionTo(GameState.IDLE)).toBe(true);
    });
  });

  describe('tile selection by state', () => {
    test('should allow tile selection in IDLE state', () => {
      expect(stateManager.canSelectTile()).toBe(true);
    });

    test('should allow tile selection in SELECTING state', () => {
      stateManager.transitionTo(GameState.SELECTING);
      expect(stateManager.canSelectTile()).toBe(true);
    });

    test('should block tile selection in MATCHING state', () => {
      stateManager.transitionTo(GameState.SELECTING);
      stateManager.transitionTo(GameState.MATCHING);
      expect(stateManager.canSelectTile()).toBe(false);
    });

    test('should block tile selection in GAME_OVER state', () => {
      stateManager.transitionTo(GameState.SELECTING);
      stateManager.transitionTo(GameState.MATCHING);
      stateManager.transitionTo(GameState.GAME_OVER);
      expect(stateManager.canSelectTile()).toBe(false);
    });
  });

  describe('game reset', () => {
    test('should reset from GAME_OVER to IDLE', () => {
      stateManager.transitionTo(GameState.SELECTING);
      stateManager.transitionTo(GameState.MATCHING);
      stateManager.transitionTo(GameState.GAME_OVER);

      stateManager.reset();

      expect(stateManager.getState()).toBe(GameState.IDLE);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('game:stateChange', {
        from: GameState.GAME_OVER,
        to: GameState.IDLE
      });
    });
  });
});
