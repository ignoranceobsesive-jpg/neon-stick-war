/**
 * ============================================================================
 * NEON STICK WAR - Player Controls Update
 * ============================================================================
 * 
 * Extracted from lines 7186-7248 of the beautified bundle.
 * Original function: e9()
 * 
 * This is the core player update function, called every frame for each
 * player entity (P1 and P2 in versus mode). It handles:
 * - Movement input (keyboard, joystick, touch)
 * - Dashing mechanics (burst speed, cooldown, afterimage particles)
 * - Shield mechanics (damage negation, timer, cooldown)
 * - Special attack mechanics (spread shot, cooldown)
 * - Shooting (weapon upgrades, critical hits, bullet creation)
 * - Gravity and platform collision
 * - Level boundary clamping
 * - Invincibility frame counting
 * - Animation frame updates
 * - Expression (face) state transitions
 * ============================================================================
 */

import type {
  PlayerEntity,
  ControlState,
  JoystickInput,
  EnemyEntity,
  BulletEntity,
  ParticleEntity,
  PlatformEntity,
  WeaponUpgrades,
  UpgradeConfig,
} from "../types";
import {
  IS_MOBILE,
  getTimerDecrement,
  spawnParticles,
  getMovingPlatformPosition,
} from "./physics";

// ============================================================================
// Upgrade Configuration (extracted from line 443)
// ============================================================================

/** Weapon upgrade effect configuration */
export const WEAPON_UPGRADES: Record<string, UpgradeConfig> = {
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
    baseCost: 1000,
    costMultiplier: 1.8,
    effectPerLevel: 0.05,
    maxLevel: 999,
  },
};

// ============================================================================
// Player Update Function
// Original: e9(player, controls, joystick, enemies, bullets, particles, platforms, level, playerId)
// ============================================================================

/**
 * Update a player entity for one frame.
 * Original: e9()
 * 
 * Processes all player input, physics, shooting, abilities, and collision.
 * Called once per frame for each active player.
 * 
 * @param player - The player entity to update (mutated in place)
 * @param controls - Current button/key states (left, right, up, shoot)
 * @param joystick - Optional joystick directional input (mobile)
 * @param enemies - Active enemy array (for proximity-based expression changes)
 * @param bullets - Bullet array (new player bullets pushed here)
 * @param particles - Particle array (muzzle flash and dash trail particles)
 * @param platforms - Platform array (for collision detection)
 * @param level - Level configuration (width/height for boundary clamping)
 * @param playerId - Player identifier (1 or 2 in versus mode, undefined in campaign)
 * @param weaponUpgrades - Player's weapon upgrade levels
 * @param frameCount - Current global frame counter
 * @param updateCooldownsUI - Callback to sync UI cooldown display
 * @param screenShakeFn - Callback to trigger screen shake
 * @param playShootSound - Callback to play shoot sound effect
 */
