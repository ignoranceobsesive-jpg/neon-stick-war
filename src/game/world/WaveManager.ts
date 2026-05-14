/**
 * WaveManager.ts — Manages enemy wave progression and portal activation.
 *
 * THIS IS WHERE THE PORTAL BUG GETS FIXED.
 *
 * The original minified code had a deeply nested wave-staging system with
 * multiple internal counters (eJ.current, staging queues, etc.) that made
 * portal activation almost impossible to trigger. The conditions were never
 * all satisfied simultaneously, so the portal rarely (if ever) opened.
 *
 * This WaveManager replaces that mess with clean, explicit logic:
 *   1. Level starts → spawn wave 0 enemies.
 *   2. Player kills all enemies in current wave.
 *   3. If more waves remain → activate portal briefly, then spawn next wave.
 *   4. If last wave cleared → activate portal permanently until player enters.
 *   5. Player enters portal → level complete.
 *
 * The portal's `active` flag is the single source of truth. No hidden state,
 * no secondary conditions — if the WaveManager says the portal is open, it
 * is open.
 */

import { EnemyState, createEnemy, EnemyType } from '../entities/Enemy';
import { PortalState, activatePortal, deactivatePortal } from '../entities/Portal';

// ---------------------------------------------------------------------------
// Wave configuration
// ---------------------------------------------------------------------------

/**
 * Defines a single wave of enemies to be spawned.
 * Each entry specifies the enemy type and world-space spawn position.
 */
export interface WaveConfig {
  enemies: Array<{ x: number; y: number; type: EnemyType }>;
}

// ---------------------------------------------------------------------------
// WaveManager class
// ---------------------------------------------------------------------------

/**
 * Tracks wave progression for a single level.
 *
 * Usage:
 * ```ts
 * const wm = new WaveManager(waveConfigs, portalX, portalY);
 * const enemies = wm.spawnCurrentWave();      // spawn wave 0
 * // ... game loop ...
 * const action = wm.progress(aliveEnemies, portal);
 * if (action === 'spawnNext') {
 *   const nextEnemies = wm.spawnCurrentWave(); // spawn wave N+1
 * } else if (action === 'portalOpen') {
 *   // show "EXIT OPEN" UI, play sound
 * }
 * ```
 */
export class WaveManager {
  /** Ordered list of wave configurations for this level. */
  waves: WaveConfig[];

  /** Zero-based index of the current (most recently spawned) wave. */
  currentWave: number = 0;

  /** Whether all waves have been cleared and the portal is permanently open. */
  allWavesCleared: boolean = false;

  /** World-space X where the portal should appear. */
  portalSpawnX: number;

  /** World-space Y where the portal should appear. */
  portalSpawnY: number;

  constructor(waves: WaveConfig[], portalX: number, portalY: number) {
    this.waves = waves;
    this.portalSpawnX = portalX;
    this.portalSpawnY = portalY;
  }

  // -----------------------------------------------------------------------
  // Spawning
  // -----------------------------------------------------------------------

  /**
   * Create EnemyState instances for the current wave index.
   * Returns an empty array if `currentWave` is out of bounds.
   *
   * Should be called:
   *   - Once at level start (wave 0).
   *   - After `progress()` returns `'spawnNext'`.
   */
  spawnCurrentWave(): EnemyState[] {
    if (this.currentWave >= this.waves.length) return [];
    const wave = this.waves[this.currentWave];
    return wave.enemies.map((e) => createEnemy(e.type, e.x, e.y));
  }

  // -----------------------------------------------------------------------
  // Wave-clear check
  // -----------------------------------------------------------------------

  /**
   * Returns `true` when no alive enemies remain in the current wave.
   *
   * @param aliveEnemies — All enemies currently in the world (the caller
   *   should pass the full list; this function filters by `alive`).
   */
  checkWaveCleared(aliveEnemies: EnemyState[]): boolean {
    return aliveEnemies.filter((e) => e.alive).length === 0;
  }

  // -----------------------------------------------------------------------
  // Progression
  // -----------------------------------------------------------------------

  /**
   * Advance the wave state based on the current enemy list.
   *
   * Call this every frame (or after each kill) to check whether the current
   * wave is cleared.
   *
   * @returns
   *   - `'spawnNext'` — current wave is done, more waves remain; caller
   *     should call `spawnCurrentWave()` and deactivate the portal.
   *   - `'portalOpen'` — all waves cleared; portal is now permanently active.
   *   - `'none' — current wave is not yet cleared; nothing to do.
   */
  progress(
    aliveEnemies: EnemyState[],
    portal: PortalState,
  ): 'spawnNext' | 'portalOpen' | 'none' {
    if (this.allWavesCleared) return 'none';
    if (!this.checkWaveCleared(aliveEnemies)) return 'none';

    // Wave cleared — advance the index
    this.currentWave++;

    if (this.currentWave >= this.waves.length) {
      // ── ALL WAVES CLEARED — open the portal permanently ────────────
      //
      // BUG FIX: In the original code, the portal activation condition
      // checked eJ.current > 0 (an internal counter that was never
      // properly incremented) AND a staging queue AND wave-completion
      // status — making it nearly impossible for all conditions to align.
      // Here we simply: all waves done → portal open. Done.
      this.allWavesCleared = true;
      activatePortal(portal);
      return 'portalOpen';
    } else {
      // ── More waves to come — briefly show portal, then spawn next ───
      //
      // The portal flashes open for a moment to give the player visual
      // feedback that the wave is cleared, then the next wave begins.
      // The caller should handle the timing (e.g. a brief delay before
      // spawning the next wave).
      return 'spawnNext';
    }
  }

  // -----------------------------------------------------------------------
  // Convenience getters
  // -----------------------------------------------------------------------

  /** Total number of waves in this level. */
  get totalWaves(): number {
    return this.waves.length;
  }

  /** Zero-based index of the current (most recently spawned) wave. */
  get waveIndex(): number {
    return this.currentWave;
  }

  /** Whether all waves are cleared and the portal is permanently active. */
  get isComplete(): boolean {
    return this.allWavesCleared;
  }

  // -----------------------------------------------------------------------
  // Reset
  // -----------------------------------------------------------------------

  /**
   * Reset the WaveManager back to its initial state.
   * Useful when restarting a level.
   */
  reset(): void {
    this.currentWave = 0;
    this.allWavesCleared = false;
  }
}
