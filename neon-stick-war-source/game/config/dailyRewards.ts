/**
 * Daily reward configuration for Neon Stick War.
 *
 * Players can claim a coin reward once per day. The rewards
 * escalate over a 7-day cycle, then reset.
 *
 * Original minified variable: `N`
 */

/** Data for a single day's reward */
export interface DailyRewardConfig {
  /** Day number in the 7-day cycle (1-indexed) */
  day: number;
  /** Number of coins awarded */
  coins: number;
  /** Reward type (currently only "coins") */
  type: "coins";
}

/**
 * Daily login reward schedule over a 7-day cycle.
 *
 * Day 1: 50 coins → Day 7: 1000 coins
 * Rewards escalate daily and reset after day 7.
 */
export const DAILY_REWARDS: DailyRewardConfig[] = [
  { day: 1, coins: 50, type: "coins" },
  { day: 2, coins: 100, type: "coins" },
  { day: 3, coins: 150, type: "coins" },
  { day: 4, coins: 200, type: "coins" },
  { day: 5, coins: 300, type: "coins" },
  { day: 6, coins: 500, type: "coins" },
  { day: 7, coins: 1000, type: "coins" },
] as const;
