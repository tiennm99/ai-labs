// src/state/GameStateManager.ts - Stub implementation for TDD
// This will be implemented in Plan 04-01

import { TypedEventEmitter } from '../game/EventEmitter';

export enum GameState {
  IDLE = 'IDLE',
  SELECTING = 'SELECTING',
  MATCHING = 'MATCHING',
  GAME_OVER = 'GAME_OVER',
}

export class GameStateManager {
  private currentState: GameState = GameState.IDLE;

  constructor(private events: TypedEventEmitter<any>) {}

  getCurrentState(): GameState {
    return this.currentState;
  }

  canSelectTile(): boolean {
    return this.currentState === GameState.IDLE || this.currentState === GameState.SELECTING;
  }

  transitionTo(newState: GameState): boolean {
    // TODO: Implement state transition validation
    this.currentState = newState;
    return true;
  }

  reset(): void {
    this.currentState = GameState.IDLE;
  }
}
