/**
 * Combat.ts — Handles damage dealing, attack cooldowns, and health management.
 *
 * This module is the central hub for all combat interactions in the game:
 *   - Player projectiles vs. enemies.
 *   - Enemy melee attacks vs. player.
 *   - Enemy projectiles vs. player.
 *
 * ### Design Notes
 *
 * 1. **Separation of Concerns**: The entity modules (Player, Enemy, Projectile)
 *    define *how* damage is applied (e.g. `damagePlayer`, `damageEnemy`), while
 *    this module determines *when* damage should be applied (collision checks,
 *    range checks, cooldown management).
 *
 * 2. **No Mutations Outside Entity Helpers**: This module never directly
 *    modifies `health` or `alive` — it always delegates to the entity's own
 *    damage functions, which handle invincibility frames, death checks, etc.
 *
 * 3. **Single-Frame Processing**: `processCombat()` is designed to be called
 *    once per game frame and processes ALL combat interactions for that frame.
 *    It returns a summary so the caller can trigger sound effects, UI updates,
 *    etc. without coupling the combat logic to the presentation layer.
 */

import { EnemyState, enemyCanAttack, damageEnemy } from '../entities/Enemy';
import { PlayerState, damagePlayer } from '../entities/Player';
import { ProjectileState } from '../entities/Projectile';
import { rectsOverlap, Rect } from './Physics';

// ---------------------------------------------------------------------------
// Target interface for generic hit detection
// ---------------------------------------------------------------------------

/**
 * Minimal interface that any entity must satisfy to be a valid projectile
 * target. Both `EnemyState` and `PlayerState` (augmented with an `alive`
 * derived field) satisfy this interface.
 */
export interface CombatTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
}

// ---------------------------------------------------------------------------
// Enemy melee attack vs. player
// ---------------------------------------------------------------------------

/**
 * Attempt an enemy melee attack on the player.
 *
 * Conditions for a hit:
 *   1. Enemy must be alive and off cooldown (`enemyCanAttack`).
 *   2. Horizontal distance between enemy and player must be within
 *      `enemy.attackRange`.
 *   3. Player must not be invincible.
 *
 * On a successful hit:
 *   - `damagePlayer()` is called (handles invincibility frame assignment).
 *   - Enemy's attack cooldown is reset to its maximum.
 *
 * @returns `true` if the attack landed this frame.
 */
export function processEnemyAttack(enemy: EnemyState, player: PlayerState): boolean {
  if (!enemyCanAttack(enemy)) return false;

  // Simple horizontal distance check (melee range)
  const dist = Math.abs(enemy.x - player.x);
  if (dist < enemy.attackRange && player.invincible <= 0) {
    damagePlayer(player, enemy.damage);
    enemy.attackCooldown = enemy.attackCooldownMax;
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Projectile hit detection
// ---------------------------------------------------------------------------

/**
 * Test whether a projectile overlaps any of the given targets.
 *
 * If a hit is detected, the projectile is killed (`alive = false`) and the
 * function returns `true`. Only the first hit is processed per call (a
 * projectile can't hit multiple targets in the same frame).
 *
 * @param proj    The projectile to test.
 * @param targets Array of potential targets (must have position, size, alive).
 * @returns `true` if the projectile hit a target.
 */
export function checkProjectileHit(
  proj: ProjectileState,
  targets: CombatTarget[],
): boolean {
  if (!proj.alive) return false;

  for (const target of targets) {
    if (!target.alive) continue;
    if (rectsOverlap(proj as Rect, target as Rect)) {
      proj.alive = false;
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Player-as-target adapter
// ---------------------------------------------------------------------------

/**
 * Convert a `PlayerState` into a `CombatTarget` for projectile hit detection.
 *
 * PlayerState doesn't have an `alive` field, so we derive it from `health > 0`.
 * This adapter allows `checkProjectileHit()` to work with players without
 * modifying the PlayerState interface.
 */
export function playerAsTarget(player: PlayerState): CombatTarget {
  return {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
    alive: player.health > 0,
  };
}

/**
 * Convert an `EnemyState` array into `CombatTarget[]` for projectile hit
 * detection. Only alive enemies are included.
 */
export function enemiesAsTargets(enemies: EnemyState[]): CombatTarget[] {
  return enemies.filter((e) => e.alive).map((e) => e as unknown as CombatTarget);
}

// ---------------------------------------------------------------------------
// Frame-level combat processing
// ---------------------------------------------------------------------------

/** Summary of combat events that occurred during a single frame. */
export interface CombatResult {
  /** Number of enemies killed by player projectiles this frame. */
  enemiesKilled: number;
  /** Whether the player took damage this frame (from any source). */
  playerHit: boolean;
}

/**
 * Process ALL combat interactions for a single game frame.
 *
 * Execution order:
 *   1. Player projectiles → enemies (ranged attacks).
 *   2. Enemy melee → player (close-range attacks).
 *   3. Enemy projectiles → player (ranged attacks).
 *
 * @param player      The player entity.
 * @param enemies     All enemies in the current wave.
 * @param projectiles All active projectiles in the world.
 * @returns A `CombatResult` summarising what happened this frame.
 */
export function processCombat(
  player: PlayerState,
  enemies: EnemyState[],
  projectiles: ProjectileState[],
): CombatResult {
  let enemiesKilled = 0;
  let playerHit = false;

  // ── 1. Player projectiles vs. enemies ──────────────────────────────────
  for (const proj of projectiles) {
    if (proj.owner !== 'player' || !proj.alive) continue;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Check if this projectile hits this enemy
      if (checkProjectileHit(proj, [enemy as unknown as CombatTarget])) {
        const killed = damageEnemy(enemy, proj.damage);
        if (killed) enemiesKilled++;
        break; // projectile is dead, stop checking more enemies
      }
    }
  }

  // ── 2. Enemy melee attacks vs. player ──────────────────────────────────
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    if (processEnemyAttack(enemy, player)) {
      playerHit = true;
    }
  }

  // ── 3. Enemy projectiles vs. player ────────────────────────────────────
  const playerTarget = playerAsTarget(player);
  for (const proj of projectiles) {
    if (proj.owner !== 'enemy' || !proj.alive) continue;

    // Only check hit if the player isn't invincible
    if (player.invincible <= 0 && checkProjectileHit(proj, [playerTarget])) {
      damagePlayer(player, proj.damage);
      playerHit = true;
      // Refresh the adapter after damage (health may have changed)
      playerTarget.alive = player.health > 0;
    }
  }

  return { enemiesKilled, playerHit };
}
