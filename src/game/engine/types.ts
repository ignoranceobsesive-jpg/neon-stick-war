/**
 * Shared type definitions for the NeonStickWar game engine.
 *
 * These interfaces define the shape of game entities as they are
 * passed between the engine modules. The actual entity classes that
 * implement these interfaces will live in the `entities` module.
 */

// ---------------------------------------------------------------------------
// Game phase / state
// ---------------------------------------------------------------------------

/** All possible game phases driven by the engine state machine. */
export type GamePhase =
  | 'splash'
  | 'menu'
  | 'playing'
  | 'paused'
  | 'levelComplete'
  | 'gameOver';

// ---------------------------------------------------------------------------
// Platform
// ---------------------------------------------------------------------------

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  /** "static" for immovable platforms, "moving" for horizontally/vertically oscillating ones. */
  type: 'static' | 'moving';
  /** For moving platforms: the speed/direction of travel. */
  moveSpeed?: number;
  /** For moving platforms: maximum displacement from the origin. */
  moveRange?: number;
  /** Current movement offset (updated each frame for moving platforms). */
  moveOffset?: number;
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  grounded: boolean;
  facingRight: boolean;
  /** Walk cycle timer (0..2π), incremented while moving. */
  walkCycle: number;
  /** Whether the player is currently in an attack animation. */
  attacking: boolean;
  /** Frames remaining in the current attack animation. */
  attackTimer: number;
  
  // ---- Dash skill (BUG FIX: direction uses facingRight, not hardcoded) ----
  /** Whether the player is currently dashing. */
  isDashing: boolean;
  /** Remaining duration of the current dash (in frames). */
  dashTimer: number;
  /** Dash cooldown remaining (in ms-equivalent). */
  dashCooldown: number;
  /** Maximum dash cooldown (500ms). */
  dashCooldownMax: number;
  /** Dash movement speed. */
  dashSpeed: number;
  /** Dash duration in frames. */
  dashDuration: number;
  /** Which direction the dash is going: 1 = right, -1 = left.
   *  BUG FIX: This MUST be set from facingRight when dash activates. */
  dashDirection: number;
  
  // ---- Skill slot ----
  /** Generic skill cooldown remaining (in ms-equivalent). */
  skillCooldown: number;
  /** Maximum skill cooldown. */
  skillCooldownMax: number;
  /** Whether the skill is currently active. */
  skillActive: boolean;
  /** Frames remaining in the active skill. */
  skillTimer: number;
  
  // ---- Invincibility ----
  /** Invincibility frames remaining (prevents damage). */
  invincible: number;
}

// ---------------------------------------------------------------------------
// Enemy
// ---------------------------------------------------------------------------

export type EnemyType = 'drone' | 'soldier' | 'basic' | 'fast' | 'heavy' | 'boss' | 'miniBoss' | 'elite' | 'sniper';

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  type: EnemyType;
  grounded: boolean;
  facingRight: boolean;
  walkCycle: number;
  attacking: boolean;
  attackTimer: number;
  /** Attack cooldown remaining (in frames). */
  attackCooldown: number;
  /** Maximum attack cooldown between attacks (in frames). */
  attackCooldownMax: number;
  /** How close the player must be for the enemy to attack. */
  attackRange: number;
  /** Damage dealt per attack. */
  damage: number;
  /** Movement speed. */
  speed: number;
  /** Detection range for chasing the player. */
  sightRange: number;
  /** Score reward when killed. */
  reward: number;
}

// ---------------------------------------------------------------------------
// Portal
// ---------------------------------------------------------------------------

export interface Portal {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Whether all enemies are defeated and the portal is active. */
  active: boolean;
}

// ---------------------------------------------------------------------------
// Projectile
// ---------------------------------------------------------------------------

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  /** Remaining lifetime in frames. */
  life: number;
  /** Display color. */
  color: string;
  /** Who fired this projectile. */
  owner: 'player' | 'enemy';
  /** Damage on hit. */
  damage: number;
}

// ---------------------------------------------------------------------------
// Skin / cosmetics
// ---------------------------------------------------------------------------

export interface PlayerSkin {
  /** Primary body color (e.g. "#00ff66"). */
  bodyColor: string;
  /** Glow color, usually same as bodyColor but could differ. */
  glowColor: string;
  /** Optional secondary accent color. */
  accentColor?: string;
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

export type WeatherType =
  | 'none'
  | 'rain'
  | 'snow'
  | 'embers'
  | 'glitch'
  | 'voidParticles';

// ---------------------------------------------------------------------------
// Wave
// ---------------------------------------------------------------------------

export interface WaveConfig {
  enemies: Array<{ x: number; y: number; type: EnemyType }>;
}

// ---------------------------------------------------------------------------
// Biome
// ---------------------------------------------------------------------------

export interface BiomeTheme {
  name: string;
  skyColor: string;
  skyGradient: string[];
  groundColor: string;
  platformColor: string;
  platformGlow: string;
  particleColor: string;
  weatherType: WeatherType;
  ambientDescription: string;
}
