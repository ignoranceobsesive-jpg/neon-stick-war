/**
 * Renderer module for NeonStickWar game engine.
 *
 * Handles all canvas drawing operations with the signature neon glow
 * visual style. Every drawable entity type has a dedicated draw method
 * that applies glow (shadowBlur + shadowColor) for that distinctive
 * neon-stickman look.
 *
 * The renderer is stateless — it receives a CanvasRenderingContext2D
 * and the current game state, draws a single frame, and returns.
 */

import type {
  Platform,
  Player,
  PlayerSkin,
  Enemy,
  Portal,
  Projectile,
  WeatherType,
} from './types';
import type { Camera } from './Camera';

// ---------------------------------------------------------------------------
// Neon glow helpers
// ---------------------------------------------------------------------------

/**
 * Drawing utility class for the NeonStickWar game.
 *
 * All methods are static so the renderer can be used without instantiation,
 * but it is also exported as a class to match the engine architecture.
 */
export class Renderer {
  // -----------------------------------------------------------------------
  // Glow helpers
  // -----------------------------------------------------------------------

  /**
   * Enable neon glow on subsequent draw calls.
   *
   * @param ctx  - The 2D rendering context.
   * @param color - Glow color (any CSS color string).
   * @param blur  - Blur radius in pixels. Larger = more diffuse glow.
   */
  static setGlow(
    ctx: CanvasRenderingContext2D,
    color: string,
    blur: number = 10
  ): void {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }

