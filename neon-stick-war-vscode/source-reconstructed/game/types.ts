// =============================================================================
// NEON STICK WAR - Comprehensive TypeScript Type Definitions
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js
// These types represent all game data structures found in the source bundle.
// =============================================================================

// ---------------------------------------------------------------------------
// Core geometry types
// ---------------------------------------------------------------------------
export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Player entity
// ---------------------------------------------------------------------------
export interface PlayerEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  facing: 1 | -1;
  grounded: boolean;
  shootCooldown: number;
  animFrame: number;
  animTimer: number;
  invincible: number;
  expression: 'angry' | 'smirk' | 'determined' | 'hurt' | 'victory' | 'neutral';
  isMoving: boolean;
  isShooting: boolean;
  shootTimer: number;
  dashCooldown: number;
  dashTimer: number;
  isDashing: boolean;
  shieldCooldown: number;
  shieldTimer: number;
  isShielding: boolean;
  specialCooldown: number;
  specialTimer: number;
  isUsingSpecial: boolean;
  jumpCount: number;
  maxJumps: number;
  kills: number;
  combo: number;
  comboTimer: number;
  skinColor: string;
  skinGlow: string;
  skinTrail: string;
  skinEffect?: string;
  equippedSkills: string[];
  skillStates: SkillState[];
}

// ---------------------------------------------------------------------------
// Enemy entity
// ---------------------------------------------------------------------------
export interface EnemyEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: string;
  health: number;
  maxHealth: number;
  facing: 1 | -1;
  shootCooldown: number;
  animFrame: number;
  active: boolean;
  grounded: boolean;
  patternTimer: number;
  invincible: number;
  bossName?: string;
  bossColor?: string;
  isFlying?: boolean;
  enraged?: boolean;
  enrageThreshold?: number;
}

// ---------------------------------------------------------------------------
// Bullet
// ---------------------------------------------------------------------------
export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  color: string;
  glowColor: string;
  owner: 'player' | 'enemy' | 'pet' | 'ally';
  life: number;
  trail?: Array<{ x: number; y: number }>;
}

// ---------------------------------------------------------------------------
// Particle
// ---------------------------------------------------------------------------
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// ---------------------------------------------------------------------------
// Platform
// ---------------------------------------------------------------------------
export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'static' | 'moving';
  /** Only present when type === 'moving' */
  moveRange?: number;
  moveSpeed?: number;
  moveAxis?: 'x' | 'y';
  moveOffset?: number;
  color?: string;
  glow?: string;
}

// ---------------------------------------------------------------------------
// Pet entity
// ---------------------------------------------------------------------------
export interface PetEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  grounded: boolean;
  shootCooldown: number;
  facing: 1 | -1;
  dead: boolean;
  respawnTimer: number;
  color: string;
  glowColor: string;
  trailColor: string;
  damage: number;
  shootRate: number;
  effect?: string;
}

// ---------------------------------------------------------------------------
// Skill state (runtime)
// ---------------------------------------------------------------------------
export interface SkillState {
  id: string;
  cooldown: number;
  maxCooldown: number;
  active: boolean;
  activeTimer: number;
  duration: number;
}

// ---------------------------------------------------------------------------
// Level data
// ---------------------------------------------------------------------------
export interface LevelData {
  id: number;
  name: string;
  chapter: string;
  width: number;
  height: number;
  playerSpawn: Position;
  platforms: Platform[];
  waves: Wave[];
  bossWave?: BossWave;
  background: string;
  introText: string;
  introColor: string;
  missionType: string;
  gangMembersAvailable: string[];
  /** Only present on procedurally generated levels */
  isProcedural?: boolean;
  environmentalObjects?: EnvironmentalObject[];
  weatherType?: string;
}

export interface Wave {
  enemies: EnemySpawn[];
  voiceLine?: string;
}

export interface EnemySpawn {
  type: string;
  x?: number;
  y?: number;
  count?: number;
}

export interface BossWave {
  enemies: BossSpawn[];
  voiceLine?: string;
}

export interface BossSpawn {
  x: number;
  y: number;
  type: string;
  bossName: string;
  bossColor: string;
}

