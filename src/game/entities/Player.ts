/**
 * Player.ts — Player character entity with physics, skills, and rendering data.
 *
 * CRITICAL BUG FIXES addressed in this module:
 *   1. STICKY GROUND: Player was magnetically snapped to ground, making jumps
 *      feel unresponsive. Fixed by adding a 2px tolerance buffer and only
 *      snapping when the player is actually colliding from above (previous
 *      bottom was above the platform surface). This allows natural jump
 *      departure without being re-snapped.
 *   2. DASH ALWAYS GOES RIGHT: Dash direction was hardcoded to 1 (right).
 *      Fixed by setting dashDirection = player.facing when dash is activated,
 *      so the dash goes in the direction the player is facing.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Full serializable state of the player character. */
export interface PlayerState {
  // Position & velocity
  x: number;
  y: number;
  vx: number;
  vy: number;

  // Hitbox dimensions
  width: number;   // ~20
  height: number;  // ~40

  // Health
  health: number;
  maxHealth: number;

  // Ground state
  grounded: boolean;

  /** Facing direction: -1 = left, 1 = right.
   *  CRITICAL: This value is used to determine dash direction.
   *  Never hardcode dash to go right — always read from this field. */
  facing: number;

  /** Invincibility frames remaining (in ms-equivalent ticks). */
  invincible: number;

  // ---- Movement parameters ----
  moveSpeed: number;     // 4 px/frame
  jumpForce: number;     // -13 (negative = upward)
  gravity: number;       // 0.6 px/frame²
  maxFallSpeed: number;  // 15 px/frame
  friction: number;      // 0.85 multiplier when idle

  // ---- Dash skill ----
  dashCooldown: number;
  dashCooldownMax: number; // 500 ms
  dashSpeed: number;       // 15 px/frame
  dashDuration: number;    // 150 ms
  dashTimer: number;
  isDashing: boolean;
  /** MUST BE SET FROM `facing` WHEN DASH IS ACTIVATED.
   *  This is the fix for the "dash always goes right" bug. */
  dashDirection: number;

  // ---- Generic skill slot ----
  skillCooldown: number;
  skillCooldownMax: number;
  skillActive: boolean;
  skillTimer: number;

  // ---- Animation ----
  walkCycle: number;
  expression: string;

  // ---- Skin / cosmetics ----
  skinId: string;
  color: string;
  glowColor: string;
  trailColor: string;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fresh player at the given world position.
 *
 * @param x      Spawn X (left edge of hitbox)
 * @param y      Spawn Y (top edge of hitbox)
 * @param skinId Cosmetic skin identifier (default: 'neon-green')
 */
export function createPlayer(
  x: number,
  y: number,
  skinId: string = 'neon-green',
): PlayerState {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    width: 20,
    height: 40,
    health: 100,
    maxHealth: 100,
    grounded: false,
    facing: 1,
    invincible: 0,

    // Movement params
    moveSpeed: 4,
    jumpForce: -13,
    gravity: 0.6,
    maxFallSpeed: 15,
    friction: 0.85,

    // Dash
    dashCooldown: 0,
    dashCooldownMax: 500,
    dashSpeed: 15,
    dashDuration: 150,
    dashTimer: 0,
    isDashing: false,
    dashDirection: 1, // will be overridden by facing on activation

    // Skill slot
    skillCooldown: 0,
    skillCooldownMax: 2000,
    skillActive: false,
    skillTimer: 0,

    // Animation
    walkCycle: 0,
    expression: 'determined',

    // Skin
    skinId,
    color: '#00ff66',
    glowColor: '#00ff66',
    trailColor: '#00ff44',
  };
}

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

/** Frame-level input snapshot fed to `updatePlayer`. */
export interface PlayerInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  skill: boolean;
}

// ---------------------------------------------------------------------------
// Platform type (minimal — only what collision needs)
// ---------------------------------------------------------------------------

export interface PlatformRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Physics update
// ---------------------------------------------------------------------------

/**
 * Advance the player state by one frame.
 *
 * ### BUG FIX — Sticky Ground
 * The previous implementation snapped the player to the platform surface
 * every frame whenever their bottom was at or below the platform top. This
 * caused the player to be *magnetised* to the ground: after jumping, the
 * next frame would see `playerBottom >= plat.y` and immediately re-snap,
 * cancelling the jump.
 *
 * **Fix**: We now compare the *previous* bottom position (before velocity
 * was applied this frame) against the platform top. Landing only occurs
 * when the player was **above** the platform last frame (within a 2 px
 * tolerance buffer) and is now overlapping. This ensures:
 *   - Players can leave the ground cleanly when jumping (previous bottom
 *     was above, so the jump is already in progress).
 *   - Players still land correctly when falling onto a platform.
 *
 * ### BUG FIX — Dash Always Goes Right
 * Dash direction is now derived from `player.facing` at the moment of
 * activation instead of being hardcoded to `1`.
 *
 * @param player    Mutated in-place each frame.
 * @param dt        Delta-time multiplier (1.0 = 60 fps frame).
 * @param platforms Array of axis-aligned platform rectangles.
 * @param input     Current frame input snapshot.
 */
