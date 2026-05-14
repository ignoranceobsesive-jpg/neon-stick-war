/**
 * Screens.ts — Full-screen overlays for game state transitions.
 *
 * Provides canvas-drawn screens for each non-gameplay phase:
 *   - **Splash**: Animated neon title with "Tap anywhere to start"
 *   - **Menu**: Title, high-score stats, and a pulsing PLAY button
 *   - **Level Complete**: Gold celebration text with score summary
 *   - **Game Over**: Red game-over text with retry prompt
 *
 * Each function receives a `time` parameter (typically from
 * `performance.now()`) for deterministic animation effects so that
 * re-draws at the same time produce identical output.
 */

import { Renderer } from '../engine/Renderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Identifiers for the four full-screen overlay screens. */
export type ScreenType = 'splash' | 'menu' | 'levelComplete' | 'gameOver';

/** Bounding rectangle returned by screens that need click detection. */
export interface ScreenButton {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Rounded-rect helper (local to avoid cross-file coupling)
// ---------------------------------------------------------------------------

/**
 * Trace a rounded-rectangle path without filling or stroking.
 */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// Splash screen
// ---------------------------------------------------------------------------

/**
 * Draw the initial splash / title screen.
 *
 * Features a pulsing neon title and a blinking "Tap anywhere to start"
 * subtitle over a dark background.
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param width  - Canvas width.
 * @param height - Canvas height.
 * @param time   - Current animation timestamp (ms).
 */
export function drawSplashScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
): void {
  // Dark background
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, width, height);

  // Pulsing title opacity
  const pulse = 0.8 + 0.2 * Math.sin(time * 0.003);

  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00ffff';

  // Double-draw with glow for stronger neon effect
  Renderer.setGlow(ctx, '#00ffff', 20);
  ctx.fillText('NEON STICK WAR', width / 2, height / 2 - 30);
  Renderer.setGlow(ctx, '#00ffff', 10);
  ctx.fillText('NEON STICK WAR', width / 2, height / 2 - 30);
  Renderer.clearGlow(ctx);

  // Blinking subtitle
  ctx.font = '10px monospace';
  ctx.fillStyle = '#666666';
  ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time * 0.005);
  ctx.fillText('Tap anywhere to start', width / 2, height / 2 + 20);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Menu screen
// ---------------------------------------------------------------------------

/**
 * Draw the main menu screen with high-score stats and a PLAY button.
 *
 * Returns the bounding rectangle of the PLAY button so the caller can
 * perform click / tap detection.
 *
 * @param ctx          - The 2D canvas rendering context.
 * @param width        - Canvas width.
 * @param height       - Canvas height.
 * @param time         - Current animation timestamp (ms).
 * @param highScore    - Player's all-time high score.
 * @param highestLevel - Highest level reached.
 * @returns Object containing the PLAY button's bounding rectangle.
 */
export function drawMenuScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  highScore: number,
  highestLevel: number,
): { playBtn: ScreenButton } {
  // Dark background
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, width, height);

  // ── Background particles (simple floating dots) ─────────────────────
  ctx.save();
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 20; i++) {
    const px = (Math.sin(time * 0.001 + i * 1.3) * 0.5 + 0.5) * width;
    const py = (Math.cos(time * 0.0008 + i * 0.7) * 0.5 + 0.5) * height;
    ctx.fillStyle = i % 2 === 0 ? '#00ffff' : '#00ff66';
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.restore();

  // ── Title ────────────────────────────────────────────────────────────
  ctx.save();
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00ffff';
  Renderer.setGlow(ctx, '#00ffff', 15);
  ctx.fillText('NEON STICK WAR', width / 2, 60);
  Renderer.clearGlow(ctx);

  // ── Stats ────────────────────────────────────────────────────────────
  ctx.font = '10px monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText(`High Score: ${highScore}`, width / 2, 90);
  ctx.fillText(`Level: ${highestLevel}`, width / 2, 105);

  // ── PLAY button (with gentle hover animation) ────────────────────────
  const btnY = height / 2 - 20;
  const btnW = 180;
  const btnH = 44;
  const btnX = width / 2 - btnW / 2;
  const hover = Math.sin(time * 0.005) * 2;

  // Border
  ctx.strokeStyle = '#00ff66';
  Renderer.setGlow(ctx, '#00ff66', 10);
  ctx.lineWidth = 2;
  roundedRectPath(ctx, btnX, btnY + hover, btnW, btnH, 8);
  ctx.stroke();
  Renderer.clearGlow(ctx);

  // Label
  ctx.fillStyle = '#00ff66';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('\u25B6 PLAY', width / 2, btnY + btnH / 2 + hover);

  ctx.restore();

  return {
    playBtn: { x: btnX, y: btnY + hover, width: btnW, height: btnH },
  };
}

// ---------------------------------------------------------------------------
// Level Complete screen
// ---------------------------------------------------------------------------

/**
 * Draw the level-complete overlay with gold celebration text.
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param width  - Canvas width.
 * @param height - Canvas height.
 * @param score  - Final score for the completed level.
 * @param level  - Level number that was just cleared.
 */
export function drawLevelCompleteScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  score: number,
  level: number,
): void {
  // Semi-transparent overlay (game world still visible beneath)
  ctx.fillStyle = 'rgba(5,5,16,0.85)';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#ffd700';
  Renderer.setGlow(ctx, '#ffd700', 15);
  ctx.fillText('LEVEL COMPLETE!', width / 2, height / 2 - 40);
  Renderer.clearGlow(ctx);

  // Level & score details
  ctx.font = '12px monospace';
  ctx.fillStyle = '#00ff66';
  ctx.fillText(`Level ${level} Cleared`, width / 2, height / 2 - 10);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Score: ${score}`, width / 2, height / 2 + 15);

  // Continue prompt
  ctx.font = '10px monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText('Tap to continue', width / 2, height / 2 + 50);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Game Over screen
// ---------------------------------------------------------------------------

/**
 * Draw the game-over overlay with retry prompt.
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param width  - Canvas width.
 * @param height - Canvas height.
 * @param score  - Final score at time of death.
 * @param level  - Level number where the player died.
 */
export function drawGameOverScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  score: number,
  level: number,
): void {
  // Dark overlay
  ctx.fillStyle = 'rgba(5,5,16,0.9)';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#ff3333';
  Renderer.setGlow(ctx, '#ff3333', 15);
  ctx.fillText('GAME OVER', width / 2, height / 2 - 40);
  Renderer.clearGlow(ctx);

  // Score summary
  ctx.font = '12px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Level ${level} | Score: ${score}`, width / 2, height / 2);

  // Retry button
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#ff6600';
  Renderer.setGlow(ctx, '#ff6600', 8);
  ctx.fillText('\u25B6 RETRY', width / 2, height / 2 + 40);
  Renderer.clearGlow(ctx);

  // Retry prompt
  ctx.font = '10px monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText('Tap to retry', width / 2, height / 2 + 65);

  ctx.restore();
}
