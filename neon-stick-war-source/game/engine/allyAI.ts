/**
 * ============================================================================
 * NEON STICK WAR - Ally (Gang Member) AI System
 * ============================================================================
 * 
 * Extracted from lines 8384-8431 of the beautified bundle.
 * 
 * Gang member AI behavior:
 * - Follows the player closely
 * - Jumps when the player is above or at platform edges
 * - Shoots at the nearest enemy within 400px
 * - Takes damage from enemy contact
 * - Dies when health reaches 0 (no respawn)
 * ============================================================================
 */

import type {
  AllyEntity,
  PlayerEntity,
  EnemyEntity,
  BulletEntity,
  ParticleEntity,
  PlatformEntity,
} from "../types";
import {
  IS_MOBILE,
  getTimerDecrement,
  spawnParticles,
  getMovingPlatformPosition,
  getEnemyHeight,
  checkAABBCollision,
  canWalkDirection,
} from "./physics";

/**
 * Update a gang member (ally) AI for one frame.
 * 
 * Allies follow the player, shoot at enemies, and take damage
 * from enemy contact. Unlike the pet, allies don't respawn after death.
 * 
 * @param ally - The ally entity to update (mutated in place)
 * @param player - The player entity (leader)
 * @param enemies - Active enemy array
 * @param bullets - Bullet array (ally bullets pushed here)
 * @param particles - Particle array (visual effects)
 * @param platforms - Platform array for collision
 * @param level - Level configuration
 * @param frameCount - Global frame counter
 */
export function updateAllyAI(
  ally: AllyEntity,
  player: PlayerEntity,
  enemies: EnemyEntity[],
  bullets: BulletEntity[],
  particles: ParticleEntity[],
  platforms: PlatformEntity[],
  level: { width: number; height: number },
  frameCount: number
): void {
  if (!ally.active) return;

  const distanceToPlayer = Math.abs(ally.x - player.x);
  const timerDecrement = getTimerDecrement();

  // ========================================================================
  // MOVEMENT: Follow the player
  // ========================================================================

  if (distanceToPlayer > 60) {
    // Move toward player
    ally.vx = (player.x > ally.x ? 1 : -1) * 4;
    ally.facing = ally.vx > 0 ? 1 : -1;
  } else {
    // Stay near player, match facing
    ally.vx = 0;
    ally.facing = player.facing;
  }

  // Edge detection: don't walk off platforms
  if (
    ally.grounded &&
    ally.vx !== 0 &&
    !canWalkDirection(ally.x, ally.y, ally.vx > 0 ? 1 : -1, platforms, level, 30)
  ) {
    ally.vx = 0;
    ally.facing = -1 * ally.facing;
  }

  // ========================================================================
  // GRAVITY & PLATFORM COLLISION
  // ========================================================================
  ally.vy += 0.5;
  if (ally.vy > 10) ally.vy = 10;
  ally.x += ally.vx;
  ally.y += ally.vy;
  ally.grounded = false;

  for (const platform of platforms) {
    const { px, py } = getMovingPlatformPosition(platform);
    if (
      ally.x + 15 > px &&
      ally.x - 15 < px + platform.width &&
      ally.y >= py - 4 &&
      ally.y - ally.vy <= py + Math.max(10, Math.abs(ally.vy) + 8)
    ) {
      ally.y = py;
      ally.vy = 0;
      ally.grounded = true;
    }
  }

  // ========================================================================
  // RESPAWN: If fallen off map, teleport to player
  // ========================================================================
  if (ally.y > level.height + 50) {
    ally.x = player.x - 40;
    ally.y = player.y;
    ally.vy = 0;
    ally.grounded = false;
    ally.invincible = 30;
  }

  // ========================================================================
  // JUMPING: Jump when player is above or at level boundary
  // ========================================================================
  if (ally.grounded && (!player.grounded || ally.x < 10 || ally.x > level.width - 30)) {
    const jumpDirection = player.x > ally.x ? 1 : -1;
    if (canWalkDirection(ally.x, ally.y, jumpDirection, platforms, level, 30)) {
      ally.vy = -10.2;
      ally.grounded = false;
    } else if (player.y < ally.y - 60) {
      // Player is above us - jump!
      ally.vy = -10.2;
      ally.grounded = false;
    }
  }

  // ========================================================================
  // SHOOTING: Fire at nearest enemy within 400px
  // ========================================================================
  ally.shootCooldown -= timerDecrement;

  if (ally.shootCooldown <= 0) {
    const nearestEnemy = enemies.find(
      (enemy) => enemy.active && 400 > Math.abs(enemy.x - ally.x)
    );

    if (nearestEnemy) {
      const dx = nearestEnemy.x - ally.x;
      const dy = (nearestEnemy.y - 25) - (ally.y - 25);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        bullets.push({
          x: ally.x,
          y: ally.y - 25,
          vx: (dx / distance) * 7,
          vy: (dy / distance) * 7,
          fromPlayer: true,
          damage: 8,
          active: true,
          color: ally.color,
          radius: 3,
          fromGangMember: ally.id,
        });

        spawnParticles(particles, ally.x + 15 * ally.facing, ally.y - 25, 2, ally.color);
      }

      ally.shootCooldown = 50 + Math.floor(30 * Math.random());
    }
  }

  // ========================================================================
  // ANIMATION
  // ========================================================================
  ally.animFrame++;

  // ========================================================================
  // INVINCIBILITY
  // ========================================================================
  if (ally.invincible > 0) {
    ally.invincible -= timerDecrement;
  }

  // ========================================================================
  // ENEMY CONTACT DAMAGE: Ally takes damage from nearby enemies
  // ========================================================================
  for (const enemy of enemies) {
    if (!enemy.active) continue;
    if (ally.invincible > 0) continue;

    const enemyHeight = getEnemyHeight(enemy.type);
    if (
      checkAABBCollision(
        ally.x - 10, ally.y - 45, 20, 45,
        enemy.x, enemy.y - enemyHeight, enemy.width, enemyHeight
      )
    ) {
      ally.health -= 10;
      ally.invincible = 40;
      ally.expression = "hurt";
      spawnParticles(particles, ally.x, ally.y - 25, 5, ally.color);
    }
  }

  // ========================================================================
  // DEATH: Ally is permanently dead (no respawn)
  // ========================================================================
  if (ally.health <= 0) {
    ally.active = false;
    spawnParticles(particles, ally.x, ally.y - 25, 15, ally.color);
  }

  // ========================================================================
  // EXPRESSION: Based on combat state
  // ========================================================================
  if (ally.shootCooldown < 20) {
    ally.expression = "angry";        // Recently shot - combat mode
  } else if (distanceToPlayer < 200) {
    ally.expression = "determined";   // Near player - alert
  } else {
    ally.expression = "neutral";      // Idle
  }
}
