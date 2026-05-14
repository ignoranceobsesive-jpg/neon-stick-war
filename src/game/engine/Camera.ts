/**
 * Camera module for NeonStickWar game engine.
 *
 * Provides a smooth-following camera that tracks a target position
 * (typically the player) and clamps its viewport within level bounds.
 * Uses linear interpolation for smooth movement on each frame.
 */

/**
 * A 2D camera that follows a target and constrains itself to level boundaries.
 *
 * @example
 * ```ts
 * const camera = new Camera(800, 600, 4000, 600);
 * // Inside the game loop:
 * camera.follow(player.x, player.y);
 * // When drawing world objects, offset by camera position:
 * const screenX = worldX - camera.x;
 * const screenY = worldY - camera.y;
 * ```
 */
export class Camera {
  /** Current horizontal offset of the camera viewport (top-left corner). */
  x: number = 0;

  /** Current vertical offset of the camera viewport (top-left corner). */
  y: number = 0;

  /** Width of the camera viewport in pixels (matches canvas width). */
  width: number;

  /** Height of the camera viewport in pixels (matches canvas height). */
  height: number;

  /** Total width of the current level in pixels. */
  levelWidth: number;

  /** Total height of the current level in pixels. */
  levelHeight: number;

  /**
   * Smoothing factor applied during follow interpolation.
   * Higher values = snappier following. Range: 0 (no movement) to 1 (instant).
   * @default 0.1
   */
  smoothing: number = 0.1;

  /**
   * Create a new Camera instance.
   *
   * @param canvasWidth  - Initial canvas/viewport width in pixels.
   * @param canvasHeight - Initial canvas/viewport height in pixels.
   * @param levelWidth   - Total width of the playable level in pixels.
   * @param levelHeight  - Total height of the playable level in pixels.
   */
  constructor(
    canvasWidth: number,
    canvasHeight: number,
    levelWidth: number,
    levelHeight: number
  ) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
  }

  /**
   * Smoothly move the camera toward a target position.
   *
   * The camera centers itself on the given world coordinates using linear
   * interpolation (lerp) for smooth following, then clamps so the viewport
   * never extends beyond level boundaries.
   *
   * @param targetX - World X coordinate to follow (e.g. player center).
   * @param targetY - World Y coordinate to follow (e.g. player center).
   */
  follow(targetX: number, targetY: number): void {
    // Desired camera position that would center the target in the viewport
    const targetCamX = targetX - this.width / 2;
    const targetCamY = targetY - this.height / 2;

    // Smooth interpolation toward the target
    this.x += (targetCamX - this.x) * this.smoothing;
    this.y += (targetCamY - this.y) * this.smoothing;

    // Clamp to level bounds so viewport never shows outside the level
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.height));
  }

  /**
   * Immediately snap the camera to center on a target (no smoothing).
   *
   * Useful for level transitions or initial positioning where smooth
   * interpolation would cause an unwanted pan.
   *
   * @param targetX - World X coordinate to center on.
   * @param targetY - World Y coordinate to center on.
   */
  snapTo(targetX: number, targetY: number): void {
    this.x = targetX - this.width / 2;
    this.y = targetY - this.height / 2;

    // Clamp to level bounds
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.height));
  }

  /**
   * Update the camera viewport dimensions.
   *
   * Call this when the canvas is resized so the camera knows its new
   * visible area. Also re-clamps the current position to the new bounds.
   *
   * @param width  - New viewport width in pixels.
   * @param height - New viewport height in pixels.
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // Re-clamp after resize in case the viewport is now larger than the level
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.height));
  }

  /**
   * Update the level boundary dimensions.
   *
   * Call this when loading a new level with different world dimensions.
   * Also re-clamps the current position to the new bounds.
   *
   * @param levelWidth  - New total level width in pixels.
   * @param levelHeight - New total level height in pixels.
   */
  setLevelBounds(levelWidth: number, levelHeight: number): void {
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;

    // Re-clamp in case the new level is smaller than the current viewport
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.height));
  }

  /**
   * Convert a world X coordinate to a screen X coordinate.
   *
   * @param worldX - X position in world space.
   * @returns X position relative to the camera viewport.
   */
  worldToScreenX(worldX: number): number {
    return worldX - this.x;
  }

  /**
   * Convert a world Y coordinate to a screen Y coordinate.
   *
   * @param worldY - Y position in world space.
   * @returns Y position relative to the camera viewport.
   */
  worldToScreenY(worldY: number): number {
    return worldY - this.y;
  }

  /**
   * Check whether a rectangular region in world space is visible
   * through this camera's viewport. Useful for culling off-screen objects.
   *
   * @param worldX      - Left edge of the region in world space.
   * @param worldY      - Top edge of the region in world space.
   * @param regionWidth  - Width of the region in pixels.
   * @param regionHeight - Height of the region in pixels.
   * @returns `true` if any part of the region overlaps the viewport.
   */
  isVisible(
    worldX: number,
    worldY: number,
    regionWidth: number,
    regionHeight: number
  ): boolean {
    return (
      worldX + regionWidth > this.x &&
      worldX < this.x + this.width &&
      worldY + regionHeight > this.y &&
      worldY < this.y + this.height
    );
  }
}