export function updatePlayerEntity(
  player: PlayerEntity,
  controls: ControlState,
  joystick: JoystickInput | null,
  enemies: EnemyEntity[],
  bullets: BulletEntity[],
  particles: ParticleEntity[],
  platforms: PlatformEntity[],
  level: { width: number; height: number },
  playerId: number | undefined,
  weaponUpgrades: WeaponUpgrades,
  frameCount: number,
  updateCooldownsUI?: (dash: number, shield: number, special: number) => void,
  screenShakeFn?: () => void,
  playShootSound?: () => void
): void {
  const timerDecrement = getTimerDecrement();

  // ========================================================================
  // SECTION 1: MOVEMENT INPUT
  // Determine horizontal movement direction from joystick or keyboard.
  // ========================================================================
  let moveDirection = 0;

  if (joystick?.active) {
    // Joystick input (mobile) - analog direction
    moveDirection = joystick.dx;
    if (joystick.dx > 0.05) {
      player.facing = 1;
    } else if (joystick.dx < -0.05) {
      player.facing = -1;
    }
    // else: keep current facing
  } else {
    // Keyboard/button input
    if (controls.left) {
      moveDirection = -1;
      player.facing = -1;
    }
    if (controls.right) {
      moveDirection = 1;
      player.facing = 1;
    }
  }

  // ========================================================================
  // SECTION 2: DASHING
  // When dashing, override velocity with burst speed in facing direction.
  // ========================================================================
  if (player.isDashing) {
    // Decrement dash timer (2x on mobile for frame rate compensation)
    player.dashTimer -= timerDecrement;

    // Override horizontal velocity with dash speed
    player.vx = 18 * player.facing;

    // End dash when timer expires
    if (player.dashTimer <= 0) {
      player.isDashing = false;
    }

    // Spawn dash trail particles every other frame
    if (frameCount % 2 === 0) {
      spawnParticles(
        particles,
        player.x + player.width / 2,
        player.y - 25,
        2,
        player.skinColor
      );
    }
  } else {
    // ========================================================================
    // SECTION 3: NORMAL MOVEMENT
    // Ground speed: 5 units/frame, Air speed: 3.5 units/frame (reduced air control)
    // ========================================================================
    player.vx = (player.grounded ? 5 : 3.5) * moveDirection;
  }

  // Track if player is moving (for animation and expression)
  player.isMoving = Math.abs(moveDirection) > 0.1 || player.isDashing;

  // ========================================================================
  // SECTION 4: SHIELD TIMER
  // Shield blocks incoming projectiles while active.
  // ========================================================================
  if (player.isShielding) {
    player.shieldTimer -= timerDecrement;
    if (player.shieldTimer <= 0) {
      player.isShielding = false;
    }
  }

  // ========================================================================
  // SECTION 5: SPECIAL ATTACK TIMER
  // Special fires a spread of bullets in a fan pattern.
  // ========================================================================
  if (player.isUsingSpecial) {
    player.specialTimer -= timerDecrement;
    if (player.specialTimer <= 0) {
      player.isUsingSpecial = false;
    }
  }

  // ========================================================================
  // SECTION 6: SHOOT COOLDOWN
  // Decrements every frame regardless of whether shooting.
  // ========================================================================
  if (player.shootCooldown > 0) {
    player.shootCooldown -= timerDecrement;
  }

  // ========================================================================
  // SECTION 7: SHOOTING
  // Create a bullet when shoot is pressed and cooldown is ready.
  // Applies weapon upgrades: damage, fire rate, bullet speed, bullet size, critical chance.
  // ========================================================================
  player.isShooting && player.shootTimer--;  // Decrement shoot animation timer

  if (controls.shoot && player.shootCooldown <= 0 && !player.isDashing) {
    // Calculate upgrade multipliers
    const damageLevel = weaponUpgrades.damage ?? 0;
    const fireRateLevel = weaponUpgrades.fireRate ?? 0;
    const bulletSpeedLevel = weaponUpgrades.bulletSpeed ?? 0;
    const bulletSizeLevel = weaponUpgrades.bulletSize ?? 0;
    const critChanceLevel = weaponUpgrades.criticalChance ?? 0;

    const damageMultiplier = 1 + damageLevel * WEAPON_UPGRADES.damage.effectPerLevel;
    const fireRateMultiplier = 1 - Math.min(fireRateLevel * WEAPON_UPGRADES.fireRate.effectPerLevel, 0.8);
    const bulletSpeedMultiplier = 1 + bulletSpeedLevel * WEAPON_UPGRADES.bulletSpeed.effectPerLevel;
    const bulletSizeMultiplier = 1 + bulletSizeLevel * WEAPON_UPGRADES.bulletSize.effectPerLevel;
    const isCritical = Math.random() < critChanceLevel * WEAPON_UPGRADES.criticalChance.effectPerLevel;

    // Create bullet entity
    bullets.push({
      x: player.x + player.width / 2 + 15 * player.facing,
      y: player.y - 25,
      vx: 10 * player.facing * bulletSpeedMultiplier,
      vy: 0,
      fromPlayer: true,
      damage: Math.round(10 * damageMultiplier * (isCritical ? 2 : 1)),
      active: true,
      color: isCritical ? "#ffd700" : player.skinColor,  // Gold for crits
      radius: Math.round(4 * bulletSizeMultiplier),
      fromPlayerId: playerId,
    });

    // Set shoot cooldown (minimum 2 frames, base 8, reduced by fire rate upgrade)
    player.shootCooldown = Math.max(2, Math.round(8 * fireRateMultiplier));

    // Start shoot animation
    player.isShooting = true;
    player.shootTimer = 6;

    // Muzzle flash particles
    spawnParticles(
      particles,
      player.x + player.width / 2 + 20 * player.facing,
      player.y - 25,
      isCritical ? 8 : 3,
      isCritical ? "#ffd700" : player.skinColor
    );

    // Visual/audio feedback
    screenShakeFn?.();
    playShootSound?.();
  }

  // End shoot animation when timer expires
  if (player.shootTimer <= 0) {
    player.isShooting = false;
  }

  // ========================================================================
  // SECTION 8: ABILITY COOLDOWNS
  // These decrement regardless of use (they count down AFTER activation).
  // ========================================================================
  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.shieldCooldown > 0) player.shieldCooldown--;
  if (player.specialCooldown > 0) player.specialCooldown--;

  // Sync cooldowns to UI every 6 frames
  if (frameCount % 6 === 0 && updateCooldownsUI) {
    updateCooldownsUI(player.dashCooldown, player.shieldCooldown, player.specialCooldown);
  }

  // ========================================================================
  // SECTION 9: EXPRESSION (FACE) STATE
  // Priority: dashing > special > shielding > hurt > shooting > moving > idle
  // ========================================================================
  if (player.isDashing) {
    player.expression = "determined";
  } else if (player.isUsingSpecial) {
    player.expression = "angry";
  } else if (player.isShielding) {
    player.expression = "smirk";
  } else if (player.invincible > 0 && player.health < 30) {
    player.expression = "hurt";
  } else if (player.isShooting) {
    player.expression = "determined";
  } else if (player.isMoving) {
    // Look angry when enemies are nearby
    const nearbyEnemies = enemies.some(
      (enemy) => enemy.active && 300 > Math.abs(enemy.x - player.x)
    );
    player.expression = nearbyEnemies ? "angry" : "determined";
  } else {
    player.expression = "smirk";  // Idle/relaxed
  }

  // ========================================================================
  // SECTION 10: GRAVITY & PLATFORM COLLISION
  // Apply gravity, move by velocity, then resolve platform landing.
  // ========================================================================
  const timeScale = IS_MOBILE ? 2 : 1;

  // Apply gravity (0.5 per frame, scaled for mobile)
  player.vy += 0.5 * timeScale;

  // Terminal velocity cap
  if (player.vy > 10 * timeScale) {
    player.vy = 10 * timeScale;
  }

  // Apply velocity
  player.x += player.vx * timeScale;
  player.y += player.vy * timeScale;

  // Reset grounded - will be set true if landing on a platform
  player.grounded = false;

  // Check each platform for landing
  for (const platform of platforms) {
    const { px, py } = getMovingPlatformPosition(platform);

    // Landing detection:
    // - Horizontal overlap (with 4px inner margin to avoid edge sticking)
    // - Feet at or below platform top
    // - Was above platform last frame (with tolerance for tunneling prevention)
    if (
      player.x + player.width > px + 4 &&
      player.x < px + platform.width - 4 &&
      player.y >= py - 4 &&
      player.y - player.vy * timeScale <= py + Math.max(10, Math.abs(player.vy) * timeScale + 8)
    ) {
      player.y = py;
      player.vy = 0;
      player.grounded = true;
      player.jumpCount = 0;  // Reset double jump on landing
    }
  }

  // ========================================================================
  // SECTION 11: LEVEL BOUNDARY CLAMPING
  // Keep player within the level width and provide a floor safety net.
  // ========================================================================

  // Left boundary
  if (player.x < 0) {
    player.x = 0;
  }

  // Right boundary
  if (player.x + player.width > level.width) {
    player.x = level.width - player.width;
  }

  // Floor safety: if player feet reach the bottom of the screen, they're grounded
  if (player.y > level.height - 5) {
    if (!player.grounded) {
      player.grounded = true;
    }
    player.jumpCount = 0;
  }

  // Void respawn: if player falls way below the level, respawn at start
  if (player.y > level.height + 100) {
    player.y = 460;
    player.vy = 0;
    player.vx = 0;
    player.x = 80;
  }

  // ========================================================================
  // SECTION 12: ANIMATION FRAME
  // Increment animation frame when moving or in the air.
  // ========================================================================
  if (player.vx !== 0 || !player.grounded) {
    player.animTimer++;
    if (player.animTimer >= 3) {
      player.animTimer = 0;
      player.animFrame++;
    }
  }

  // ========================================================================
  // SECTION 13: INVINCIBILITY
  // Count down invincibility frames (2x on mobile for frame rate compensation).
  // ========================================================================
  if (player.invincible > 0) {
    player.invincible -= timerDecrement;
  }
}
