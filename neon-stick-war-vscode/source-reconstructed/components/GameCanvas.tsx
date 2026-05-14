// =============================================================================
// NEON STICK WAR — Main Game Canvas Component
// =============================================================================
// Reconstructed from: 0cf1o-rq41zxz.beautified.js (lines ~6536–9812)
//
// This is the ENTIRE GAME ENGINE. It contains:
//   - Player initialization & controls
//   - Enemy AI & spawning
//   - Physics (gravity, collision, platform, movement)
//   - Game loop (update + render at 60fps / 30fps on mobile)
//   - Drawing functions (stickmen, enemies, bullets, particles, bosses)
//   - Wave management & boss fight logic
//   - Score/coins tracking
//   - Skills, pets, allies, versus mode
//   - Background rendering (weather, zones, lightning)
// =============================================================================

import React, { useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import type {
  PlayerEntity,
  EnemyEntity,
  Bullet,
  Particle,
  Platform,
  SkillState,
  LevelData,
  SaveData,
  CoinCollectible,
  EventTrigger,
} from '../game/types';
import { FLYING_ENEMY_TYPES } from '../game/types';
import { COLORS } from '../game/config/colors';

// ---------------------------------------------------------------------------
// Color constant aliases (matching original minified: n, i, s, c, d, h, f, u, m, x, p, g)
// ---------------------------------------------------------------------------
const CYAN = COLORS.cyan;       // n
const MAGENTA = COLORS.magenta; // i
const GREEN = COLORS.green;     // s
const ORANGE = COLORS.orange;   // c
const YELLOW = COLORS.yellow;   // d
const PURPLE = COLORS.purple;   // h
const RED = COLORS.red;         // f
const BG_DARK = COLORS.bgDark;  // u
const GOLD = COLORS.gold;       // m
const PINK = COLORS.pink;       // x
const BLUE = COLORS.blue;       // p
const WHITE = COLORS.white;     // g

// ---------------------------------------------------------------------------
// Helper: is the given enemy type a flying type?
// (Original: function E(e) { return I.includes(e) })
// ---------------------------------------------------------------------------
function isFlyingType(type: string): boolean {
  return FLYING_ENEMY_TYPES.includes(type);
}

// ---------------------------------------------------------------------------
// Helper: is the given enemy type a boss?
// (Original: inline checks throughout the code)
// ---------------------------------------------------------------------------
function isBossType(type: string): boolean {
  return [
    'boss', 'bossRedKing', 'bossTitan', 'bossDragon',
    'bossPhoenix', 'bossMechGolem', 'bossCorrupted',
    'bossFather', 'bossTwin'
  ].includes(type);
}

// ---------------------------------------------------------------------------
// Mobile detection
// (Original: function eB())
// ---------------------------------------------------------------------------
function isMobileDevice(): boolean {
  return !!(
    (window as any).Capacitor?.isNativePlatform?.() ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

// ---------------------------------------------------------------------------
// Platform constants (original: eG, e$, eF, eH)
// ---------------------------------------------------------------------------
const IS_MOBILE = isMobileDevice();
const MOBILE_TIME_SCALE = IS_MOBILE ? 0.4 : 1;   // e$
const MAX_PARTICLES = IS_MOBILE ? 20 : 100;       // eF
const FRAME_TIME = 1000 / (IS_MOBILE ? 30 : 60);  // eH

// ---------------------------------------------------------------------------
// Background lightning particles (original: eL)
// ---------------------------------------------------------------------------
let lightningParticles: Array<{
  segments: Array<{ x: number; y: number }>;
  life: number;
  flashLife: number;
}> = [];

// ---------------------------------------------------------------------------
// Background particles (original: eL for menu/Q.current for game)
// ---------------------------------------------------------------------------
let backgroundParticles: Particle[] = [];

// ---------------------------------------------------------------------------
// Box collision detection
// (Original: function eO(e, t, o, a, l, r, n, i))
// ---------------------------------------------------------------------------
function boxCollision(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// ---------------------------------------------------------------------------
// Get effective platform position (handles moving platforms)
// (Original: function eV(e))
// ---------------------------------------------------------------------------
function getPlatformPosition(platform: Platform): { px: number; py: number } {
  return {
    px:
      platform.type === 'moving' && platform.moveAxis === 'x' && platform.moveRange && platform.moveSpeed
        ? platform.x + Math.sin(platform.moveOffset || 0) * platform.moveRange
        : platform.x,
    py:
      platform.type === 'moving' && platform.moveAxis === 'y' && platform.moveRange && platform.moveSpeed
        ? platform.y + Math.sin(platform.moveOffset || 0) * platform.moveRange
        : platform.y,
  };
}

// ---------------------------------------------------------------------------
// Get enemy collision height based on type
// (Original: function ez(e))
// ---------------------------------------------------------------------------
function getEnemyCollisionHeight(type: string): number {
  if (isBossType(type) || type === 'giant') return 80;
  if (type === 'voidGuardian') return 30;
  if (type === 'dragon' || type === 'phoenix') return 50;
  if (type === 'mechGolem' || type === 'heavyWalker' || type === 'zombie') return 55;
  if (type === 'shadowAssassin' || type === 'eliteDrone' || type === 'necromancer') return 50;
  if (type === 'bomber') return 45;
  if (type === 'voidBat') return 30;
  if (type === 'stormEagle') return 45;
  if (type === 'emberWisp') return 30;
  if (type === 'frostWraith') return 45;
  if (type === 'shadowDrake') return 55;
  if (type === 'plasmaSerpent') return 50;
  if (type === 'neonWyrm') return 60;
  if (type === 'crystalMoth') return 35;
  return 50;
}

// ---------------------------------------------------------------------------
// Spawn particles at a position
// (Original: function eU(e, t, o, a, l))
// ---------------------------------------------------------------------------
function spawnParticles(
  particles: Particle[],
  x: number,
  y: number,
  count: number,
  color: string
): void {
  const actualCount = IS_MOBILE ? Math.min(Math.ceil(count * MOBILE_TIME_SCALE), 3) : count;
  for (let i = 0; i < actualCount; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5 - 1.5,
      life: 18 + 18 * Math.random(),
      maxLife: 36,
      color,
      size: 2 + 2 * Math.random(),
    });
  }
  // Trim excess particles
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
}

// ---------------------------------------------------------------------------
// Check if an entity can walk forward on a platform (edge detection)
// (Original: eK)
// ---------------------------------------------------------------------------
function canWalkForward(
  entityX: number,
  entityY: number,
  facing: 1 | -1,
  platforms: Platform[],
  level: LevelData,
  entityWidth: number = 20
): boolean {
  const checkY = entityY + 5;
  const checkPoints = [
    entityX + 35 * facing,
    entityX + 35 * facing + (facing > 0 ? entityWidth : -entityWidth) * 0.5,
    entityX + (facing > 0 ? entityWidth : 0) + 5 * facing,
  ];
  for (const px of checkPoints) {
    let onPlatform = false;
    for (const plat of platforms) {
      const { px: platX, py: platY } = getPlatformPosition(plat);
      if (px >= platX && px <= platX + plat.width && checkY >= platY - 5 && checkY <= platY + plat.height + 20) {
        onPlatform = true;
        break;
      }
    }
    if (!onPlatform) return false;
  }
  // Check level bounds
  if (entityX + 35 * facing < 0) return false;
  if (entityX + 35 * facing > level.width - 20) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Draw background with grid and floating particles (menu/playing backdrop)
// (Original: function eD(e, t, o, a, l))
// ---------------------------------------------------------------------------
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number,
  bgParticles: Particle[]
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#030310');
  gradient.addColorStop(0.5, '#050520');
  gradient.addColorStop(1, '#030310');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1;
  const gridOffset = 0.3 * frameCount % 80;
  for (let x = gridOffset; x < width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Floating particles
  ctx.globalAlpha = 1;
  for (const p of bgParticles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) {
      p.y = height + 10;
      p.x = Math.random() * width;
    }
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 5;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Draw corrupted/glitch background (for game-over, skin-shop, etc.)
// (Original: function eW(e, t, o, a))
// ---------------------------------------------------------------------------
function drawCorruptedBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number
): void {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = RED;
  for (let i = 0; i < 8; i++) {
    const y = (1.5 * frameCount + 97 * i) % height;
    ctx.fillRect(0, y, width, 3 + 5 * Math.random());
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Draw victory/level-complete background with rising stars
// (Original: inline in main game loop)
// ---------------------------------------------------------------------------
function drawVictoryBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#000510');
  gradient.addColorStop(0.5, '#001020');
  gradient.addColorStop(1, '#000510');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 30; i++) {
    const x = (73.7 * i + 0.5 * frameCount) % width;
    const y = height - (47.7 * i + 0.8 * frameCount) % height;
    const color = [CYAN, GREEN, MAGENTA, YELLOW][i % 4];
    ctx.shadowBlur = 5;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Draw stickman face expression
// (Original: inline in eE function)
// ---------------------------------------------------------------------------
function drawExpression(
  ctx: CanvasRenderingContext2D,
  facing: number,
  scale: number,
  color: string,
  expression: string
): void {
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.lineWidth = 1.5 * scale;
  switch (expression) {
    case 'angry':
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-5 * facing * scale, -43 * scale);
      ctx.lineTo(facing * scale, -41 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(5 * facing * scale, -43 * scale);
      ctx.lineTo(facing * scale, -41 * scale);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39 * scale, 1.2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'smirk':
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-5 * facing * scale, -42 * scale);
      ctx.lineTo(facing * scale, -43 * scale);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(3.5 * facing * scale, -39 * scale, +scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-2 * facing * scale, -35 * scale);
      ctx.lineTo(4 * facing * scale, -35.5 * scale);
      ctx.lineTo(5 * facing * scale, -36.5 * scale);
      ctx.stroke();
      break;
    case 'determined':
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-4 * facing * scale, -42 * scale);
      ctx.lineTo(5 * facing * scale, -42 * scale);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39 * scale, 1.2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(-2 * facing * scale, -35 * scale);
      ctx.lineTo(3 * facing * scale, -35 * scale);
      ctx.stroke();
      break;
    case 'hurt': {
      ctx.strokeStyle = color;
      const ex = 3 * facing * scale;
      const ey = -39 * scale;
      ctx.beginPath();
      ctx.moveTo(ex - 2 * scale, ey - 2 * scale);
      ctx.lineTo(ex + 2 * scale, ey + 2 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex + 2 * scale, ey - 2 * scale);
      ctx.lineTo(ex - 2 * scale, ey + 2 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2 * facing * scale, -35 * scale);
      ctx.lineTo(0 * facing * scale, -34 * scale);
      ctx.lineTo(3 * facing * scale, -35.5 * scale);
      ctx.stroke();
      break;
    }
    case 'victory':
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(facing * scale, -39 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5 * facing * scale, -39 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -37 * scale, 5 * scale, 0.1, Math.PI - 0.1);
      ctx.stroke();
      break;
    default: // neutral
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(3 * facing * scale, -39.5 * scale, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = +scale;
      ctx.beginPath();
      ctx.moveTo(0 * facing * scale, -35 * scale);
      ctx.lineTo(3 * facing * scale, -35.2 * scale);
      ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Draw skin effect (rainbow, sparkle, shadow, plasma, holy, abyss, glitch)
// (Original: switch in eE after drawing the body)
// ---------------------------------------------------------------------------
function drawSkinEffect(
  ctx: CanvasRenderingContext2D,
  effect: string,
  scale: number,
  frameCount: number
): void {
  ctx.save();
  switch (effect) {
    case 'rainbow': {
      const hue = 3 * frameCount % 360;
      const color = `hsl(${hue}, 100%, 60%)`;
      ctx.globalAlpha = 0.15 + 0.08 * Math.sin(0.08 * frameCount);
      ctx.shadowBlur = 25;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 35 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 5; i++) {
        const angle = i / 5 * Math.PI * 2 + 0.05 * frameCount;
        const dist = 30 * scale + 8 * Math.sin(0.06 * frameCount + i) * scale;
        const h = (hue + 72 * i) % 360;
        ctx.fillStyle = `hsl(${h}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * dist,
          -20 * scale + Math.sin(angle) * dist * 0.5,
          1.5 * scale, 0, 2 * Math.PI
        );
        ctx.fill();
      }
      break;
    }
    case 'sparkle':
      if (frameCount % 8 < 2) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        const sx = 15 * Math.sin(0.7 * frameCount) * scale;
        const sy = (-20 + 15 * Math.cos(0.5 * frameCount)) * scale;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 * scale, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 0.08 + 0.05 * Math.sin(0.1 * frameCount);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#88ffff';
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 30 * scale, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'shadow':
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = '#333344';
      ctx.lineWidth = 2 * scale;
      for (let i = 1; i <= 3; i++) {
        ctx.globalAlpha = Math.max(0.2 - 0.06 * i, 0.02);
        ctx.beginPath();
        ctx.arc(-0 * i * 10 * scale, -38 * scale, 8 * scale, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-0 * i * 10 * scale, -29 * scale);
        ctx.lineTo(-0 * i * 10 * scale, -10 * scale);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.1 + 0.05 * Math.sin(0.07 * frameCount);
      ctx.fillStyle = '#222233';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#444466';
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 25 * scale, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'plasma':
      ctx.globalAlpha = 0.2 + 0.1 * Math.sin(0.12 * frameCount);
      ctx.fillStyle = '#ff44ff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff88ff';
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 28 * scale + 5 * Math.sin(0.1 * frameCount) * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ff88ff';
      ctx.lineWidth = 1.5 * scale;
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 3; i++) {
        const angle = 0.1 * frameCount + 2 * i;
        ctx.beginPath();
        ctx.moveTo(10 * Math.cos(angle) * scale, -20 * scale + 10 * Math.sin(angle) * scale);
        ctx.lineTo(25 * Math.cos(angle + 0.5) * scale, -20 * scale + 25 * Math.sin(angle + 0.5) * scale);
        ctx.stroke();
      }
      break;
    case 'holy':
      ctx.globalAlpha = 0.15 + 0.08 * Math.sin(0.06 * frameCount);
      ctx.fillStyle = '#ffdd44';
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#ffdd44';
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 35 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#ffdd44';
      ctx.lineWidth = 1.5 * scale;
      for (let i = 0; i < 6; i++) {
        const angle = i / 6 * Math.PI * 2 + 0.01 * frameCount;
        ctx.beginPath();
        ctx.moveTo(20 * Math.cos(angle) * scale, -20 * scale + 20 * Math.sin(angle) * scale);
        ctx.lineTo(45 * Math.cos(angle) * scale, -20 * scale + 45 * Math.sin(angle) * scale);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = '#ffdd44';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.ellipse(0, -50 * scale, 10 * scale, 3 * scale, 0, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'abyss':
      ctx.globalAlpha = 0.15 + 0.08 * Math.sin(0.08 * frameCount);
      ctx.fillStyle = '#220044';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#440088';
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 32 * scale, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = '#6600aa';
      ctx.lineWidth = 1.5 * scale;
      for (let i = 0; i < 4; i++) {
        const angle = i / 4 * Math.PI * 2 + 0.03 * frameCount;
        ctx.beginPath();
        ctx.moveTo(12 * Math.cos(angle) * scale, -20 * scale + 12 * Math.sin(angle) * scale);
        const cx = 22 * Math.cos(angle + 0.3) * scale;
        const cy = -20 * scale + 22 * Math.sin(angle + 0.3) * scale;
        const ex = 30 * Math.cos(angle + 0.5) * scale;
        const ey = -20 * scale + 30 * Math.sin(angle + 0.5) * scale;
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.stroke();
      }
      break;
    case 'glitch': {
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2 * scale;
      const glitchOffset = 3 * Math.sin(0.5 * frameCount) * scale;
      ctx.beginPath();
      ctx.arc(glitchOffset, -38 * scale, 9 * scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(-glitchOffset, -38 * scale, 9 * scale, 0, 2 * Math.PI);
      ctx.stroke();
      if (frameCount % 20 < 3) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#00ffaa';
        ctx.fillRect(-20 * scale, -45 * scale + 40 * Math.random() * scale, 40 * scale, 2 * scale);
      }
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#00ffaa';
      ctx.fillRect(-20 * scale, 2 * frameCount % 60 * scale - 30 * scale, 40 * scale, 2 * scale);
      break;
    }
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Draw a stickman figure (player, ally, or basic enemy)
// (Original: function eE(e, t, o, a, l, r, n, i, s, c, d, h, f, u))
// This is the core rendering function for any humanoid character.
// ---------------------------------------------------------------------------
function drawStickman(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: number,
  color: string,
  frameCount: number,
  isShooting: boolean,
  isGrounded: boolean,
  scale: number = 1,
  expression: string = 'neutral',
  isMoving: boolean = false,
  isGhost: boolean = false,
  velocityX: number = 0,
  skinEffect: string = ''
): void {
  const isFast = Math.abs(velocityX) > 6;
  const speedFactor = Math.min(Math.abs(velocityX) / 10, 1.5);
  const runPulse = isFast ? 0.45 : 0.3;

  // Ghost/afterimage rendering
  if (isGhost) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.3 + 0.2 * Math.sin(0.1 * frameCount);
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;
    const drift = 0.5 * frameCount;
    ctx.beginPath();
    ctx.arc(Math.sin(0.3 * frameCount) * drift, -38 * scale + Math.cos(0.2 * frameCount) * drift, 8 * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.sin(0.4 * frameCount) * drift * 0.5, -30 * scale);
    ctx.lineTo(Math.cos(0.3 * frameCount) * drift * 0.5, -10 * scale);
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(x, y);

  // Head with glow
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;

  const headBob = isMoving && isGrounded
    ? 3 * Math.abs(Math.sin(frameCount * runPulse)) * scale * speedFactor
    : Math.sin(0.06 * frameCount) * scale;

  // Draw head circle
  ctx.beginPath();
  ctx.arc(0, -38 * scale - headBob, 9 * scale, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Draw face expression
  drawExpression(ctx, facing, scale, color, expression);

  // Body offset for running lean
  const bodyLean = isMoving ? facing * (isFast ? 5 * scale : 2 * scale) * Math.min(speedFactor + 0.5, 1.2) : 0;

  // Body (torso)
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 5 * scale;
  ctx.beginPath();
  ctx.moveTo(bodyLean, -29 * scale - 0.5 * headBob);
  ctx.lineTo(0, -10 * scale);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  ctx.moveTo(bodyLean, -29 * scale - 0.5 * headBob);
  ctx.lineTo(0, -10 * scale);
  ctx.stroke();

  // Core glow dot on torso
  ctx.globalAlpha = 0.4 + 0.2 * Math.sin(0.08 * frameCount);
  ctx.fillStyle = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0.5 * bodyLean, -22 * scale - 0.3 * headBob, 3 * scale, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Arms
  const armY = -25 * scale - 0.5 * headBob;

  if (isShooting) {
    // Shooting arm animation
    const recoil = 3 * Math.sin(0.8 * frameCount) * scale;
    // Back arm (still)
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean - 0.3 * recoil, armY);
    ctx.lineTo(-(15 * scale * facing), armY + 5 * scale);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean - 0.3 * recoil, armY);
    ctx.lineTo(-(15 * scale * facing), armY + 5 * scale);
    ctx.stroke();
    // Front arm (gun)
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean - 0.3 * recoil, armY);
    ctx.lineTo(25 * scale * facing - recoil * facing * 0.5, armY - 3 * scale);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean - 0.3 * recoil, armY);
    ctx.lineTo(25 * scale * facing - recoil * facing * 0.5, armY - 3 * scale);
    ctx.stroke();
    // Muzzle flash
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(28 * facing * scale, armY - 3 * scale, 5 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(28 * facing * scale, armY - 3 * scale, 9 * scale, 0, 2 * Math.PI);
    ctx.fill();
    // Spark particles at muzzle
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const sparkAngle = (facing > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.2;
      const sparkDist = 10 + 10 * Math.random();
      ctx.beginPath();
      ctx.arc(
        28 * facing * scale + Math.cos(sparkAngle) * sparkDist * scale,
        armY - 3 * scale + Math.sin(sparkAngle) * sparkDist * scale,
        (1 + 1.5 * Math.random()) * scale,
        0, 2 * Math.PI
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    // Normal arm animation (running swing)
    const swingBack = isFast ? 22 * scale : isMoving ? 16 * scale : 3 * scale;
    const swingFront = isGrounded ? Math.sin(frameCount * runPulse) * swingBack * speedFactor : -8 * scale;
    const swingRange = isFast ? 15 * scale : 12 * scale;

    // Back arm
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean, armY);
    ctx.lineTo(-facing * swingRange, armY + swingFront);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyLean, armY);
    ctx.lineTo(-facing * swingRange, armY + swingFront);
    ctx.stroke();

    // Front arm
    if (!isMoving && isGrounded) {
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.moveTo(bodyLean, armY);
      ctx.lineTo(8 * scale * facing, armY + 12 * scale + 2 * Math.sin(0.05 * frameCount) * scale);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(bodyLean, armY);
      ctx.lineTo(8 * scale * facing, armY + 12 * scale + 2 * Math.sin(0.05 * frameCount) * scale);
    } else {
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.moveTo(bodyLean, armY);
      ctx.lineTo(facing * swingRange, armY - swingFront);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(bodyLean, armY);
      ctx.lineTo(facing * swingRange, armY - swingFront);
    }
    ctx.stroke();
  }

  // Legs
  if (isGrounded) {
    if (isMoving) {
      // Running animation
      const legSwing = Math.sin(frameCount * runPulse) * (isFast ? 20 * scale : 14 * scale) * Math.max(speedFactor, 0.6);
      const legRange = isFast ? 12 * scale : 8 * scale;
      // Left leg
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(-(0.5 * legRange) + 0.3 * legSwing, -10 * scale + 12 * scale);
      ctx.lineTo(-legRange + 0.5 * legSwing, -10 * scale + 22 * scale + 0.6 * legSwing);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(0.5 * legRange - 0.3 * legSwing, -10 * scale + 12 * scale);
      ctx.lineTo(legRange - 0.5 * legSwing, -10 * scale + 22 * scale - 0.6 * legSwing);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(-(0.5 * legRange) + 0.3 * legSwing, -10 * scale + 12 * scale);
      ctx.lineTo(-legRange + 0.5 * legSwing, -10 * scale + 22 * scale + 0.6 * legSwing);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(0.5 * legRange - 0.3 * legSwing, -10 * scale + 12 * scale);
      ctx.lineTo(legRange - 0.5 * legSwing, -10 * scale + 22 * scale - 0.6 * legSwing);
      ctx.stroke();
    } else {
      // Standing animation
      const breathe = 1.5 * Math.sin(0.06 * frameCount) * scale;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(-9 * scale, -10 * scale + 20 * scale + breathe);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(9 * scale, -10 * scale + 20 * scale + breathe);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(-9 * scale, -10 * scale + 20 * scale + breathe);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(9 * scale, -10 * scale + 20 * scale + breathe);
      ctx.stroke();
    }
  } else {
    // In air (jumping)
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -10 * scale);
    ctx.lineTo(-10 * scale, -10 * scale + 14 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -10 * scale);
    ctx.lineTo(10 * scale, -10 * scale + 14 * scale);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -10 * scale);
    ctx.lineTo(-10 * scale, -10 * scale + 14 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -10 * scale);
    ctx.lineTo(10 * scale, -10 * scale + 14 * scale);
    ctx.stroke();
  }

  // Speed trail (running afterimages)
  if (isMoving && isGrounded) {
    const trailCount = isFast ? 5 : 3;
    const trailSpacing = isFast ? 10 * scale : 8 * scale;
    ctx.strokeStyle = color;
    ctx.lineWidth = isFast ? 2 * scale : 1.5 * scale;
    for (let i = 1; i <= trailCount; i++) {
      const trailX = -facing * i * trailSpacing;
      ctx.globalAlpha = Math.max(0.15 - 0.03 * i, 0.02);
      ctx.beginPath();
      ctx.moveTo(trailX, -38 * scale - headBob);
      ctx.lineTo(trailX + bodyLean, -29 * scale - 0.5 * headBob);
      ctx.lineTo(trailX, -10 * scale);
      ctx.stroke();
    }
    // Speed lines
    if (isFast) {
      ctx.lineWidth = +scale;
      for (let i = 0; i < 3; i++) {
        const lineY = -32 * scale + 10 * i * scale;
        const lineLen = (8 + 12 * Math.random()) * scale;
        ctx.globalAlpha = 0.1 + 0.1 * Math.random();
        ctx.beginPath();
        ctx.moveTo(-facing * (15 + 5 * i) * scale, lineY);
        ctx.lineTo(-facing * (15 + 5 * i + lineLen / scale) * scale, lineY);
        ctx.stroke();
      }
    }
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  // Draw skin effect overlay
  if (skinEffect && !isGhost) {
    drawSkinEffect(ctx, skinEffect, scale, frameCount);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Draw boss stickman (large scale with aura, crown, health bar)
// (Original: inline in e7 render function)
// ---------------------------------------------------------------------------
function drawBoss(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  y: number,
  facing: number,
  color: string,
  frameCount: number,
  health: number,
  maxHealth: number,
  bossName?: string
): void {
  ctx.save();
  ctx.translate(screenX, y);

  // Aura
  ctx.shadowBlur = 30;
  ctx.shadowColor = color;
  ctx.globalAlpha = 0.15 + 0.1 * Math.sin(0.05 * frameCount);
  ctx.beginPath();
  ctx.arc(0, -75, 100, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  // Crown
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(0, -95, 30, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Crown gems (red eyes)
  ctx.fillStyle = '#ff0000';
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(-12.5, -100, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12.5, -100, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Body (ghost + solid)
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, -65);
  ctx.lineTo(0, -12.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -65);
  ctx.lineTo(0, -12.5);
  ctx.stroke();

  // Arms
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(-(25 * facing * 2.5), -25 + 5 * Math.sin(0.05 * frameCount) * 2.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(25 * facing * 2.5, -62.5 + 5 * Math.sin(0.05 * frameCount + 1) * 2.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(-(25 * facing * 2.5), -25 + 5 * Math.sin(0.05 * frameCount) * 2.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(25 * facing * 2.5, -62.5 + 5 * Math.sin(0.05 * frameCount + 1) * 2.5);
  ctx.stroke();

  // Legs
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, -12.5);
  ctx.lineTo(-25, 32.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -12.5);
  ctx.lineTo(25, 32.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -12.5);
  ctx.lineTo(-25, 32.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -12.5);
  ctx.lineTo(25, 32.5);
  ctx.stroke();

  // Health bar above boss
  ctx.globalAlpha = 0.8;
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#330000';
  ctx.fillRect(-40, -137.5, 80, 6);
  ctx.fillStyle = RED;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 8;
  ctx.fillRect(-40, -137.5, (health / maxHealth) * 80, 6);

  ctx.restore();

  // Boss name label
  if (bossName) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(bossName, screenX, y - 90);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Draw individual enemy types (special rendering for each enemy variant)
// (Original: inline IIFE in e7 render function)
// ---------------------------------------------------------------------------
function drawEnemy(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  y: number,
  type: string,
  facing: number,
  frameCount: number,
  isGrounded: boolean
): void {
  if (isBossType(type)) return; // Bosses drawn separately

  const defaultColor = type === 'drone' ? RED
    : type === 'glitchWalker' ? PURPLE
    : type === 'eliteDrone' ? '#ff4466'
    : type === 'heavyWalker' ? '#884400'
    : ORANGE;

  // Elite Drone - stickman with aura
  if (type === 'eliteDrone') {
    drawStickman(ctx, screenX, y + 2 * Math.sin(0.15 * frameCount), facing, '#ff4466', frameCount, false, isGrounded, 1.1, 'angry', true);
    ctx.save();
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(0.1 * frameCount);
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff4466';
    ctx.fillStyle = '#ff4466';
    ctx.beginPath();
    ctx.arc(screenX, y - 25, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Heavy Walker - thick stickman
  if (type === 'heavyWalker') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#884400';
    ctx.strokeStyle = '#884400';
    ctx.lineWidth = 3.9;
    ctx.beginPath();
    ctx.arc(0, -49.4, 11.7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(3 * facing * 1.3, -50.7, 2.6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -37.7);
    ctx.lineTo(0, -13);
    ctx.stroke();
    ctx.lineWidth = 5.2;
    ctx.beginPath();
    ctx.moveTo(0, -32.5);
    ctx.lineTo(-(15 * facing * 1.3), -19.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -32.5);
    ctx.lineTo(15 * facing * 1.3, -19.5);
    ctx.stroke();
    ctx.lineWidth = 5.2;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(-13, 10.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(13, 10.4);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // Void Guardian - floating box shape
  if (type === 'voidGuardian') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = ORANGE;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = ORANGE;
    ctx.fillRect(-15, -25, 30, 25);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -25, 30, 25);
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(20 * facing, -18);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // Dragon - winged serpent
  if (type === 'dragon') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = ORANGE;
    ctx.strokeStyle = ORANGE;
    ctx.fillStyle = ORANGE;
    ctx.lineWidth = 2;
    const bob = 3 * Math.sin(0.08 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -15 + bob, 14, 8, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(16 * facing, -20 + bob, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(18 * facing, -21 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 10 * Math.sin(0.15 * frameCount);
    ctx.strokeStyle = ORANGE;
    ctx.beginPath();
    ctx.moveTo(-6, -18 + bob);
    ctx.lineTo(-20, -30 + bob + wingFlap);
    ctx.lineTo(-12, -8 + bob);
    ctx.moveTo(6, -18 + bob);
    ctx.lineTo(20, -30 + bob + wingFlap);
    ctx.lineTo(12, -8 + bob);
    ctx.stroke();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-(14 * facing), -12 + bob);
    ctx.quadraticCurveTo(-(22 * facing), -6 + bob + 4 * Math.sin(0.1 * frameCount), -(26 * facing), -12 + bob);
    ctx.stroke();
    // Fire breath
    if (frameCount % 60 < 15) {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = YELLOW;
      ctx.beginPath();
      ctx.moveTo(22 * facing, -20 + bob);
      ctx.lineTo(35 * facing, -18 + bob);
      ctx.lineTo(35 * facing, -22 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // Phoenix - firebird
  if (type === 'phoenix') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = YELLOW;
    ctx.strokeStyle = YELLOW;
    ctx.fillStyle = YELLOW;
    ctx.lineWidth = 2;
    const bob = 4 * Math.sin(0.1 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -14 + bob, 10, 6, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(12 * facing, -18 + bob, 5, 0, 2 * Math.PI);
    ctx.stroke();
    const wingFlap = 8 * Math.sin(0.2 * frameCount);
    ctx.strokeStyle = ORANGE;
    ctx.beginPath();
    ctx.moveTo(-5, -16 + bob);
    ctx.lineTo(-18, -26 + bob + wingFlap);
    ctx.lineTo(-8, -6 + bob);
    ctx.moveTo(5, -16 + bob);
    ctx.lineTo(18, -26 + bob + wingFlap);
    ctx.lineTo(8, -6 + bob);
    ctx.stroke();
    // Tail feathers
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = ORANGE;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(-facing * (8 + 6 * i), -10 + bob + 3 * Math.sin(0.15 * frameCount + i), 3 - 0.5 * i, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // Mech Golem - robotic square body
  if (type === 'mechGolem') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = GREEN;
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 2.5;
    const bob = 1.5 * Math.sin(0.06 * frameCount);
    // Head
    ctx.beginPath();
    ctx.moveTo(-6, -38 + bob);
    ctx.lineTo(6, -38 + bob);
    ctx.lineTo(8, -30 + bob);
    ctx.lineTo(-8, -30 + bob);
    ctx.closePath();
    ctx.stroke();
    // Eyes
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(-3, -34 + bob, 2, 0, 2 * Math.PI);
    ctx.arc(3, -34 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    // Body
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 3;
    ctx.strokeRect(-10, -28 + bob, 20, 20);
    // Arms
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -24 + bob);
    ctx.lineTo(-18, -16 + bob + 2 * Math.sin(0.1 * frameCount));
    ctx.moveTo(10, -24 + bob);
    ctx.lineTo(18, -16 + bob - 2 * Math.sin(0.1 * frameCount));
    ctx.stroke();
    // Legs
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, -8 + bob);
    ctx.lineTo(-8, 2 + bob);
    ctx.moveTo(6, -8 + bob);
    ctx.lineTo(8, 2 + bob);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }

  // Shadow Assassin - ghostly stickman
  if (type === 'shadowAssassin') {
    ctx.save();
    ctx.translate(screenX, y);
    // Ghost afterimages
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = PURPLE;
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i++) {
      const gx = -facing * i * 8;
      ctx.beginPath();
      ctx.arc(gx, -38, 7, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, -31);
      ctx.lineTo(gx, -10);
      ctx.stroke();
    }
    // Main body
    ctx.globalAlpha = 0.7 + 0.2 * Math.sin(0.2 * frameCount);
    ctx.shadowBlur = 8;
    ctx.shadowColor = PURPLE;
    ctx.strokeStyle = PURPLE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -38, 7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = MAGENTA;
    ctx.shadowColor = MAGENTA;
    ctx.beginPath();
    ctx.arc(3 * facing, -39, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = PURPLE;
    ctx.beginPath();
    ctx.moveTo(0, -31);
    ctx.lineTo(0, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(18 * facing, -28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(-(10 * facing), -20);
    ctx.stroke();
    const legAnim = 10 * Math.sin(0.3 * frameCount);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-6 + 0.3 * legAnim, legAnim);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(6 - 0.3 * legAnim, -legAnim);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Void Bat - bat creature
  if (type === 'voidBat') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#8800aa';
    ctx.strokeStyle = '#8800aa';
    ctx.fillStyle = MAGENTA;
    ctx.lineWidth = 1.5;
    const bob = 4 * Math.sin(0.2 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -12 + bob, 6, 4, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(7 * facing, -14 + bob, 3.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = MAGENTA;
    ctx.beginPath();
    ctx.arc(8 * facing, -15 + bob, 1.2, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 8 * Math.sin(0.3 * frameCount);
    ctx.beginPath();
    ctx.moveTo(-3, -14 + bob);
    ctx.quadraticCurveTo(-12, -22 + bob + wingFlap, -8, -6 + bob);
    ctx.moveTo(3, -14 + bob);
    ctx.quadraticCurveTo(12, -22 + bob + wingFlap, 8, -6 + bob);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Storm Eagle - eagle with lightning
  if (type === 'stormEagle') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = YELLOW;
    ctx.strokeStyle = YELLOW;
    ctx.fillStyle = '#ffff44';
    ctx.lineWidth = 2;
    const bob = 5 * Math.sin(0.12 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -16 + bob, 12, 6, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(14 * facing, -20 + bob, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16 * facing, -21 + bob, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 10 * Math.sin(0.2 * frameCount);
    ctx.strokeStyle = YELLOW;
    ctx.beginPath();
    ctx.moveTo(-6, -18 + bob);
    ctx.lineTo(-22, -30 + bob + wingFlap);
    ctx.lineTo(-10, -8 + bob);
    ctx.moveTo(6, -18 + bob);
    ctx.lineTo(22, -30 + bob + wingFlap);
    ctx.lineTo(10, -8 + bob);
    ctx.stroke();
    // Lightning bolt
    if (frameCount % 30 < 5) {
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(5 * facing, -8 + bob);
      ctx.lineTo(8 * facing, -3 + bob);
      ctx.lineTo(3 * facing, -2 + bob);
      ctx.lineTo(7 * facing, 3 + bob);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Ember Wisp - floating fire spirit
  if (type === 'emberWisp') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = ORANGE;
    const bob = 5 * Math.sin(0.15 * frameCount);
    ctx.globalAlpha = 0.6 + 0.2 * Math.sin(0.1 * frameCount);
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(0, -12 + bob, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.arc(0, -12 + bob, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = i / 4 * Math.PI * 2 + 0.08 * frameCount;
      const dist = 8 + 4 * Math.sin(0.15 * frameCount + 2 * i);
      ctx.beginPath();
      ctx.moveTo(0, -12 + bob);
      ctx.lineTo(Math.cos(angle) * dist, -12 + bob + Math.sin(angle) * dist);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, -13 + bob, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2, -13 + bob, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Frost Wraith - ghostly cold figure
  if (type === 'frostWraith') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#88eeff';
    ctx.strokeStyle = '#88eeff';
    ctx.lineWidth = 1.5;
    const bob = 6 * Math.sin(0.1 * frameCount);
    ctx.globalAlpha = 0.5 + 0.15 * Math.sin(0.08 * frameCount);
    ctx.beginPath();
    ctx.moveTo(-8, -5 + bob);
    ctx.quadraticCurveTo(-10, -30 + bob, 0, -35 + bob);
    ctx.quadraticCurveTo(10, -30 + bob, 8, -5 + bob);
    for (let i = 0; i < 4; i++) {
      const lx = -8 + 4 * i + 1;
      const ly = -5 + bob + 3 * Math.sin(0.15 * frameCount + i);
      ctx.lineTo(lx, ly);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -22 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -22 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const px = 12 * Math.cos(0.05 * frameCount + 1.5 * i);
      const py = -20 + bob + 8 * Math.sin(0.07 * frameCount + 1.3 * i);
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Shadow Drake - dark winged beast
  if (type === 'shadowDrake') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = PURPLE;
    ctx.strokeStyle = PURPLE;
    ctx.fillStyle = MAGENTA;
    ctx.lineWidth = 2;
    const bob = 4 * Math.sin(0.08 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -16 + bob, 14, 8, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(17 * facing, -22 + bob, 7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = MAGENTA;
    ctx.beginPath();
    ctx.arc(19 * facing, -23 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 12 * Math.sin(0.15 * frameCount);
    ctx.strokeStyle = PURPLE;
    ctx.beginPath();
    ctx.moveTo(-8, -20 + bob);
    ctx.lineTo(-24, -34 + bob + wingFlap);
    ctx.lineTo(-16, -24 + bob);
    ctx.lineTo(-22, -14 + bob + 0.5 * wingFlap);
    ctx.lineTo(-10, -12 + bob);
    ctx.moveTo(8, -20 + bob);
    ctx.lineTo(24, -34 + bob + wingFlap);
    ctx.lineTo(16, -24 + bob);
    ctx.lineTo(22, -14 + bob + 0.5 * wingFlap);
    ctx.lineTo(10, -12 + bob);
    ctx.stroke();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-(14 * facing), -14 + bob);
    ctx.quadraticCurveTo(-(24 * facing), -8 + bob + 5 * Math.sin(0.1 * frameCount), -(28 * facing), -16 + bob);
    ctx.stroke();
    // Aura
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(0.1 * frameCount);
    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.arc(0, -16 + bob, 22, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Plasma Serpent - segmented snake
  if (type === 'plasmaSerpent') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = MAGENTA;
    ctx.strokeStyle = MAGENTA;
    ctx.lineWidth = 2.5;
    const bob = 4 * Math.sin(0.1 * frameCount);
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < 6; i++) {
      const sx = -facing * i * 7;
      const sy = -14 + bob + 5 * Math.sin(0.15 * frameCount + 0.8 * i);
      const r = 4 - 0.3 * i;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(5 * facing, -16 + bob, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7 * facing, -17 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#ff44ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const fx = facing * (2 + 5 * i);
      const fy = -14 + bob + 6 * Math.sin(0.2 * frameCount + i);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 8 * Math.sin(0.3 * frameCount + 2 * i), fy + 5 * Math.cos(0.25 * frameCount + i));
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Neon Wyrm - large cyan dragon
  if (type === 'neonWyrm') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 15;
    ctx.shadowColor = CYAN;
    ctx.strokeStyle = CYAN;
    ctx.fillStyle = '#00ffff';
    ctx.lineWidth = 2.5;
    const bob = 5 * Math.sin(0.07 * frameCount);
    ctx.globalAlpha = 0.9;
    for (let i = 0; i < 8; i++) {
      const sx = -facing * i * 9;
      const sy = -18 + bob + 6 * Math.sin(0.12 * frameCount + 0.7 * i);
      const r = 6 - 0.5 * i;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(8 * facing, -22 + bob, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(11 * facing, -24 + bob, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = CYAN;
    ctx.beginPath();
    ctx.arc(11 * facing, -24 + bob, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 10 * Math.sin(0.12 * frameCount);
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -22 + bob);
    ctx.lineTo(-25, -38 + bob + wingFlap);
    ctx.lineTo(-15, -16 + bob);
    ctx.moveTo(5, -22 + bob);
    ctx.lineTo(25, -38 + bob + wingFlap);
    ctx.lineTo(15, -16 + bob);
    ctx.stroke();
    ctx.globalAlpha = 0.12 + 0.06 * Math.sin(0.08 * frameCount);
    ctx.fillStyle = CYAN;
    ctx.beginPath();
    ctx.arc(0, -18 + bob, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Crystal Moth - moth with diamond wings
  if (type === 'crystalMoth') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = GREEN;
    ctx.strokeStyle = GREEN;
    ctx.fillStyle = '#88ffaa';
    ctx.lineWidth = 1.5;
    const bob = 5 * Math.sin(0.13 * frameCount);
    ctx.beginPath();
    ctx.ellipse(0, -12 + bob, 4, 6, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -20 + bob, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-1.5, -21 + bob, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1.5, -21 + bob, 1, 0, 2 * Math.PI);
    ctx.fill();
    const wingFlap = 6 * Math.sin(0.25 * frameCount);
    ctx.fillStyle = GREEN;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(-4, -16 + bob);
    ctx.lineTo(-16, -24 + bob + wingFlap);
    ctx.lineTo(-14, -12 + bob + 0.5 * wingFlap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -16 + bob);
    ctx.lineTo(16, -24 + bob + wingFlap);
    ctx.lineTo(14, -12 + bob + 0.5 * wingFlap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(0.1 * frameCount);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const px = 12 * Math.cos(0.06 * frameCount + 2 * i);
      const py = -16 + bob + 8 * Math.sin(0.08 * frameCount + 1.5 * i);
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Zombie - green shambling stickman
  if (type === 'zombie') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#44aa00';
    ctx.strokeStyle = '#44aa00';
    ctx.lineWidth = 2.5;
    const bob = 3 * Math.sin(0.08 * frameCount);
    ctx.beginPath();
    ctx.arc(0.3 * bob, -40, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#88ff00';
    ctx.beginPath();
    ctx.arc(2 * facing + 0.3 * bob, -41, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-facing + 0.3 * bob, -41, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0.3 * bob, -32);
    ctx.lineTo(0.2 * bob, -12);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0.2 * bob, -26);
    ctx.lineTo(16 * facing, -22 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.2 * bob, -26);
    ctx.lineTo(-(8 * facing), -20);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0.2 * bob, -12);
    ctx.lineTo(-8 + 0.5 * bob, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.2 * bob, -12);
    ctx.lineTo(8 - 0.5 * bob, 2);
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#44aa00';
    for (let i = 0; i < 3; i++) {
      const px = 10 * Math.sin(0.05 * frameCount + 2 * i);
      const py = -20 + 8 * Math.cos(0.07 * frameCount + i);
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Giant - huge stickman
  if (type === 'giant') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#cc4400';
    ctx.strokeStyle = '#cc4400';
    ctx.lineWidth = 6.4;
    const bob = 2 * Math.sin(0.04 * frameCount);
    ctx.beginPath();
    ctx.arc(bob, -60.8, 19.2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(4 * facing + bob, -62.4, 4.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-(2 * facing) + bob, -62.4, 4.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bob, -41.6);
    ctx.lineTo(bob, -12.8);
    ctx.stroke();
    ctx.lineWidth = 6.4;
    ctx.beginPath();
    ctx.moveTo(bob, -35.2);
    ctx.lineTo(22 * facing * 1.6, -22.4 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bob, -35.2);
    ctx.lineTo(-(18 * facing * 1.6), -16);
    ctx.stroke();
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(bob, -12.8);
    ctx.lineTo(-16 + bob, 6.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bob, -12.8);
    ctx.lineTo(16 + bob, 6.4);
    ctx.stroke();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.ellipse(0, 4, 25, 5, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Necromancer - robed caster
  if (type === 'necromancer') {
    ctx.save();
    ctx.translate(screenX, y);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#6600aa';
    ctx.strokeStyle = '#6600aa';
    ctx.fillStyle = MAGENTA;
    ctx.lineWidth = 2;
    const bob = 6 * Math.sin(0.08 * frameCount);
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(-10, -5 + bob);
    ctx.quadraticCurveTo(-12, -30 + bob, 0, -38 + bob);
    ctx.quadraticCurveTo(12, -30 + bob, 10, -5 + bob);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#6600aa';
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -28 + bob, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -28 + bob, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ff44ff';
    ctx.beginPath();
    ctx.arc(-3, -28 + bob, 1.2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -28 + bob, 1.2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#8844cc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12 * facing, -32 + bob);
    ctx.lineTo(10 * facing, 0 + bob);
    ctx.stroke();
    ctx.fillStyle = '#ff44ff';
    ctx.shadowColor = '#ff44ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(12 * facing, -35 + bob, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#ff44ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const angle = 0.06 * frameCount + 2 * Math.PI / 3 * i;
      const cx = 16 * Math.cos(angle);
      const cy = -20 + bob + 10 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Bomber - explosive stickman with bomb
  if (type === 'bomber') {
    ctx.save();
    ctx.translate(screenX, y);
    const pulse = 0.3 * Math.sin(0.2 * frameCount) + 0.7;
    ctx.shadowBlur = 8 + 6 * Math.sin(0.15 * frameCount);
    ctx.shadowColor = RED;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 2;
    const bob = 3 * Math.sin(0.4 * frameCount);
    ctx.beginPath();
    ctx.arc(0, -38 + bob, 7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = YELLOW;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(0, -46 + bob, 3 + 2 * Math.sin(0.3 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -39 + bob, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -39 + bob, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = RED;
    ctx.beginPath();
    ctx.moveTo(0, -31 + bob);
    ctx.lineTo(0, -12 + bob);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -26 + bob);
    ctx.lineTo(14 * facing, -22 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -26 + bob);
    ctx.lineTo(-(8 * facing), -20 + bob);
    ctx.stroke();
    ctx.lineWidth = 2;
    const legAnim = 12 * Math.sin(0.4 * frameCount);
    ctx.beginPath();
    ctx.moveTo(0, -12 + bob);
    ctx.lineTo(-6 + 0.4 * legAnim, 0 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -12 + bob);
    ctx.lineTo(6 - 0.4 * legAnim, 0 + bob);
    ctx.stroke();
    ctx.globalAlpha = 0.1 + 0.08 * Math.sin(0.25 * frameCount);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(0, -22 + bob, 20 + 5 * Math.sin(0.2 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Default: draw as basic stickman (drone, glitchWalker, etc.)
  drawStickman(
    ctx,
    screenX + (type === 'glitchWalker' ? 3 * Math.sin(0.5 * frameCount) : 0),
    y,
    facing,
    defaultColor,
    frameCount,
    false,
    isGrounded,
    0.9,
    'angry',
    true
  );
}

// ---------------------------------------------------------------------------
// Draw pet
// (Original: inline function in e7)
// ---------------------------------------------------------------------------
function drawPet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  petType: string,
  skinColor: string,
  frameCount: number,
  facing: number
): void {
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = skinColor;
  ctx.strokeStyle = skinColor;
  ctx.fillStyle = skinColor;
  ctx.lineWidth = 1.5;
  const bob = 3 * Math.sin(0.08 * frameCount);

  switch (petType) {
    case 'neonWolf':
      ctx.beginPath();
      ctx.ellipse(x, y - 10 + bob, 8, 5, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 10 * facing, y - 15 + bob, 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 8 * facing, y - 19 + bob);
      ctx.lineTo(x + 6 * facing, y - 24 + bob);
      ctx.moveTo(x + 13 * facing, y - 19 + bob);
      ctx.lineTo(x + 14 * facing, y - 24 + bob);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 12 * facing, y - 15 + bob, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 8 * facing, y - 10 + bob);
      ctx.quadraticCurveTo(x - 14 * facing, y - 20 + bob + 3 * Math.sin(0.15 * frameCount), x - 16 * facing, y - 16 + bob);
      ctx.stroke();
      break;
    case 'plasmaFalcon': {
      ctx.beginPath();
      ctx.ellipse(x, y - 12 + bob, 6, 4, 0, 0, 2 * Math.PI);
      ctx.stroke();
      const wf = 6 * Math.sin(0.2 * frameCount);
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 12 + bob);
      ctx.lineTo(x - 16, y - 18 + bob + wf);
      ctx.lineTo(x - 8, y - 8 + bob);
      ctx.moveTo(x + 5, y - 12 + bob);
      ctx.lineTo(x + 16, y - 18 + bob + wf);
      ctx.lineTo(x + 8, y - 8 + bob);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 8 * facing, y - 16 + bob, 3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 9 * facing, y - 16 + bob, 1.2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 11 * facing, y - 16 + bob);
      ctx.lineTo(x + 14 * facing, y - 15 + bob);
      ctx.stroke();
      break;
    }
    case 'shadowSpider':
      ctx.beginPath();
      ctx.arc(x, y - 10 + bob, 6, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 6 * facing, y - 14 + bob, 4, 0, 2 * Math.PI);
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const ls = 2 * Math.sin(0.15 * frameCount + i);
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 8 + bob);
        ctx.lineTo(x - 12 + ls, y - 2 + 2 * i + bob);
        ctx.moveTo(x + 4, y - 8 + bob);
        ctx.lineTo(x + 12 - ls, y - 2 + 2 * i + bob);
        ctx.stroke();
      }
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(x + 7 * facing, y - 15 + bob, 1.5, 0, 2 * Math.PI);
      ctx.arc(x + 5 * facing, y - 15 + bob, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'crystalGolem':
      ctx.beginPath();
      ctx.moveTo(x - 7, y + bob);
      ctx.lineTo(x - 9, y - 10 + bob);
      ctx.lineTo(x, y - 18 + bob);
      ctx.lineTo(x + 9, y - 10 + bob);
      ctx.lineTo(x + 7, y + bob);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 8 + bob);
      ctx.lineTo(x - 14, y - 14 + bob + 2 * Math.sin(0.1 * frameCount));
      ctx.moveTo(x + 9, y - 8 + bob);
      ctx.lineTo(x + 14, y - 14 + bob - 2 * Math.sin(0.1 * frameCount));
      ctx.stroke();
      ctx.fillStyle = skinColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x + 2 * facing, y - 13 + bob, 2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    // Additional pet types follow similar pattern...
    // neonCat, voidDrake, thunderBird, iceFox, magmaSnail, cosmicOwl
    // All follow the same drawing pattern with species-specific shapes
    default:
      // Generic pet - small circle with ears
      ctx.beginPath();
      ctx.arc(x, y - 12 + bob, 6, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 3 * facing, y - 13 + bob, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Draw zone-specific background (the in-level background with weather, etc.)
// (Original: inline IIFE in e7 render function)
// ---------------------------------------------------------------------------
function drawZoneBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraX: number,
  level: LevelData,
  bgStars: Array<{ x: number; y: number; size: number; speed: number }>,
  frameCount: number,
  zoneConfig?: any
): void {
  // Sky gradient
  if (zoneConfig) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    const sky = zoneConfig.skyGradient;
    for (let i = 0; i < sky.length; i++) grad.addColorStop(i / (sky.length - 1), sky[i]);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = BG_DARK;
  }
  ctx.fillRect(0, 0, width, height);

  // Dark overlay
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#000008';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  // Weather effects (lightning for storm zones)
  if (zoneConfig && zoneConfig.weatherType !== 'none') {
    drawWeatherEffects(ctx, width, height, zoneConfig);
  }

  // Background stars / nebula
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 30; i++) {
    const sx = ((197.3 * i - 0.05 * cameraX + 0.15 * frameCount) % width + width) % width;
    const sy = (127.7 * i + 0.2 * frameCount * (0.5 + i % 3 * 0.3)) % height;
    const size = 1.5 + i % 4 * 0.8;
    ctx.fillStyle = i % 3 === 0 ? '#220044' : i % 3 === 1 ? '#110022' : '#0a0020';
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Scrolling particles
  ctx.globalAlpha = 0.4;
  for (const star of bgStars) {
    const sx = ((star.x - cameraX * star.speed) % width + width) % width;
    ctx.fillStyle = zoneConfig ? zoneConfig.particleColor : '#ffffff';
    ctx.fillRect(sx, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;

  // Grid overlay
  const glowColor = zoneConfig
    ? zoneConfig.platformGlow
    : level.background === 'firewall' ? ORANGE
    : level.background === 'void' ? MAGENTA
    : level.background === 'core' ? PURPLE
    : CYAN;

  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1;
  const gridOff1 = -(0.15 * cameraX) % 80;
  for (let x = gridOff1; x < width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Finer grid
  ctx.globalAlpha = 0.1;
  const gridOff2 = -(0.4 * cameraX) % 50;
  for (let x = gridOff2; x < width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Cityscape silhouette
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = glowColor;
  const cityOff = -(0.2 * cameraX);
  const cityWidths = [60, 40, 80, 50, 70, 45, 90, 55, 65, 75, 35, 85];
  const cityHeights = [120, 80, 200, 150, 180, 90, 250, 130, 160, 220, 70, 190];
  for (let i = 0; i < cityWidths.length; i++) {
    const bx = (cityOff + 250 * i) % (width + 500) - 100;
    ctx.fillRect(bx, height - 100 - cityHeights[i], cityWidths[i], cityHeights[i]);
  }

  // Floating ambient particles
  const particleColor = zoneConfig ? zoneConfig.particleColor : glowColor;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 20; i++) {
    const px = ((173.7 * i - 0.1 * cameraX) % width + width) % width;
    const py = (91.3 * i + 0.3 * frameCount) % height;
    const size = 1 + i % 3;
    ctx.shadowBlur = 5;
    ctx.shadowColor = particleColor;
    ctx.fillStyle = particleColor;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  // Weather overlay (rain, snow, embers, glitch, voidParticles)
  if (zoneConfig) {
    drawWeatherOverlay(ctx, width, height, cameraX, frameCount, zoneConfig);
  } else if (level.background === 'corrupted') {
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = RED;
    for (let i = 0; i < 5; i++) {
      const y = (2 * frameCount + 137 * i) % height;
      ctx.fillRect(0, y, width, 2 + 4 * Math.random());
    }
    ctx.globalAlpha = 1;
  } else if (level.background === 'void') {
    ctx.globalAlpha = 0.05 + 0.03 * Math.sin(0.02 * frameCount);
    ctx.fillStyle = MAGENTA;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 200 + 50 * Math.sin(0.03 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (level.background === 'core') {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 300 + 30 * Math.sin(0.02 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = CYAN;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 150 + 20 * Math.sin(0.04 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------------
// Draw weather effects (lightning, rain, snow, embers, glitch, void particles)
// ---------------------------------------------------------------------------
function drawWeatherEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoneConfig: any
): void {
  // Lightning for storm weather
  if (zoneConfig.weatherType === 'rain' || zoneConfig.weatherType === 'none') {
    if (0.015 > Math.random()) {
      const segCount = 2 + Math.floor(3 * Math.random());
      const segments: Array<{ x: number; y: number }> = [];
      let lx = Math.random() * width;
      let ly = 0;
      segments.push({ x: lx, y: ly });
      for (let i = 0; i < segCount; i++) {
        lx += (Math.random() - 0.5) * 120;
        ly += height / (segCount + 1) + 40 * Math.random();
        segments.push({ x: lx, y: Math.min(ly, height) });
      }
      lightningParticles.push({ segments, life: 6 + Math.floor(4 * Math.random()), flashLife: 4 });
    }
  }

  // Draw existing lightning
  for (let i = lightningParticles.length - 1; i >= 0; i--) {
    const bolt = lightningParticles[i];
    bolt.life--;
    bolt.flashLife--;
    if (bolt.life <= 0) {
      lightningParticles.splice(i, 1);
      continue;
    }
    // Flash
    if (bolt.flashLife > 0) {
      ctx.globalAlpha = 0.15 * (bolt.flashLife / 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }
    const alpha = Math.min(bolt.life / 6, 1);
    // Thick glow
    ctx.save();
    ctx.globalAlpha = 0.4 * alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
    for (let j = 1; j < bolt.segments.length; j++) ctx.lineTo(bolt.segments[j].x, bolt.segments[j].y);
    ctx.stroke();
    // Thin cyan
    ctx.globalAlpha = 0.9 * alpha;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
    for (let j = 1; j < bolt.segments.length; j++) ctx.lineTo(bolt.segments[j].x, bolt.segments[j].y);
    ctx.stroke();
    // Branches
    ctx.globalAlpha = 0.5 * alpha;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 8;
    for (let j = 1; j < bolt.segments.length - 1; j++) {
      if (0.6 > Math.random()) {
        const bLen = 15 + 30 * Math.random();
        const bAngle = (Math.random() - 0.5) * Math.PI * 0.6;
        ctx.beginPath();
        ctx.moveTo(bolt.segments[j].x, bolt.segments[j].y);
        ctx.lineTo(
          bolt.segments[j].x + Math.cos(bAngle) * bLen,
          bolt.segments[j].y + Math.sin(bAngle + 0.5) * bLen
        );
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

function drawWeatherOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraX: number,
  frameCount: number,
  zoneConfig: any
): void {
  const weather = zoneConfig.weatherType;
  const color = zoneConfig.particleColor;

  if (weather === 'rain') {
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const rx = ((97.3 * i - 0.3 * cameraX + 2 * frameCount) % width + width) % width;
      const ry = (53.7 * i + 6 * frameCount) % height;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 1, ry + 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (weather === 'snow') {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const sx = ((79.1 * i - 0.1 * cameraX + 20 * Math.sin(0.01 * frameCount + i)) % width + width) % width;
      const sy = (43.7 * i + 1.5 * frameCount) % height;
      const size = 1 + i % 3;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (weather === 'embers') {
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 40; i++) {
      const ex = ((87.3 * i - 0.15 * cameraX) % width + width) % width;
      const ey = height - (67.1 * i + 2 * frameCount) % height;
      const size = 1 + i % 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = color;
      ctx.fillStyle = i % 3 === 0 ? YELLOW : color;
      ctx.beginPath();
      ctx.arc(ex, ey, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  } else if (weather === 'glitch') {
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
      const y = (2 * frameCount + 97 * i) % height;
      ctx.fillRect(0, y, width, 2 + 6 * Math.random());
    }
    if (zoneConfig.platformGlow === YELLOW && frameCount % 180 < 3) {
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalAlpha = 1;
  } else if (weather === 'voidParticles') {
    ctx.globalAlpha = 0.08 + 0.04 * Math.sin(0.02 * frameCount);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 200 + 50 * Math.sin(0.03 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 20; i++) {
      const px = ((113.7 * i - 0.2 * cameraX) % width + width) % width;
      const py = (73.1 * i + 0.8 * frameCount) % height;
      ctx.fillStyle = i % 2 === 0 ? color : '#440044';
      ctx.beginPath();
      ctx.arc(px, py, 2 + +Math.sin(0.1 * frameCount + i), 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (weather === 'none') {
    ctx.globalAlpha = 0.3 + 0.15 * Math.sin(0.04 * frameCount);
    for (let i = 0; i < 15; i++) {
      const dx = ((131.7 * i - 0.1 * cameraX) % width + width) % width;
      const dy = (83.1 * i + 30 * Math.sin(0.02 * frameCount + 2 * i)) % height;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const r = 2 + +Math.sin(0.08 * frameCount + i);
      ctx.moveTo(dx, dy - r);
      ctx.lineTo(dx + r, dy);
      ctx.lineTo(dx, dy + r);
      ctx.lineTo(dx - r, dy);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  // Red zone sun (for specific zone configs)
  if (zoneConfig.platformGlow === '#cc0033') {
    ctx.globalAlpha = 0.04 + 0.02 * Math.sin(0.01 * frameCount);
    ctx.fillStyle = '#ff0033';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.2 + 0.05 * Math.sin(0.02 * frameCount);
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#cc0033';
    ctx.fillStyle = '#cc0033';
    ctx.beginPath();
    ctx.arc(0.8 * width, 60, 35 + 3 * Math.sin(0.03 * frameCount), 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------------
// Draw a single platform
// (Original: inline IIFE in e7)
// ---------------------------------------------------------------------------
function drawPlatform(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  y: number,
  width: number,
  height: number,
  background: string
): void {
  const glowColor = background === 'firewall' ? ORANGE
    : background === 'void' ? MAGENTA
    : background === 'core' ? PURPLE
    : CYAN;

  // Glow
  ctx.shadowBlur = 10;
  ctx.shadowColor = glowColor;
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = glowColor;
  ctx.fillRect(screenX, y, width, height);

  // Solid fill
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = background === 'firewall' ? '#1a0d00'
    : background === 'void' ? '#1a0011'
    : background === 'core' ? '#11001a'
    : '#001a1a';
  ctx.fillRect(screenX, y, width, height);

  // Top edge glow
  ctx.globalAlpha = 0.8;
  ctx.shadowBlur = 6;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(screenX, y);
  ctx.lineTo(screenX + width, y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

// ===========================================================================
// MAIN GAME CANVAS COMPONENT
// ===========================================================================
// This is the core component that runs the entire game via requestAnimationFrame.
// It uses refs for all mutable game state to avoid React re-renders.
//
// Original minified name: eq (forwardRef component)
// ===========================================================================

export interface GameCanvasHandle {
  moveLeft: () => void;
  moveRight: () => void;
  stopMove: () => void;
  jump: () => void;
  shoot: () => void;
  stopShoot: () => void;
  dash: () => void;
  shield: () => void;
  special: () => void;
  setJoystick: (joystick: { active: boolean; dx: number; dy: number }) => void;
  setP2Joystick: (joystick: { active: boolean; dx: number; dy: number }) => void;
  executeSkill: (skillId: string) => void;
  pause: () => void;
}

const GameCanvas = forwardRef<GameCanvasHandle>((_props, ref) => {
  // =======================================================================
  // Refs — all mutable game state lives here (no React re-renders)
  // =======================================================================

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Input states
  const keysRef = useRef({ left: false, right: false, up: false, shoot: false });
  const p2KeysRef = useRef({ left: false, right: false, up: false, shoot: false, dash: false, shield: false, special: false });
  const joystickRef = useRef({ active: false, dx: 0, dy: 0 });
  const p2JoystickRef = useRef({ active: false, dx: 0, dy: 0 });

  // Game entities
  const player1Ref = useRef<PlayerEntity | null>(null);        // j.current
  const player2Ref = useRef<PlayerEntity | null>(null);        // N.current
  const enemiesRef = useRef<EnemyEntity[]>([]);                // I.current
  const bulletsRef = useRef<Bullet[]>([]);                     // D.current
  const particlesRef = useRef<Particle[]>([]);                 // W.current
  const platformsRef = useRef<Platform[]>([]);                 // O.current
  const levelRef = useRef<LevelData | null>(null);             // B.current
  const petRef = useRef<any>(null);                            // ec.current
  const alliesRef = useRef<any[]>([]);                         // es.current

  // Score and progress
  const scoreRef = useRef(0);                                  // $.current
  const coinsRef = useRef(0);                                  // F.current (frame counter reused)
  const frameRef = useRef(0);                                  // F.current (frame counter)
  const frameCountRef = useRef(0);                             // z.current
  const levelLoadedRef = useRef(false);                        // ee.current
  const screenShakeRef = useRef(0);                            // X.current
  const comboRef = useRef(0);                                  // en.current
  const comboTimerRef = useRef(0);                             // ei.current

  // UI overlays
  const voiceLineTextRef = useRef('');                         // el.current
  const voiceLineColorRef = useRef(CYAN);                      // er.current
  const voiceLineTimerRef = useRef(0);                         // et.current
  const dramaticTextRef = useRef('');                          // eu.current
  const dramaticColorRef = useRef(CYAN);                       // em.current
  const dramaticTimerRef = useRef(0);                          // ex.current
  const introTextRef = useRef('');                             // ep.current
  const introColorRef = useRef(CYAN);                          // eg.current
  const introTimerRef = useRef(0);                             // ey.current

  // State tracking
  const currentPhaseRef = useRef<string>('menu');              // ed.current
  const soundInitRef = useRef(false);                          // eh.current
  const dramaticTimerRef2 = useRef(0);                         // ef.current
  const dramaticTextRef2 = useRef('');                         // eu.current
  const dramaticColorRef2 = useRef(CYAN);                      // em.current
  const versusModeRef = useRef(false);                         // ev.current
  const timescaleRef = useRef(1);                              // ew.current

  // Coins/chests
  const coinsOnMapRef = useRef<CoinCollectible[]>([]);         // ek.current
  const coinsCollectedRef = useRef(0);                         // eC.current
  const chestsRef = useRef<any[]>([]);                         // e2.current

  // Exit gate
  const exitGateRef = useRef({ x: 0, y: 0, active: false }); // eS.current
  const maxComboRef = useRef(0);                               // eT.current
  const eventOverlayRef = useRef<EventTrigger | null>(null);   // ej.current
  const eventTimerRef = useRef(0);                             // eN.current
  const eventTriggeredRef = useRef(false);                     // eP.current
  const difficultyRef = useRef(1);                             // eA.current

  // Wave spawning queue
  const spawnQueueRef = useRef<any[]>([]);                     // eR.current
  const spawnIntervalRef = useRef(0);                          // eI.current
  const spawnDelayRef = useRef(0);                             // e$.current (local override)
  const spawnTimerRef = useRef(0);                             // eq.current (local)
  const totalEnemiesKilledRef = useRef(0);                     // eY.current
  const totalEnemiesSpawnedRef = useRef(0);                    // eJ.current
  const totalEnemiesForLevelRef = useRef(0);                   // eM.current

  // Skills
  const skillStatesRef = useRef<SkillState[]>([]);             // e1.current

  // Display
  const pixelRatioRef = useRef(1);                             // q.current
  const isMobileNowRef = useRef(false);                        // _.current
  const wasMobileRef = useRef(false);                          // K.current
  const lastTimestampRef = useRef(0);                          // eb.current
  const skipFrameRef = useRef(false);                          // ev.current
  const bgStarsRef = useRef<any[]>([]);                        // Y.current
  const bgParticlesRef = useRef<Particle[]>([]);               // Q.current

  // =======================================================================
  // Helper: Initialize audio context
  // (Original: eZ = () => { eh.current || (eo.init(), eh.current = true) })
  // =======================================================================
  const initAudio = useCallback(() => {
    // In the real implementation, this calls eo.init()
    // For the reconstructed source, we reference the SoundManager
    if (!soundInitRef.current) {
      soundInitRef.current = true;
      // soundManager.init();
    }
  }, []);

  // =======================================================================
  // Helper: Show voice line
  // (Original: e4 = (e, t) => { el.current = e, er.current = t, et.current = 90 })
  // =======================================================================
  const showVoiceLine = useCallback((text: string, color: string) => {
    voiceLineTextRef.current = text;
    voiceLineColorRef.current = color;
    voiceLineTimerRef.current = 90;
  }, []);

  // =======================================================================
  // Helper: Show dramatic text
  // (Original: e6 = (e, t) => { eu.current = e, em.current = t, ex.current = 120 })
  // =======================================================================
  const showDramaticText = useCallback((text: string, color: string) => {
    dramaticTextRef.current = text;
    dramaticColorRef.current = color;
    dramaticTimerRef.current = 120;
  }, []);

  // =======================================================================
  // Create background stars for a level
  // (Original: eX callback)
  // =======================================================================
  const createBgStars = useCallback((width: number) => {
    const stars: any[] = [];
    const count = IS_MOBILE ? 30 : 80;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: 600 * Math.random(),
        size: 0.5 + 2 * Math.random(),
        speed: 0.1 + 0.3 * Math.random(),
      });
    }
    bgStarsRef.current = stars;
  }, []);

  // =======================================================================
  // Create background floating particles
  // (Original: eQ callback)
  // =======================================================================
  const createBgParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const count = IS_MOBILE ? 15 : 40;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.5 * Math.random()) - 0.2,
        color: [CYAN, MAGENTA, GREEN, PURPLE][Math.floor(4 * Math.random())],
        size: 1 + 3 * Math.random(),
        life: 9999,
        maxLife: 9999,
      });
    }
    bgParticlesRef.current = particles;
  }, []);

  // =======================================================================
  // Create player entity
  // (Original: e0 callback)
  // =======================================================================
  const createPlayer = useCallback((x: number, y: number, skinId: string): PlayerEntity => {
    // In real implementation, this looks up skin from C array
    const skin = { color: CYAN, glowColor: CYAN, trailColor: CYAN, effect: '' };
    return {
      x, y,
      width: 20,
      height: 50,
      vx: 0,
      vy: 0,
      health: 100,
      maxHealth: 100,
      facing: 1,
      grounded: false,
      shootCooldown: 0,
      animFrame: 0,
      animTimer: 0,
      invincible: 0,
      expression: 'determined',
      isMoving: false,
      isShooting: false,
      shootTimer: 0,
      dashCooldown: 0,
      dashTimer: 0,
      isDashing: false,
      shieldCooldown: 0,
      shieldTimer: 0,
      isShielding: false,
      specialCooldown: 0,
      specialTimer: 0,
      isUsingSpecial: false,
      jumpCount: 0,
      maxJumps: 2,
      kills: 0,
      combo: 0,
      comboTimer: 0,
      skinColor: skin.color,
      skinGlow: skin.glowColor,
      skinTrail: skin.trailColor,
      skinEffect: skin.effect,
      equippedSkills: [],
      skillStates: [],
    };
  }, []);

  // =======================================================================
  // Load a level
  // (Original: e3 callback)
  // This initializes players, enemies, platforms, coins, pets, allies, etc.
  // =======================================================================
  const loadLevel = useCallback((levelId: number) => {
    // In real implementation, this fetches level data from G array or generates procedural level
    // It sets up: player1Ref, player2Ref, enemies, platforms, coins, pet, allies, skill states, etc.
    // For the reconstructed source, we show the structure:

    levelLoadedRef.current = false;
    comboRef.current = 0;
    comboTimerRef.current = 0;
    screenShakeRef.current = 0;
    scoreRef.current = 0;
    coinsCollectedRef.current = 0;
    spawnQueueRef.current = [];
    spawnIntervalRef.current = 0;
    spawnTimerRef.current = 0;
    totalEnemiesKilledRef.current = 0;
    totalEnemiesSpawnedRef.current = 0;

    // Reset UI overlays
    voiceLineTimerRef.current = 0;
    dramaticTimerRef.current = 0;
    introTimerRef.current = 0;

    // Reset event state
    eventOverlayRef.current = null;
    eventTimerRef.current = 0;
    eventTriggeredRef.current = false;
    exitGateRef.current = { x: 0, y: 0, active: false };

    // Clear entities
    enemiesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];

    initAudio();
    createBgStars(levelRef.current?.width || 1200);
  }, [initAudio, createBgStars]);

  // =======================================================================
  // Imperative handle — exposed methods for parent components
  // (Original: useImperativeHandle)
  // =======================================================================
  useImperativeHandle(ref, () => ({
    moveLeft: () => { keysRef.current.left = true; },
    moveRight: () => { keysRef.current.right = true; },
    stopMove: () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.up = false;
      keysRef.current.shoot = false;
    },
    jump: () => {
      const player = player1Ref.current;
      if (player && player.jumpCount < player.maxJumps) {
        player.vy = -12;
        player.grounded = false;
        player.jumpCount++;
        spawnParticles(particlesRef.current, player.x + player.width / 2, player.y, 5, CYAN);
        initAudio();
        // soundManager.playJump();
      }
    },
    shoot: () => { keysRef.current.shoot = true; },
    stopShoot: () => { keysRef.current.shoot = false; },
    dash: () => {
      const player = player1Ref.current;
      if (!player || player.dashCooldown > 0 || player.isDashing) return;
      player.isDashing = true;
      player.dashTimer = 8;
      player.dashCooldown = 90;
      player.invincible = Math.max(player.invincible, 8);
      showVoiceLine('⚡ DASH!', CYAN);
      spawnParticles(particlesRef.current, player.x + player.width / 2, player.y - 25, 8, CYAN);
      initAudio();
      // soundManager.playDash();
    },
    shield: () => {
      const player = player1Ref.current;
      if (!player || player.shieldCooldown > 0 || player.isShielding) return;
      player.isShielding = true;
      player.shieldTimer = 120;
      player.shieldCooldown = 300;
      showVoiceLine('🛡 SHIELD!', GREEN);
      initAudio();
      // soundManager.playShield();
    },
    special: () => {
      const player = player1Ref.current;
      if (!player || player.specialCooldown > 0 || player.isUsingSpecial) return;
      player.isUsingSpecial = true;
      player.specialTimer = 30;
      player.specialCooldown = 360;
      screenShakeRef.current = 10;
      showVoiceLine('✦ SPECIAL!', ORANGE);
      // Fire spread of special bullets
      const cx = player.x + player.width / 2;
      const cy = player.y - 25;
      for (let a = -0.5; a <= 0.51; a += 0.1) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const speed = 10 * player.facing;
        bulletsRef.current.push({
          x: cx, y: cy,
          vx: speed * cos,
          vy: speed * sin,
          fromPlayer: true,
          damage: 30,
          active: true,
          color: ORANGE,
          radius: 5,
          width: 10,
          height: 10,
          owner: 'player',
          life: 999,
          glowColor: ORANGE,
        });
      }
      spawnParticles(particlesRef.current, cx, cy, 20, ORANGE);
      initAudio();
      // soundManager.playSpecial();
    },
    setJoystick: (joystick) => { joystickRef.current = joystick; },
    setP2Joystick: (joystick) => { p2JoystickRef.current = joystick; },
    executeSkill: (skillId) => {
      // In real implementation, calls e8(skillId)
      // which looks up the skill definition, applies its effect
      // (projectile, aoe, buff, summon, beam, wave)
    },
    pause: () => {
      // In real implementation: if playing, set gamePhase to "settings"
    },
  }));

  // =======================================================================
  // Update player entity (controls, physics, shooting, animation)
  // (Original: e9 function)
  // =======================================================================
  const updatePlayer = useCallback((
    player: PlayerEntity,
    keys: { left: boolean; right: boolean; up: boolean; shoot: boolean },
    joystick: { active: boolean; dx: number; dy: number } | null,
    enemies: EnemyEntity[],
    bullets: Bullet[],
    particles: Particle[],
    platforms: Platform[],
    level: LevelData,
    playerId?: number
  ) => {
    let moveDir = 0;

    // Handle movement input (joystick or keyboard)
    if (joystick?.active) {
      moveDir = joystick.dx;
      player.facing = moveDir > 0.05 ? 1 : moveDir < -0.05 ? -1 : player.facing;
    } else {
      if (keys.left) { moveDir = -1; player.facing = -1; }
      if (keys.right) { moveDir = 1; player.facing = 1; }
    }

    // Dashing
    if (player.isDashing) {
      player.dashTimer -= (IS_MOBILE ? 2 : 1);
      player.vx = 18 * player.facing;
      if (player.dashTimer <= 0) player.isDashing = false;
      if (frameRef.current % 2 === 0) {
        spawnParticles(particles, player.x + player.width / 2, player.y - 25, 2, player.skinColor);
      }
    } else {
      player.vx = (player.grounded ? 5 : 3.5) * moveDir;
    }

    player.isMoving = Math.abs(moveDir) > 0.1 || player.isDashing;

    // Shield timer
    if (player.isShielding) {
      player.shieldTimer -= (IS_MOBILE ? 2 : 1);
      if (player.shieldTimer <= 0) player.isShielding = false;
    }

    // Special timer
    if (player.isUsingSpecial) {
      player.specialTimer -= (IS_MOBILE ? 2 : 1);
      if (player.specialTimer <= 0) player.isUsingSpecial = false;
    }

    // Shoot cooldown
    if (player.shootCooldown > 0) player.shootCooldown -= (IS_MOBILE ? 2 : 1);

    // Shooting
    if (player.isShooting) player.shootTimer--;
    if (keys.shoot && player.shootCooldown <= 0 && !player.isDashing) {
      // Weapon upgrades would modify these values
      const damageMult = 1;
      const fireRateMult = 1;
      const speedMult = 1;
      const sizeMult = 1;
      const isCrit = false; // Would be calculated from upgrade

      bullets.push({
        x: player.x + player.width / 2 + 15 * player.facing,
        y: player.y - 25,
        vx: 10 * player.facing * speedMult,
        vy: 0,
        fromPlayer: true,
        damage: Math.round(10 * damageMult * (isCrit ? 2 : 1)),
        active: true,
        color: isCrit ? GOLD : player.skinColor,
        radius: Math.round(4 * sizeMult),
        width: 8,
        height: 8,
        owner: 'player',
        life: 999,
        glowColor: player.skinColor,
      });

      player.shootCooldown = Math.max(2, Math.round(8 * fireRateMult));
      player.isShooting = true;
      player.shootTimer = 6;
      spawnParticles(particles, player.x + player.width / 2 + 20 * player.facing, player.y - 25, isCrit ? 8 : 3, isCrit ? GOLD : player.skinColor);
      initAudio();
      // soundManager.playShoot();
    }

    if (player.shootTimer <= 0) player.isShooting = false;

    // Cooldown ticks
    if (player.dashCooldown > 0) player.dashCooldown--;
    if (player.shieldCooldown > 0) player.shieldCooldown--;
    if (player.specialCooldown > 0) player.specialCooldown--;

    // Update cooldowns in store (every 6 frames)
    if (frameRef.current % 6 === 0) {
      // gameStore.updateCooldowns(player.dashCooldown, player.shieldCooldown, player.specialCooldown);
    }

    // Expression updates
    if (player.isDashing) player.expression = 'determined';
    else if (player.isUsingSpecial) player.expression = 'angry';
    else if (player.isShielding) player.expression = 'smirk';
    else if (player.invincible > 0 && player.health < 30) player.expression = 'hurt';
    else if (player.isShooting) player.expression = 'determined';
    else if (player.isMoving) {
      const enemyNear = enemies.some(e => e.active && 300 > Math.abs(e.x - player.x));
      player.expression = enemyNear ? 'angry' : 'determined';
    } else {
      player.expression = 'smirk';
    }

    // Physics — gravity, movement, platform collision
    const ts = timescaleRef.current;
    player.vy += 0.5 * ts;
    if (player.vy > 10 * ts) player.vy = 10 * ts;
    player.x += player.vx * ts;
    player.y += player.vy * ts;
    player.grounded = false;

    // Platform collision
    for (const plat of platforms) {
      const { px, py } = getPlatformPosition(plat);
      if (
        player.x + player.width > px + 4 &&
        player.x < px + plat.width - 4 &&
        player.y >= py - 4 &&
        player.y - player.vy * ts <= py + Math.max(10, Math.abs(player.vy) * ts + 8)
      ) {
        player.y = py;
        player.vy = 0;
        player.grounded = true;
        player.jumpCount = 0;
      }
    }

    // Level bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > level.width) player.x = level.width - player.width;
    if (player.y > level.height - 5) {
      if (!player.grounded) player.grounded = true;
      player.jumpCount = 0;
    }
    if (player.y > level.height + 100) {
      player.y = 460;
      player.vy = 0;
      player.vx = 0;
      player.x = 80;
    }

    // Animation
    if ((0 !== player.vx || !player.grounded)) {
      player.animTimer++;
      if (player.animTimer >= 3) {
        player.animTimer = 0;
        player.animFrame++;
      }
    }

    // Invincibility timer
    if (player.invincible > 0) player.invincible -= (IS_MOBILE ? 2 : 1);
  }, [initAudio]);

  // =======================================================================
  // Main game loop effect
  // (Original: the huge useEffect that sets up requestAnimationFrame)
  // =======================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    if (!ctx) return;

    // Canvas resize handler
    const handleResize = () => {
      const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      pixelRatioRef.current = dpr;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      isMobileNowRef.current = isMobileDevice();
      wasMobileRef.current = isMobileNowRef.current;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Auto-pause when hidden
        // gameStore.setGamePhase('settings');
      }
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    const handleOrientationChange = () => { setTimeout(handleResize, 100); };
    window.addEventListener('orientationchange', handleOrientationChange);

    // ===================================================================
    // MAIN GAME LOOP
    // ===================================================================
    const gameLoop = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(gameLoop);

      // Frame timing
      if (lastTimestampRef.current === 0) lastTimestampRef.current = timestamp;
      const elapsed = timestamp - lastTimestampRef.current;
      const targetFrameTime = isMobileNowRef.current ? FRAME_TIME : 1000 / 60;
      if (elapsed < targetFrameTime) return;

      lastTimestampRef.current = timestamp - (elapsed % targetFrameTime);
      if (isMobileNowRef.current && elapsed > 40 && !skipFrameRef.current) {
        skipFrameRef.current = true;
      }

      frameRef.current++;
      timescaleRef.current = isMobileNowRef.current ? 2 : 1;

      // Get game state
      // In real implementation: const state = gameStore.getState();
      const gamePhase = 'menu'; // placeholder
      const dpr = pixelRatioRef.current;
      const canvasW = canvas.width / dpr;
      const canvasH = canvas.height / dpr;
      const scaleY = canvasH / 600;
      const gameWidth = Math.ceil(canvasW / scaleY);

      // Mobile entity culling
      if (isMobileNowRef.current) {
        if (particlesRef.current.length > MAX_PARTICLES) {
          particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES);
        }
        if (bulletsRef.current.length > 20) {
          bulletsRef.current = bulletsRef.current.filter(b => b.active);
        }
        if (enemiesRef.current.length > 15) {
          enemiesRef.current = enemiesRef.current.filter(e => e.active);
        }
      }

      // Screen shake calculation
      let shakeX = 0;
      let shakeY = 0;
      if (screenShakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        screenShakeRef.current *= 0.9;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(shakeX, shakeY);
      ctx.imageSmoothingEnabled = false;

      // Render based on game phase
      switch (gamePhase) {
        case 'menu': {
          drawBackground(ctx, canvasW, canvasH, frameRef.current, bgParticlesRef.current);
          // Draw menu stickman in center
          ctx.save();
          const menuBob = 5 * Math.sin(0.03 * frameRef.current);
          ctx.globalAlpha = 0.12;
          drawStickman(ctx, canvasW / 2, canvasH / 2 + 40 + menuBob, 1, CYAN, frameRef.current, false, true, 1.2, 'smirk', false, false, 0, '');
          // Orbiting dots
          ctx.globalAlpha = 0.35;
          for (let i = 0; i < 8; i++) {
            const angle = i / 8 * Math.PI * 2 + 0.02 * frameRef.current;
            const dist = 55 + 10 * Math.sin(0.04 * frameRef.current + i);
            const dx = canvasW / 2 + Math.cos(angle) * dist;
            const dy = canvasH / 2 + 40 + menuBob + Math.sin(angle) * dist * 0.5;
            ctx.shadowBlur = 5;
            ctx.shadowColor = i % 2 === 0 ? CYAN : GREEN;
            ctx.fillStyle = i % 2 === 0 ? CYAN : GREEN;
            ctx.beginPath();
            ctx.arc(dx, dy, 2, 0, 2 * Math.PI);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          ctx.restore();
          break;
        }
        case 'playing': {
          // Main game rendering — scale to game coordinates
          ctx.save();
          ctx.scale(scaleY, scaleY);
          // renderGameWorld(ctx, gameWidth, 600); // Would be called here
          ctx.restore();
          // HUD overlays
          // drawHUD(ctx, canvasW, canvasH);
          break;
        }
        case 'settings': {
          // Dim the game world
          if (levelRef.current && player1Ref.current) {
            ctx.save();
            ctx.scale(scaleY, scaleY);
            // renderGameWorld(ctx, gameWidth, 600);
            ctx.restore();
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, 0, canvasW, canvasH);
          } else {
            drawCorruptedBackground(ctx, canvasW, canvasH, frameRef.current);
          }
          break;
        }
        case 'game-over':
        case 'skin-shop':
          drawCorruptedBackground(ctx, canvasW, canvasH, frameRef.current);
          break;
        case 'level-complete':
        case 'victory':
          drawVictoryBackground(ctx, canvasW, canvasH, frameRef.current);
          break;
        default:
          drawBackground(ctx, canvasW, canvasH, frameRef.current, bgParticlesRef.current);
          break;
      }

      ctx.restore();
    };

    // Start the loop
    requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // =======================================================================
  // Expose global controls for mobile touch overlay
  // (Original: window.__neonWarriorControls)
  // =======================================================================
  useEffect(() => {
    (window as any).__neonWarriorControls = {
      moveLeft: () => { keysRef.current.left = true; },
      moveRight: () => { keysRef.current.right = true; },
      stopMove: () => {
        keysRef.current.left = false;
        keysRef.current.right = false;
        keysRef.current.up = false;
        keysRef.current.shoot = false;
      },
      jump: () => {
        const player = player1Ref.current;
        if (player && player.jumpCount < player.maxJumps) {
          player.vy = -12;
          player.grounded = false;
          player.jumpCount++;
          spawnParticles(particlesRef.current, player.x + player.width / 2, player.y, 5, CYAN);
          initAudio();
        }
      },
      shoot: () => { keysRef.current.shoot = true; },
      stopShoot: () => { keysRef.current.shoot = false; },
      dash: () => {
        const player = player1Ref.current;
        if (!player || player.dashCooldown > 0 || player.isDashing) return;
        player.isDashing = true;
        player.dashTimer = 8;
        player.dashCooldown = 90;
        player.invincible = Math.max(player.invincible, 8);
        spawnParticles(particlesRef.current, player.x + player.width / 2, player.y - 25, 8, CYAN);
      },
      shield: () => {
        const player = player1Ref.current;
        if (!player || player.shieldCooldown > 0 || player.isShielding) return;
        player.isShielding = true;
        player.shieldTimer = 120;
        player.shieldCooldown = 300;
      },
      special: () => {
        const player = player1Ref.current;
        if (!player || player.specialCooldown > 0 || player.isUsingSpecial) return;
        player.isUsingSpecial = true;
        player.specialTimer = 30;
        player.specialCooldown = 360;
      },
      setJoystick: (j: any) => { joystickRef.current = j; },
      setP2Joystick: (j: any) => { p2JoystickRef.current = j; },
      executeSkill: (id: string) => { /* e8(id) */ },
      pause: () => { /* if playing, setGamePhase('settings') */ },
    };

    return () => {
      delete (window as any).__neonWarriorControls;
    };
  }, [initAudio]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
