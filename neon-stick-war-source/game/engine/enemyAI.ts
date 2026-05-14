/**
 * ============================================================================
 * NEON STICK WAR - Enemy AI System
 * ============================================================================
 * 
 * Extracted from lines 7500-8347 of the beautified bundle.
 * Original: switch statement inside the e8() game loop function.
 * 
 * Each enemy type has distinct movement and attack patterns:
 * 
 * GROUND ENEMIES: Walk toward player, reverse at edges/platforms
 * FLYING ENEMIES: Float toward player with varying vertical behavior
 * BOSSES: Multi-phase attack patterns (move → shoot → slam → repeat)
 * 
 * Common patterns:
 * - Ground enemies use eK() (canWalkDirection) for edge detection
 * - Flying enemies use reduced gravity (0.075-0.15 instead of 0.5)
 * - All enemies shoot when within range and cooldown expires
 * - Bosses have enrage mechanics when health drops below a threshold
 * ============================================================================
 */

import type {
  EnemyEntity,
  PlayerEntity,
  BulletEntity,
  ParticleEntity,
  PlatformEntity,
  EnemyType,
} from "../types";
import {
  IS_MOBILE,
  getTimerDecrement,
  spawnParticles,
  getMovingPlatformPosition,
  getEnemyHeight,
  canWalkDirection,
  isBossType,
} from "./physics";

// ============================================================================
// Helper: Create an enemy bullet
// ============================================================================

/**
 * Create and push an enemy bullet into the bullets array.
 * @param bullets - Bullet array to push into
 * @param x - Bullet spawn X
 * @param y - Bullet spawn Y
 * @param vx - Bullet velocity X
 * @param vy - Bullet velocity Y
 * @param damage - Bullet damage
 * @param color - Bullet color
 * @param radius - Bullet radius
 */
function fireEnemyBullet(
  bullets: BulletEntity[],
  x: number,
  y: number,
  vx: number,
  vy: number,
  damage: number,
  color: string,
  radius: number = 3
): void {
  bullets.push({
    x,
    y,
    vx,
    vy,
    fromPlayer: false,
    damage,
    active: true,
    color,
    radius,
  });
}

// ============================================================================
// Helper: Aim toward player
// ============================================================================

/**
 * Calculate direction vector from enemy to player and fire a bullet.
 * @param enemy - The enemy shooting
 * @param player - The target player
 * @param bullets - Bullet array
 * @param speed - Bullet speed
 * @param damage - Bullet damage
 * @param color - Bullet color
 * @param offsetY - Vertical offset from enemy's base position (default -25)
 */
function fireAimedBullet(
  enemy: EnemyEntity,
  player: PlayerEntity,
  bullets: BulletEntity[],
  speed: number,
  damage: number,
  color: string,
  offsetY: number = -25
): void {
  const dx = player.x - enemy.x;
  const dy = (player.y - 25) - (enemy.y + offsetY);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    fireEnemyBullet(
      bullets,
      enemy.x + enemy.width / 2,
      enemy.y + offsetY,
      (dx / distance) * speed,
      (dy / distance) * speed,
      damage,
      color
    );
  }
}

// ============================================================================
// Helper: Fire spread pattern
// ============================================================================

/**
 * Fire a spread of bullets using cosine/sine for angular offset.
 * This creates a fan pattern of bullets toward the player.
 * 
 * @param enemy - The enemy shooting
 * @param player - The target player
 * @param bullets - Bullet array
 * @param speed - Base bullet speed
 * @param damage - Bullet damage
 * @param color - Bullet color
 * @param angleStep - Angular spacing between bullets (radians)
 * @param angleRange - Total spread range (radians, -range to +range)
 * @param offsetY - Vertical offset from enemy base
 */
function fireBulletSpread(
  enemy: EnemyEntity,
  player: PlayerEntity,
  bullets: BulletEntity[],
  speed: number,
  damage: number,
  color: string,
  angleStep: number,
  angleRange: number,
  offsetY: number = -25
): void {
  const dx = player.x - enemy.x;
  const dy = (player.y - 25) - (enemy.y + offsetY);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    for (let angle = -angleRange; angle <= angleRange + 0.01; angle += angleStep) {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      fireEnemyBullet(
        bullets,
        enemy.x + enemy.width / 2,
        enemy.y + offsetY,
        (dx / distance * cosA - dy / distance * sinA) * speed,
        (dx / distance * sinA + dy / distance * cosA) * speed,
        damage,
        color,
        4
      );
    }
  }
}

// ============================================================================
// Color Constants
// ============================================================================

const CYAN = "#00ffff";
const MAGENTA = "#ff00ff";
const GREEN = "#00ff66";
const ORANGE = "#ff6600";
const YELLOW = "#ffff00";
const PURPLE = "#aa00ff";
const RED = "#ff3333";

// ============================================================================
// Main Enemy AI Update
// ============================================================================

/**
 * Update an enemy's AI behavior for one frame.
 * 
 * This massive function handles every enemy type's unique behavior.
 * Each case in the switch statement implements that enemy type's:
 * - Movement pattern (how they approach/follow the player)
 * - Attack pattern (when and how they shoot)
 * - Special behaviors (enrage, slam, suicide, etc.)
 * 
 * @param enemy - The enemy entity to update (mutated in place)
 * @param player - The primary player entity
 * @param platforms - Array of platforms for collision
 * @param bullets - Bullet array (new enemy bullets pushed here)
 * @param particles - Particle array (visual effects)
 * @param level - Level configuration
 * @param frameCount - Global frame counter
 * @param screenShakeFn - Callback to trigger screen shake
 * @param currentLevel - Current level number (for difficulty scaling)
 * @param bossDefeatCount - Number of bosses defeated so far (for enrage thresholds)
 */
