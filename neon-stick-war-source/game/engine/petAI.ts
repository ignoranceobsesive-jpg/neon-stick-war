/**
 * ============================================================================
 * NEON STICK WAR - Pet AI System
 * ============================================================================
 * 
 * Extracted from lines 8432-8485 of the beautified bundle.
 * 
 * Pet AI behavior:
 * - Follows the player, staying near their offset position
 * - Jumps when the player is above or when at platform edges
 * - Shoots at the nearest enemy within range
 * - Takes damage from enemy contact
 * - Respawns after a timer when killed
 * ============================================================================
 */

import type {
  PetEntity,
  PlayerEntity,
  EnemyEntity,
  BulletEntity,
  ParticleEntity,
  PlatformEntity,
  PetData,
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
 * Update pet AI for one frame.
 * 
 * The pet follows the player with smooth interpolation, jumps when needed,
 * shoots at nearby enemies, takes damage from enemy contact, and respawns
 * after death.
 * 
 * @param pet - The pet entity (mutated in place), or null if no pet
 * @param player - The player entity (owner)
 * @param enemies - Active enemy array
 * @param bullets - Bullet array (pet bullets pushed here)
 * @param particles - Particle array (visual effects)
 * @param platforms - Platform array for collision
 * @param level - Level configuration
 * @param petDataList - Pet type data array (for damage/shoot rate lookup)
 * @param frameCount - Global frame counter
 * @param screenShakeFn - Callback for screen shake
 * @param playPetShootFn - Callback for pet shoot sound
 * @param playDamageFn - Callback for damage sound
 * @param playPetDeathFn - Callback for pet death sound
 * @param playPetRespawnFn - Callback for pet respawn sound
 */
export function updatePetAI(
  pet: PetEntity | null,
  player: PlayerEntity,
  enemies: EnemyEntity[],
  bullets: BulletEntity[],
  particles: ParticleEntity[],
  platforms: PlatformEntity[],
  level: { width: number; height: number },
  petDataList: PetData[],
  frameCount: number,
  screenShakeFn?: () => void,
  playPetShootFn?: () => void,
  playDamageFn?: () => void,
  playPetDeathFn?: () => void,
  playPetRespawnFn?: () => void
): void {
  if (!pet) return;

  // ========================================================================
  // ACTIVE PET: Follow, shoot, take damage
  // ========================================================================
  if (pet.active) {
    const distanceToPlayer = Math.abs(pet.x - player.x);
    const verticalDistance = player.y - pet.y;

    // Target position: slightly behind the player based on facing direction
    const targetX = player.x - 30 * player.facing;
    const directionToTarget = targetX > pet.x ? 1 : targetX < pet.x ? -1 : 0;

    // ====================================================================
    // MOVEMENT: Follow player with smooth interpolation
    // ====================================================================
    let atPlatformEdge = false;

    // Check if pet is about to walk off a platform
    if (pet.grounded && directionToTarget !== 0) {
      atPlatformEdge = !canWalkDirection(pet.x, pet.y, directionToTarget, platforms, level, 20);
    }

    if (atPlatformEdge) {
      // At edge: jump if far from player, otherwise stop
      if (pet.grounded && distanceToPlayer > 60) {
        pet.vy = -10.8;  // Jump!
        pet.grounded = false;
      }
    } else {
      // Smooth follow: interpolate X toward target
      const followSpeed = distanceToPlayer > 80 ? 0.12 : 0.06;
      pet.x += (targetX - pet.x) * followSpeed;

      // Extra catch-up speed when far away
      if (distanceToPlayer > 80) {
        pet.x += (targetX - pet.x) * 0.08;
      }
    }

    // Face toward player or same direction as player when close
    if (distanceToPlayer > 30) {
      pet.facing = player.x > pet.x ? 1 : -1;
    } else {
      pet.facing = player.facing;
    }

    // ====================================================================
    // GRAVITY: Reduced gravity for pet (0.25 vs 0.5 for player)
    // ====================================================================
    pet.vy += 0.25;
    if (pet.vy > 6) pet.vy = 6;

    // Jump when player is significantly above
    if (verticalDistance < -60 && pet.grounded) {
      pet.vy = -10.2;
      pet.grounded = false;
    }

    // Apply vertical velocity
    pet.y += pet.vy;

    // ====================================================================
    // PLATFORM COLLISION
    // ====================================================================
    pet.grounded = false;

    for (const platform of platforms) {
      const { px, py } = getMovingPlatformPosition(platform);
      if (
        pet.x + 10 > px &&
        pet.x - 10 < px + platform.width &&
        pet.y >= py &&
        pet.y - pet.vy <= py + 4
      ) {
        pet.y = py;
        pet.vy = 0;
        pet.grounded = true;
      }
    }

    // ====================================================================
    // BOUNDARY: Respawn at player if fallen off map
    // ====================================================================
    if (pet.y > level.height + 50) {
      pet.x = player.x + 30;
      pet.y = player.y - 20;
      pet.vy = 0;
      pet.grounded = false;
      pet.invincible = 30;
    }

    // Horizontal bounds
    if (pet.x < 0) pet.x = 0;
    if (pet.x > level.width) pet.x = level.width;

    // ====================================================================
    // SHOOTING: Fire at nearest enemy within 350px
    // ====================================================================
    pet.shootCooldown -= getTimerDecrement();

    if (pet.shootCooldown <= 0) {
      const nearestEnemy = enemies.find(
        (enemy) => enemy.active && 350 > Math.abs(enemy.x - pet.x)
      );

      if (nearestEnemy) {
        const dx = nearestEnemy.x - pet.x;
        const dy = (nearestEnemy.y - 20) - (pet.y - 15);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          // Look up pet data for damage and shoot rate
          const petData = petDataList.find((p) => p.id === pet.type) || petDataList[0];

          bullets.push({
            x: pet.x,
            y: pet.y - 15,
            vx: (dx / distance) * 6,
            vy: (dy / distance) * 6,
            fromPlayer: true,
            damage: petData.damage,
            active: true,
            color: pet.skinColor,
            radius: 3,
            fromPet: true,
          });

          spawnParticles(particles, pet.x + 10 * pet.facing, pet.y - 15, 2, pet.skinColor);
          screenShakeFn?.();
          playPetShootFn?.();
        }

        // Reset cooldown based on pet type
        pet.shootCooldown =
          petDataList.find((p) => p.id === pet.type)?.shootRate || 45;
      }
    }

    // ====================================================================
    // ANIMATION
    // ====================================================================
    pet.animFrame++;

    // ====================================================================
    // INVINCIBILITY
    // ====================================================================
    if (pet.invincible > 0) pet.invincible--;

    // ====================================================================
    // ENEMY CONTACT DAMAGE: Pet takes damage from nearby enemies
    // ====================================================================
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      if (pet.invincible > 0) continue;

      const enemyHeight = getEnemyHeight(enemy.type);
      if (
        checkAABBCollision(
          pet.x - 8, pet.y - 20, 16, 20,
          enemy.x, enemy.y - enemyHeight, enemy.width, enemyHeight
        )
      ) {
        pet.health -= 8;
        pet.invincible = 40;
        spawnParticles(particles, pet.x, pet.y - 10, 5, pet.skinColor);
        screenShakeFn?.();
        playDamageFn?.();
      }
    }

    // ====================================================================
    // DEATH & RESPAWN
    // ====================================================================
    if (pet.health <= 0) {
      pet.active = false;
      pet.respawnTimer = 600;  // 10 seconds at 60fps
      spawnParticles(particles, pet.x, pet.y - 15, 15, pet.skinColor);
      screenShakeFn?.();
      playPetDeathFn?.();
    }
  }
  // ========================================================================
  // DEAD PET: Count down respawn timer
  // ========================================================================
  else {
    pet.respawnTimer--;
    if (pet.respawnTimer <= 0) {
      // Respawn near player
      pet.active = true;
      pet.health = pet.maxHealth;
      pet.x = player.x + 30;
      pet.y = player.y - 20;
      pet.invincible = 60;
      screenShakeFn?.();
      playPetRespawnFn?.();
    }
  }
}
