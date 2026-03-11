// src/state/GameStateManager.ts - Game state machine with transition validation
import { TypedEventEmitter } from '../game/EventEmitter';
import type { GameEvents } from '../types';

/**
 * Represents a game state in the state machine
 * String enum for better debugging and logging
 */
export enum GameState {
  /** Waiting for player input */
  IDLE = 'IDLE',
  /** One tile selected, waiting for second tile */
  SELECTING = 'SELECTING',
  /** Processing match, input blocked */
  MATCHING = 'MATCHING',
  /** Game ended (win or no moves) */
  GAME_OVER = 'GAME_OVER',
}

/**
 * Manages game state transitions with validation and event emission
 * Enforces valid state transitions and provides helper methods for state-based logic
 */
export class GameStateManager {
  private currentState: GameState;
  private readonly events: TypedEventEmitter<GameEvents>;

  /**
   * Valid state transitions
   * Maps each state to the list of states it can transition to
   */
  private readonly validTransitions: Record<GameState, GameState[]> = {
    [GameState.IDLE]: [GameState.SELECTING],
    [GameState.SELECTING]: [GameState.IDLE, GameState.MATCHING],
    [GameState.MATCHING]: [GameState.IDLE, GameState.GAME_OVER],
    [GameState.GAME_OVER]: [GameState.IDLE], // restart only
  };

  constructor(events: TypedEventEmitter<GameEvents>) {
    this.events = events;
    this.currentState = GameState.IDLE;
  }

  /**
   * Transition to a new state if valid
   * @param newState - The state to transition to
   * @returns true if transition succeeded, false if invalid
   */
  transitionTo(newState: GameState): boolean {
    // Validate transition
    const allowedStates = this.validTransitions[this.currentState];
    if (!allowedStates.includes(newState)) {
      return false;
    }

    // Perform transition
    const previousState = this.currentState;
    this.currentState = newState;

    // Emit event for other components to react
    this.events.emit('game:stateChange', {
      from: previousState,
      to: newState
    });

    return true;
  }

  /**
   * Get the current game state
   * @returns The current GameState
   */
  getState(): GameState {
    return this.currentState;
  }

  /**
   * Check if tiles can be selected in the current state
   * @returns true if selection is allowed, false otherwise
   */
  canSelectTile(): boolean {
    return this.currentState === GameState.IDLE || this.currentState === GameState.SELECTING;
  }

  /**
   * Reset the state machine to IDLE (for restart functionality)
   * Emits a state change event from current state to IDLE
   */
  reset(): void {
    const previousState = this.currentState;
    this.currentState = GameState.IDLE;

    this.events.emit('game:stateChange', {
      from: previousState,
      to: GameState.IDLE
    });
  }
}
