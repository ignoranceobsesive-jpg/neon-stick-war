/**
 * SoundManager - Procedural Web Audio API Sound Manager
 * 
 * Generates all game sounds procedurally using the Web Audio API.
 * No audio files are required - everything is synthesized in real-time.
 * Implements the Singleton pattern for global access.
 */

/** Sound settings stored in localStorage */
export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

/** Default sound settings */
const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  musicEnabled: true,
  sfxEnabled: true,
};

/** localStorage key for persisting sound settings */
const SOUND_SETTINGS_KEY = "neonStickman_sound_v1";

/**
 * SoundManager class - Procedural audio synthesis for the entire game.
 * Handles SFX, background music, boss music, and menu music
 * all generated through Web Audio API oscillators and noise buffers.
 */
class SoundManager {
  /** Web Audio API context */
  private ctx: AudioContext | null = null;

  /** Master gain node controlling overall volume */
  private masterGain: GainNode | null = null;

  /** SFX gain node for sound effects volume */
  private sfxGain: GainNode | null = null;

  /** Music gain node for music volume */
  private musicGain: GainNode | null = null;

  /** Whether background music is currently playing */
  private musicPlaying = false;

  /** Whether boss music is currently playing */
  private bossMusicPlaying = false;

  /** Whether menu music is currently playing */
  private menuMusicPlaying = false;

  /** Interval timer ID for background music loop */
  private musicInterval: ReturnType<typeof setInterval> | null = null;

  /** Interval timer ID for boss music loop */
  private bossMusicInterval: ReturnType<typeof setInterval> | null = null;

  /** Interval timer ID for menu music loop */
  private menuMusicInterval: ReturnType<typeof setInterval> | null = null;

  /** Pre-generated noise buffer for standard-length noise sounds */
  private noiseBuffer: AudioBuffer | null = null;

  /** Pre-generated shorter noise buffer for quick noise sounds */
  private shortNoiseBuffer: AudioBuffer | null = null;

  /** Timestamps of last played SFX per type, used for throttling */
  private lastSfxTime: Record<string, number> = {};

  /** Minimum milliseconds between same-type SFX plays */
  private readonly SFX_THROTTLE_MS = 50;

  /** Current count of active audio nodes */
  private activeNodeCount = 0;

  /** Maximum simultaneous active audio nodes */
  private readonly MAX_ACTIVE_NODES = 30;

  /** Timestamp of last AudioContext resume call */
  private lastResumeTime = 0;

  /** Minimum milliseconds between AudioContext resume attempts */
  private readonly RESUME_THROTTLE_MS = 500;

  /** Current master volume level (0-1) */
  private masterVolume = 0.7;

  /** Current SFX volume level (0-1) */
  private sfxVolume = 0.8;

  /** Current music volume level (0-1) */
  private musicVolume = 0.5;

  /** Whether music is enabled */
  private musicEnabled = true;

  /** Whether SFX is enabled */
  private sfxEnabled = true;

  /** Singleton instance */
  private static instance: SoundManager | null = null;

  private constructor() {}

  /**
   * Gets the singleton instance of SoundManager.
   * Creates one if it doesn't exist yet.
   */
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Initializes the Web Audio API context, gain nodes, and noise buffers.
   * Safe to call multiple times - only initializes once.
   */
  init(): void {
    if (this.ctx) return;

    try {
      this.ctx = new AudioContext();

      // Create master gain and connect to destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      // Create SFX gain connected to master
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      // Create music gain connected to master
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      // Pre-generate noise buffers at different lengths
      this.noiseBuffer = this.createNoiseBuffer(4410);
      this.shortNoiseBuffer = this.createNoiseBuffer(2205);
    } catch {
      // AudioContext not available (e.g., server-side rendering)
    }
  }