// ---------------------------------------------------------------------------
// Environmental object (procedural levels only)
// ---------------------------------------------------------------------------
export interface EnvironmentalObject {
  x: number;
  y: number;
  type: string;
}

// ---------------------------------------------------------------------------
// Save data
// ---------------------------------------------------------------------------
export interface SaveData {
  currentChapter: number;
  highestLevel: number;
  totalCoins: number;
  totalScore: number;
  unlockedSkins: string[];
  currentSkin: string;
  currentPet: string;
  unlockedPets: string[];
  currentPetSkin: string;
  unlockedPetSkins: string[];
  gangMembersUnlocked: string[];
  missionsCompleted: string[];
  endlessHighScore: number;
  endlessHighestWave: number;
  totalKills: number;
  totalDeaths: number;
  lastSaveTime: number;
  rankingData: RankingData;
  username: string;
  avatar: string;
  about: string;
  nationality: string;
  unlockedSkills: string[];
  equippedSkills: [string, string, string];
  skillUpgrades: Record<string, number>;
  lastDailyRewardDay: string;
  dailyRewardStreak: number;
  levelStars: Record<string, number>;
  weaponUpgrades: Record<string, number>;
  hasSeenTapToStart: boolean;
  skinUpgrades: Record<string, number>;
}

export interface RankingData {
  elo: number;
  wins: number;
  losses: number;
}

export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  sfxEnabled: boolean;
  musicEnabled: boolean;
}

export interface PlayerProfile {
  username: string;
  avatar: string;
  about: string;
  nationality: string;
}

// ---------------------------------------------------------------------------
// Game state phases
// ---------------------------------------------------------------------------
export type GamePhase =
  | 'splash'
  | 'menu'
  | 'playing'
  | 'settings'
  | 'game-over'
  | 'level-complete'
  | 'victory'
  | 'cutscene'
  | 'skin-shop'
  | 'skill-shop'
  | 'weapon-shop'
  | 'profile'
  | 'leaderboard'
  | 'level-map'
  | 'online-arena'
  | 'online-lobby'
  | 'daily-reward';

export type GameMode = 'campaign' | 'versus' | 'online';

// ---------------------------------------------------------------------------
// Zone / Environment config
// ---------------------------------------------------------------------------
export interface ZoneConfig {
  skyColor: string;
  skyGradient: [string, string, string];
  groundColor: string;
  platformColor: string;
  platformGlow: string;
  particleColor: string;
  weatherType: 'rain' | 'snow' | 'embers' | 'glitch' | 'voidParticles' | 'none';
  ambientDescription: string;
}

// ---------------------------------------------------------------------------
// Cutscene data
// ---------------------------------------------------------------------------
export interface CutsceneData {
  id: string;
  frames: CutsceneFrame[];
}

export interface CutsceneFrame {
  scene: string;
  dialogue: string;
  speaker: string;
  speakerColor: string;
  duration: number;
}

// ---------------------------------------------------------------------------
// Skill definition
// ---------------------------------------------------------------------------
export interface SkillDefinition {
  id: string;
  name: string;
  element: string;
  description: string;
  damage: number;
  cooldown: number;
  duration: number;
  color: string;
  glowColor: string;
  rarity: string;
  unlockMethod: string;
  unlockCost: number;
  unlockLevel?: number;
  unlockBoss?: string;
  effectType: string;
  projectileCount?: number;
  effectRadius?: number;
  summonCount?: number;
  effect?: string;
}

// ---------------------------------------------------------------------------
// Pet definition
// ---------------------------------------------------------------------------
export interface PetDefinition {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  shootColor: string;
  damage: number;
  shootRate: number;
  description: string;
  price: number;
}

// ---------------------------------------------------------------------------
// Pet skin definition
// ---------------------------------------------------------------------------
export interface PetSkinDefinition {
  id: string;
  name: string;
  petId: string;
  color: string;
  glowColor: string;
  trailColor: string;
  price: number;
  rarity: string;
  effect?: string;
}

// ---------------------------------------------------------------------------
// Player skin definition
// ---------------------------------------------------------------------------
export interface SkinDefinition {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  trailColor: string;
  price: number;
  rarity: string;
  effect?: string;
  unlockLevel?: number;
  petId?: string;
}

