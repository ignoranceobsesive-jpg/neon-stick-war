/**
 * Shared type definitions for the Neon Stickman: Stick War game
 * Extracted from the beautified bundle for reverse-engineering purposes
 */

// ─── Color Constants ───────────────────────────────────────────────────────────
export const COLORS = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  green: '#00ff66',
  gold: '#ffd700',
  orange: '#ff6600',
  red: '#ff3333',
  purple: '#aa00ff',
  yellow: '#ffff00',
  darkBg: '#050510',
  darkBgAlt: '#050520',
} as const;

// ─── Game Phase ─────────────────────────────────────────────────────────────────
export type GamePhase =
  | 'splash'
  | 'menu'
  | 'playing'
  | 'game-over'
  | 'level-complete'
  | 'victory'
  | 'cutscene'
  | 'settings'
  | 'online-arena'
  | 'level-map'
  | 'shop'
  | 'skill-shop'
  | 'weapon-shop'
  | 'profile'
  | 'leaderboard'
  | 'daily-reward';

// ─── Game Mode ──────────────────────────────────────────────────────────────────
export type GameMode = 'single' | 'versus' | 'online';

// ─── Skin / Pet / Skill Rarity ─────────────────────────────────────────────────
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// ─── Element Types ──────────────────────────────────────────────────────────────
export type ElementType =
  | 'fire'
  | 'frost'
  | 'shadow'
  | 'summon'
  | 'death'
  | 'lightning'
  | 'void'
  | 'blood';

// ─── Skill Unlock Method ───────────────────────────────────────────────────────
export type SkillUnlockMethod = 'level' | 'boss' | 'chest' | 'purchase' | 'ad' | 'story';

// ─── Ranking Data ───────────────────────────────────────────────────────────────
export interface RankingData {
  elo: number;
  wins: number;
  losses: number;
}

export interface RankInfo {
  icon: string;
  rank: string;
}

// ─── Save Data ──────────────────────────────────────────────────────────────────
export interface SaveData {
  highestLevel: number;
  totalCoins: number;
  totalKills: number;
  totalScore: number;
  currentSkin: string;
  currentPet: string;
  currentPetSkin: string;
  unlockedSkins: string[];
  unlockedPets: string[];
  unlockedPetSkins: string[];
  unlockedSkills: string[];
  equippedSkills: [string | null, string | null, string | null];
  skillUpgrades: Record<string, number>;
  weaponUpgrades: Record<string, number>;
  missionsCompleted: string[];
  levelStars: Record<string, number>;
  rankingData: RankingData;
  username: string;
  avatar: string;
  about: string;
  nationality: string;
  dailyRewardStreak: number;
  lastDailyRewardDay: string;
  soundSettings: SoundSettings;
}

// ─── Sound Settings ─────────────────────────────────────────────────────────────
export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  sfxEnabled: boolean;
  musicVolume: number;
  musicEnabled: boolean;
}

// ─── Skin Data ──────────────────────────────────────────────────────────────────
export interface SkinData {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  price: number;
  rarity: Rarity;
}

// ─── Pet Data ───────────────────────────────────────────────────────────────────
export interface PetData {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  price: number;
  damage: number;
  shootRate: number;
  description: string;
}

// ─── Pet Skin Data ──────────────────────────────────────────────────────────────
export interface PetSkinData {
  id: string;
  petId: string;
  name: string;
  color: string;
  glowColor: string;
  price: number;
  rarity: Rarity;
}

// ─── Skill Data ─────────────────────────────────────────────────────────────────
export interface SkillData {
  id: string;
  name: string;
  description: string;
  element: ElementType;
  color: string;
  glowColor: string;
  rarity: Rarity;
  cooldown: number;
  unlockCost: number;
  unlockMethod: SkillUnlockMethod;
  unlockLevel?: number;
  unlockBoss?: string;
}

// ─── Level Data ─────────────────────────────────────────────────────────────────
export interface LevelData {
  id: number;
  name: string;
  chapter: string;
}

// ─── Cutscene Data ──────────────────────────────────────────────────────────────
export interface CutsceneFrame {
  scene: string;
  speaker: string;
  dialogue: string;
  duration: number;
  speakerColor?: string;
}

export interface CutsceneData {
  id: string;
  frames: CutsceneFrame[];
}

// ─── Chapter Theme ──────────────────────────────────────────────────────────────
export interface ChapterTheme {
  color: string;
  glow: string;
  gradient: string;
  icon: string;
  name: string;
}

// ─── Online Arena ───────────────────────────────────────────────────────────────
export interface OnlineOpponent {
  name: string;
  avatar: string;
  elo: number;
  wins: number;
  losses: number;
  rank: string;
  rankIcon: string;
}

// ─── Weapon Upgrade Config ──────────────────────────────────────────────────────
export interface WeaponUpgradeConfig {
  name: string;
  maxLevel: number;
  effectPerLevel: number;
}

// ─── Daily Reward ───────────────────────────────────────────────────────────────
export interface DailyRewardTier {
  coins: number;
}
