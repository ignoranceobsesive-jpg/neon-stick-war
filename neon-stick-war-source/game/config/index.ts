/**
 * Game configuration barrel export for Neon Stick War.
 *
 * Re-exports all configuration modules for convenient importing:
 *   import { COLORS, PETS, SKILLS } from './game/config';
 */

// ── Core configuration ──
export { COLORS } from "./colors";
export type { ColorName, ColorHex } from "./colors";

// ── Upgrade system ──
export { UPGRADE_CONFIG, getUpgradeCost } from "./upgrades";
export type { UpgradeConfig } from "./upgrades";

// ── Pet companions ──
export { PETS } from "./pets";
export type { PetConfig } from "./pets";

// ── Pet skins ──
export { PET_SKINS } from "./petSkins";
export type { PetSkinConfig, PetSkinRarity, PetSkinEffect } from "./petSkins";

// ── Player skins ──
export { PLAYER_SKINS } from "./playerSkins";
export type { PlayerSkinConfig, PlayerSkinRarity, PlayerSkinEffect } from "./playerSkins";

// ── Gang allies ──
export { ALLIES } from "./allies";
export type { AllyConfig } from "./allies";

// ── Daily rewards ──
export { DAILY_REWARDS } from "./dailyRewards";
export type { DailyRewardConfig } from "./dailyRewards";

// ── Difficulty scaling ──
export {
  HEALTH_MULTIPLIERS,
  SPEED_MULTIPLIERS,
  COIN_MULTIPLIERS,
  BOSS_FLAGS,
  DIFFICULTY_TIERS,
} from "./difficulty";

// ── Skills/spells ──
export { SKILLS } from "./skills";
export type {
  SkillConfig,
  SkillRarity,
  SkillUnlockMethod,
  SkillEffectType,
  SkillElement,
} from "./skills";

// ── Zone/environment system ──
export { ZONE_ORDER, getZoneByLevel, getZoneEnvironment } from "./zones";
export type { ZoneId, ZoneEnvironment, WeatherType } from "./zones";

// ── Enemy types ──
export { FLYING_ENEMY_TYPES, isFlyingEnemy, getEnemyHeight } from "./enemies";

// ── Voice lines ──
export { VOICE_LINES, INTRO_VOICE_LINES } from "./voiceLines";
export type { VoiceLineCategory } from "./voiceLines";
