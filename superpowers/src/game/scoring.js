import { BASE_MATCH_SCORE, SPEED_BONUS_MAX, SPEED_BONUS_WINDOW_MS } from "./constants";

/**
 * @param {number} msSinceLastMatch
 * @param {number} combo
 * @returns {number}
 */
export function calculateMatchScore(msSinceLastMatch, combo) {
  let speedBonus = 0;
  if (msSinceLastMatch < SPEED_BONUS_WINDOW_MS) {
    const ratio = 1 - msSinceLastMatch / SPEED_BONUS_WINDOW_MS;
    speedBonus = Math.round(SPEED_BONUS_MAX * ratio);
  }

  return (BASE_MATCH_SCORE + speedBonus) * combo;
}
