const GAME_STATE_KEY = 'gameState';
const BEST_SCORE_KEY = 'bestScore';

export function saveGameState(state) {
  try {
    const { grid, score, won, keepPlaying } = state;
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({ grid, score, won, keepPlaying }));
  } catch {
    // Silent failure — localStorage may be full or unavailable
  }
}

export function loadGameState() {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.grid) || typeof parsed.score !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch {
    // Silent failure
  }
}

export function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(score));
  } catch {
    // Silent failure
  }
}

export function loadBestScore() {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    if (raw === null) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'number' ? parsed : 0;
  } catch {
    return 0;
  }
}