export function updatePlayer(
  player: PlayerState,
  dt: number,
  platforms: PlatformRect[],
  input: PlayerInput,
): void {
  // ------------------------------------------------------------------
  // 1. Horizontal movement (only when NOT dashing)
  // ------------------------------------------------------------------
  if (!player.isDashing) {
    if (input.left) {
      player.vx = -player.moveSpeed;
      player.facing = -1;
    } else if (input.right) {
      player.vx = player.moveSpeed;
      player.facing = 1;
    } else {
      player.vx *= player.friction;
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }
  }

  // ------------------------------------------------------------------
  // 2. Jump — ONLY when grounded (not sticky — just a normal check)
  // ------------------------------------------------------------------
  if (input.jump && player.grounded) {
    player.vy = player.jumpForce;
    player.grounded = false; // Release from ground immediately
  }

  // ------------------------------------------------------------------
  // 3. Dash activation
  //    BUG FIX: dashDirection is set from player.facing, NOT hardcoded 1.
  // ------------------------------------------------------------------
  if (input.skill && player.dashCooldown <= 0 && !player.isDashing) {
    player.isDashing = true;
    player.dashTimer = player.dashDuration;
    player.dashCooldown = player.dashCooldownMax;
    // ── KEY FIX ── Use the player's current facing direction.
    player.dashDirection = player.facing;
    player.vx = 0;
    player.vy = 0;
  }

  // ------------------------------------------------------------------
  // 4. Apply dash movement
  // ------------------------------------------------------------------
  if (player.isDashing) {
    player.vx = player.dashSpeed * player.dashDirection;
    player.vy = 0; // freeze vertical movement while dashing
    player.dashTimer -= dt * 16.667; // convert dt to ms
    if (player.dashTimer <= 0) {
      player.isDashing = false;
    }
  }

  // ------------------------------------------------------------------
  // 5. Gravity (only when NOT dashing — dash overrides vertical)
  // ------------------------------------------------------------------
  if (!player.isDashing) {
    player.vy += player.gravity * dt;
    if (player.vy > player.maxFallSpeed) player.vy = player.maxFallSpeed;
  }

  // ------------------------------------------------------------------
  // 6. Apply velocity to position
  // ------------------------------------------------------------------
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // ------------------------------------------------------------------
  // 7. Ground / platform collision
  //    BUG FIX — Sticky Ground: use previous-bottom + tolerance check.
  // ------------------------------------------------------------------
  player.grounded = false;

  for (const plat of platforms) {
    // Horizontal overlap check — player must be within platform bounds
    if (player.x + player.width > plat.x && player.x < plat.x + plat.width) {
      const playerBottom = player.y + player.height;
      // Reconstruct previous bottom *before* this frame's velocity was applied
      const prevBottom = playerBottom - player.vy * dt;

      // Only land if:
      //   • Previous bottom was at or above the platform top (+ 2 px tolerance
      //     buffer to avoid snapping when barely overlapping), AND
      //   • Current bottom has crossed the platform top.
      //
      // The 2 px tolerance buffer is the key to preventing the sticky-ground
      // bug: without it, a player standing on a platform with vy ≈ 0 would
      // be re-snapped every frame, preventing jumps from taking effect.
      if (prevBottom <= plat.y + 2 && playerBottom >= plat.y) {
        player.y = plat.y - player.height;
        // Only zero *positive* (falling) velocity — don't kill an upward jump
        if (player.vy > 0) player.vy = 0;
        player.grounded = true;
        break; // land on the first (topmost) matching platform
      }
    }
  }

  // ------------------------------------------------------------------
  // 8. Cooldowns & invincibility
  // ------------------------------------------------------------------
  if (player.dashCooldown > 0) player.dashCooldown -= dt * 16.667;
  if (player.invincible > 0) player.invincible -= dt * 16.667;

  // ------------------------------------------------------------------
  // 9. Walk-cycle animation counter
  // ------------------------------------------------------------------
  if (player.grounded && Math.abs(player.vx) > 0.5) {
    player.walkCycle += Math.abs(player.vx) * dt * 0.3;
  }

  // ------------------------------------------------------------------
  // 10. Clamp to left edge of level
  // ------------------------------------------------------------------
  if (player.x < 0) player.x = 0;
}

// ---------------------------------------------------------------------------
// Damage helpers
// ---------------------------------------------------------------------------

/**
 * Apply damage to the player. Returns `true` if the player dies.
 * Respects invincibility frames — damage is ignored while invincible.
 */
export function damagePlayer(player: PlayerState, damage: number): boolean {
  if (player.invincible > 0) return false;

  player.health -= damage;
  player.invincible = 60; // ~1 second at 60 fps

  if (player.health <= 0) {
    player.health = 0;
    return true; // player died
  }
  return false;
}

/** Fully heal the player. */
export function healPlayer(player: PlayerState, amount: number): void {
  player.health = Math.min(player.health + amount, player.maxHealth);
}