  /**
   * Creates a noise buffer of the specified sample length.
   * Each sample is a random value between -1 and 1 (white noise).
   * 
   * @param sampleCount - Number of audio samples to generate
   * @returns An AudioBuffer filled with white noise, or null if context unavailable
   */
  private createNoiseBuffer(sampleCount: number): AudioBuffer | null {
    if (!this.ctx) return null;

    const buffer = this.ctx.createBuffer(1, sampleCount, this.ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      channelData[i] = 2 * Math.random() - 1;
    }
    return buffer;
  }

  /**
   * Ensures the AudioContext is initialized and running.
   * Resumes a suspended context if needed, with throttling
   * to avoid excessive resume() calls.
   */
  private ensureContext(): void {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx?.state === "suspended") {
      const now = performance.now();
      if (now - this.lastResumeTime >= this.RESUME_THROTTLE_MS) {
        this.lastResumeTime = now;
        this.ctx!.resume();
      }
    }
  }

  /**
   * Checks if a sound effect of the given type can be played
   * based on throttle timing. Updates the last play time if allowed.
   * 
   * @param type - The SFX type identifier (e.g., "shoot", "hit")
   * @returns True if enough time has passed since last play of this type
   */
  canPlaySfx(type: string): boolean {
    const now = performance.now();
    if (now - (this.lastSfxTime[type] || 0) < this.SFX_THROTTLE_MS) {
      return false;
    }
    this.lastSfxTime[type] = now;
    return true;
  }

  /**
   * Sets the master volume level.
   * Updates the gain node and persists settings to localStorage.
   * 
   * @param volume - Volume level from 0 to 1
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
    this.saveSettings();
  }

  /**
   * Sets the SFX volume level.
   * Updates the gain node and persists settings to localStorage.
   * 
   * @param volume - Volume level from 0 to 1
   */
  setSfxVolume(volume: number): void {
    this.sfxVolume = volume;
    if (this.sfxGain) {
      this.sfxGain.gain.value = volume;
    }
    this.saveSettings();
  }

  /**
   * Sets the music volume level.
   * Updates the gain node and persists settings to localStorage.
   * 
   * @param volume - Volume level from 0 to 1
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = volume;
    if (this.musicGain) {
      this.musicGain.gain.value = volume;
    }
    this.saveSettings();
  }

  /**
   * Enables or disables music playback.
   * Starts music when enabled, stops when disabled.
   * 
   * @param enabled - Whether music should be enabled
   */
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (enabled) {
      if (this.ctx) this.startMusic();
    } else {
      this.stopMusic();
    }
    this.saveSettings();
  }

  /**
   * Enables or disables SFX playback.
   * 
   * @param enabled - Whether SFX should be enabled
   */
  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    this.saveSettings();
  }

  /**
   * Plays a synthesized tone using an oscillator.
   * Respects SFX enabled state and active node limit.
   * Automatically handles node cleanup on completion.
   * 
   * @param frequency - Starting frequency in Hz
   * @param duration - Duration in seconds
   * @param type - Oscillator type: "sine", "square", "sawtooth", or "triangle"
   * @param volume - Volume level (0-1), defaults to 0.3
   * @param endFrequency - Optional end frequency for pitch sweep (linear ramp)
   */
  playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "square",
    volume: number = 0.3,
    endFrequency?: number
  ): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    if (this.activeNodeCount >= this.MAX_ACTIVE_NODES) return;

    this.ensureContext();
    if (this.ctx.state !== "running") return;

    try {
      this.activeNodeCount++;

      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      if (endFrequency !== undefined) {
        oscillator.frequency.linearRampToValueAtTime(
          endFrequency,
          this.ctx.currentTime + duration
        );
      }

      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);

      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + duration);

      oscillator.onended = () => {
        this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
      };
    } catch {
      this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
    }
  }

  /**
   * Plays a synthesized noise burst using the pre-generated noise buffer.
   * Optionally applies a bandpass filter for tonal noise.
   * 
   * @param duration - Duration in seconds
   * @param volume - Volume level (0-1), defaults to 0.3
   * @param filterFrequency - Optional bandpass filter center frequency in Hz
   */
  playNoise(duration: number, volume: number = 0.3, filterFrequency?: number): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    if (this.activeNodeCount >= this.MAX_ACTIVE_NODES) return;

    this.ensureContext();
    if (this.ctx.state !== "running") return;

    try {
      this.activeNodeCount++;

      const source = this.ctx.createBufferSource();
      const buffer = this.noiseBuffer || this.shortNoiseBuffer;

      if (!buffer) {
        this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
        return;
      }

      source.buffer = buffer;

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration
      );

      if (filterFrequency) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = filterFrequency;
        filter.Q.value = 2;
        source.connect(filter);
        filter.connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      gainNode.connect(this.sfxGain);

      source.start(this.ctx.currentTime);
      source.stop(this.ctx.currentTime + duration);

      source.onended = () => {
        this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
      };
    } catch {
      this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
    }
  }

  /**
   * Plays a combined tone and noise sound simultaneously.
   * Useful for impact sounds that need both tonal and percussive elements.
   * 
   * @param frequency - Tone frequency in Hz
   * @param duration - Total duration in seconds
   * @param toneType - Oscillator type for the tone
   * @param toneVolume - Volume for the tone component
   * @param noiseVolume - Volume for the noise component
   * @param noiseDuration - Optional separate duration for the noise component
   */
  playToneNoise(
    frequency: number,
    duration: number,
    toneType: OscillatorType = "sine",
    toneVolume: number = 0.2,
    noiseVolume: number = 0.15,
    noiseDuration?: number
  ): void {
    this.playTone(frequency, duration, toneType, toneVolume);
    this.playNoise(noiseDuration ?? duration, noiseVolume);
  }

  // ==========================================
  // SFX Methods - Specific game sound effects
  // ==========================================

  /** Plays the player shoot sound - a descending square wave */
  playShoot(): void {
    if (this.canPlaySfx("shoot")) {
      this.playTone(800, 0.15, "square", 0.15, 400);
    }
  }

  /** Plays the dash sound - a short filtered noise burst */
  playDash(): void {
    if (this.canPlaySfx("dash")) {
      this.playNoise(0.15, 0.2, 2000);
    }
  }

  /** Plays the shield activate sound - layered sine tones with echo */
  playShield(): void {
    if (this.canPlaySfx("shield")) {
      this.playTone(220, 0.12, "sine", 0.12);
      this.playTone(330, 0.12, "sine", 0.1);
      setTimeout(() => {
        this.playTone(220, 0.1, "sine", 0.08);
        this.playTone(330, 0.1, "sine", 0.06);
      }, 120);
    }
  }

  /** Plays the special ability activation sound - ascending square sweep */
  playSpecial(): void {
    this.playTone(200, 0.3, "square", 0.15, 800);
  }

  /** Plays the hit impact sound - combined tone and noise */
  playHit(): void {
    if (this.canPlaySfx("hit")) {
      this.playToneNoise(100, 0.08, "sine", 0.12, 0.15, 0.06);
    }
  }

  /** Plays the explosion sound - deep noise with sub-bass tone */
  playExplosion(): void {
    if (this.canPlaySfx("explosion")) {
      this.playNoise(0.4, 0.25, 200);
      this.playTone(60, 0.4, "sine", 0.2, 20);
    }
  }

  /** Plays the jump sound - ascending sine sweep */
  playJump(): void {
    if (this.canPlaySfx("jump")) {
      this.playTone(300, 0.08, "sine", 0.12, 600);
    }
  }

  /** Plays the enemy death sound - descending square wave */
  playEnemyDeath(): void {
    if (this.canPlaySfx("enemyDeath")) {
      this.playTone(600, 0.15, "square", 0.1, 100);
    }
  }

  /** Plays the boss hit sound - sawtooth + filtered noise */
  playBossHit(): void {
    if (this.canPlaySfx("bossHit")) {
      this.playTone(80, 0.2, "sawtooth", 0.15, 40);
      this.playNoise(0.1, 0.15, 500);
    }
  }

  /** Plays the wave complete fanfare - ascending sine chord */
  playWaveComplete(): void {
    [440, 554, 659].forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.15, "sine", 0.15), 150 * index);
    });
  }

  /** Plays the level complete fanfare - ascending 4-note chord */
  playLevelComplete(): void {
    [440, 554, 659, 880].forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.2, "sine", 0.2), 150 * index);
    });
  }

  /** Plays the versus mode victory fanfare - 3-note ascending chord */
  playVersusVictory(): void {
    [523, 659, 784].forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.3, "sine", 0.12), 200 * index);
    });
  }

  /** Plays the game over sound - long descending sawtooth */
  playGameOver(): void {
    this.playTone(300, 0.8, "sawtooth", 0.15, 50);
  }

  /** Plays a short click feedback sound for menu interactions */
  playMenuClick(): void {
    this.playTone(1000, 0.04, "sine", 0.1);
  }

  /** Plays a very short hover feedback sound for menu items */
  playMenuHover(): void {
    this.playTone(600, 0.02, "sine", 0.06);
  }

  /** Plays the coin collection sound - two ascending sine pings */
  playCoinCollect(): void {
    if (this.canPlaySfx("coin")) {
      this.playTone(1200, 0.08, "sine", 0.1);
      setTimeout(() => this.playTone(1500, 0.08, "sine", 0.08), 40);
    }
  }

  /** Plays the ability ready notification sound - ascending sine sweep */
  playAbilityReady(): void {
    this.playTone(800, 0.12, "sine", 0.1, 1000);
  }

  /** Plays the player damage taken sound - noise burst + low tone */
  playDamage(): void {
    if (this.canPlaySfx("damage")) {
      this.playNoise(0.1, 0.15);
      this.playTone(80, 0.08, "sine", 0.12);
    }
  }

  /** Plays the pet shoot sound - high-pitched descending square wave */
  playPetShoot(): void {
    if (this.canPlaySfx("petShoot")) {
      this.playTone(1400, 0.06, "square", 0.08, 900);
    }
  }

  /** Plays the pet death sound - descending sine tones */
  playPetDeath(): void {
    this.playTone(500, 0.4, "sine", 0.12, 100);
    setTimeout(() => this.playTone(350, 0.2, "sine", 0.08, 150), 150);
  }

  /** Plays the pet respawn sound - ascending sine sweep */
  playPetRespawn(): void {
    this.playTone(400, 0.12, "sine", 0.1, 800);
  }

  /** Plays a dramatic moment sound - ascending 4-note chord */
  playDramaticMoment(): void {
    [220, 330, 440, 660].forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.25, "sine", 0.15), 80 * index);
    });
  }

  /** Plays the reinforcement arrival sound - 3-note ascending fanfare */
  playReinforcement(): void {
    this.playTone(440, 0.12, "sine", 0.15);
    setTimeout(() => this.playTone(554, 0.12, "sine", 0.12), 80);
    setTimeout(() => this.playTone(880, 0.2, "sine", 0.18), 160);
  }

  /** Plays the boss enrage sound - deep sawtooth + noise */
  playBossEnrage(): void {
    this.playTone(100, 0.4, "sawtooth", 0.2, 50);
    this.playNoise(0.2, 0.15, 300);
  }

  /** Plays the victory fanfare - 5-note ascending chord with harmonics and final chord */
  playVictoryFanfare(): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;

    [523, 659, 784, 1047, 1319].forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, "sine", 0.18);
        if (index < 3) {
          this.playTone(1.5 * freq, 0.25, "sine", 0.06);
        }
      }, 180 * index);
    });

    setTimeout(() => {
      this.playTone(523, 0.6, "sine", 0.12);
      this.playTone(659, 0.6, "sine", 0.1);
      this.playTone(784, 0.6, "sine", 0.1);
    }, 1000);
  }

  // ==========================================
  // Music Methods - Procedural background music
  // ==========================================

  /**
   * Starts the main gameplay background music loop.
   * Features a bass drum, hi-hat, snare, sawtooth bass,
   * square lead, and sine melody arranged in a 16-step pattern.
   * Does not start if another music type is already playing.
   */
  startMusic(): void {
    if (
      !this.musicEnabled ||
      this.musicPlaying ||
      this.bossMusicPlaying ||
      this.menuMusicPlaying ||
      !this.ctx ||
      !this.musicGain
    ) {
      return;
    }

    this.ensureContext();
    this.musicPlaying = true;

    /** Bass drum - sine sweep from 150Hz down to 30Hz */
    const playBassDrum = () => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(150, this.ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        30,
        this.ctx.currentTime + 0.12
      );
      gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.15
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.15);
    };

    /** Hi-hat - short high-pass filtered noise burst */
    const playHiHat = () => {
      if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
      const source = this.ctx.createBufferSource();
      source.buffer = this.shortNoiseBuffer;
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.04
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 8000;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      source.start(this.ctx.currentTime);
      source.stop(this.ctx.currentTime + 0.04);
    };

    /** Snare - bandpass filtered noise + triangle oscillator */
    const playSnare = () => {
      if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
      const source = this.ctx.createBufferSource();
      source.buffer = this.shortNoiseBuffer;
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.1
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 3000;
      filter.Q.value = 1;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      source.start(this.ctx.currentTime);
      source.stop(this.ctx.currentTime + 0.1);

      const oscillator = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 180;
      oscGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.06
      );
      oscillator.connect(oscGain);
      oscGain.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.06);
    };

    /** Sawtooth bass note with lowpass filter sweep */
    const playBassNote = (frequency: number, duration: number = 0.15) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        200,
        this.ctx.currentTime + duration
      );
      filter.Q.value = 5;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + duration);
    };

    /** Square wave lead note with lowpass filter */
    const playLeadNote = (frequency: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.1
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2500;
      filter.Q.value = 2;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.1);
    };

    /** Soft sine melody note */
    const playMelodyNote = (frequency: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.08
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.08);
    };

    // Musical patterns - 16-step sequences
    const bassPattern = [55, 55, 55, 65, 55, 55, 73, 55, 55, 55, 55, 65, 73, 73, 65, 55];
    const leadPattern = [330, 0, 392, 0, 440, 0, 392, 330, 330, 0, 0, 392, 440, 0, 392, 0];
    const melodyPattern = [220, 277, 330, 277, 220, 277, 330, 370, 220, 277, 330, 277, 370, 330, 277, 220];

    let step = 0;

    // BPM ~140 (0.428571s per beat at half-step interval)
    this.musicInterval = setInterval(() => {
      if (!this.musicPlaying) return;

      const currentStep = step % 16;

      // Bass drum on beats 0, 4, 8, 12
      if (currentStep === 0 || currentStep === 4 || currentStep === 8 || currentStep === 12) {
        playBassDrum();
      }

      // Snare on beats 4 and 12
      if (currentStep === 4 || currentStep === 12) {
        playSnare();
      }

      // Hi-hat on even steps
      if (currentStep % 2 === 0) {
        playHiHat();
      }

      // Bass note on every step with pattern variation
      if (currentStep % 2 === 0 || currentStep === 3 || currentStep === 7 || currentStep === 11 || currentStep === 15) {
        playBassNote(
          bassPattern[currentStep],
          currentStep % 4 === 0 ? 0.2 : 0.1
        );
      }

      // Lead on even steps when pattern has a note
      if (leadPattern[currentStep] > 0 && currentStep % 2 === 0) {
        playLeadNote(leadPattern[currentStep]);
      }

      // Melody on even steps
      if (currentStep % 2 === 0) {
        playMelodyNote(melodyPattern[currentStep]);
      }

      step++;
    }, (0.42857142857142855 * 1000) / 2);
  }

  /** Stops the main gameplay background music */
  stopMusic(): void {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  /**
   * Starts the menu background music loop.
   * Features ambient chord pads, bass notes, kick drum,
   * and a shimmering high tone. Uses a 16-step pattern at ~90 BPM.
   */
  startMenuMusic(): void {
    if (
      !this.musicEnabled ||
      this.menuMusicPlaying ||
      this.musicPlaying ||
      this.bossMusicPlaying ||
      !this.ctx ||
      !this.musicGain
    ) {
      return;
    }

    this.ensureContext();
    this.menuMusicPlaying = true;

    /** Ambient sine pad with slow attack and lowpass filter */
    const playPad = (frequency: number, duration: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3 * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 1;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + duration);
    };

    /** Triangle bass note with lowpass filter */
    const playBassNote = (frequency: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 250;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.4);
    };

    /** Kick drum - sine sweep from 100Hz down to 25Hz */
    const playKick = () => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(100, this.ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        25,
        this.ctx.currentTime + 0.15
      );
      gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.15
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.15);
    };

    // Chord progressions for 4 measure groups
    const chordProgressions = [
      [110, 165, 220], // Am
      [87, 131, 175],  // F
      [65, 98, 131],   // C
      [98, 147, 196],  // G
    ];
    const bassNotes = [55, 43, 65, 49];

    let step = 0;

    // ~90 BPM
    this.menuMusicInterval = setInterval(() => {
      if (!this.menuMusicPlaying) return;

      const currentStep = step % 16;

      // Kick on beats 0 and 8
      if (currentStep === 0 || currentStep === 8) {
        playKick();
      }

      // Bass on beats 0, 4, 8, 12
      if (currentStep === 0 || currentStep === 4 || currentStep === 8 || currentStep === 12) {
        playBassNote(bassNotes[Math.floor(currentStep / 4)]);
      }

      // Pad chord on beat 0 of each 4-step group
      if (currentStep === 0) {
        for (const freq of chordProgressions[Math.floor(step / 4) % 4]) {
          playPad(freq, 2.5);
        }
      }

      // Shimmering high tone on beats 2, 6, 10, 14
      if (currentStep === 2 || currentStep === 6 || currentStep === 10 || currentStep === 14) {
        if (!this.ctx || !this.musicGain) return;
        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 880 + 100 * Math.sin(0.1 * step);
        gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx.currentTime + 0.15
        );
        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);
        oscillator.start(this.ctx.currentTime);
        oscillator.stop(this.ctx.currentTime + 0.15);
      }

      step++;
    }, 0.6666666666666666 * 1000);
  }

  /** Stops the menu background music */
  stopMenuMusic(): void {
    this.menuMusicPlaying = false;
    if (this.menuMusicInterval) {
      clearInterval(this.menuMusicInterval);
      this.menuMusicInterval = null;
    }
  }

  /**
   * Starts the boss fight background music loop.
   * More intense than regular music with faster tempo,
   * heavier bass drum, aggressive snare, and distorted bass.
   * Uses an 8-step pattern at ~180 BPM.
   */
  startBossMusic(): void {
    if (
      !this.musicEnabled ||
      this.bossMusicPlaying ||
      !this.ctx ||
      !this.musicGain
    ) {
      return;
    }

    this.ensureContext();
    this.stopMusic();
    this.stopMenuMusic();
    this.bossMusicPlaying = true;

    /** Heavy bass drum - sine sweep from 200Hz down to 25Hz */
    const playBassDrum = () => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, this.ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        25,
        this.ctx.currentTime + 0.1
      );
      gainNode.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.12
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.12);
    };

    /** Aggressive hi-hat - very short high-pass noise */
    const playHiHat = () => {
      if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
      const source = this.ctx.createBufferSource();
      source.buffer = this.shortNoiseBuffer;
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.025
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 10000;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      source.start(this.ctx.currentTime);
      source.stop(this.ctx.currentTime + 0.025);
    };

    /** Distorted sawtooth bass with filter sweep */
    const playBassNote = (frequency: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.12
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        300,
        this.ctx.currentTime + 0.12
      );
      filter.Q.value = 4;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.12);
    };

    /** Square lead note with lowpass filter */
    const playLeadNote = (frequency: number) => {
      if (!this.ctx || !this.musicGain) return;
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.08
      );
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);
      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + 0.08);
    };

    // Boss music patterns - 8-step sequences
    const bassPattern = [41, 41, 49, 41, 55, 55, 49, 41];
    const leadPattern = [330, 0, 440, 0, 330, 0, 494, 440];

    let step = 0;

    // ~180 BPM (0.333s per beat)
    this.bossMusicInterval = setInterval(() => {
      if (!this.bossMusicPlaying) return;

      const currentStep = step % 8;

      // Bass drum on even beats
      if (currentStep === 0 || currentStep === 2 || currentStep === 4 || currentStep === 6) {
        playBassDrum();
      }

      // Hi-hat on every step
      playHiHat();

      // Bass on even steps
      if (currentStep % 2 === 0) {
        playBassNote(bassPattern[currentStep]);
      }

      // Lead on even steps when pattern has a note
      if (leadPattern[currentStep] > 0 && currentStep % 2 === 0) {
        playLeadNote(leadPattern[currentStep]);
      }

      step++;
    }, 0.3333333333333333 * 1000);
  }

  /** Stops the boss fight background music */
  stopBossMusic(): void {
    this.bossMusicPlaying = false;
    if (this.bossMusicInterval) {
      clearInterval(this.bossMusicInterval);
      this.bossMusicInterval = null;
    }
  }

  /** Returns whether boss music is currently playing */
  isBossMusicPlaying(): boolean {
    return this.bossMusicPlaying;
  }

  /** Stops all music (gameplay, boss, and menu) */
  stopAll(): void {
    this.stopMusic();
    this.stopBossMusic();
    this.stopMenuMusic();
  }

  /**
   * Saves current sound settings to localStorage.
   * Persists master volume, SFX volume, music volume, and enabled states.
   */
  saveSettings(): void {
    try {
      const settings: SoundSettings = {
        masterVolume: this.masterVolume,
        sfxVolume: this.sfxVolume,
        musicVolume: this.musicVolume,
        musicEnabled: this.musicEnabled,
        sfxEnabled: this.sfxEnabled,
      };
      localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // localStorage unavailable
    }
  }

  /**
   * Loads sound settings from localStorage.
   * Applies loaded settings to gain nodes and internal state.
   * Returns the loaded settings or defaults if unavailable.
   * 
   * @returns The current sound settings
   */
  loadSettings(): SoundSettings {
    try {
      const stored = localStorage.getItem(SOUND_SETTINGS_KEY);
      if (!stored) return { ...DEFAULT_SOUND_SETTINGS };

      const parsed = JSON.parse(stored);
      const settings: SoundSettings = {
        ...DEFAULT_SOUND_SETTINGS,
        ...parsed,
      };

      // Apply loaded settings to internal state
      this.masterVolume = settings.masterVolume;
      this.sfxVolume = settings.sfxVolume;
      this.musicVolume = settings.musicVolume;
      this.musicEnabled = settings.musicEnabled;
      this.sfxEnabled = settings.sfxEnabled;

      // Apply to gain nodes if initialized
      if (this.masterGain) {
        this.masterGain.gain.value = this.masterVolume;
      }
      if (this.sfxGain) {
        this.sfxGain.gain.value = this.sfxVolume;
      }
      if (this.musicGain) {
        this.musicGain.gain.value = this.musicVolume;
      }

      return settings;
    } catch {
      return { ...DEFAULT_SOUND_SETTINGS };
    }
  }
}

/** Exported singleton instance for global use */
export const soundManager = SoundManager.getInstance();

export default SoundManager;
