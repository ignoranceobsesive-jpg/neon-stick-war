/**
 * Upgrade system configuration for Neon Stick War.
 *
 * Each upgrade type defines how it scales with level:
 *   - baseCost:     Starting coin cost at level 0
 *   - costMultiplier: Exponential cost growth per level
 *   - effectPerLevel:  Incremental power gain per level (multiplier or percentage)
 *   - maxLevel:     Hard cap on upgradeable levels
 *
 * Original minified variable: `y`
 * Original cost function:     `b(e, t)` → getUpgradeCost(upgradeType, level)
 */

/** Configuration for a single upgrade type */
export interface UpgradeConfig {
  /** Human-readable display name */
  name: string;
  /** Starting coin cost at level 0 */
  baseCost: number;
  /** Cost multiplier per level (exponential growth) */
  costMultiplier: number;
  /** Effect increment per level (e.g. 0.15 = +15% damage) */
  effectPerLevel: number;
  /** Maximum upgradeable level */
  maxLevel: number;
}

/**
 * All upgrade definitions keyed by upgrade type identifier.
 *
 * - damage:         Increases bullet damage by 15% per level
 * - fireRate:       Increases fire rate by 10% per level
 * - bulletSpeed:    Increases bullet velocity by 12% per level
 * - bulletSize:     Increases bullet hitbox size by 10% per level
 * - criticalChance: Adds 2% critical hit chance per level (capped at 50)
 */
export const UPGRADE_CONFIG: Record<string, UpgradeConfig> = {
  damage: {
    name: "Damage",
    baseCost: 500,
    costMultiplier: 1.5,
    effectPerLevel: 0.15,
    maxLevel: 999,
  },
  fireRate: {
    name: "Fire Rate",
    baseCost: 800,
    costMultiplier: 1.6,
    effectPerLevel: 0.1,
    maxLevel: 999,
  },
  bulletSpeed: {
    name: "Bullet Speed",
    baseCost: 600,
    costMultiplier: 1.4,
    effectPerLevel: 0.12,
    maxLevel: 999,
  },
  bulletSize: {
    name: "Bullet Size",
    baseCost: 400,
    costMultiplier: 1.3,
    effectPerLevel: 0.1,
    maxLevel: 999,
  },
  criticalChance: {
    name: "Critical Hit",
    baseCost: 1500,
    costMultiplier: 2,
    effectPerLevel: 0.02,
    maxLevel: 50,
  },
} as const;

/**
 * Calculate the coin cost to upgrade from the given level to the next.
 *
 * Formula: `floor(baseCost * costMultiplier^level)`
 *
 * @param upgradeType - Key into UPGRADE_CONFIG (e.g. "damage", "fireRate")
 * @param level       - Current upgrade level (0-indexed; cost returned is for level→level+1)
 * @returns The coin cost for the next upgrade level
 */
export function getUpgradeCost(upgradeType: string, level: number): number {
  const config = UPGRADE_CONFIG[upgradeType];
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, level));
}