export function updateEnemyAI(
  enemy: EnemyEntity,
  player: PlayerEntity,
  platforms: PlatformEntity[],
  bullets: BulletEntity[],
  particles: ParticleEntity[],
  level: { width: number; height: number },
  frameCount: number,
  screenShakeFn?: () => void,
  currentLevel: number = 1,
  bossDefeatCount: number = 0
): void {
  const timerDecrement = getTimerDecrement();
  const distanceToPlayer = Math.abs(enemy.x - player.x);

  // Decrement invincibility and hit flash timers
  if (enemy.invincible > 0) enemy.invincible--;
  if (enemy.isHit) {
    enemy.hitTimer--;
    if (enemy.hitTimer <= 0) enemy.isHit = false;
  }

  switch (enemy.type) {
    // ======================================================================
    // DRONE - Basic ground enemy, walks toward player, simple behavior
    // ======================================================================
    case "drone": {
      /**
       * Movement: Approaches player within 500px, otherwise patrols in facing direction.
       * Attack: None (melee only - contact damage handled in bulletSystem)
       * Edge detection: Reverses direction at platform edges.
       */
      if (distanceToPlayer < 500) {
        enemy.vx = enemy.x > player.x ? -1.5 : 1.5;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = +enemy.facing;  // Patrol in current direction
      }

      // Edge detection: reverse if about to walk off platform
      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      // Gravity and platform collision
      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      // Boundary reversal
      if (enemy.x < 10 || enemy.x > level.width - 30) {
        enemy.facing = -1 * enemy.facing;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // GLITCH WALKER - Ground enemy that shoots aimed bullets
    // ======================================================================
    case "glitchWalker": {
      /**
       * Movement: Approaches player within 600px with variable speed (2.5 ± 0.5 sinusoidal).
       * Attack: Fires aimed bullets at the player when within 500px.
       * Shoot cooldown: 49 frames.
       * Bullet: Speed 5.5, damage 10, purple color, radius 3.
       */
      if (distanceToPlayer < 600) {
        const speed = 2.5 + 0.5 * Math.sin(0.1 * enemy.animFrame);
        enemy.vx = enemy.x > player.x ? -speed : speed;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 1.5 * enemy.facing;
      }

      // Edge detection
      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      // Gravity and platform collision
      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      // Boundary reversal
      if (enemy.x < 10 || enemy.x > level.width - 30) {
        enemy.facing = -1 * enemy.facing;
      }

      // Shooting: Aimed bullet toward player
      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 500) {
        fireAimedBullet(enemy, player, bullets, 5.5, 10, PURPLE);
        enemy.shootCooldown = 49;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // VOID GUARDIAN - Stationary turret that fires 3-bullet spread
    // ======================================================================
    case "voidGuardian": {
      /**
       * Movement: None (stationary turret).
       * Attack: Fires a 3-bullet spread (±0.2 rad) when within 500px.
       * Shoot cooldown: 80 frames.
       * Bullet: Speed 4.5, damage 10, orange color, radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 500) {
        const dx = player.x - enemy.x;
        const dy = (player.y - 25) - (enemy.y - 15);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          for (let angle = -0.2; angle <= 0.21; angle += 0.2) {
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2,
              enemy.y - 15,
              (dx / distance * cosA - dy / distance * sinA) * 4.5,
              (dx / distance * sinA + dy / distance * cosA) * 4.5,
              10,
              ORANGE,
              3
            );
          }
        }
        enemy.shootCooldown = 80;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // BOSS TYPES - Multi-phase attack pattern with enrage mechanic
    // boss, bossRedKing, bossTitan, bossDragon, bossPhoenix, bossMechGolem
    // ======================================================================
    case "boss":
    case "bossRedKing":
    case "bossTitan":
    case "bossDragon":
    case "bossPhoenix":
    case "bossMechGolem": {
      /**
       * PHASE PATTERN (360-frame cycle):
       * - Frames 0-119: CHASE - Walk toward player at speed 2.5 * enrageMultiplier
       * - Frames 120-239: SHOOT - Spread fire (±0.3 rad, step 0.15) at player
       *   Bullet speed 5.5, damage 10, color varies by boss type
       *   Cooldown scales with enrage: 25/enrageMultiplier frames
       * - Frames 240-359: SLAM - Jump at frame 240 (vy = -14), land and deal
       *   15 damage + screen shake at frame 300 if player is within 130px
       * 
       * ENRAGE: Triggers when health < (0.5 + (bossDefeatCount-1)*0.15) * maxHealth
       * Increases speed multiplier to 1.5x, reduces shoot cooldown.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.patternTimer++;

      // Enrage check
      const enrageThreshold = Math.min(0.5 + (bossDefeatCount - 1) * 0.15, 0.75);
      if (enemy.health < enemy.maxHealth * enrageThreshold && !enemy.enraged) {
        enemy.enraged = true;
        // Screen shake, particles, sound handled externally
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 40, 30, RED);
        screenShakeFn?.();
      }

      const enrageMultiplier = enemy.enraged ? 1.5 : 1;

      // Gravity and platform collision
      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      // Phase logic
      const patternPhase = enemy.patternTimer % 360;
      let chaseDirection = 0;

      if (patternPhase < 120) {
        // PHASE 1: Chase player
        chaseDirection = player.x > enemy.x ? 1 : -1;
        enemy.vx = 2.5 * chaseDirection * enrageMultiplier;
      } else {
        enemy.vx = 0;
      }

      // Edge detection during chase
      if (enemy.grounded && chaseDirection !== 0 && !canWalkDirection(enemy.x, enemy.y, chaseDirection, platforms, level, enemy.width)) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.x += enemy.vx;

      // PHASE 2: Shooting
      if (patternPhase >= 120 && patternPhase < 240) {
        enemy.shootCooldown -= timerDecrement;
        if (enemy.shootCooldown <= 0) {
          // Bullet color varies by boss type
          const bulletColor =
            enemy.type === "bossDragon" ? ORANGE :
            enemy.type === "bossPhoenix" ? YELLOW :
            enemy.type === "bossMechGolem" ? GREEN :
            MAGENTA;

          fireBulletSpread(enemy, player, bullets, 5.5, 10, bulletColor, 0.15, 0.3, -40);
          enemy.shootCooldown = Math.round(25 / enrageMultiplier);
        }
      }
      // PHASE 3: Ground slam
      else if (patternPhase >= 240) {
        // Jump at the start of slam phase
        if (patternPhase === 240 && enemy.grounded) {
          enemy.vy = -14;
        }

        // Slam damage on frame 300
        if (patternPhase === 300 && enemy.grounded && distanceToPlayer < 130) {
          if (player.invincible <= 0 && !player.isShielding) {
            player.health -= 15;
            player.invincible = 40;
            player.expression = "hurt";
            spawnParticles(particles, player.x + player.width / 2, player.y - 25, 10, RED);
            screenShakeFn?.();
          }

          // Ground impact particles
          for (let i = 0; i < 20; i++) {
            particles.push({
              x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 150,
              y: enemy.y,
              vx: (Math.random() - 0.5) * 4,
              vy: -(5 * Math.random()),
              life: 30,
              maxLife: 30,
              color: ORANGE,
              size: 3,
            });
          }
        }
      }

      enemy.y += enemy.vy;
      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // DRAGON - Flying enemy that breathes fire
    // ======================================================================
    case "dragon": {
      /**
       * Movement: Flies toward player with reduced gravity (0.15).
       * Vertical: Tracks player Y ±40-60px above.
       * Idle: Slow sinusoidal hovering.
       * Attack: 3-bullet horizontal spread (±0.15 rad) every 50 frames when within 400px.
       * Bullet: Speed 5.5 facing, damage 10, orange color, radius 4.
       */
      enemy.vy += 0.15;  // Reduced gravity for flying
      if (enemy.vy > 3) enemy.vy = 3;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
        // Track player vertical position
        if (enemy.y - 25 > player.y - 40) enemy.vy -= 0.5;
        if (enemy.y - 25 < player.y - 60) enemy.vy += 0.3;
      } else {
        enemy.vx = +enemy.facing;
        enemy.vy += 0.3 * Math.sin(0.05 * enemy.animFrame);
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;

      // Fire breath
      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 400) {
        for (let angle = -0.15; angle <= 0.16; angle += 0.15) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 20,
            5.5 * enemy.facing * Math.cos(angle),
            2 * Math.sin(angle) - 1,
            10,
            ORANGE,
            4
          );
        }
        enemy.shootCooldown = 50;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // PHOENIX - Fast flying enemy with straight-line fire shots
    // ======================================================================
    case "phoenix": {
      /**
       * Movement: Flies toward player faster than dragon (2.5 speed).
       * Vertical: Tracks player Y ±30-70px above.
       * Attack: Single fast bullet (6.5 speed) every 35 frames when within 450px.
       * Bullet: Damage 8, yellow color, radius 3.
       */
      enemy.vy += 0.125;
      if (enemy.vy > 3) enemy.vy = 3;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2.5;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
        if (enemy.y - 25 > player.y - 30) enemy.vy -= 0.6;
        if (enemy.y - 25 < player.y - 70) enemy.vy += 0.4;
      } else {
        enemy.vx = 1.5 * enemy.facing;
        enemy.vy += 0.4 * Math.sin(0.06 * enemy.animFrame);
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        fireEnemyBullet(
          bullets,
          enemy.x + enemy.width / 2,
          enemy.y - 15,
          6.5 * enemy.facing,
          1,
          8,
          YELLOW,
          3
        );
        enemy.shootCooldown = 35;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // MECH GOLEM - Heavy ground unit with double-shot
    // ======================================================================
    case "mechGolem": {
      /**
       * Movement: Slow approach (1.2 speed), slow patrol (0.8 speed).
       * Attack: 2-bullet vertical spread (±0.1 rad) every 60 frames when within 450px.
       * Bullet: Speed 5.5, damage 12, green color, radius 4.
       */
      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 1.2;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 0.8 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        for (let angle = -0.1; angle <= 0.11; angle += 0.2) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 30,
            5.5 * enemy.facing * Math.cos(angle),
            -2 * Math.sin(angle),
            12,
            GREEN,
            4
          );
        }
        enemy.shootCooldown = 60;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // SHADOW ASSASSIN - Fast ground enemy with quick shots
    // ======================================================================
    case "shadowAssassin": {
      /**
       * Movement: Fast approach (3.5 + sinusoidal speed), patrol at 2.0.
       * Attack: Single fast bullet (8.5 speed) every 25 frames when within 200px.
       * Bullet: Damage 14, purple color, radius 3.
       */
      if (distanceToPlayer < 500) {
        const speed = 3.5 + +Math.sin(0.15 * enemy.animFrame);
        enemy.vx = (player.x > enemy.x ? 1 : -1) * speed;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 2 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 200) {
        fireEnemyBullet(
          bullets,
          enemy.x + enemy.width / 2,
          enemy.y - 25,
          8.5 * enemy.facing,
          0,
          14,
          PURPLE,
          3
        );
        enemy.shootCooldown = 25;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // ELITE DRONE - Improved ground enemy with aimed shots
    // ======================================================================
    case "eliteDrone": {
      /**
       * Movement: Faster approach (2 speed) within 600px, patrol at 1.2.
       * Attack: Aimed bullet (6 speed) every 35 frames when within 500px.
       * Bullet: Damage 12, red color, radius 3.
       */
      if (distanceToPlayer < 600) {
        enemy.vx = enemy.x > player.x ? -2 : 2;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 1.2 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 500) {
        fireAimedBullet(enemy, player, bullets, 6, 12, RED);
        enemy.shootCooldown = 35;
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) {
        enemy.facing = -1 * enemy.facing;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // HEAVY WALKER - Slow tank with spread fire
    // ======================================================================
    case "heavyWalker": {
      /**
       * Movement: Very slow approach (1.0 speed), patrol at 0.6.
       * Attack: 3-bullet spread (±0.15 rad) every 70 frames when within 450px.
       * Bullet: Speed 4.5, damage 14, orange color, radius 4.
       */
      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 1;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 0.6 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        for (let angle = -0.15; angle <= 0.16; angle += 0.15) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 30,
            4.5 * enemy.facing * Math.cos(angle),
            -1.5 * Math.sin(angle),
            14,
            ORANGE,
            4
          );
        }
        enemy.shootCooldown = 70;
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) {
        enemy.facing = -1 * enemy.facing;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // BOSS CORRUPTED - Multi-phase boss with spread + jump
    // ======================================================================
    case "bossCorrupted": {
      /**
       * PHASE PATTERN (300-frame cycle):
       * - Frames 0-99: Chase (2 speed * enrageMultiplier)
       * - Frames 100-199: Wide spread fire (±0.4 rad, step 0.2)
       *   Bullet speed 5, damage 10, purple color
       * - Frames 200-299: Jump (vy = -13 at frame 200)
       * 
       * Enrage multiplier: 1.5x when health < threshold.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.patternTimer++;

      const enrageThreshold = Math.min(0.5 + (bossDefeatCount - 1) * 0.15, 0.75);
      if (enemy.health < enemy.maxHealth * enrageThreshold && !enemy.enraged) {
        enemy.enraged = true;
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 40, 30, PURPLE);
        screenShakeFn?.();
      }

      const enrageMultiplier = enemy.enraged ? 1.5 : 1;

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      const phase = enemy.patternTimer % 300;
      let chaseDir = 0;

      if (phase < 100) {
        chaseDir = player.x > enemy.x ? 1 : -1;
        enemy.vx = 2 * chaseDir * enrageMultiplier;
      } else {
        enemy.vx = 0;
      }

      if (enemy.grounded && chaseDir !== 0 && !canWalkDirection(enemy.x, enemy.y, chaseDir, platforms, level, enemy.width)) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.x += enemy.vx;

      if (phase >= 100 && phase < 200) {
        enemy.shootCooldown -= timerDecrement;
        if (enemy.shootCooldown <= 0) {
          for (let angle = -0.4; angle <= 0.41; angle += 0.2) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2,
              enemy.y - 40,
              5 * enemy.facing * Math.cos(angle),
              3 * Math.sin(angle),
              10,
              PURPLE,
              4
            );
          }
          enemy.shootCooldown = Math.round(25 / enrageMultiplier);
        }
      } else if (phase >= 200) {
        if (phase === 200 && enemy.grounded) {
          enemy.vy = -13;
        }
      }

      enemy.y += enemy.vy;
      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // BOSS FATHER - 4-phase boss: chase → dash → shoot → slam + radial
    // ======================================================================
    case "bossFather": {
      /**
       * PHASE PATTERN (360-frame cycle):
       * - Frames 0-79: Chase at 2.5 * enrageMultiplier
       * - Frames 80-119: DASH at 8 * enrageMultiplier (with trail particles)
       * - Frames 120-219: Wide spread fire (±0.6 rad, step 0.15)
       *   Bullet speed 6*enrage, damage 8, cyan color
       *   Cooldown: 50/enrageMultiplier frames
       * - Frames 220-359: Jump (vy=-14 at 220), radial burst at 240+
       *   7 radial bullets (spread -3 to +3), damage 12, cyan
       * 
       * Enrage multiplier: 1.6x
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.patternTimer++;

      const enrageThreshold = Math.min(0.4 + (bossDefeatCount - 1) * 0.15, 0.7);
      if (enemy.health < enemy.maxHealth * enrageThreshold && !enemy.enraged) {
        enemy.enraged = true;
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 40, 30, CYAN);
        screenShakeFn?.();
      }

      const enrageMultiplier = enemy.enraged ? 1.6 : 1;

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      const phase = enemy.patternTimer % 360;
      let chaseDir = 0;

      if (phase < 80) {
        chaseDir = player.x > enemy.x ? 1 : -1;
        enemy.vx = 2.5 * chaseDir * enrageMultiplier;
      } else if (phase >= 80 && phase < 120) {
        // DASH phase with particles
        if (phase === 80) spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 25, 10, CYAN);
        chaseDir = player.x > enemy.x ? 1 : -1;
        enemy.vx = 8 * chaseDir * enrageMultiplier;
        if (frameCount % 3 === 0) spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 25, 2, CYAN);
      } else if (phase >= 120 && phase < 220) {
        // SHOOT phase
        enemy.vx = 0;
        enemy.shootCooldown -= timerDecrement;
        if (enemy.shootCooldown <= 0) {
          for (let angle = -0.6; angle <= 0.61; angle += 0.15) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2,
              enemy.y - 30,
              6 * enemy.facing * Math.cos(angle) * enrageMultiplier,
              4 * Math.sin(angle),
              8,
              CYAN,
              4
            );
          }
          enemy.shootCooldown = Math.round(50 / enrageMultiplier);
        }
      } else {
        // SLAM + RADIAL phase
        if (phase === 220 && enemy.grounded) {
          enemy.vy = -14;
          spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y, 15, CYAN);
        }
        if (phase > 240 && enemy.grounded) {
          // Radial burst
          for (let i = -3; i <= 3; i++) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2 + 20 * i,
              enemy.y - 5,
              2.5 * i,
              -2,
              12,
              CYAN,
              5
            );
          }
          spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y, 20, CYAN);
        }
        enemy.vx = player.x > enemy.x ? 1.5 : -1.5;
      }

      if (enemy.grounded && chaseDir !== 0 && !canWalkDirection(enemy.x, enemy.y, chaseDir, platforms, level, enemy.width)) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;

      // Boundary clamping
      if (enemy.x < 10) enemy.x = 10;
      if (enemy.x + enemy.width > level.width) enemy.x = level.width - enemy.width;

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // BOSS TWIN - 4-phase boss: charge → rapid fire → charge up → air raid
    // ======================================================================
    case "bossTwin": {
      /**
       * PHASE PATTERN (400-frame cycle):
       * - Frames 0-59: CHARGE at 10 * enrageMultiplier (with trail particles)
       * - Frames 60-179: Rapid spread fire (±0.5 rad, step 0.12)
       *   Bullet speed 7*enrage, damage 7, blue color
       *   Cooldown: floor(62.5/enrage)
       * - Frames 180-259: Charge up (particles only)
       * - Frames 260-399: Jump (vy=-15 at 260), air bullets every 12 frames
       *   Radial ground burst at frame 300+
       *   9 radial bullets (spread -4 to +4), damage 10, blue
       * 
       * Enrage multiplier: 1.8x
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.patternTimer++;

      const enrageThreshold = Math.min(0.4 + (bossDefeatCount - 1) * 0.15, 0.7);
      if (enemy.health < enemy.maxHealth * enrageThreshold && !enemy.enraged) {
        enemy.enraged = true;
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 40, 30, "#4488ff");
        screenShakeFn?.();
      }

      const enrageMultiplier = enemy.enraged ? 1.8 : 1;

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      const phase = enemy.patternTimer % 400;
      let chaseDir = 0;

      if (phase < 60) {
        // CHARGE
        chaseDir = player.x > enemy.x ? 1 : -1;
        enemy.vx = 10 * chaseDir * enrageMultiplier;
        if (frameCount % 2 === 0) spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 25, 2, "#4488ff");
      } else if (phase >= 60 && phase < 180) {
        // RAPID FIRE
        enemy.vx = 0;
        enemy.shootCooldown -= timerDecrement;
        if (enemy.shootCooldown <= 0) {
          for (let angle = -0.5; angle <= 0.51; angle += 0.12) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2,
              enemy.y - 30,
              7 * enemy.facing * Math.cos(angle) * enrageMultiplier,
              3 * Math.sin(angle),
              7,
              "#4488ff",
              4
            );
          }
          enemy.shootCooldown = Math.floor(62.5 / enrageMultiplier);
        }
      } else if (phase >= 180 && phase < 260) {
        // CHARGE UP (visual only)
        enemy.vx = 0;
        if (phase === 180) spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 25, 15, "#4488ff");
        if (frameCount % 4 === 0) spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 25, 1, "#88bbff");
      } else {
        // AIR RAID
        if (phase === 260 && enemy.grounded) {
          enemy.vy = -15;
          spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y, 15, "#4488ff");
        }
        enemy.vx = player.x > enemy.x ? 2 : -2;

        // Air bullets
        if (!enemy.grounded && frameCount % 12 === 0) {
          for (let angle = -0.3; angle <= 0.31; angle += 0.15) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2,
              enemy.y - 30,
              6 * enemy.facing * Math.cos(angle),
              4 * Math.sin(angle),
              6,
              "#88bbff",
              3
            );
          }
        }

        // Ground radial burst
        if (phase > 300 && enemy.grounded) {
          for (let i = -4; i <= 4; i++) {
            fireEnemyBullet(
              bullets,
              enemy.x + enemy.width / 2 + 15 * i,
              enemy.y - 5,
              2 * i,
              -3,
              10,
              "#4488ff",
              4
            );
          }
          spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y, 25, "#4488ff");
        }
      }

      if (enemy.grounded && chaseDir !== 0 && !canWalkDirection(enemy.x, enemy.y, chaseDir, platforms, level, enemy.width)) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;

      if (enemy.x < 10) enemy.x = 10;
      if (enemy.x + enemy.width > level.width) enemy.x = level.width - enemy.width;

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // FLYING ENEMIES - Common pattern with unique parameters
    // ======================================================================

    case "voidBat": {
      /**
       * Movement: Fast approach (3 speed), tracks player Y-60.
       * Idle: Slow patrol with sinusoidal bobbing.
       * Attack: Single forward bullet every 40 frames within 400px.
       * Bullet: Speed 5, damage 5, magenta color, radius 2.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 3;
        const targetY = player.y - 60;
        enemy.vy += (targetY - enemy.y) * 0.02;
      } else {
        enemy.vx = 2 * enemy.facing;
        enemy.vy = 1.5 * Math.sin(0.08 * enemy.animFrame);
      }

      enemy.vy += 0.3 * Math.sin(0.12 * enemy.animFrame);
      if (enemy.vy > 4) enemy.vy = 4;
      if (enemy.vy < -4) enemy.vy = -4;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 40) enemy.y = 40;
      if (enemy.y > level.height - 50) enemy.y = level.height - 50;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 400) {
        fireEnemyBullet(bullets, enemy.x + enemy.width / 2, enemy.y - 10, 5 * enemy.facing, 0.5, 5, MAGENTA, 2);
        enemy.shootCooldown = 40;
      }

      enemy.animFrame++;
      break;
    }

    case "stormEagle": {
      /**
       * Movement: Approach at 2 speed, tracks player Y-80.
       * Attack: Aimed bullet (8 speed) every 60 frames within 450px.
       * Bullet: Damage 10, yellow color, radius 4.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2;
        const targetY = player.y - 80;
        enemy.vy += (targetY - enemy.y) * 0.015;
      } else {
        enemy.vx = 1.5 * enemy.facing;
        enemy.vy = 1.2 * Math.sin(0.06 * enemy.animFrame);
      }

      enemy.vy += 0.2 * Math.sin(0.1 * enemy.animFrame);
      if (enemy.vy > 3) enemy.vy = 3;
      if (enemy.vy < -3) enemy.vy = -3;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 50) enemy.y = 50;
      if (enemy.y > level.height - 60) enemy.y = level.height - 60;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        fireAimedBullet(enemy, player, bullets, 8, 10, YELLOW, -20);
        enemy.shootCooldown = 60;
      }

      enemy.animFrame++;
      break;
    }

    case "emberWisp": {
      /**
       * Movement: Approach at 2.5 speed, oscillating Y target (player Y-50 + 30*sin).
       * Attack: Single forward bullet every 35 frames within 400px.
       * Bullet: Speed 5, damage 7, orange color, radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2.5;
        const targetY = player.y - 50 + 30 * Math.sin(0.1 * enemy.animFrame);
        enemy.vy += (targetY - enemy.y) * 0.02;
      } else {
        enemy.vx = 1.5 * enemy.facing;
        enemy.vy = 1.5 * Math.sin(0.1 * enemy.animFrame);
      }

      enemy.vy += 0.4 * Math.sin(0.15 * enemy.animFrame);
      if (enemy.vy > 4) enemy.vy = 4;
      if (enemy.vy < -4) enemy.vy = -4;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 30) enemy.y = 30;
      if (enemy.y > level.height - 50) enemy.y = level.height - 50;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 400) {
        fireEnemyBullet(bullets, enemy.x + enemy.width / 2, enemy.y - 8, 5 * enemy.facing, 1, 7, ORANGE, 3);
        enemy.shootCooldown = 35;
      }

      enemy.animFrame++;
      break;
    }

    case "frostWraith": {
      /**
       * Movement: Slow approach at 1.8, tracks player Y-70.
       * Attack: 3-bullet spread (±0.2 rad) every 65 frames within 450px.
       * Bullet: Speed 4, damage 8, light blue (#88eeff), radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 1.8;
        const targetY = player.y - 70;
        enemy.vy += (targetY - enemy.y) * 0.012;
      } else {
        enemy.vx = +enemy.facing;
        enemy.vy = +Math.sin(0.07 * enemy.animFrame);
      }

      enemy.vy += 0.3 * Math.sin(0.09 * enemy.animFrame);
      if (enemy.vy > 3) enemy.vy = 3;
      if (enemy.vy < -3) enemy.vy = -3;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 40) enemy.y = 40;
      if (enemy.y > level.height - 60) enemy.y = level.height - 60;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        for (let angle = -0.2; angle <= 0.21; angle += 0.2) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 20,
            4 * enemy.facing * Math.cos(angle),
            2 * Math.sin(angle),
            8,
            "#88eeff",
            3
          );
        }
        enemy.shootCooldown = 65;
      }

      enemy.animFrame++;
      break;
    }

    case "shadowDrake": {
      /**
       * Movement: Approach at 2.5 speed, tracks player Y-80.
       * Attack: 3-bullet spread (±0.15 rad) every 50 frames within 400px.
       * Bullet: Speed 5, damage 9, purple color, radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.vy += 0.1;
      if (enemy.vy > 3) enemy.vy = 3;

      if (distanceToPlayer < 600) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2.5;
        const targetY = player.y - 80;
        enemy.vy += (targetY - enemy.y) * 0.015;
      } else {
        enemy.vx = 1.5 * enemy.facing;
        enemy.vy += 0.4 * Math.sin(0.07 * enemy.animFrame);
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 30) enemy.y = 30;
      if (enemy.y > level.height - 60) enemy.y = level.height - 60;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 400) {
        for (let angle = -0.15; angle <= 0.16; angle += 0.15) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 20,
            5 * enemy.facing * Math.cos(angle),
            1.5 * Math.sin(angle),
            9,
            PURPLE,
            3
          );
        }
        enemy.shootCooldown = 50;
      }

      enemy.animFrame++;
      break;
    }

    case "plasmaSerpent": {
      /**
       * Movement: Approach at 2.2 speed, tracks player Y-65.
       * Attack: Aimed bullet (6 speed) every 55 frames within 450px.
       * Bullet: Damage 10, magenta color, radius 4.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2.2;
        const targetY = player.y - 65;
        enemy.vy += (targetY - enemy.y) * 0.018;
      } else {
        enemy.vx = 1.5 * enemy.facing;
        enemy.vy = 1.5 * Math.sin(0.08 * enemy.animFrame);
      }

      enemy.vy += 0.5 * Math.sin(0.12 * enemy.animFrame);
      if (enemy.vy > 4) enemy.vy = 4;
      if (enemy.vy < -4) enemy.vy = -4;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 30) enemy.y = 30;
      if (enemy.y > level.height - 60) enemy.y = level.height - 60;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 450) {
        fireAimedBullet(enemy, player, bullets, 6, 10, MAGENTA, -15);
        enemy.shootCooldown = 55;
      }

      enemy.animFrame++;
      break;
    }

    case "neonWyrm": {
      /**
       * Movement: Approach at 2 speed, tracks player Y-90 (highest flyer).
       * Attack: 5-bullet spread (±0.3 rad, step 0.15) every 70 frames within 500px.
       * Bullet: Speed 5, damage 12, cyan color, radius 4.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;
      enemy.vy += 0.075;
      if (enemy.vy > 3) enemy.vy = 3;

      if (distanceToPlayer < 600) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2;
        const targetY = player.y - 90;
        enemy.vy += (targetY - enemy.y) * 0.01;
      } else {
        enemy.vx = +enemy.facing;
        enemy.vy += 0.5 * Math.sin(0.06 * enemy.animFrame);
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 40) enemy.y = 40;
      if (enemy.y > level.height - 70) enemy.y = level.height - 70;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 500) {
        for (let angle = -0.3; angle <= 0.31; angle += 0.15) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 25,
            5 * enemy.facing * Math.cos(angle),
            2 * Math.sin(angle),
            12,
            CYAN,
            4
          );
        }
        enemy.shootCooldown = 70;
      }

      enemy.animFrame++;
      break;
    }

    case "crystalMoth": {
      /**
       * Movement: Approach at 2 speed, oscillating Y target (player Y-55 + 25*sin).
       * Attack: 3-bullet spread (±0.25 rad) every 50 frames within 400px.
       * Bullet: Speed 4.5, damage 6, green color, radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 2;
        const targetY = player.y - 55 + 25 * Math.sin(0.08 * enemy.animFrame);
        enemy.vy += (targetY - enemy.y) * 0.02;
      } else {
        enemy.vx = +enemy.facing;
        enemy.vy = +Math.sin(0.1 * enemy.animFrame);
      }

      enemy.vy += 0.3 * Math.sin(0.13 * enemy.animFrame);
      if (enemy.vy > 3) enemy.vy = 3;
      if (enemy.vy < -3) enemy.vy = -3;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      if (enemy.y < 30) enemy.y = 30;
      if (enemy.y > level.height - 50) enemy.y = level.height - 50;

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 400) {
        for (let angle = -0.25; angle <= 0.26; angle += 0.25) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 12,
            4.5 * enemy.facing * Math.cos(angle),
            1.5 * Math.sin(angle),
            6,
            GREEN,
            3
          );
        }
        enemy.shootCooldown = 50;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // ZOMBIE - Slow ground enemy with close-range shot
    // ======================================================================
    case "zombie": {
      /**
       * Movement: Slow approach (1.2 speed), patrol at 0.8.
       * Attack: Single slow bullet (3 speed) every 50 frames when within 80px.
       * Bullet: Damage 8, green (#44aa44), radius 4.
       * Note: Only shoots at very close range (80px)!
       */
      if (distanceToPlayer < 600) {
        enemy.vx = player.x > enemy.x ? 1.2 : -1.2;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 0.8 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 80) {
        fireEnemyBullet(
          bullets,
          enemy.x + enemy.width / 2,
          enemy.y - 25,
          3 * enemy.facing,
          0,
          8,
          "#44aa44",
          4
        );
        enemy.shootCooldown = 50;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // BOMBER - Suicide runner that explodes near the player
    // ======================================================================
    case "bomber": {
      /**
       * Movement: Fast approach (2.5 speed), patrol at 1.5.
       * Special: When within 60px, EXPLODES dealing contact damage,
       * spawning particles, and destroying itself.
       * Damage scales with level: 3/8/12 depending on level range.
       */
      if (distanceToPlayer < 500) {
        enemy.vx = player.x > enemy.x ? 2.5 : -2.5;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 1.5 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      // EXPLODE when close to player
      if (distanceToPlayer < 60 && enemy.active) {
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 20, 20, ORANGE);
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y - 20, 15, RED);
        screenShakeFn?.();

        // Deal explosion damage to player
        if (player.invincible <= 0) {
          const explosionDamage = currentLevel <= 3 ? 3 : currentLevel <= 50 ? 8 : 12;
          player.health -= explosionDamage;
          player.invincible = 40;
        }

        // Self-destruct
        enemy.active = false;
        enemy.health = 0;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // NECROMANCER - Stationary caster with rotating bullet pattern
    // ======================================================================
    case "necromancer": {
      /**
       * Movement: Very slow approach (0.5 speed within 400px), patrol at 0.3.
       * Attack: 3 bullets in rotating circular pattern every 55 frames within 500px.
       * Each wave fires 3 bullets at 120° intervals, rotating over time.
       * Bullet: Speed 4 horizontal + 3 vertical, damage 7, purple, radius 3.
       */
      enemy.facing = enemy.x > player.x ? -1 : 1;

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;

      if (distanceToPlayer < 400) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 0.5;
      } else {
        enemy.vx = 0.3 * enemy.facing;
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 500) {
        const baseAngle = 0.5 * enemy.animFrame;
        for (let i = 0; i < 3; i++) {
          const angle = baseAngle + (i / 3) * Math.PI * 2;
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2,
            enemy.y - 25,
            4 * Math.cos(angle),
            3 * Math.sin(angle),
            7,
            PURPLE,
            3
          );
        }
        enemy.shootCooldown = 55;
      }

      enemy.animFrame++;
      break;
    }

    // ======================================================================
    // GIANT - Very slow, very tough, radial ground burst attack
    // ======================================================================
    case "giant": {
      /**
       * Movement: Very slow approach (0.8 speed), patrol at 0.5.
       * Attack: 5-bullet radial burst every 80 frames within 300px.
       * Each burst creates 5 bullets spread from center, + particles + screen shake.
       * Bullet: Speed 2, damage 12, orange color, radius 5.
       */
      if (distanceToPlayer < 500) {
        enemy.vx = (player.x > enemy.x ? 1 : -1) * 0.8;
        enemy.facing = enemy.vx > 0 ? 1 : -1;
      } else {
        enemy.vx = 0.5 * enemy.facing;
      }

      if (
        enemy.grounded &&
        !canWalkDirection(enemy.x, enemy.y, enemy.vx > 0 ? 1 : -1, platforms, level, enemy.width)
      ) {
        enemy.vx = 0;
        enemy.facing = -1 * enemy.facing;
      }

      enemy.vy += 0.5;
      if (enemy.vy > 10) enemy.vy = 10;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
      enemy.grounded = false;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        if (
          enemy.x + enemy.width > px &&
          enemy.x < px + platform.width &&
          enemy.y >= py - 4 &&
          enemy.y - enemy.vy <= py + Math.max(10, Math.abs(enemy.vy) + 8)
        ) {
          enemy.y = py;
          enemy.vy = 0;
          enemy.grounded = true;
        }
      }

      if (enemy.x < 10 || enemy.x > level.width - 30) enemy.facing = -1 * enemy.facing;

      enemy.shootCooldown -= timerDecrement;
      if (enemy.shootCooldown <= 0 && distanceToPlayer < 300) {
        // Radial ground burst
        for (let i = -2; i <= 2; i++) {
          fireEnemyBullet(
            bullets,
            enemy.x + enemy.width / 2 + 15 * i,
            enemy.y - 5,
            2 * i,
            -2,
            12,
            ORANGE,
            5
          );
        }
        spawnParticles(particles, enemy.x + enemy.width / 2, enemy.y, 15, ORANGE);
        screenShakeFn?.();
        enemy.shootCooldown = 80;
      }

      enemy.animFrame++;
      break;
    }

    default:
      // Unknown enemy type - do nothing
      break;
  }

  // ========================================================================
  // POST-UPDATE: Respawn boss if fallen off map, deactivate normal enemies
  // ========================================================================
  if (enemy.y > level.height + 100) {
    if (isBossType(enemy.type)) {
      // Bosses respawn on the nearest platform
      let nearestPlatform = platforms[0];
      let nearestDistance = Infinity;

      for (const platform of platforms) {
        const { px, py } = getMovingPlatformPosition(platform);
        const distance = Math.abs(px + platform.width / 2 - player.x);
        if (distance < nearestDistance && py < 530) {
          nearestDistance = distance;
          nearestPlatform = platform;
        }
      }

      const { px, py } = getMovingPlatformPosition(nearestPlatform);
      enemy.x = px + nearestPlatform.width / 2 - enemy.width / 2;
      enemy.y = py;
      enemy.vy = 0;
      enemy.grounded = false;
      enemy.invincible = 60;
    } else {
      // Normal enemies are deactivated when falling off the map
      enemy.active = false;
    }
  }
}
