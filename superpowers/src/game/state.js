import { DIFFICULTY_CONFIGS } from "./constants";

/**
 * @typedef {import("../types").Difficulty} Difficulty
 * @typedef {import("../types").GameStatus} GameStatus
 */

/** @typedef {() => void} Listener */

/**
 * @typedef {Object} GameState
 * @property {GameStatus} status
 * @property {Difficulty | null} difficulty
 * @property {number} score
 * @property {number} timerSeconds
 * @property {number} hintsRemaining
 * @property {number} shufflesRemaining
 * @property {number} combo
 * @property {number} lastMatchTime
 */

export class GameStateManager {
  constructor() {
    /** @type {GameState} */
    this.state = {
      status: "menu",
      difficulty: null,
      score: 0,
      timerSeconds: 0,
      hintsRemaining: 0,
      shufflesRemaining: 0,
      combo: 1,
      lastMatchTime: 0,
    };
    /** @type {Map<string, Listener[]>} */
    this.listeners = new Map();
  }

  /** @returns {Readonly<GameState>} */
  getState() {
    return { ...this.state };
  }

  /**
   * @param {string} event
   * @param {Listener} listener
   * @returns {void}
   */
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    /** @type {Listener[]} */ (this.listeners.get(event)).push(listener);
  }

  /**
   * @param {string} event
   * @param {Listener} listener
   * @returns {void}
   */
  off(event, listener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    }
  }

  /**
   * @param {string} event
   * @returns {void}
   */
  emit(event) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const l of listeners) l();
    }
  }

  /**
   * @param {Difficulty} difficulty
   * @returns {void}
   */
  startGame(difficulty) {
    const config = DIFFICULTY_CONFIGS[difficulty];
    this.state = {
      status: "playing",
      difficulty,
      score: 0,
      timerSeconds: config.timerSeconds,
      hintsRemaining: config.hints,
      shufflesRemaining: config.shuffles,
      combo: 1,
      lastMatchTime: Date.now(),
    };
    this.emit("stateChange");
  }

  /**
   * @param {number} points
   * @returns {void}
   */
  addScore(points) {
    this.state.score += points;
    this.emit("stateChange");
  }

  /** @returns {boolean} */
  useHint() {
    if (this.state.hintsRemaining <= 0) return false;
    this.state.hintsRemaining--;
    this.emit("stateChange");
    return true;
  }

  /** @returns {boolean} */
  useShuffle() {
    if (this.state.shufflesRemaining <= 0) return false;
    this.state.shufflesRemaining--;
    this.emit("stateChange");
    return true;
  }

  /** @returns {void} */
  tick() {
    if (this.state.status !== "playing") return;
    this.state.timerSeconds--;
    if (this.state.timerSeconds <= 0) {
      this.state.timerSeconds = 0;
      this.state.status = "lost";
    }
    this.emit("stateChange");
  }

  /** @returns {void} */
  incrementCombo() {
    this.state.combo++;
    this.emit("stateChange");
  }

  /** @returns {void} */
  resetCombo() {
    this.state.combo = 1;
    this.emit("stateChange");
  }

  /**
   * @param {GameStatus} status
   * @returns {void}
   */
  setStatus(status) {
    this.state.status = status;
    this.emit("stateChange");
  }

  /**
   * @param {number} time
   * @returns {void}
   */
  setLastMatchTime(time) {
    this.state.lastMatchTime = time;
  }
}
