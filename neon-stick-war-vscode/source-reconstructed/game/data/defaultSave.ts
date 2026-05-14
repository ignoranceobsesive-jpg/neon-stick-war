// =============================================================================
// NEON STICK WAR - Default Save Data
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js, lines 1580-1614
// Original variable name: B
// =============================================================================

import type { SaveData, RankingData } from '../types';

/** Default ranking data (original variable: D) */
export const defaultRankingData: RankingData = {
  elo: 1000,
  wins: 0,
  losses: 0,
};

/** Default save data — applied when no save file exists or as fallback */
export const defaultSave: SaveData = {
  currentChapter: 1,
  highestLevel: 1,
  totalCoins: 0,
  totalScore: 0,
  unlockedSkins: ['neon-green'],
  currentSkin: 'neon-green',
  currentPet: 'crystalGolem',
  unlockedPets: ['neonWolf', 'crystalGolem'],
  currentPetSkin: 'wolf-default',
  unlockedPetSkins: ['wolf-default'],
  gangMembersUnlocked: [],
  missionsCompleted: [],
  endlessHighScore: 0,
  endlessHighestWave: 0,
  totalKills: 0,
  totalDeaths: 0,
  lastSaveTime: 0,
  rankingData: {
    ...defaultRankingData,
  },
  username: 'NeonWarrior',
  avatar: '⚔️',
  about: '',
  nationality: '',
  unlockedSkills: [],
  equippedSkills: ['', '', ''],
  skillUpgrades: {},
  lastDailyRewardDay: '',
  dailyRewardStreak: 0,
  levelStars: {},
  weaponUpgrades: {},
  hasSeenTapToStart: false,
  skinUpgrades: {},
};

/** localStorage key for save data (original variable: K) */
export const SAVE_KEY = 'neonStickman_save_v4';

/** Default sound settings (from source: lines 3462-3468) */
export const defaultSoundSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  musicEnabled: true,
  sfxEnabled: true,
};

/** localStorage key for sound settings */
export const SOUND_KEY = 'neonStickman_sound_v1';
