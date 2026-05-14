/**
 * Enemy.ts — Enemy types, creation, AI behaviour, and damage helpers.
 *
 * Each enemy type has distinct stats (speed, health, damage, sight range, etc.)
 * The AI is deliberately simple: chase the player when in sight, stop and
 * attack when in range, and idle otherwise.
 *
 * Ground collision follows the same tolerance-buffer approach used by
 * Player.ts to avoid sticky-ground issues.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** All enemy archetype identifiers. */
export type EnemyType = 'drone' | 'basic' | 'fast' | 'heavy' | 'boss';

/** Full serializable state of a single enemy instance. */
export interface EnemyState {
  // Position & velocity
  x: number;
  y: number;
  vx: number;
  vy: number;

  // Hitbox
  width: number;
  height: number;

  // Identity
  type: EnemyType;

  // Health
  health: number;
  maxHealth: number;

  // Combat stats
  speed: number;
  damage: number;
  attackCooldown: number;
  attackCooldownMax: number;
  sightRange: number;
  attackRange: number;

  /** Facing direction: -1 left, 1 right. */
  facing: number;

  /** Whether the enemy is alive and should be updated / rendered. */
  alive: boolean;

  // Visual
  color: string;
  glowColor: string;

  /** Score reward given to the player when this enemy is killed. */
  reward: number;
}

// ---------------------------------------------------------------------------
// Configuration per enemy type
// ---------------------------------------------------------------------------

interface EnemyConfig {
  width: number;
  height: number;
  health: number;
  speed: number;
  damage: number;
  attackCooldownMax: number;
  sightRange: number;
  attackRange: number;
  color: string;
  glowColor: string;
  reward: number;
}

const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  drone: {
    width: 16,
    height: 20,
    health: 15,
    speed: 2.5,
    damage: 5,
    attackCooldownMax: 800,
    sightRange: 250,
    attackRange: 25,
    color: '#ff4444',
    glowColor: '#ff6666',
    reward: 10,
  },
  basic: {
    width: 20,
    height: 36,
    health: 30,
    speed: 1.5,
    damage: 8,
    attackCooldownMax: 1000,
    sightRange: 200,
    attackRange: 30,
    color: '#ff3333',
    glowColor: '#ff5555',
    reward: 20,
  },
  fast: {
    width: 16,
    height: 32,
    health: 20,
    speed: 3.5,
    damage: 6,
    attackCooldownMax: 600,
    sightRange: 300,
    attackRange: 25,
    color: '#ffaa00',
    glowColor: '#ffcc00',
    reward: 25,
  },
  heavy: {
    width: 28,
    height: 44,
    health: 60,
    speed: 0.8,
    damage: 15,
    attackCooldownMax: 1500,
    sightRange: 180,
    attackRange: 35,
    color: '#cc0000',
    glowColor: '#ff2222',
    reward: 40,
  },
  boss: {
    width: 36,
    height: 56,
    health: 150,
    speed: 1.2,
    damage: 20,
    attackCooldownMax: 1200,
    sightRange: 350,
    attackRange: 40,
    color: '#ff0066',
    glowColor: '#ff3388',
    reward: 100,
  },
};

// ---------------------------------------------------------------------------
// Platform type (minimal — re-declared locally to avoid circular imports)
// ---------------------------------------------------------------------------

interface PlatformRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Spawn a new enemy of the given type at the specified world position.
 */
export function createEnemy(type: EnemyType, x: number, y: number): EnemyState {
  const cfg = ENEMY_CONFIGS[type];
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    width: cfg.width,
    height: cfg.height,
    type,
    health: cfg.health,
    maxHealth: cfg.health,
    speed: cfg.speed,
    damage: cfg.damage,
    attackCooldown: 0,
    attackCooldownMax: cfg.attackCooldownMax,
    sightRange: cfg.sightRange,
    attackRange: cfg.attackRange,
    facing: 1,
    alive: true,
    color: cfg.color,
    glowColor: cfg.glowColor,
    reward: cfg.reward,
  };
}

// ---------------------------------------------------------------------------
// AI update
// ---------------------------------------------------------------------------

/**
 * Advance an enemy by one frame.
 *
 * AI behaviour:
 *   1. If the player is within `sightRange`, face them and chase.
 *   2. If within `attackRange`, stop moving (attack is handled externally
 *      via `enemyCanAttack` / cooldown management).
 *   3. If the player is NOT in sight, gradually decelerate.
 *   4. Apply gravity, ground collision, and level-bound clamping.
 *
 * @param enemy    Mutated in-place each frame.
 * @param playerX  Player centre X (for chase AI).
 * @param playerY  Player centre Y (for distance checks).
 * @param dt       Delta-time multiplier (1.0 = 60 fps frame).
 * @param platforms Array of axis-aligned platform rectangles.
 */
export function updateEnemy(
  enemy: EnemyState,
  playerX: number,
  playerY: number,
  dt: number,
  platforms: PlatformRect[],
): void {
  if (!enemy.alive) return;

  // ── Chase AI ──────────────────────────────────────────────────────────
  const dx = playerX - enemy.x;
  const dy = playerY - enemy.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < enemy.sightRange) {
    // Face the player
    enemy.facing = dx > 0 ? 1 : -1;

    if (dist > enemy.attackRange) {
      // Chase: move towards the player
      enemy.vx = enemy.speed * enemy.facing;
    } else {
      // In attack range — stop moving, let the attack system handle it
      enemy.vx = 0;
    }
  } else {
    // Player not in sight — decelerate
    enemy.vx *= 0.9;
  }

  // ── Gravity ───────────────────────────────────────────────────────────
  enemy.vy += 0.6 * dt;
  if (enemy.vy > 15) enemy.vy = 15;

  // ── Apply velocity ────────────────────────────────────────────────────
  enemy.x += enemy.vx * dt;
  enemy.y += enemy.vy * dt;

  // ── Ground collision (same tolerance-buffer approach as Player) ───────
  for (const plat of platforms) {
    const enemyBottom = enemy.y + enemy.height;
    if (enemy.x + enemy.width > plat.x && enemy.x < plat.x + plat.width) {
      // Only land when bottom is within a thin band just below platform top
      if (enemyBottom >= plat.y && enemyBottom <= plat.y + 10) {
        enemy.y = plat.y - enemy.height;
        if (enemy.vy > 0) enemy.vy = 0;
        break;
      }
    }
  }

  // ── Attack cooldown ───────────────────────────────────────────────────
  if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt * 16.667;

  // ── Level bounds ──────────────────────────────────────────────────────
  if (enemy.x < 0) {
    enemy.x = 0;
    enemy.vx = 0;
  }
}

// ---------------------------------------------------------------------------
// Combat helpers
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the enemy is alive and its attack cooldown has expired,
 * meaning it can strike the player this frame.
 */
export function enemyCanAttack(enemy: EnemyState): boolean {
  return enemy.alive && enemy.attackCooldown <= 0;
}

/**
 * Apply damage to an enemy. Returns `true` if the enemy is killed.
 * On kill, sets `alive = false`.
 */
export function damageEnemy(enemy: EnemyState, damage: number): boolean {
  enemy.health -= damage;
  if (enemy.health <= 0) {
    enemy.alive = false;
    return true; // killed
  }
  return false;
}

/**
 * Reset an enemy's attack cooldown to its maximum (call after an attack lands
 * or is attempted).
 */
export function resetEnemyAttackCooldown(enemy: EnemyState): void {
  enemy.attackCooldown = enemy.attackCooldownMax;
}
