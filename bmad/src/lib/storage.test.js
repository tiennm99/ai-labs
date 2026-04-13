import { describe, it, expect, beforeEach } from 'vitest';
import { saveGameState, loadGameState, clearGameState, saveBestScore, loadBestScore } from './storage.js';

// Mock localStorage
const store = {};
const localStorageMock = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

beforeEach(() => {
  Object.keys(store).forEach((key) => delete store[key]);
});

describe('saveGameState / loadGameState', () => {
  it('round-trips game state', () => {
    const state = { grid: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 4]], score: 8, won: false, keepPlaying: false };
    saveGameState(state);
    const loaded = loadGameState();
    expect(loaded).toEqual(state);
  });

  it('returns null when no saved state', () => {
    expect(loadGameState()).toBeNull();
  });

  it('returns null for corrupted data', () => {
    store.gameState = 'not-valid-json{{{';
    expect(loadGameState()).toBeNull();
  });

  it('returns null for valid JSON with wrong shape', () => {
    store.gameState = '{"foo": 1}';
    expect(loadGameState()).toBeNull();
  });

  it('only saves canonical fields', () => {
    const state = { grid: [[0]], score: 5, won: true, keepPlaying: false, extraField: 'nope' };
    saveGameState(state);
    const loaded = loadGameState();
    expect(loaded).not.toHaveProperty('extraField');
  });
});

describe('clearGameState', () => {
  it('removes gameState key', () => {
    saveGameState({ grid: [[0]], score: 0, won: false, keepPlaying: false });
    clearGameState();
    expect(loadGameState()).toBeNull();
  });

  it('does not affect bestScore key', () => {
    saveBestScore(100);
    saveGameState({ grid: [[0]], score: 0, won: false, keepPlaying: false });
    clearGameState();
    expect(loadBestScore()).toBe(100);
  });
});

describe('saveBestScore / loadBestScore', () => {
  it('round-trips best score', () => {
    saveBestScore(2048);
    expect(loadBestScore()).toBe(2048);
  });

  it('returns 0 when no saved score', () => {
    expect(loadBestScore()).toBe(0);
  });

  it('returns 0 for corrupted data', () => {
    store.bestScore = 'not-a-number{';
    expect(loadBestScore()).toBe(0);
  });

  it('returns 0 for non-number JSON', () => {
    store.bestScore = '"hello"';
    expect(loadBestScore()).toBe(0);
  });
});
