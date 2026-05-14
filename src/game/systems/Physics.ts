/**
 * Physics.ts — Static helper functions for collision detection.
 *
 * Provides:
 *   - AABB (Axis-Aligned Bounding Box) overlap tests.
 *   - Point-in-rect checks.
 *   - Ground-finding utilities.
 *   - Entity-platform collision resolution (landing on top of platforms).
 *
 * All functions are pure (no side effects) and operate on simple `Rect`
 * structures, making them easy to test and compose.
 *
 * ### Collision Philosophy
 *
 * The original minified game had a collision tolerance of only +4 pixels,
 * which — combined with an uncapped speed multiplier — caused players to
 * fall through platforms at high frame times. The `resolvePlatformCollision`
 * function here uses the same tolerance-buffer approach as `Player.ts`:
 * it compares the entity's *previous* bottom position against the platform
 * top and only triggers a landing when the entity was above the platform
 * last frame and is now overlapping.
 */

// ---------------------------------------------------------------------------
// Rect type
// ---------------------------------------------------------------------------

/**
 * Minimal axis-aligned rectangle used for all collision tests.
 * Matches the shape of entity hitboxes (x, y = top-left corner).
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// AABB overlap
// ---------------------------------------------------------------------------

/**
 * Test whether two axis-aligned rectangles overlap.
 *
 * Uses the standard separating-axis test: if there is NO overlap on either
 * the X or Y axis, the rectangles do not overlap.
 */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ---------------------------------------------------------------------------
// Point-in-rect
// ---------------------------------------------------------------------------

/**
 * Test whether a point (px, py) lies inside a rectangle.
 * Inclusive on all edges (>= left, <= right, >= top, <= bottom).
 */
export function pointInRect(px: number, py: number, r: Rect): boolean {
  return px >= r.x && px <= r.x + r.width && py >= r.y && py <= r.y + r.height;
}

// ---------------------------------------------------------------------------
// Ground finding
// ---------------------------------------------------------------------------

/**
 * Find the Y position of the highest platform surface directly below a point.
 *
 * Useful for:
 *   - Spawning enemies on the ground.
 *   - Teleporting the player back to ground level after falling off-screen.
 *
 * @param x          World-space X to check.
 * @param platforms  Array of platform rectangles to test against.
 * @returns The Y coordinate of the platform top, or `null` if no platform
 *          exists below the point.
 */
export function findGroundBelow(x: number, platforms: Rect[]): number | null {
  let groundY: number | null = null;

  for (const p of platforms) {
    // Only consider platforms that horizontally contain the point
    if (x >= p.x && x <= p.x + p.width) {
      // Pick the highest (smallest Y) platform top
      if (groundY === null || p.y < groundY) {
        groundY = p.y;
      }
    }
  }

  return groundY;
}

// ---------------------------------------------------------------------------
// Platform collision resolution
// ---------------------------------------------------------------------------

/**
 * Resolve entity-platform collision (landing on top of a platform).
 *
 * This function checks whether an entity that was **above** a platform in
 * the previous frame has now fallen into it. If so, it places the entity
 * on top of the platform and marks it as grounded.
 *
 * ### How it works
 *
 * 1. For each platform, check horizontal overlap (entity must be within
 *    the platform's horizontal bounds).
 * 2. Compare the entity's **previous bottom** (before this frame's velocity
 *    was applied) against the platform top.
 * 3. If the previous bottom was at or above the platform top (with a small
 *    tolerance), and the current bottom has crossed below it, the entity
 *    has landed.
 * 4. Place the entity on the platform surface and zero out positive (falling)
 *    velocity.
 *
 * @param entityX       Entity left edge (current frame).
 * @param entityY       Entity top edge (current frame).
 * @param entityWidth   Entity hitbox width.
 * @param entityHeight  Entity hitbox height.
 * @param prevY         Entity top edge (previous frame, BEFORE velocity).
 * @param vy            Entity vertical velocity (current frame).
 * @param platforms     Array of platform rectangles to test against.
 * @returns An object with the corrected `y` position and whether the entity
 *          is now `grounded`.
 */
export function resolvePlatformCollision(
  entityX: number,
  entityY: number,
  entityWidth: number,
  entityHeight: number,
  prevY: number,
  vy: number,
  platforms: Rect[],
): { y: number; grounded: boolean } {
  let grounded = false;
  let y = entityY;

  const entityBottom = entityY + entityHeight;
  const prevBottom = prevY + entityHeight;

  for (const plat of platforms) {
    // Horizontal overlap check
    if (entityX + entityWidth > plat.x && entityX < plat.x + plat.width) {
      // Only land if was above platform and now overlapping (with tolerance)
      // The 2px tolerance prevents re-snapping when standing still
      if (prevBottom <= plat.y + 2 && entityBottom >= plat.y) {
        y = plat.y - entityHeight;
        // Only zero *positive* (falling) velocity — don't kill upward jumps
        if (vy > 0) grounded = true;
        break; // land on the first (topmost) matching platform
      }
    }
  }

  return { y, grounded };
}

// ---------------------------------------------------------------------------
// Distance utilities
// ---------------------------------------------------------------------------

/**
 * Compute the Euclidean distance between two points.
 */
export function distanceBetween(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Compute the horizontal distance between the centres of two rectangles.
 * Useful for enemy sight-range checks where only horizontal distance matters.
 */
export function horizontalDistance(a: Rect, b: Rect): number {
  const aCenterX = a.x + a.width / 2;
  const bCenterX = b.x + b.width / 2;
  return Math.abs(aCenterX - bCenterX);
}

// ---------------------------------------------------------------------------
// Level bounds clamping
// ---------------------------------------------------------------------------

/**
 * Clamp an entity's X position within level bounds [0, levelWidth - entityWidth].
 *
 * @returns The clamped X position.
 */
export function clampToLevelBounds(
  entityX: number,
  entityWidth: number,
  levelWidth: number,
): number {
  if (entityX < 0) return 0;
  if (entityX + entityWidth > levelWidth) return levelWidth - entityWidth;
  return entityX;
}