// ---------------------------------------------------------------------------
// Upgrade config
// ---------------------------------------------------------------------------
export interface UpgradeConfig {
  name: string;
  baseCost: number;
  costMultiplier: number;
  effectPerLevel: number;
  maxLevel: number;
}

// ---------------------------------------------------------------------------
// Ally definition
// ---------------------------------------------------------------------------
export interface AllyDefinition {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  ability: string;
  joinChapter: number;
  active: boolean;
  health: number;
  maxHealth: number;
}

// ---------------------------------------------------------------------------
// Daily reward
// ---------------------------------------------------------------------------
export interface DailyReward {
  day: number;
  coins: number;
  type: string;
}

// ---------------------------------------------------------------------------
// Coin collectible
// ---------------------------------------------------------------------------
export interface CoinCollectible {
  x: number;
  y: number;
  collected: boolean;
  value: number;
}

// ---------------------------------------------------------------------------
// Chest
// ---------------------------------------------------------------------------
export interface Chest {
  x: number;
  y: number;
  opened: boolean;
  reward: number;
}

// ---------------------------------------------------------------------------
// Ranking tier
// ---------------------------------------------------------------------------
export interface RankingTier {
  rank: string;
  min: number;
  icon: string;
}

// ---------------------------------------------------------------------------
// Voice lines (by category)
// ---------------------------------------------------------------------------
export interface VoiceLines {
  kill: string[];
  damage: string[];
  waveClear: string[];
  dash: string[];
  shield: string[];
  special: string[];
  gang: string[];
  rescue: string[];
  protect: string[];
  dramatic: string[];
  bossEnrage: string[];
  pet: string[];
  dragon: string[];
  phoenix: string[];
  mechGolem: string[];
  shadowAssassin: string[];
  voidBat: string[];
  stormEagle: string[];
  emberWisp: string[];
  frostWraith: string[];
  shadowDrake: string[];
  plasmaSerpent: string[];
  neonWyrm: string[];
  crystalMoth: string[];
}

// ---------------------------------------------------------------------------
// Event trigger (procedural level events at specific levels)
// ---------------------------------------------------------------------------
export interface EventTrigger {
  type: string;
  text: string;
  color: string;
  spawnEnemies: string[];
  enemyCount?: number;
  duration: number;
}

// ---------------------------------------------------------------------------
// Color palette constants (from source: lines 431-442)
// ---------------------------------------------------------------------------
export const COLOR_PALETTE = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  green: '#00ff66',
  orange: '#ff6600',
  yellow: '#ffff00',
  purple: '#aa00ff',
  red: '#ff3333',
  darkBg: '#050510',
  gold: '#ffd700',
  pink: '#ff69b4',
  blue: '#4488ff',
  white: '#ffffff',
} as const;

// ---------------------------------------------------------------------------
// Difficulty scaling arrays (from source: lines 1028-1031)
// ---------------------------------------------------------------------------
export const DIFFICULTY_SCALING = {
  /** Health multiplier by difficulty tier [1, 1.2, 1.5, 1.8, 2.2] */
  healthMultiplier: [1, 1.2, 1.5, 1.8, 2.2] as const,
  /** Cooldown multiplier by difficulty tier [1, 0.9, 0.8, 0.7, 0.6] */
  cooldownMultiplier: [1, 0.9, 0.8, 0.7, 0.6] as const,
  /** Score thresholds for difficulty tiers */
  scoreThresholds: [0, 1500, 3000, 5400, 10500] as const,
  /** Whether boss enrage is enabled per tier */
  bossEnrageEnabled: [false, false, true, true, true] as const,
} as const;

// ---------------------------------------------------------------------------
// Flying enemy types (from source: line 1458-1460)
// ---------------------------------------------------------------------------
export const FLYING_ENEMY_TYPES: string[] = [
  'voidBat', 'stormEagle', 'emberWisp', 'frostWraith', 'shadowDrake',
  'plasmaSerpent', 'neonWyrm', 'crystalMoth', 'dragon', 'phoenix',
];
