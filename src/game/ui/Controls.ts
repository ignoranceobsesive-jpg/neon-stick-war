/**
 * Controls.ts — Virtual mobile touch controls drawn on the canvas.
 *
 * Defines touch-button data structures, a factory that positions buttons
 * relative to the canvas dimensions, a renderer that draws each button
 * as a semi-transparent rounded rectangle with label, and a hit-test
 * function that maps a touch coordinate to a button ID.
 *
 * Layout (from bottom of screen):
 *   - Bottom-left:  Left (◀) and Right (▶) arrows, side by side
 *   - Above arrows: Jump button (green, ▲)
 *   - Bottom-right: Attack button (red, ⚔)
 *   - Above attack: Skill button (purple, ✦)
 */

import { Renderer } from '../engine/Renderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single virtual touch button's state and geometry. */
export interface TouchButton {
  /** Unique identifier, e.g. 'left', 'right', 'jump', 'attack', 'skill'. */
  id: string;
  /** Top-left X position in canvas coordinates. */
  x: number;
  /** Top-left Y position in canvas coordinates. */
  y: number;
  /** Button width in pixels. */
  width: number;
  /** Button height in pixels. */
  height: number;
  /** Display label drawn inside the button. */
  label: string;
  /** Primary colour (fill and text). */
  color: string;
  /** Whether the button is currently being pressed (changes visual style). */
  pressed: boolean;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create and position all virtual touch buttons for the current canvas size.
 *
 * Buttons are placed relative to the bottom-left and bottom-right corners
 * so they stay usable on any screen dimensions.
 *
 * @param canvasWidth  - Current canvas width.
 * @param canvasHeight - Current canvas height.
 * @param scale        - Uniform size multiplier (default 1). Useful for
 *                       high-DPI screens or smaller devices.
 * @returns A Map keyed by button ID.
 */
export function createTouchButtons(
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1,
): Map<string, TouchButton> {
  const buttons = new Map<string, TouchButton>();

  const btnSize = 50 * scale;
  const smallBtn = 44 * scale;
  const margin = 16 * scale;
  const gap = 8 * scale;
  const bottom = canvasHeight - margin;

  // Left arrow — bottom-left corner
  buttons.set('left', {
    id: 'left',
    x: margin,
    y: bottom - btnSize,
    width: btnSize,
    height: btnSize,
    label: '\u25C0',
    color: '#00ff66',
    pressed: false,
  });

  // Right arrow — next to left arrow
  buttons.set('right', {
    id: 'right',
    x: margin + btnSize + gap,
    y: bottom - btnSize,
    width: btnSize,
    height: btnSize,
    label: '\u25B6',
    color: '#00ff66',
    pressed: false,
  });

  // Jump — centred above the two arrow buttons
  buttons.set('jump', {
    id: 'jump',
    x: margin + btnSize / 2,
    y: bottom - btnSize * 2 - gap,
    width: smallBtn,
    height: smallBtn,
    label: '\u25B2',
    color: '#00ff66',
    pressed: false,
  });

  // Attack — bottom-right corner
  buttons.set('attack', {
    id: 'attack',
    x: canvasWidth - margin - btnSize,
    y: bottom - btnSize,
    width: btnSize,
    height: btnSize,
    label: '\u2694',
    color: '#ff3333',
    pressed: false,
  });

  // Skill — above attack, offset slightly left
  buttons.set('skill', {
    id: 'skill',
    x: canvasWidth - margin - btnSize - 4 * scale,
    y: bottom - btnSize * 2 - gap,
    width: smallBtn,
    height: smallBtn,
    label: '\u2726',
    color: '#cc00ff',
    pressed: false,
  });

  return buttons;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Draw all virtual touch buttons onto the canvas.
 *
 * Each button is rendered as a semi-transparent rounded rectangle with a
 * centred label. When pressed, the button glows and becomes more opaque
 * to give visual feedback.
 *
 * @param ctx     - The 2D canvas rendering context.
 * @param buttons - Map of button ID → TouchButton state.
 */
export function drawTouchButtons(
  ctx: CanvasRenderingContext2D,
  buttons: Map<string, TouchButton>,
): void {
  for (const [, btn] of buttons) {
    ctx.save();

    // ── Button background (rounded rect) ──────────────────────────────
    ctx.globalAlpha = btn.pressed ? 0.4 : 0.15;
    ctx.fillStyle = btn.color;

    const r = 8; // corner radius
    drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, r);
    ctx.fill();

    // ── Glow border when pressed ──────────────────────────────────────
    if (btn.pressed) {
      Renderer.setGlow(ctx, btn.color, 15);
      ctx.strokeStyle = btn.color;
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, r);
      ctx.stroke();
      Renderer.clearGlow(ctx);
    }

    // ── Label ──────────────────────────────────────────────────────────
    ctx.globalAlpha = btn.pressed ? 1 : 0.6;
    ctx.fillStyle = btn.color;
    ctx.font = `bold ${Math.floor(btn.width * 0.4)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);

    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Hit testing
// ---------------------------------------------------------------------------

/**
 * Check whether a touch coordinate falls inside any button's hit-box.
 *
 * @param buttons - Map of button ID → TouchButton state.
 * @param tx      - Touch X in canvas coordinates.
 * @param ty      - Touch Y in canvas coordinates.
 * @returns The ID of the first matching button, or `null` if none hit.
 */
export function hitTestButtons(
  buttons: Map<string, TouchButton>,
  tx: number,
  ty: number,
): string | null {
  for (const [id, btn] of buttons) {
    if (
      tx >= btn.x &&
      tx <= btn.x + btn.width &&
      ty >= btn.y &&
      ty <= btn.y + btn.height
    ) {
      return id;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Trace a rounded-rectangle path (does NOT fill or stroke).
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param x      - Top-left X.
 * @param y      - Top-left Y.
 * @param w      - Width.
 * @param h      - Height.
 * @param radius - Corner radius in pixels.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
