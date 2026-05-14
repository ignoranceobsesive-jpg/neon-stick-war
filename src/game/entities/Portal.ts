/**
 * Portal.ts — Portal entity that opens when all enemies in the current wave
 * are defeated, allowing the player to advance to the next wave or complete
 * the level.
 *
 * ## BUG FIX — Portal Doesn't Open
 * The original minified code had a convoluted portal-activation condition that
 * checked multiple internal counters and wave-staging queues. In practice this
 * meant the portal almost never activated because the conditions were never all
 * satisfied simultaneously.
 *
 * **Fix**: The portal activation logic is now clean and explicit:
 *   - `activatePortal()` is called when **all** enemies in the current wave
 *     are dead (alive count === 0).
 *   - `deactivatePortal()` is called when a new wave begins.
 *   - The caller (game loop / wave manager) is responsible for checking the
 *     enemy count — this module simply tracks the portal's active state.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Full serializable state of a portal entity. */
export interface PortalState {
  /** Centre X position in world space. */
  x: number;
  /** Centre Y position in world space. */
  y: number;

  /**
   * Whether the portal is active (visible & enterable).
   * When `false`, the portal is invisible and cannot be entered.
   *
   * BUG FIX: This field is the single source of truth for portal visibility.
   * The caller must call `activatePortal()` when all enemies are dead and
   * `deactivatePortal()` when a new wave starts. There is no hidden state or
   * secondary condition — if `active` is `true`, the portal works.
   */
  active: boolean;

  /** Rotation angle for the spinning-ring animation (radians). */
  rotation: number;

  /** Pulsing scale factor for the glow animation. */
  pulseScale: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a new portal at the given world position.
 * Portals start **inactive** — call `activatePortal()` to open them.
 */
export function createPortal(x: number, y: number): PortalState {
  return {
    x,
    y,
    active: false,
    rotation: 0,
    pulseScale: 1,
  };
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

/**
 * Advance the portal animation by one frame.
 * Only runs when the portal is active.
 *
 * @param portal Mutated in-place.
 * @param dt     Delta-time multiplier (1.0 = 60 fps frame).
 */
export function updatePortal(portal: PortalState, dt: number): void {
  if (!portal.active) return;

  // Spin the ring animation
  portal.rotation += 0.05 * dt;

  // Gentle pulsing glow — uses wall-clock time for smoothness
  portal.pulseScale = 1 + 0.1 * Math.sin(Date.now() * 0.005);
}

// ---------------------------------------------------------------------------
// Proximity check
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the player is close enough to enter the portal.
 * Distance thresholds: |dx| < 30 AND |dy| < 30 (roughly one character width).
 *
 * The portal **must** be active for this to return `true`.
 */
export function isPlayerAtPortal(
  portal: PortalState,
  playerX: number,
  playerY: number,
): boolean {
  if (!portal.active) return false;

  const dx = playerX - portal.x;
  const dy = playerY - portal.y;

  return Math.abs(dx) < 30 && Math.abs(dy) < 30;
}

// ---------------------------------------------------------------------------
// Activation / deactivation
// ---------------------------------------------------------------------------

/**
 * Open the portal so the player can see it and enter it.
 *
 * **Call this when all enemies in the current wave are dead.**
 *
 * Example (in the game loop):
 * ```ts
 * const aliveEnemies = enemies.filter(e => e.alive);
 * if (aliveEnemies.length === 0 && !portal.active) {
 *   activatePortal(portal);
 * }
 * ```
 */
export function activatePortal(portal: PortalState): void {
  portal.active = true;
}

/**
 * Close the portal (e.g. when a new wave begins).
 *
 * **Call this at the start of each new wave.**
 */
export function deactivatePortal(portal: PortalState): void {
  portal.active = false;
}

// ---------------------------------------------------------------------------
// Wave / level flow helper
// ---------------------------------------------------------------------------

/**
 * High-level helper: check whether the portal should be activated based on
 * the current list of enemies, and activate it if so.
 *
 * Returns `true` if the portal was just activated this frame (useful for
 * triggering UI / sound effects).
 *
 * @param portal   The portal to potentially activate.
 * @param enemies  All enemies in the current wave.
 */
export function checkPortalActivation(
  portal: PortalState,
  enemies: Array<{ alive: boolean }>,
): boolean {
  if (portal.active) return false; // already open

  const allDead = enemies.length > 0 && enemies.every((e) => !e.alive);
  if (allDead) {
    activatePortal(portal);
    return true; // just opened
  }
  return false;
}

/**
 * Process the player entering the portal.
 * Returns a result indicating what should happen next:
 *   - `'nextWave'` — advance to the next wave (portal resets).
 *   - `'levelComplete'` — the final wave is done; level is finished.
 *
 * @param portal       The portal being entered.
 * @param currentWave  Zero-based index of the current wave.
 * @param totalWaves   Total number of waves in this level.
 */
export function enterPortal(
  portal: PortalState,
  currentWave: number,
  totalWaves: number,
): 'nextWave' | 'levelComplete' {
  // Close the portal for the next wave
  deactivatePortal(portal);

  if (currentWave < totalWaves - 1) {
    return 'nextWave';
  }
  return 'levelComplete';
}
