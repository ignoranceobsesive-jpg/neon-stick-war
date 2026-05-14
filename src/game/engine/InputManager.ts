/**
 * InputManager module for NeonStickWar game engine.
 *
 * Handles both keyboard (desktop) and touch (mobile) input for the game.
 * On mobile, virtual control buttons are rendered directly on the canvas
 * and tracked via pointer events for multi-touch support.
 *
 * Mobile layout (from original game):
 * - Left side:  D-pad (left/right arrows) + Jump button (green, above d-pad)
 * - Right side: Attack button (red) + Skill button (purple, above attack)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Describes a virtual touch button rendered on the canvas.
 */
export interface TouchButton {
  /** X position of the button's top-left corner (canvas pixels). */
  x: number;
  /** Y position of the button's top-left corner (canvas pixels). */
  y: number;
  /** Width of the button in pixels. */
  width: number;
  /** Height of the button in pixels. */
  height: number;
  /** Display label drawn on the button. */
  label: string;
  /** Fill color when the button is not pressed. */
  color: string;
  /** Fill color when the button is currently pressed. */
  activeColor: string;
  /** Whether the button is currently being held down. */
  pressed: boolean;
}

/** Button identifiers used as keys in the touch button map. */
type ButtonId = 'left' | 'right' | 'jump' | 'attack' | 'skill';

// ---------------------------------------------------------------------------
// InputManager
// ---------------------------------------------------------------------------

/**
 * Unified input handler for keyboard and touch controls.
 *
 * On desktop, arrow keys / WASD / space / Z / X are mapped to game actions.
 * On mobile (detected via touch support), virtual buttons are rendered on the
 * canvas and tracked through pointer events.
 *
 * @example
 * ```ts
 * const input = new InputManager();
 * input.bindCanvas(canvasElement);
 *
 * // Inside game update:
 * if (input.isLeft())  player.moveLeft();
 * if (input.isJump())  player.jump();
 * if (input.isAttack()) player.attack();
 *
 * // Inside game render (draws mobile controls):
 * input.renderButtons(ctx, canvas.width, canvas.height);
 * ```
 */
export class InputManager {
  /** Set of currently-held keyboard key strings. */
  private keys: Set<string> = new Set();

  /** Map of button IDs to their TouchButton definitions. */
  private touchButtons: Map<ButtonId, TouchButton> = new Map();

  /**
   * Map from active pointer IDs to the button ID they are currently pressing.
   * This enables proper multi-touch handling (e.g. move + jump simultaneously).
   */
  private activeTouches: Map<number, ButtonId> = new Map();

  /** Whether the device supports touch input. */
  private isMobile: boolean;

  /** Reference to the bound canvas element. */
  private canvas: HTMLCanvasElement | null = null;

  /** Bound keyboard event handlers (stored for cleanup). */
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  /** Bound pointer event handlers (stored for cleanup). */
  private boundPointerDown: (e: PointerEvent) => void;
  private boundPointerMove: (e: PointerEvent) => void;
  private boundPointerUp: (e: PointerEvent) => void;
  private boundPointerCancel: (e: PointerEvent) => void;

  /** Whether touch event listeners have been set up. */
  private touchSetup: boolean = false;

  // -------------------------------------------------------------------------
  // Construction & lifecycle
  // -------------------------------------------------------------------------

  constructor() {
    this.isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Pre-bind handlers so we can remove them later
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);
    this.boundPointerCancel = this.handlePointerCancel.bind(this);

