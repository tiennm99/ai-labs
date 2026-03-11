// src/matching/Scoring.ts - Score calculation with complexity bonus
/**
 * Scoring system that rewards players with complexity bonuses
 * Fewer turns = higher score (harder to spot paths)
 */

export class Scoring {
  /**
   * Base score for any successful match
   */
  private static readonly BASE_SCORE = 100;

  /**
   * Bonus multipliers based on path complexity (fewer turns = higher bonus)
   * - 0 turns: 1.5x (50% bonus) - same row/col direct path
   * - 1 turn: 1.25x (25% bonus) - one corner
   * - 2 turns: 1.0x (base) - two corners (max allowed)
   */
  private static readonly BONUS_MULTIPLIERS = {
    0: 1.5,   // 50% bonus for 0-turn (same row/col)
    1: 1.25,  // 25% bonus for 1-turn
    2: 1.0    // No bonus for 2-turn
  } as const;

  /**
   * Calculate score based on path complexity (number of turns)
   * @param turns - Number of turns in the path (0, 1, or 2)
   * @returns Integer score with complexity bonus applied
   */
  static calculate(turns: number): number {
    // Get multiplier for this turn count, default to base (1.0) if invalid
    const multiplier = this.BONUS_MULTIPLIERS[turns as keyof typeof Scoring.BONUS_MULTIPLIERS] || 1.0;

    // Calculate score and ensure integer result
    return Math.floor(this.BASE_SCORE * multiplier);
  }
}
