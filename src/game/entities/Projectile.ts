/**
 * Projectile.ts — Projectiles for both player weapons and skills.
 *
 * Supports multiple projectile types:
 *   - `bullet`     — Fast, narrow, low-damage (basic weapon).
 *   - `fireball`   — Medium speed, larger, high-damage (fire skill).
 *   - `iceShard`   — Fast, slight upward arc, medium damage (ice skill).
 *   - `shadowStep` — Reserved for shadow-step skill effects (future use).
 *
 * Each projectile tracks its owner (`'player'` or `'enemy'`) so the
 * collision system can determine who it should damage.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Who fired this projectile? */
export type ProjectileOwner = 'player' | 'enemy';

/** Visual / behavioural variant of a projectile. */
export type ProjectileType = 'bullet' | 'fireball' | 'iceShard' | 'shadowStep';

/** Full serializable state of a single projectile. */
export interface ProjectileState {
  // Position & velocity
  x: number;
  y: number;
  vx: number;
  vy: number;

  // Hitbox
  width: number;
  height: number;

  // Combat
  damage: number;
  owner: ProjectileOwner;
  type: ProjectileType;

  // Visual
  color: string;
  glowColor: string;

  /** Whether the projectile is still alive and should be updated / rendered. */
  alive: boolean;

  /** Remaining lifetime in milliseconds. Projectiles auto-die when this hits 0. */
  lifetime: number;
}

// ---------------------------------------------------------------------------
// Factory — bullet (basic weapon)
// ---------------------------------------------------------------------------

/**
 * Create a standard bullet projectile.
 *
 * @param x         Spawn X (left edge of hitbox).
 * @param y         Spawn Y (centre of hitbox vertically).
 * @param direction -1 = left, 1 = right.
 * @param owner     Who fired the bullet.
 */
export function createBullet(
  x: number,
  y: number,
  direction: number,
  owner: ProjectileOwner,
): ProjectileState {
  return {
    x,
    y,
    vx: 12 * direction,
    vy: 0,
    width: 8,
    height: 3,
    damage: 10,
    owner,
    type: 'bullet',
    color: owner === 'player' ? '#00ff66' : '#ff3333',
    glowColor: owner === 'player' ? '#00ff66' : '#ff5555',
    alive: true,
    lifetime: 2000,
  };
}

// ---------------------------------------------------------------------------
// Factory — fireball (fire skill)
// ---------------------------------------------------------------------------

/**
 * Create a fireball projectile (player-only skill).
 *
 * @param x         Spawn X.
 * @param y         Spawn Y.
 * @param direction -1 = left, 1 = right.
 */
export function createFireball(
  x: number,
  y: number,
  direction: number,
): ProjectileState {
  return {
    x,
    y,
    vx: 8 * direction,
    vy: 0,
    width: 12,
    height: 12,
    damage: 25,
    owner: 'player',
    type: 'fireball',
    color: '#ff6600',
    glowColor: '#ff8800',
    alive: true,
    lifetime: 1500,
  };
}

// ---------------------------------------------------------------------------
// Factory — ice shard (ice skill)
// ---------------------------------------------------------------------------

/**
 * Create an ice shard projectile (player-only skill).
 * Ice shards travel fast with a slight upward arc.
 *
 * @param x         Spawn X.
 * @param y         Spawn Y.
 * @param direction -1 = left, 1 = right.
 */
export function createIceShard(
  x: number,
  y: number,
  direction: number,
): ProjectileState {
  return {
    x,
    y,
    vx: 10 * direction,
    vy: -2, // slight upward arc
    width: 10,
    height: 10,
    damage: 20,
    owner: 'player',
    type: 'iceShard',
    color: '#88eeff',
    glowColor: '#aaffff',
    alive: true,
    lifetime: 1200,
  };
}

// ---------------------------------------------------------------------------
// Factory — shadow step (reserved / future)
// ---------------------------------------------------------------------------

/**
 * Create a shadow-step effect projectile.
 * Currently a placeholder with minimal stats — can be expanded later.
 *
 * @param x         Spawn X.
 * @param y         Spawn Y.
 * @param direction -1 = left, 1 = right.
 */
export function createShadowStep(
  x: number,
  y: number,
  direction: number,
): ProjectileState {
  return {
    x,
    y,
    vx: 14 * direction,
    vy: 0,
    width: 6,
    height: 6,
    damage: 15,
    owner: 'player',
    type: 'shadowStep',
    color: '#aa44ff',
    glowColor: '#cc66ff',
    alive: true,
    lifetime: 800,
  };
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

/**
 * Advance a projectile by one frame.
 *
 * Movement is purely velocity-based (no gravity by default).
 * Projectiles auto-die when their lifetime expires.
 *
 * @param proj Mutated in-place each frame.
 * @param dt   Delta-time multiplier (1.0 = 60 fps frame).
 */
export function updateProjectile(proj: ProjectileState, dt: number): void {
  if (!proj.alive) return;

  // Move
  proj.x += proj.vx * dt;
  proj.y += proj.vy * dt;

  // Count down lifetime (convert dt to ms)
  proj.lifetime -= dt * 16.667;
  if (proj.lifetime <= 0) {
    proj.alive = false;
  }
}

// ---------------------------------------------------------------------------
// Collision helpers
// ---------------------------------------------------------------------------

/**
 * Simple AABB overlap test between a projectile and a rectangular entity.
 *
 * @param proj     The projectile.
 * @param entX     Entity left edge.
 * @param entY     Entity top edge.
 * @param entW     Entity width.
 * @param entH     Entity height.
 * @returns `true` if the projectile hitbox overlaps the entity hitbox.
 */
export function projectileHitsRect(
  proj: ProjectileState,
  entX: number,
  entY: number,
  entW: number,
  entH: number,
): boolean {
  if (!proj.alive) return false;

  return (
    proj.x + proj.width > entX &&
    proj.x < entX + entW &&
    proj.y + proj.height > entY &&
    proj.y < entY + entH
  );
}

/**
 * Kill a projectile (e.g. on hitting a wall or an entity).
 */
export function destroyProjectile(proj: ProjectileState): void {
  proj.alive = false;
}