    this.setupKeyboard();
  }

  /**
   * Bind the input manager to a canvas element.
   *
   * On mobile, this also sets up pointer event listeners and initializes
   * the virtual button layout.
   *
   * @param canvas - The game canvas element to bind to.
   */
  bindCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;

    if (this.isMobile && !this.touchSetup) {
      this.setupTouch(canvas);
      this.touchSetup = true;
    }
  }

  // -------------------------------------------------------------------------
  // Keyboard
  // -------------------------------------------------------------------------

  /**
   * Register global keyboard event listeners.
   */
  private setupKeyboard(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
  }

  /**
   * Handle keydown events — add the key to the active set.
   */
  private handleKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.key);

    // Prevent default for game keys to avoid scrolling the page
    const gameKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      ' ', 'w', 'a', 's', 'd', 'z', 'Z', 'x', 'X',
    ];
    if (gameKeys.includes(e.key)) {
      e.preventDefault();
    }
  }

  /**
   * Handle keyup events — remove the key from the active set.
   */
  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key);
  }

  // -------------------------------------------------------------------------
  // Touch / Pointer
  // -------------------------------------------------------------------------

  /**
   * Set up pointer event listeners on the canvas for mobile touch controls.
   * Uses Pointer Events API for unified mouse/pen/touch handling.
   */
  private setupTouch(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', this.boundPointerDown);
    canvas.addEventListener('pointermove', this.boundPointerMove);
    canvas.addEventListener('pointerup', this.boundPointerUp);
    canvas.addEventListener('pointercancel', this.boundPointerCancel);

    // Prevent default touch behaviors (scrolling, zooming) on the canvas
    canvas.style.touchAction = 'none';
  }

  /**
   * Handle pointer down — check if the touch hits a virtual button.
   */
  private handlePointerDown(e: PointerEvent): void {
    const buttonId = this.hitTestButton(e.offsetX, e.offsetY);
    if (buttonId) {
      this.activeTouches.set(e.pointerId, buttonId);
      const btn = this.touchButtons.get(buttonId);
      if (btn) btn.pressed = true;
    }
  }

  /**
   * Handle pointer move — update button state if the pointer slides
   * onto or off a virtual button.
   */
  private handlePointerMove(e: PointerEvent): void {
    const currentButton = this.activeTouches.get(e.pointerId);

    // Check what button the pointer is currently over
    const hitButton = this.hitTestButton(e.offsetX, e.offsetY);

    if (currentButton && currentButton !== hitButton) {
      // Pointer slid off its current button
      const btn = this.touchButtons.get(currentButton);
      if (btn) btn.pressed = false;

      // Release from map; if it slid onto a new button, the next
      // pointerdown or move will pick it up.
      this.activeTouches.delete(e.pointerId);
    }
  }

  /**
   * Handle pointer up — release the button associated with this pointer.
   */
  private handlePointerUp(e: PointerEvent): void {
    const buttonId = this.activeTouches.get(e.pointerId);
    if (buttonId) {
      const btn = this.touchButtons.get(buttonId);
      if (btn) btn.pressed = false;
      this.activeTouches.delete(e.pointerId);
    }
  }

  /**
   * Handle pointer cancel (same as up).
   */
  private handlePointerCancel(e: PointerEvent): void {
    this.handlePointerUp(e);
  }

  /**
   * Test whether a screen-space coordinate falls within any virtual button.
   *
   * @param screenX - X position relative to the canvas.
   * @param screenY - Y position relative to the canvas.
   * @returns The button ID if a hit is detected, or `null` otherwise.
   */
  private hitTestButton(screenX: number, screenY: number): ButtonId | null {
    for (const [id, btn] of this.touchButtons) {
      if (
        screenX >= btn.x &&
        screenX <= btn.x + btn.width &&
        screenY >= btn.y &&
        screenY <= btn.y + btn.height
      ) {
        return id;
      }
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // Public query API
  // -------------------------------------------------------------------------

  /**
   * Whether the player is pressing "move left".
   * Keyboard: ArrowLeft or A.  Touch: left d-pad button.
   */
  isLeft(): boolean {
    return (
      this.keys.has('ArrowLeft') ||
      this.keys.has('a') ||
      this.isButtonPressed('left')
    );
  }

  /**
   * Whether the player is pressing "move right".
   * Keyboard: ArrowRight or D.  Touch: right d-pad button.
   */
  isRight(): boolean {
    return (
      this.keys.has('ArrowRight') ||
      this.keys.has('d') ||
      this.isButtonPressed('right')
    );
  }

  /**
   * Whether the player is pressing "jump".
   * Keyboard: ArrowUp, W, or Space.  Touch: jump button.
   */
  isJump(): boolean {
    return (
      this.keys.has('ArrowUp') ||
      this.keys.has('w') ||
      this.keys.has(' ') ||
      this.isButtonPressed('jump')
    );
  }

  /**
   * Whether the player is pressing "attack".
   * Keyboard: Z.  Touch: attack button.
   */
  isAttack(): boolean {
    return (
      this.keys.has('z') ||
      this.keys.has('Z') ||
      this.isButtonPressed('attack')
    );
  }

  /**
   * Whether the player is pressing "skill".
   * Keyboard: X.  Touch: skill button.
   */
  isSkill(): boolean {
    return (
      this.keys.has('x') ||
      this.keys.has('X') ||
      this.isButtonPressed('skill')
    );
  }

  /**
   * Check if a specific virtual button is currently pressed.
   */
  private isButtonPressed(id: ButtonId): boolean {
    const btn = this.touchButtons.get(id);
    return btn?.pressed ?? false;
  }

  /**
   * Get the position of the first active touch on the canvas.
   * Returns null if no touches are active.
   *
   * Useful for aiming or other position-dependent actions.
   */
  getTouchPosition(): { x: number; y: number } | null {
    // If we have active touches, return the first one's position
    // (This is a simplified version; a more complete implementation
    // would track pointer positions separately.)
    if (this.activeTouches.size === 0) return null;
    return null; // Position tracking can be enhanced later
  }

  // -------------------------------------------------------------------------
  // Virtual button layout & rendering
  // -------------------------------------------------------------------------

  /**
   * Recalculate the virtual button positions based on canvas dimensions.
   *
   * Layout (proportional to canvas size):
   * ```
   *  LEFT SIDE                    RIGHT SIDE
   *  ┌──────┐                     ┌──────┐
   *  │ JUMP │ (green)             │SKILL │ (purple)
   *  └──────┘                     └──────┘
   *  ┌──┐ ┌──┐                    ┌──────┐
   *  │◄│ │►│                     │ATK   │ (red)
   *  └──┘ └──┘                    └──────┘
   * ```
   */
  updateButtonLayout(canvasWidth: number, canvasHeight: number): void {
    const unit = Math.min(canvasWidth / 12, canvasHeight / 8);
    const pad = unit * 0.5;

    // D-pad left/right buttons (bottom-left area)
    const dpadW = unit * 1.8;
    const dpadH = unit * 1.8;
    const dpadY = canvasHeight - dpadH - pad * 2;

    this.touchButtons.set('left', {
      x: pad,
      y: dpadY,
      width: dpadW,
      height: dpadH,
      label: '◄',
      color: 'rgba(0, 255, 100, 0.25)',
      activeColor: 'rgba(0, 255, 100, 0.55)',
      pressed: false,
    });

    this.touchButtons.set('right', {
      x: pad + dpadW + pad * 0.5,
      y: dpadY,
      width: dpadW,
      height: dpadH,
      label: '►',
      color: 'rgba(0, 255, 100, 0.25)',
      activeColor: 'rgba(0, 255, 100, 0.55)',
      pressed: false,
    });

    // Jump button (above the d-pad)
    const jumpSize = unit * 2;
    this.touchButtons.set('jump', {
      x: pad + dpadW * 0.25,
      y: dpadY - jumpSize - pad,
      width: jumpSize,
      height: jumpSize,
      label: '▲',
      color: 'rgba(0, 255, 100, 0.3)',
      activeColor: 'rgba(0, 255, 100, 0.6)',
      pressed: false,
    });

    // Attack button (bottom-right area)
    const atkSize = unit * 2.4;
    this.touchButtons.set('attack', {
      x: canvasWidth - atkSize - pad * 2,
      y: canvasHeight - atkSize - pad * 2,
      width: atkSize,
      height: atkSize,
      label: 'ATK',
      color: 'rgba(255, 60, 60, 0.3)',
      activeColor: 'rgba(255, 60, 60, 0.6)',
      pressed: false,
    });

    // Skill button (above attack)
    const skillSize = unit * 2;
    this.touchButtons.set('skill', {
      x: canvasWidth - skillSize - pad * 2,
      y: canvasHeight - atkSize - pad * 2 - skillSize - pad,
      width: skillSize,
      height: skillSize,
      label: 'SKL',
      color: 'rgba(180, 60, 255, 0.3)',
      activeColor: 'rgba(180, 60, 255, 0.6)',
      pressed: false,
    });
  }

  /**
   * Draw the virtual control buttons on the canvas.
   *
   * Only renders on mobile devices. Call this after drawing the game world
   * so the buttons appear on top.
   *
   * @param ctx         - The 2D rendering context.
   * @param canvasWidth  - Current canvas width (used to position buttons).
   * @param canvasHeight - Current canvas height (used to position buttons).
   */
  renderButtons(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (!this.isMobile) return;

    // Update layout before rendering (handles resize)
    this.updateButtonLayout(canvasWidth, canvasHeight);

    ctx.save();

    for (const [, btn] of this.touchButtons) {
      const fillColor = btn.pressed ? btn.activeColor : btn.color;

      // Button background
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      const r = 8; // border radius
      this.roundRect(ctx, btn.x, btn.y, btn.width, btn.height, r);
      ctx.fill();

      // Button border
      ctx.strokeStyle = btn.pressed
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      this.roundRect(ctx, btn.x, btn.y, btn.width, btn.height, r);
      ctx.stroke();

      // Button label
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, btn.width * 0.3)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
    }

    ctx.restore();
  }

  /**
   * Draw a rounded rectangle path (helper).
   */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // -------------------------------------------------------------------------
  // Reset & cleanup
  // -------------------------------------------------------------------------

  /**
   * Reset all input state.
   *
   * Call this when the game is paused or the window loses focus to prevent
   * "sticky" inputs from keys held during a blur event.
   */
  reset(): void {
    this.keys.clear();
    this.activeTouches.clear();

    for (const [, btn] of this.touchButtons) {
      btn.pressed = false;
    }
  }

  /**
   * Remove all event listeners and clean up.
   *
   * Call this when the game engine is destroyed or the component unmounts.
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundKeyDown);
      window.removeEventListener('keyup', this.boundKeyUp);
    }

    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.boundPointerDown);
      this.canvas.removeEventListener('pointermove', this.boundPointerMove);
      this.canvas.removeEventListener('pointerup', this.boundPointerUp);
      this.canvas.removeEventListener('pointercancel', this.boundPointerCancel);
    }

    this.reset();
    this.canvas = null;
    this.touchSetup = false;
  }
}
