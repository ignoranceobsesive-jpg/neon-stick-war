/**
 * AudioManager.ts — Web Audio API sound manager for game sound effects.
 *
 * Generates all sounds procedurally using oscillators and gain nodes —
 * no audio files required. This keeps the bundle small and avoids loading
 * delays on slow connections.
 *
 * ### Architecture
 *
 * ```
 * OscillatorNode → GainNode → sfxGain ──→ masterGain ──→ destination
 *                            → musicGain ─┘
 * ```
 *
 * - **masterGain**: Top-level volume control (all audio passes through here).
 * - **sfxGain**: Sound-effect volume (jump, dash, attack, etc.).
 * - **musicGain**: Music volume (reserved for future background music).
 *
 * ### Usage
 *
 * ```ts
 * import { audioManager } from './AudioManager';
 *
 * // Initialise on first user interaction (required by browsers)
 * audioManager.init();
 *
 * // Play sounds
 * audioManager.playJump();
 * audioManager.playAttack();
 *
 * // Adjust volumes (0.0 – 1.0)
 * audioManager.setMasterVolume(0.5);
 * audioManager.setSfxVolume(0.8);
 *
 * // Pause/resume when the app goes to background
 * audioManager.pauseAll();
 * audioManager.resumeAll();
 * ```
 *
 * ### Browser Autoplay Policy
 *
 * The Web Audio API requires a user gesture (click, tap, etc.) before
 * an `AudioContext` can be created. The `init()` method is idempotent
 * and safe to call multiple times — call it in response to the first
 * user interaction (e.g. a "Tap to Start" screen).
 */

// ---------------------------------------------------------------------------
// AudioManager class
// ---------------------------------------------------------------------------

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Volume levels (0.0 – 1.0)
  private musicVolume = 0.5;
  private sfxVolume = 0.8;
  private masterVolume = 0.7;

  // Whether init() has been called successfully
  private initialized = false;

  // -----------------------------------------------------------------------
  // Initialisation
  // -----------------------------------------------------------------------

  /**
   * Initialise the AudioContext and gain nodes.
   * Must be called after a user gesture (click/tap) due to browser autoplay
   * policies. Idempotent — safe to call multiple times.
   */
  init(): void {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();

      // Master gain → destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      // SFX gain → master
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      // Music gain → master
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.initialized = true;
    } catch {
      // AudioContext not available (e.g. server-side rendering, old browser).
      // Silently fail — the game works without sound.
    }
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  /** Ensure the AudioContext exists and is running. */
  private ensureCtx(): void {
    if (!this.initialized) this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play a single oscillator tone through the SFX channel.
   *
   * @param freq     Frequency in Hz.
   * @param duration Duration in seconds.
   * @param type     Oscillator type (sine, square, sawtooth, triangle).
   * @param volume   Peak volume (0.0 – 1.0, typically kept low ~0.05–0.1).
   */
  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.1,
  ): void {
    this.ensureCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.value = volume;
    // Exponential ramp to near-zero for a clean fade-out
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration,
    );

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // -----------------------------------------------------------------------
  // Sound effects
  // -----------------------------------------------------------------------

  /** Player jump — short rising blip. */
  playJump(): void {
    this.playTone(400, 0.1, 'sine', 0.08);
  }

  /** Player dash — low sawtooth burst. */
  playDash(): void {
    this.playTone(200, 0.15, 'sawtooth', 0.06);
  }

  /** Player basic attack — quick square wave click. */
  playAttack(): void {
    this.playTone(300, 0.05, 'square', 0.06);
  }

  /** Player or enemy takes damage — low sawtooth thud. */
  playHit(): void {
    this.playTone(150, 0.1, 'sawtooth', 0.08);
  }

  /** Enemy killed — two-tone chirp (square + sine). */
  playEnemyDeath(): void {
    this.playTone(500, 0.15, 'square', 0.06);
    this.playTone(800, 0.1, 'sine', 0.04);
  }

  /** Portal opens — ascending two-tone shimmer. */
  playPortalOpen(): void {
    this.playTone(600, 0.3, 'sine', 0.08);
    this.playTone(900, 0.2, 'sine', 0.06);
  }

  /** Level complete — ascending three-note melody (C5 → E5 → G5). */
  playLevelComplete(): void {
    this.playTone(523, 0.15, 'sine', 0.08);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.08), 150);
    setTimeout(() => this.playTone(784, 0.3, 'sine', 0.08), 300);
  }

  /** Game over — low descending sawtooth. */
  playGameOver(): void {
    this.playTone(200, 0.5, 'sawtooth', 0.08);
  }

  /** Coin/collectible pickup — high double-chirp. */
  playCoinCollect(): void {
    this.playTone(1200, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(1600, 0.08, 'sine', 0.08), 80);
  }

  /** Menu button click — quick high ping. */
  playMenuClick(): void {
    this.playTone(800, 0.03, 'sine', 0.05);
  }

  // -----------------------------------------------------------------------
  // Volume controls
  // -----------------------------------------------------------------------

  /** Set the master volume (affects all audio). Range: 0.0 – 1.0. */
  setMasterVolume(v: number): void {
    this.masterVolume = v;
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  /** Set the SFX volume. Range: 0.0 – 1.0. */
  setSfxVolume(v: number): void {
    this.sfxVolume = v;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  /** Set the music volume. Range: 0.0 – 1.0. */
  setMusicVolume(v: number): void {
    this.musicVolume = v;
    if (this.musicGain) this.musicGain.gain.value = v;
  }

  // -----------------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------------

  /** Pause all audio output (e.g. when the app goes to background). */
  pauseAll(): void {
    this.ctx?.suspend();
  }

  /** Resume audio output (e.g. when the app returns to foreground). */
  resumeAll(): void {
    this.ctx?.resume();
  }

  /** Permanently close the AudioContext and release resources. */
  destroy(): void {
    this.ctx?.close();
    this.initialized = false;
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

/**
 * Global AudioManager instance.
 *
 * Import this wherever you need to play sounds:
 * ```ts
 * import { audioManager } from '../systems/AudioManager';
 * audioManager.playJump();
 * ```
 */
export const audioManager = new AudioManager();
