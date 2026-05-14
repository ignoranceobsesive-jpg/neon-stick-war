/**
 * Enemy type configuration for Neon Stick War.
 *
 * This module defines which enemy types are flying, how tall each
 * enemy type is rendered, and related utility functions.
 *
 * Original minified variables/functions:
 *   I  = FLYING_ENEMY_TYPES (array)
 *   E  = isFlyingEnemy(e)
 *   ez = getEnemyHeight(e)
 */

/**
 * List of enemy type identifiers that are classified as "flying".
 *
 * Flying enemies hover above the ground and are harder to hit.
 * They include bats, birds, wisps, wraiths, drakes, serpents,
 * wyrms, moths, and the legendary dragon/phoenix bosses.
 *
 * Original minified name: I
 */
export const FLYING_ENEMY_TYPES: readonly string[] = [
  "voidBat",
  "stormEagle",
  "emberWisp",
  "frostWraith",
  "shadowDrake",
  "plasmaSerpent",
  "neonWyrm",
  "crystalMoth",
  "dragon",
  "phoenix",
] as const;

/**
 * Check if an enemy type is classified as flying.
 *
 * Flying enemies have different movement patterns and are
 * rendered at a higher Y offset than ground enemies.
 *
 * Original minified name: E()
 *
 * @param enemyType - The enemy type identifier
 * @returns True if the enemy is a flying type
 */
export function isFlyingEnemy(enemyType: string): boolean {
  return FLYING_ENEMY_TYPES.includes(enemyType);
}

/**
 * Get the rendering height (in pixels) for an enemy type.
 *
 * This determines the visual size of the enemy sprite.
 * Bosses are the largest at 80px, while small enemies like
 * bats and wisps are 30px.
 *
 * Original minified name: ez()
 *
 * @param enemyType - The enemy type identifier
 * @returns Height in pixels for rendering
 */
export function getEnemyHeight(enemyType: string): number {
  // ── Bosses and giants (80px) ──
  if (
    enemyType === "boss" ||
    enemyType === "bossRedKing" ||
    enemyType === "bossTitan" ||
    enemyType === "bossDragon" ||
    enemyType === "bossPhoenix" ||
    enemyType === "bossMechGolem" ||
    enemyType === "bossCorrupted" ||
    enemyType === "bossFather" ||
    enemyType === "bossTwin" ||
    enemyType === "giant"
  ) {
    return 80;
  }

  // ── Small flying enemies (30px) ──
  if (enemyType === "voidGuardian" || enemyType === "voidBat" || enemyType === "emberWisp") {
    return 30;
  }

  // ── Dragon/phoenix (50px) ──
  if (enemyType === "dragon" || enemyType === "phoenix") {
    return 50;
  }

  // ── Heavy/mechanical enemies (55px) ──
  if (enemyType === "mechGolem" || enemyType === "heavyWalker" || enemyType === "zombie") {
    return 55;
  }

  // ── Agile/elite enemies (50px) ──
  if (enemyType === "shadowAssassin" || enemyType === "eliteDrone" || enemyType === "necromancer") {
    return 50;
  }

  // ── Bomber (45px) ──
  if (enemyType === "bomber") {
    return 45;
  }

  // ── Flying enemies: storm eagle, frost wraith (45px) ──
  if (enemyType === "stormEagle" || enemyType === "frostWraith") {
    return 45;
  }

  // ── Flying enemies: shadow drake (55px) ──
  if (enemyType === "shadowDrake") {
    return 55;
  }

  // ── Flying enemies: plasma serpent (50px) ──
  if (enemyType === "plasmaSerpent") {
    return 50;
  }

  // ── Flying enemies: neon wyrm (60px) ──
  if (enemyType === "neonWyrm") {
    return 60;
  }

  // ── Flying enemies: crystal moth (35px) ──
  if (enemyType === "crystalMoth") {
    return 35;
  }

  // ── Default height for all other enemies (50px) ──
  return 50;
}
