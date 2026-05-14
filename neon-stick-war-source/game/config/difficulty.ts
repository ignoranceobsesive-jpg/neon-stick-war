/**
 * Difficulty scaling configuration for Neon Stick War.
 *
 * These arrays define how enemy stats scale across 5 difficulty tiers.
 * Index 0 = easiest, Index 4 = hardest.
 *
 * Original minified variables:
 *   S = HEALTH_MULTIPLIERS
 *   T = SPEED_MULTIPLIERS
 *   M = COIN_MULTIPLIERS
 *   j = BOSS_FLAGS
 */

/**
 * Enemy health multiplier per difficulty tier.
 * Higher tiers = significantly tankier enemies.
 *
 * Tier 0: 1.0x (normal)
 * Tier 1: 1.2x
 * Tier 2: 1.5x
 * Tier 3: 1.8x
 * Tier 4: 2.2x
 */
export const HEALTH_MULTIPLIERS: readonly number[] = [1, 1.2, 1.5, 1.8, 2.2] as const;

/**
 * Enemy speed multiplier per difficulty tier.
 * Higher tiers = faster enemies (lower value = slower, relative to base).
 * Actually this is a speed scale: 1.0 = normal, 0.6 = 60% speed.
 * Wait — looking at the values: [1, 0.9, 0.8, 0.7, 0.6]
 * This appears to be a PLAYER speed penalty or enemy attack interval multiplier.
 * Lower values at higher tiers mean enemies attack MORE frequently.
 *
 * Tier 0: 1.0 (normal interval)
 * Tier 1: 0.9 (10% faster attacks)
 * Tier 2: 0.8 (20% faster attacks)
 * Tier 3: 0.7 (30% faster attacks)
 * Tier 4: 0.6 (40% faster attacks)
 */
export const SPEED_MULTIPLIERS: readonly number[] = [1, 0.9, 0.8, 0.7, 0.6] as const;

/**
 * Coin reward multiplier per difficulty tier.
 * Higher tiers = more coins per kill.
 *
 * Tier 0: 0   (no bonus coins)
 * Tier 1: 1500
 * Tier 2: 3000
 * Tier 3: 5400
 * Tier 4: 10500
 */
export const COIN_MULTIPLIERS: readonly number[] = [0, 1500, 3000, 5400, 10500] as const;

/**
 * Whether bosses appear per difficulty tier.
 * Bosses only spawn from tier 2 onwards.
 *
 * Tier 0: false (no bosses)
 * Tier 1: false (no bosses)
 * Tier 2: true  (bosses enabled)
 * Tier 3: true  (bosses enabled)
 * Tier 4: true  (bosses enabled)
 */
export const BOSS_FLAGS: readonly boolean[] = [false, false, true, true, true] as const;

/** Total number of difficulty tiers */
export const DIFFICULTY_TIERS = 5 as const;
