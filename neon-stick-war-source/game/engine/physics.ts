/**
 * ============================================================================
 * NEON STICK WAR - Physics & Collision System
 * ============================================================================
 * 
 * Extracted from lines 6467-6535 of the beautified bundle.
 * Contains: AABB collision, particle spawning, moving platform positions,
 * enemy height lookup, edge detection, voice line selection, and
 * mobile detection/timescale constants.
 * ============================================================================
 */

import type {
  ParticleEntity,
  PlatformEntity,
  EnemyType,
  VoiceLineCategories,
} from "../types";

// ============================================================================
// Mobile Detection & Time Scale Constants
// Original: eB(), eG, e$, eF, eH (lines 6471-6478)
// ============================================================================

/**
 * Detect if the game is running on a mobile/touch device.
 * Original: eB()
 * 
 * Checks three methods:
 * 1. Capacitor native platform (iOS/Android wrapper)
 * 2. CSS media query for touch-only devices (hover:none + pointer:coarse)
 * 3. User-agent string matching common mobile browsers
 */
export function detectMobile(): boolean {
  return !!(
    (window as any).Capacitor?.isNativePlatform?.() ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

/** Whether the current device is mobile. Original: eG */
export const IS_MOBILE: boolean = detectMobile();

/**
 * Particle count multiplier for mobile (reduced to save performance).
 * Mobile: 0.4 (40% of requested particles)
 * Desktop: 1.0 (100%)
 * Original: e$
 */
export const PARTICLE_COUNT_MULTIPLIER: number = IS_MOBILE ? 0.4 : 1;

/**
 * Maximum allowed particle count in the scene.
 * Mobile: 20 (lower for performance)
 * Desktop: 100
 * Original: eF
 */
export const MAX_PARTICLES: number = IS_MOBILE ? 20 : 100;

/**
 * Target frame interval in milliseconds.
 * Mobile: ~33ms (30 FPS target)
 * Desktop: ~16.67ms (60 FPS target)
 * Original: eH
 */
export const FRAME_INTERVAL: number = 1000 / (IS_MOBILE ? 30 : 60);

/**
 * Get the mobile-adjusted decrement step for timer counters.
 * On mobile, timers decrement by 2 per frame (30fps → effectively same speed as 60fps with -1).
 * On desktop, timers decrement by 1 per frame.
 * 
 * @returns Timer decrement value (2 on mobile, 1 on desktop)
 */
export function getTimerDecrement(): number {
  return IS_MOBILE ? 2 : 1;
}

// ============================================================================
// AABB Collision Detection
// Original: eO(x1,y1,w1,h1, x2,y2,w2,h2) - line 6467
// ============================================================================

/**
 * Check if two axis-aligned bounding boxes overlap.
 * Original: eO()
 * 
 * Standard AABB overlap test: two rectangles collide if they overlap
 * on BOTH the X and Y axes simultaneously.
 * 
 * @param x1 - Left edge of rectangle A
 * @param y1 - Bottom edge of rectangle A (in game coords, y increases downward)
 * @param w1 - Width of rectangle A
 * @param h1 - Height of rectangle A
 * @param x2 - Left edge of rectangle B
 * @param y2 - Bottom edge of rectangle B
 * @param w2 - Width of rectangle B
 * @param h2 - Height of rectangle B
 * @returns true if the two rectangles overlap
 * 
 * @example
 * // Player collision with enemy
 * const playerHitbox = { x: player.x, y: player.y - player.height, w: player.width, h: player.height };
 * const enemyHitbox = { x: enemy.x, y: enemy.y - enemyHeight, w: enemy.width, h: enemyHeight };
 * if (checkAABBCollision(playerHitbox.x, playerHitbox.y, playerHitbox.w, playerHitbox.h,
 *                         enemyHitbox.x, enemyHitbox.y, enemyHitbox.w, enemyHitbox.h)) {
 *   // Collision detected!
 * }
 */
export function checkAABBCollision(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// ============================================================================
// Particle Spawning
// Original: eU(particles, x, y, count, color) - line 6480
// ============================================================================

/**
 * Spawn particles at a given position and trim excess particles.
 * Original: eU()
 * 
 * On mobile, the particle count is reduced by the PARTICLE_COUNT_MULTIPLIER
 * and capped at 3 maximum to preserve performance. Each particle gets
 * a random velocity, lifetime, and size.
 * 
 * After spawning, if the total particle count exceeds MAX_PARTICLES,
 * the oldest particles are removed (spliced from the beginning).
 * 
 * @param particles - The active particle array (mutated in place)
 * @param x - Spawn X position
 * @param y - Spawn Y position
 * @param count - Desired number of particles to spawn
 * @param color - Color string for all spawned particles
 */
export function spawnParticles(
  particles: ParticleEntity[],
  x: number,
  y: number,
  count: number,
  color: string
): void {
  // Reduce count on mobile, cap at 3
  const adjustedCount: number = IS_MOBILE
    ? Math.min(Math.ceil(count * PARTICLE_COUNT_MULTIPLIER), 3)
    : count;

  for (let i = 0; i < adjustedCount; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 5,         // Random horizontal spread ±2.5
      vy: (Math.random() - 0.5) * 5 - 1.5,    // Random vertical spread, biased upward
      life: 18 + 18 * Math.random(),            // 18-36 frame lifetime
      maxLife: 36,
      color: color,
      size: 2 + 2 * Math.random(),              // 2-4 pixel radius
    });
  }

  // Trim oldest particles if over the limit
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
}

// ============================================================================
// Moving Platform Position
// Original: eV(platform) - line 6495
// ============================================================================

/**
 * Calculate the current rendered position of a moving platform.
 * Original: eV()
 * 
 * Moving platforms oscillate along their configured axis using a sine wave.
 * The moveOffset is incremented each frame by (0.02 * moveSpeed).
 * 
 * For non-moving platforms, or platforms missing required properties,
 * returns the static x/y position directly.
 * 
 * @param platform - The platform entity
 * @returns Object with {px, py} = current position of the platform
 */
export function getMovingPlatformPosition(
  platform: PlatformEntity
): { px: number; py: number } {
  return {
    px:
      platform.type === "moving" &&
      platform.moveAxis === "x" &&
      platform.moveRange &&
      platform.moveSpeed
        ? platform.x + Math.sin(platform.moveOffset || 0) * platform.moveRange
        : platform.x,
    py:
      platform.type === "moving" &&
      platform.moveAxis === "y" &&
      platform.moveRange &&
      platform.moveSpeed
        ? platform.y + Math.sin(platform.moveOffset || 0) * platform.moveRange
        : platform.y,
  };
}

// ============================================================================
// Enemy Height Lookup
// Original: ez(enemyType) - line 6504
// ============================================================================

/**
 * Get the collision height for a given enemy type.
 * Original: ez()
 * 
 * Different enemy types have different hitbox heights, which affects
 * both collision detection and rendering. Bosses and giants are the
 * tallest at 80px, while void bats are the shortest at 30px.
 * 
 * @param enemyType - The type identifier of the enemy
 * @returns Height in pixels for collision detection
 */
export function getEnemyHeight(enemyType: EnemyType): number {
  switch (enemyType) {
    // Bosses and giant: 80px
    case "boss":
    case "bossRedKing":
    case "bossTitan":
    case "bossDragon":
    case "bossPhoenix":
    case "bossMechGolem":
    case "bossCorrupted":
    case "bossFather":
    case "bossTwin":
    case "giant":
      return 80;

    // Small flying: 30px
    case "voidGuardian":
    case "voidBat":
    case "emberWisp":
      return 30;

    // Medium-small flyers: 35px
    case "crystalMoth":
      return 35;

    // Medium: 45px
    case "stormEagle":
    case "frostWraith":
    case "bomber":
      return 45;

    // Medium-large: 50px (default)
    case "dragon":
    case "phoenix":
    case "shadowAssassin":
    case "eliteDrone":
    case "necromancer":
    case "plasmaSerpent":
      return 50;

    // Large: 55px
    case "mechGolem":
    case "heavyWalker":
    case "zombie":
    case "shadowDrake":
      return 55;

    // Extra-large: 60px
    case "neonWyrm":
      return 60;

    // Default fallback
    default:
      return 50;
  }
}

// ============================================================================
// Random Voice Line Picker
// Original: e_(category) - line 6514
// ============================================================================

/**
 * Pick a random voice line from the given category.
 * Original: e_()
 * 
 * The voice lines object (_) is keyed by category name (e.g., "kill", "damage",
 * "bossEnrage"). This function picks one at random from the array, or returns
 * an empty string if the category is empty or missing.
 * 
 * @param category - The voice line category key
 * @param voiceLines - The voice lines data object
 * @returns A random voice line string, or "" if none available
 */
export function getRandomVoiceLine(
  category: string,
  voiceLines: VoiceLineCategories
): string {
  const lines = voiceLines[category];
  return lines && lines.length !== 0
    ? lines[Math.floor(Math.random() * lines.length)]
    : "";
}

// ============================================================================
// Edge Detection (Can Walk Direction)
// Original: eK(x, y, dir, platforms, level, width) - line 6518
// ============================================================================

/**
 * Check whether an entity can safely walk in a given direction without
 * falling off a platform edge or going out of level bounds.
 * Original: eK()
 * 
 * This is used by enemies and allies to avoid walking off platforms.
 * It tests three probe points along the entity's path:
 * 1. Entity's front edge (x + 35 * direction)
 * 2. Slightly beyond that (x + 35*dir + half the entity width)
 * 3. Full step forward (x + entity width + small offset)
 * 
 * If ALL three probe points have solid ground beneath them, the entity
 * can walk that direction. Also checks level boundaries.
 * 
 * @param x - Entity's current X position
 * @param y - Entity's current Y position (bottom/feet)
 * @param direction - 1 for right, -1 for left
 * @param platforms - Array of platform entities
 * @param level - The level config (uses level.width for boundary)
 * @param entityWidth - Width of the entity (default 20)
 * @returns true if the entity can safely walk in the given direction
 */
export function canWalkDirection(
  x: number,
  y: number,
  direction: number,
  platforms: PlatformEntity[],
  level: { width: number },
  entityWidth: number = 20
): boolean {
  // Test Y position: slightly below feet (5px tolerance for ground detection)
  const testY = y + 5;

  // Three probe points along the walking path
  const probePoints = [
    x + 35 * direction,                                        // Front edge
    x + 35 * direction + (direction > 0 ? entityWidth : -entityWidth) * 0.5,  // Half step
    x + (direction > 0 ? entityWidth : 0) + 5 * direction,    // Full step + small offset
  ];

  for (const probeX of probePoints) {
    let hasGround = false;

    for (const platform of platforms) {
      const { px, py } = getMovingPlatformPosition(platform);

      // Check if probe point is above this platform
      if (
        probeX >= px &&
        probeX <= px + platform.width &&
        testY >= py - 5 &&
        testY <= py + platform.height + 20
      ) {
        hasGround = true;
        break;
      }
    }

    // If any probe point has no ground beneath, can't walk this way
    if (!hasGround) return false;
  }

  // Also check level boundaries
  if (x + 35 * direction < 0) return false;
  if (x + 35 * direction > level.width - 20) return false;

  return true;
}

// ============================================================================
// Standard Platform Collision (shared by many entity types)
// ============================================================================

/**
 * Apply gravity and platform collision resolution for a ground-based entity.
 * This is the common physics pattern shared by player, enemies, and allies.
 * 
 * Pattern extracted from the repeated code blocks in enemy AI:
 *   1. Apply gravity (vy += 0.5)
 *   2. Clamp terminal velocity (vy max = 10)
 *   3. Move by velocity
 *   4. Reset grounded flag
 *   5. Check each platform for landing
 * 
 * @param entity - The entity to update (mutated in place)
 * @param platforms - Array of platform entities
 * @param timeScale - Time scale factor (1 on desktop, 2 on mobile)
 */
export function applyGravityAndPlatformCollision(
  entity: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    grounded: boolean;
  },
  platforms: PlatformEntity[],
  timeScale: number = 1
): void {
  // Apply gravity
  entity.vy += 0.5 * timeScale;
  if (entity.vy > 10 * timeScale) {
    entity.vy = 10 * timeScale;
  }

  // Apply velocity
  entity.x += entity.vx * timeScale;
  entity.y += entity.vy * timeScale;

  // Reset grounded - will be set true if landing on a platform
  entity.grounded = false;

  // Check platform collision
  for (const platform of platforms) {
    const { px, py } = getMovingPlatformPosition(platform);

    // Landing check: entity feet at or below platform top, and was above it last frame
    if (
      entity.x + entity.width > px + 4 &&
      entity.x < px + platform.width - 4 &&
      entity.y >= py - 4 &&
      entity.y - entity.vy * timeScale <= py + Math.max(10, Math.abs(entity.vy) * timeScale + 8)
    ) {
      entity.y = py;
      entity.vy = 0;
      entity.grounded = true;
    }
  }
}

/**
 * Reverse entity facing when hitting level boundaries.
 * Common pattern used by many enemy types.
 * 
 * @param entity - Entity with x, width, facing properties
 * @param levelWidth - Width of the level
 */
export function clampLevelBounds(
  entity: { x: number; width: number; facing: number; vx?: number },
  levelWidth: number
): void {
  if (entity.x < 10 || entity.x > levelWidth - 30) {
    entity.facing = -1 * entity.facing;
  }
}