  /**
   * Disable neon glow on subsequent draw calls.
   *
   * @param ctx - The 2D rendering context.
   */
  static clearGlow(ctx: CanvasRenderingContext2D): void {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // -----------------------------------------------------------------------
  // Background / clear
  // -----------------------------------------------------------------------

  /**
   * Clear the entire canvas and fill with a sky gradient.
   *
   * @param ctx         - The 2D rendering context.
   * @param width       - Canvas width.
   * @param height      - Canvas height.
   * @param skyColor    - Top color of the sky gradient.
   * @param skyGradient - Bottom color of the sky gradient.
   */
  clearCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    skyColor: string = '#050510',
    skyGradient: string = '#0a0a2e'
  ): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, skyColor);
    gradient.addColorStop(1, skyGradient);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // -----------------------------------------------------------------------
  // Platforms
  // -----------------------------------------------------------------------

  /**
   * Draw a platform with neon glow.
   *
   * @param ctx            - The 2D rendering context.
   * @param platform       - The platform data.
   * @param camera         - The active camera for viewport offset.
   * @param platformColor  - Fill color for the platform body.
   * @param platformGlow   - Glow color applied around the platform.
   */
  drawPlatform(
    ctx: CanvasRenderingContext2D,
    platform: Platform,
    camera: Camera,
    platformColor: string = '#00cc66',
    platformGlow: string = '#00ff88'
  ): void {
    const sx = platform.x - camera.x;
    const sy = platform.y - camera.y;

    // Skip if entirely off-screen
    if (sx + platform.width < 0 || sx > camera.width) return;
    if (sy + platform.height < 0 || sy > camera.height) return;

    ctx.save();
    Renderer.setGlow(ctx, platformGlow, 12);

    ctx.fillStyle = platformColor;
    ctx.fillRect(sx, sy, platform.width, platform.height);

    // Top highlight line
    ctx.strokeStyle = platformGlow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + platform.width, sy);
    ctx.stroke();

    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Player (stick figure)
  // -----------------------------------------------------------------------

  /**
   * Draw the player as a neon stick figure with glow.
   *
   * Anatomy:
   * - Head: circle at top
   * - Body: vertical line from neck to hip
   * - Arms: two lines from shoulder, animated during walk
   * - Legs: two lines from hip, animated during walk
   *
   * @param ctx    - The 2D rendering context.
   * @param player - Player entity data.
   * @param camera - Active camera.
   * @param skin   - Player skin / color scheme.
   */
  drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player,
    camera: Camera,
    skin: PlayerSkin
  ): void {
    const sx = player.x - camera.x;
    const sy = player.y - camera.y;

    // Skip if off-screen
    if (sx + player.width < -50 || sx > camera.width + 50) return;
    if (sy + player.height < -50 || sy > camera.height + 50) return;

    ctx.save();

    const color = skin.bodyColor;
    const glowColor = skin.glowColor;
    Renderer.setGlow(ctx, glowColor, 15);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Scale factor for the stick figure relative to entity hitbox
    const h = player.height;
    const headR = h * 0.12;
    const cx = sx + player.width / 2;
    const headCY = sy + headR + 2;
    const neckY = headCY + headR;
    const shoulderY = neckY + h * 0.05;
    const hipY = neckY + h * 0.4;
    const feetY = sy + h;

    // Direction multiplier for flipping arms/legs
    const dir = player.facingRight ? 1 : -1;

    // Walk animation swing (sinusoidal)
    const swing = Math.sin(player.walkCycle) * h * 0.15;
    const armSwing = Math.sin(player.walkCycle) * h * 0.12;

    // -- Head --
    ctx.beginPath();
    ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
    ctx.stroke();

    // -- Body --
    ctx.beginPath();
    ctx.moveTo(cx, neckY);
    ctx.lineTo(cx, hipY);
    ctx.stroke();

    // -- Arms --
    // Left arm
    const armLen = h * 0.22;
    ctx.beginPath();
    ctx.moveTo(cx, shoulderY);
    ctx.lineTo(cx - dir * armLen * 0.6, shoulderY + armLen + armSwing);
    ctx.stroke();

    // Right arm
    ctx.beginPath();
    ctx.moveTo(cx, shoulderY);
    ctx.lineTo(cx + dir * armLen * 0.6, shoulderY + armLen - armSwing);
    ctx.stroke();

    // -- Legs --
    const legLen = h * 0.28;
    // Left leg
    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(cx - legLen * 0.3 + swing * 0.5, feetY);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(cx + legLen * 0.3 - swing * 0.5, feetY);
    ctx.stroke();

    // -- Attack indicator --
    if (player.attacking && player.attackTimer > 0) {
      Renderer.setGlow(ctx, '#ff4444', 20);
      ctx.strokeStyle = 'rgba(255, 80, 80, 0.8)';
      ctx.lineWidth = 2;
      const atkX = cx + dir * (player.width * 0.6);
      const atkY = shoulderY + h * 0.1;
      ctx.beginPath();
      ctx.arc(atkX, atkY, h * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Enemy (stick figure)
  // -----------------------------------------------------------------------

  /**
   * Draw an enemy as a neon stick figure with red/orange glow.
   *
   * Size varies by type:
   * - drone:   small (0.7x)
   * - soldier: normal (1.0x)
   * - heavy:   large (1.4x)
   * - boss:    very large (2.0x)
   *
   * @param ctx   - The 2D rendering context.
   * @param enemy - Enemy entity data.
   * @param camera - Active camera.
   */
  drawEnemy(
    ctx: CanvasRenderingContext2D,
    enemy: Enemy,
    camera: Camera
  ): void {
    const sx = enemy.x - camera.x;
    const sy = enemy.y - camera.y;

    // Skip if off-screen
    if (sx + enemy.width < -50 || sx > camera.width + 50) return;
    if (sy + enemy.height < -50 || sy > camera.height + 50) return;

    ctx.save();

    // Color by enemy type
    let bodyColor: string;
    let glowColor: string;

    switch (enemy.type) {
      case 'drone':
        bodyColor = '#ff8844';
        glowColor = '#ff6600';
        break;
      case 'heavy':
        bodyColor = '#ff4444';
        glowColor = '#ff2200';
        break;
      case 'boss':
        bodyColor = '#ff0066';
        glowColor = '#ff0088';
        break;
      default: // soldier
        bodyColor = '#ff5555';
        glowColor = '#ff3333';
        break;
    }

    Renderer.setGlow(ctx, glowColor, 12);

    ctx.strokeStyle = bodyColor;
    ctx.fillStyle = bodyColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const h = enemy.height;
    const headR = h * 0.12;
    const cx = sx + enemy.width / 2;
    const headCY = sy + headR + 2;
    const neckY = headCY + headR;
    const shoulderY = neckY + h * 0.05;
    const hipY = neckY + h * 0.4;
    const feetY = sy + h;

    const dir = enemy.facingRight ? 1 : -1;
    const swing = Math.sin(enemy.walkCycle) * h * 0.15;
    const armSwing = Math.sin(enemy.walkCycle) * h * 0.12;

    // -- Head --
    ctx.beginPath();
    ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
    ctx.stroke();

    // -- Body --
    ctx.beginPath();
    ctx.moveTo(cx, neckY);
    ctx.lineTo(cx, hipY);
    ctx.stroke();

    // -- Arms --
    const armLen = h * 0.22;
    ctx.beginPath();
    ctx.moveTo(cx, shoulderY);
    ctx.lineTo(cx - dir * armLen * 0.6, shoulderY + armLen + armSwing);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, shoulderY);
    ctx.lineTo(cx + dir * armLen * 0.6, shoulderY + armLen - armSwing);
    ctx.stroke();

    // -- Legs --
    const legLen = h * 0.28;
    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(cx - legLen * 0.3 + swing * 0.5, feetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(cx + legLen * 0.3 - swing * 0.5, feetY);
    ctx.stroke();

    // -- Health bar (above head) --
    if (enemy.health < enemy.maxHealth) {
      Renderer.clearGlow(ctx);
      const barW = enemy.width * 0.8;
      const barH = 4;
      const barX = sx + (enemy.width - barW) / 2;
      const barY = sy - 10;
      const ratio = Math.max(0, enemy.health / enemy.maxHealth);

      ctx.fillStyle = 'rgba(60, 0, 0, 0.6)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = ratio > 0.5 ? '#ff8800' : '#ff2200';
      ctx.fillRect(barX, barY, barW * ratio, barH);
    }

    // -- Attack indicator --
    if (enemy.attacking && enemy.attackTimer > 0) {
      Renderer.setGlow(ctx, '#ff0000', 25);
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
      ctx.lineWidth = 2;
      const atkX = cx + dir * (enemy.width * 0.6);
      const atkY = shoulderY + h * 0.1;
      ctx.beginPath();
      ctx.arc(atkX, atkY, h * 0.22, 0, Math.PI * 2);
      ctx.stroke();
    }

    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Portal
  // -----------------------------------------------------------------------

  /**
   * Draw a portal with rotating ring effect and glow.
   *
   * The portal has multiple concentric rings that rotate at different
   * speeds, with particle-like decorations when active.
   *
   * @param ctx    - The 2D rendering context.
   * @param portal - Portal entity data.
   * @param camera - Active camera.
   * @param time   - Current animation time (typically from performance.now).
   */
  drawPortal(
    ctx: CanvasRenderingContext2D,
    portal: Portal,
    camera: Camera,
    time: number
  ): void {
    const sx = portal.x - camera.x;
    const sy = portal.y - camera.y;

    // Skip if off-screen (generous margin for glow)
    if (sx + portal.width < -80 || sx > camera.width + 80) return;
    if (sy + portal.height < -80 || sy > camera.height + 80) return;

    const cx = sx + portal.width / 2;
    const cy = sy + portal.height / 2;
    const baseRadius = Math.min(portal.width, portal.height) * 0.4;

    ctx.save();

    const portalColor = portal.active ? '#00ffcc' : '#444466';
    const glowIntensity = portal.active ? 30 : 8;

    Renderer.setGlow(ctx, portalColor, glowIntensity);

    if (portal.active) {
      // Outer rotating ring
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 3;
      const angle1 = time * 0.002;
      ctx.beginPath();
      ctx.ellipse(cx, cy, baseRadius * 1.2, baseRadius, angle1, 0, Math.PI * 2);
      ctx.stroke();

      // Inner counter-rotating ring
      ctx.strokeStyle = '#88ffee';
      ctx.lineWidth = 2;
      const angle2 = -time * 0.003;
      ctx.beginPath();
      ctx.ellipse(cx, cy, baseRadius * 0.8, baseRadius * 0.6, angle2, 0, Math.PI * 2);
      ctx.stroke();

      // Center glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.5);
      grad.addColorStop(0, 'rgba(0, 255, 200, 0.4)');
      grad.addColorStop(1, 'rgba(0, 255, 200, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Floating particles around portal
      for (let i = 0; i < 6; i++) {
        const pAngle = time * 0.004 + (i * Math.PI * 2) / 6;
        const px = cx + Math.cos(pAngle) * baseRadius * 1.3;
        const py = cy + Math.sin(pAngle) * baseRadius * 0.9;
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Inactive portal: dim rings
      ctx.strokeStyle = 'rgba(80, 80, 120, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, baseRadius * 1.1, baseRadius * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // "Locked" indicator
      ctx.fillStyle = 'rgba(100, 100, 140, 0.4)';
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Projectile
  // -----------------------------------------------------------------------

  /**
   * Draw a projectile (bullet, fireball, etc.) with glow trail.
   *
   * @param ctx        - The 2D rendering context.
   * @param projectile - Projectile entity data.
   * @param camera     - Active camera.
   * @param color      - Override color (uses projectile.color if not provided).
   */
  drawProjectile(
    ctx: CanvasRenderingContext2D,
    projectile: Projectile,
    camera: Camera,
    color?: string
  ): void {
    const sx = projectile.x - camera.x;
    const sy = projectile.y - camera.y;

    // Skip if off-screen
    if (sx + projectile.width < -10 || sx > camera.width + 10) return;
    if (sy + projectile.height < -10 || sy > camera.height + 10) return;

    const drawColor = color ?? projectile.color;

    ctx.save();
    Renderer.setGlow(ctx, drawColor, 12);

    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(
      sx + projectile.width / 2,
      sy + projectile.height / 2,
      Math.max(projectile.width, projectile.height) / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Short motion trail
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx + projectile.width / 2, sy + projectile.height / 2);
    ctx.lineTo(
      sx + projectile.width / 2 - projectile.vx * 3,
      sy + projectile.height / 2 - projectile.vy * 3
    );
    ctx.stroke();
    ctx.globalAlpha = 1;

    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // HUD
  // -----------------------------------------------------------------------

  /**
   * Draw the heads-up display (health bar, score, wave, level).
   *
   * Drawn in screen space — not affected by camera position.
   *
   * @param ctx    - The 2D rendering context.
   * @param width  - Canvas width.
   * @param height - Canvas height.
   * @param health - Current player health (0–maxHealth).
   * @param maxHealth - Maximum player health.
   * @param score  - Current score.
   * @param wave   - Current wave number.
   * @param level  - Current level number.
   */
  drawHUD(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    health: number,
    maxHealth: number,
    score: number,
    wave: number,
    level: number
  ): void {
    ctx.save();

    const pad = 16;
    const barW = 180;
    const barH = 14;
    const barX = pad;
    const barY = pad;
    const ratio = Math.max(0, health / maxHealth);

    // Health bar background
    ctx.fillStyle = 'rgba(30, 0, 0, 0.7)';
    ctx.fillRect(barX, barY, barW, barH);

    // Health bar fill
    const healthColor =
      ratio > 0.6 ? '#00ff66' : ratio > 0.3 ? '#ffaa00' : '#ff2222';
    Renderer.setGlow(ctx, healthColor, 8);
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barW * ratio, barH);
    Renderer.clearGlow(ctx);

    // Health bar border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Health text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`HP ${Math.ceil(health)}/${maxHealth}`, barX + 4, barY + 1);

    // Score (top-right)
    ctx.fillStyle = '#00ffcc';
    Renderer.setGlow(ctx, '#00ffcc', 6);
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE ${score}`, width - pad, pad);
    Renderer.clearGlow(ctx);

    // Wave & level (top-right, below score)
    ctx.fillStyle = '#aaaacc';
    ctx.font = '12px monospace';
    ctx.fillText(`WAVE ${wave}  |  LEVEL ${level}`, width - pad, pad + 22);

    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Weather effects
  // -----------------------------------------------------------------------

  /**
   * Draw a weather overlay effect across the full viewport.
   *
   * Supported types:
   * - `rain`        : diagonal blue streaks falling down
   * - `snow`        : slowly drifting white dots
   * - `embers`      : rising orange/red particles
   * - `glitch`      : random horizontal line artifacts
   * - `voidParticles`: dark purple floating motes
   *
   * @param ctx    - The 2D rendering context.
   * @param width  - Canvas width.
   * @param height - Canvas height.
   * @param type   - Which weather effect to render.
   * @param time   - Current animation time (for deterministic effects).
   */
  drawWeather(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    type: WeatherType,
    time: number
  ): void {
    if (type === 'none') return;

    ctx.save();

    switch (type) {
      case 'rain': {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = 1;
        const rainSeed = Math.floor(time / 16);
        for (let i = 0; i < 80; i++) {
          // Deterministic pseudo-random positions from seed + index
          const px =
            ((rainSeed * 7 + i * 137) % width);
          const py =
            ((rainSeed * 3 + i * 97) % (height + 40)) - 20;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - 4, py + 14);
          ctx.stroke();
        }
        break;
      }

      case 'snow': {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        const snowSeed = Math.floor(time / 50);
        for (let i = 0; i < 50; i++) {
          const px =
            ((snowSeed * 11 + i * 211) % width);
          const py =
            ((snowSeed * 5 + i * 173) % height);
          const size = 1.5 + (i % 3);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'embers': {
        const emberSeed = Math.floor(time / 30);
        for (let i = 0; i < 40; i++) {
          const px =
            ((emberSeed * 13 + i * 179) % width);
          const py = height - ((emberSeed * 7 + i * 131) % height);
          const alpha = 0.3 + (i % 5) * 0.12;
          ctx.fillStyle =
            i % 3 === 0
              ? `rgba(255, 100, 0, ${alpha})`
              : `rgba(255, 180, 0, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'glitch': {
        ctx.fillStyle = 'rgba(0, 255, 200, 0.06)';
        const glitchSeed = Math.floor(time / 80);
        for (let i = 0; i < 8; i++) {
          const gy =
            ((glitchSeed * 17 + i * 97) % height);
          const gw = 40 + ((glitchSeed * 3 + i * 41) % 200);
          const gx = ((glitchSeed * 11 + i * 67) % width) - gw / 2;
          ctx.fillRect(gx, gy, gw, 2);
        }
        break;
      }

      case 'voidParticles': {
        const voidSeed = Math.floor(time / 40);
        for (let i = 0; i < 30; i++) {
          const px =
            ((voidSeed * 19 + i * 157) % width);
          const py =
            ((voidSeed * 11 + i * 113) % height);
          const alpha = 0.15 + (i % 4) * 0.08;
          ctx.fillStyle = `rgba(120, 40, 200, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, 3 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
    }

    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Generic particle
  // -----------------------------------------------------------------------

  /**
   * Draw a single particle at the given world position.
   *
   * @param ctx   - The 2D rendering context.
   * @param x     - World X position.
   * @param y     - World Y position.
   * @param size  - Radius of the particle.
   * @param color - Fill color.
   * @param alpha - Opacity (0–1).
   * @param camera - Active camera for viewport offset.
   */
  drawParticle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    alpha: number,
    camera: Camera
  ): void {
    const sx = x - camera.x;
    const sy = y - camera.y;

    // Skip if off-screen
    if (sx < -size || sx > camera.width + size) return;
    if (sy < -size || sy > camera.height + size) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    Renderer.setGlow(ctx, color, 6);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
    Renderer.clearGlow(ctx);
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // Overlay screens
  // -----------------------------------------------------------------------

  /**
   * Draw a semi-transparent overlay (used for menus, pause, game-over).
   *
   * @param ctx    - The 2D rendering context.
   * @param width  - Canvas width.
   * @param height - Canvas height.
   * @param alpha  - Overlay opacity (0–1).
   */
  drawOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    alpha: number = 0.6
  ): void {
    ctx.save();
    ctx.fillStyle = `rgba(5, 5, 16, ${alpha})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  /**
   * Draw centered text with optional neon glow.
   *
   * @param ctx    - The 2D rendering context.
   * @param text   - String to draw.
   * @param y      - Y position for the text baseline.
   * @param width  - Canvas width (used to center).
   * @param color  - Text color.
   * @param fontSize - Font size in pixels.
   * @param glow   - Whether to apply neon glow.
   */
  drawCenteredText(
    ctx: CanvasRenderingContext2D,
    text: string,
    y: number,
    width: number,
    color: string = '#ffffff',
    fontSize: number = 24,
    glow: boolean = true
  ): void {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (glow) {
      Renderer.setGlow(ctx, color, 15);
    }

    ctx.fillText(text, width / 2, y);

    if (glow) {
      Renderer.clearGlow(ctx);
    }

    ctx.restore();
  }
}
