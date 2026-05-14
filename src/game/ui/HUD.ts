/**
 * HUD.ts — Heads-Up Display drawn on the canvas during gameplay.
 *
 * Renders all in-game UI elements in screen space (not affected by camera):
 *   - Health bar (top-left): green/orange/red bar with neon glow
 *   - Score (top-right): neon-coloured text
 *   - Level name (top-centre): small muted text
 *   - Wave indicator (top-centre): "WAVE X/Y"
 *   - Dash/Skill cooldown indicators (bottom-left area)
 *
 * All coordinates are relative to the canvas top-left, no camera offset
 * is applied.
 */

import { Renderer } from '../engine/Renderer';

// ---------------------------------------------------------------------------
// drawHUD
// ---------------------------------------------------------------------------

/**
 * Draw the full heads-up display for a single frame.
 *
 * @param ctx              - The 2D canvas rendering context.
 * @param width            - Canvas width in pixels.
 * @param height           - Canvas height in pixels.
 * @param health           - Current player health.
 * @param maxHealth        - Maximum player health.
 * @param score            - Current score.
 * @param levelName        - Display name of the current level.
 * @param currentWave      - Current wave number (1-based).
 * @param totalWaves       - Total number of waves in this level.
 * @param dashCooldown     - Remaining dash cooldown in ms (0 = ready).
 * @param dashCooldownMax  - Total dash cooldown duration in ms.
 * @param skillCooldown    - Remaining skill cooldown in ms (0 = ready).
 * @param skillCooldownMax - Total skill cooldown duration in ms.
 */
export function drawHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  health: number,
  maxHealth: number,
  score: number,
  levelName: string,
  currentWave: number,
  totalWaves: number,
  dashCooldown: number,
  dashCooldownMax: number,
  skillCooldown: number,
  skillCooldownMax: number,
): void {
  ctx.save();

  // ── Health bar (top-left) ──────────────────────────────────────────────
  const barWidth = 120;
  const barHeight = 8;
  const barX = 16;
  const barY = 16;
  const healthPct = Math.max(0, health / maxHealth);

  // Colour transitions: green → orange → red as health drops
  const healthColor =
    healthPct > 0.5 ? '#00ff66' : healthPct > 0.25 ? '#ffaa00' : '#ff3333';

  // Background track
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Filled portion with neon glow
  Renderer.setGlow(ctx, healthColor, 8);
  ctx.fillStyle = healthColor;
  ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);
  Renderer.clearGlow(ctx);

  // Health text label below bar
  ctx.font = '8px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(
    `HP ${Math.ceil(health)}/${maxHealth}`,
    barX,
    barY + barHeight + 4,
  );

  // ── Score (top-right) ─────────────────────────────────────────────────
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = '10px monospace';
  ctx.fillStyle = '#00ff66';
  Renderer.setGlow(ctx, '#00ff66', 5);
  ctx.fillText(`SCORE ${score}`, width - 16, 16);
  Renderer.clearGlow(ctx);

  // ── Level name (top-centre) ───────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '8px monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText(levelName, width / 2, 12);

  // ── Wave indicator (top-centre, below level name) ─────────────────────
  ctx.fillText(`WAVE ${currentWave}/${totalWaves}`, width / 2, 24);

  // ── Dash cooldown (bottom-left area) ──────────────────────────────────
  const dashReady = dashCooldown <= 0;
  ctx.font = '7px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';

  if (dashReady) {
    ctx.fillStyle = '#cc00ff';
    Renderer.setGlow(ctx, '#cc00ff', 5);
    ctx.fillText('\u26A1 DASH READY', 16, height - 60);
    Renderer.clearGlow(ctx);
  } else {
    ctx.fillStyle = '#444444';
    ctx.fillText(
      `\u26A1 ${(dashCooldown / 1000).toFixed(1)}s`,
      16,
      height - 60,
    );
  }

  // ── Skill cooldown (bottom-left, below dash) ──────────────────────────
  const skillReady = skillCooldown <= 0;

  if (skillReady) {
    ctx.fillStyle = '#ff6600';
    Renderer.setGlow(ctx, '#ff6600', 5);
    ctx.fillText('\uD83D\uDD25 SKILL READY', 16, height - 48);
    Renderer.clearGlow(ctx);
  } else {
    ctx.fillStyle = '#444444';
    ctx.fillText(
      `\uD83D\uDD25 ${(skillCooldown / 1000).toFixed(1)}s`,
      16,
      height - 48,
    );
  }

  ctx.restore();
}
