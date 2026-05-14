/**
 * Game Store - Central Zustand state management for the entire game
 * 
 * This is the single source of truth for all game state including:
 * - Game phase and mode management
 * - Level/wave progression
 * - Versus mode state
 * - Save data and economy (coins, skins, pets, skills, weapons)
 * - Sound settings
 * - Cutscene and story progression
 * - Cooldowns and UI state
 */

import { create } from "zustand";
import {
  loadSave,
  writeSave,
  addCoinsToSave,
  canClaimDailyReward,
  setCloudSyncEnabled,
  clearSaveData,
  getDefaultSaveData,
} from "./saveSystem";
import type { SaveData } from "./saveSystem";
import { soundManager } from "../audio/SoundManager";
import type { SoundSettings } from "../audio/SoundManager";

// ==========================================
// Type Definitions
// ==========================================

/** Current phase of the game lifecycle */
export type GamePhase =
  | "menu"
  | "playing"
  | "level-complete"
  | "game-over"
  | "cutscene"
  | "victory";

/** Game mode selection */
export type GameMode = "single" | "versus";

/** Voice line overlay displayed during gameplay */
export interface VoiceLine {
  /** The text to display */
  text: string;
  /** Text color */
  color: string;
  /** Frames remaining to display */
  timer: number;
}

/** Dramatic moment overlay (e.g., boss intro) */
export interface DramaticMoment {
  /** The text to display */
  text: string;
  /** Text color */
  color: string;
  /** Frames remaining to display */
  timer: number;
}

/** Cutscene frame data */
export interface CutsceneFrame {
  text: string;
  speaker?: string;
  background?: string;
}

/** Cutscene data structure */
export interface Cutscene {
  id: string;
  frames: CutsceneFrame[];
}

/** Daily reward claim result */
export interface DailyRewardResult {
  /** Coins awarded */
  coins: number;
  /** Day in the streak (1-7) */
  day: number;
}

/** Rewarded ad result */
export interface RewardedAdResult {
  /** Whether the user earned the reward */
  rewarded: boolean;
  /** Reason for not earning (if applicable) */
  reason?: "cooldown" | "closed_early" | "error";
  /** Duration of the ad in ms */
  durationMs: number;
}

/** Skill upgrade cost tiers */
const SKILL_UPGRADE_COSTS = [0, 1500, 3000, 5400, 10500];

/** Daily reward coin amounts by day (1-indexed) */
const DAILY_REWARD_COINS = [50, 100, 150, 200, 300, 500, 1000];

/** Weapon upgrade configuration */
interface WeaponUpgradeConfig {
  name: string;
  baseCost: number;
  costMultiplier: number;
  effectPerLevel: number;
  maxLevel: number;
}

/** All weapon upgrade definitions */
const WEAPON_UPGRADES: Record<string, WeaponUpgradeConfig> = {
  damage: {
    name: "Damage",
    baseCost: 500,
    costMultiplier: 1.5,
    effectPerLevel: 0.15,
    maxLevel: 999,
  },
  fireRate: {
    name: "Fire Rate",
    baseCost: 800,
    costMultiplier: 1.6,
    effectPerLevel: 0.1,
    maxLevel: 999,
  },
  bulletSpeed: {
    name: "Bullet Speed",
    baseCost: 600,
    costMultiplier: 1.4,
    effectPerLevel: 0.12,
    maxLevel: 999,
  },
  bulletSize: {
    name: "Bullet Size",
    baseCost: 400,
    costMultiplier: 1.3,
    effectPerLevel: 0.1,
    maxLevel: 999,
  },
  criticalChance: {
    name: "Critical Hit",
    baseCost: 1500,
    costMultiplier: 2,
    effectPerLevel: 0.02,
    maxLevel: 50,
  },
};

/**
 * Calculates the cost to upgrade a weapon to the next level.
 * 
 * @param weaponType - The weapon upgrade type key
 * @param currentLevel - The current upgrade level
 * @returns The coin cost for the next upgrade level
 */
function getWeaponUpgradeCost(weaponType: string, currentLevel: number): number {
  const config = WEAPON_UPGRADES[weaponType];
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, currentLevel));
}

// ==========================================
// External data references (loaded from other modules)
// These would be imported from their respective data files
// ==========================================

/** Skin definitions - imported from skin data module */
interface SkinDefinition {
  id: string;
  name: string;
  price: number;
  unlockLevel?: number;
}

/** Skill definitions - imported from skill data module */
interface SkillDefinition {
  id: string;
  name: string;
  unlockMethod: string;
  unlockCost: number;
  unlockLevel?: number;
}

/** Pet definitions - imported from pet data module */
interface PetDefinition {
  id: string;
  name: string;
  price: number;
}

/** Pet skin definitions */
interface PetSkinDefinition {
  id: string;
  petId: string;
  price: number;
}

/** Gang member definitions */
interface GangMemberDefinition {
  id: string;
  joinChapter: number;
}

/** Level definitions */
interface LevelDefinition {
  id: number;
  name: string;
  chapter: string;
  introText: string;
  introColor: string;
  waves: unknown[];
  bossWave?: unknown;
  gangMembersAvailable: string[];
}

// These would normally be imported from data files
// Declared here for type reference
declare const SKIN_DEFINITIONS: SkinDefinition[];
declare const SKILL_DEFINITIONS: SkillDefinition[];
declare const PET_DEFINITIONS: PetDefinition[];
declare const PET_SKIN_DEFINITIONS: PetSkinDefinition[];
declare const GANG_MEMBER_DEFINITIONS: GangMemberDefinition[];
declare const LEVEL_DEFINITIONS: LevelDefinition[];
declare const CUTSCENE_DEFINITIONS: Record<string, Cutscene>;

// ==========================================
// Helper functions
// ==========================================

/**
 * Unlocks skins and skills based on level progression.
 * 
 * @param saveData - Current save data
 * @param level - Level just completed
 * @returns Updated save data with newly unlocked items
 */
function unlockLevelRewards(saveData: SaveData, level: number): SaveData {
  let updated = { ...saveData };

  // Unlock skins that should be available at this level
  for (const skin of SKIN_DEFINITIONS) {
    if (
      skin.unlockLevel &&
      skin.unlockLevel <= level &&
      !updated.unlockedSkins.includes(skin.id)
    ) {
      if (!updated.unlockedSkins.includes(skin.id)) {
        updated = {
          ...updated,
          unlockedSkins: [...updated.unlockedSkins, skin.id],
        };
      }
    }
  }

  // Unlock skills that should be available at this level
  for (const skill of SKILL_DEFINITIONS) {
    if (
      skill.unlockMethod === "level" &&
      skill.unlockLevel &&
      skill.unlockLevel <= level &&
      !updated.unlockedSkills.includes(skill.id)
    ) {
      updated = {
        ...updated,
        unlockedSkills: [...updated.unlockedSkills, skill.id],
      };
    }
  }

  // Update highest level
  if (level > updated.highestLevel) {
    updated.highestLevel = level;
  }

  return updated;
}

/**
 * Applies the pet skin, also switching to the associated pet.
 * 
 * @param saveData - Current save data
 * @param petSkinId - The pet skin ID to equip
 * @returns Updated save data with pet skin and pet switched
 */
function applyPetSkin(saveData: SaveData, petSkinId: string): SaveData {
  if (!saveData.unlockedPetSkins.includes(petSkinId)) return saveData;

  const skinDef = PET_SKIN_DEFINITIONS.find((s) => s.id === petSkinId);
  if (!skinDef) return saveData;

  return {
    ...saveData,
    currentPetSkin: petSkinId,
    currentPet: skinDef.petId,
  };
}

/**
 * Calculates the daily reward for the current streak.
 * 
 * @param saveData - Current save data
 * @returns Reward result or null if not eligible
 */
function calculateDailyReward(
  saveData: SaveData
): { save: SaveData; coins: number; day: number } | null {
  if (!canClaimDailyReward(saveData)) return null;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak: number;
  if (
    saveData.lastDailyRewardDay === "" ||
    saveData.lastDailyRewardDay === yesterday
  ) {
    // Continue streak
    newStreak = Math.min(saveData.dailyRewardStreak + 1, 7);
  } else if (saveData.lastDailyRewardDay === today) {
    // Already claimed today
    return null;
  } else {
    // Streak broken - restart
    newStreak = 1;
  }

  const rewardIndex = Math.min(newStreak - 1, DAILY_REWARD_COINS.length - 1);
  const coins = DAILY_REWARD_COINS[rewardIndex];

  return {
    save: {
      ...saveData,
      totalCoins: saveData.totalCoins + coins,
      lastDailyRewardDay: today,
      dailyRewardStreak: newStreak,
    },
    coins,
    day: newStreak,
  };
}

/**
 * Attempts to upgrade a skill level.
 * 
 * @param saveData - Current save data
 * @param skillId - The skill to upgrade
 * @returns Updated save data if successful, null otherwise
 */
function attemptSkillUpgrade(
  saveData: SaveData,
  skillId: string
): SaveData | null {
  if (!saveData.unlockedSkills.includes(skillId)) return null;

  const currentLevel = saveData.skillUpgrades[skillId] ?? 1;
  if (currentLevel >= 5) return null;

  const cost = SKILL_UPGRADE_COSTS[currentLevel];
  if (cost > 0 && saveData.totalCoins < cost) return null;

  const updatedUpgrades = {
    ...saveData.skillUpgrades,
    [skillId]: currentLevel + 1,
  };

  return {
    ...saveData,
    totalCoins: cost > 0 ? saveData.totalCoins - cost : saveData.totalCoins,
    skillUpgrades: updatedUpgrades,
  };
}

// ==========================================
// Store State and Actions
// ==========================================

/** Complete game state interface */
export interface GameState {
  // --- Core Game State ---
  /** Current phase of the game (menu, playing, etc.) */
  gamePhase: GamePhase;
  /** Current game mode (single player or versus) */
  gameMode: GameMode;
  /** Current level number (1-based, -1 for versus) */
  currentLevel: number;
  /** Current score for this level/run */
  score: number;
  /** Accumulated total score across all plays */
  totalScore: number;
  /** Current wave index within the level */
  currentWave: number;
  /** Total number of waves in the current level */
  totalWaves: number;
  /** Whether the current wave is a boss wave */
  isBossLevel: boolean;
  /** Whether the player can use a revive */
  canRevive: boolean;
  /** Whether the player has already used their revive this level */
  hasUsedRevive: boolean;
  /** Whether the player revived with full power */
  revivedWithFullPower: boolean;

  // --- Story & Cutscene ---
  /** Current story chapter for progression */
  currentStoryChapter: number;
  /** Currently playing cutscene, or null */
  currentCutscene: Cutscene | null;
  /** Current frame index within the cutscene */
  cutsceneFrameIndex: number;
  /** Text reveal progress within the current cutscene frame */
  cutsceneTextProgress: number;
  /** Active voice line overlay */
  voiceLine: VoiceLine | null;
  /** Active dramatic moment overlay */
  dramaticMoment: DramaticMoment | null;
  /** Intro text displayed when starting a level */
  introText: string | null;
  /** Color of the intro text */
  introColor: string;
  /** Timer for intro text display (in frames) */
  introTimer: number;

  // --- Save & Settings ---
  /** Persisted save data */
  saveData: SaveData;
  /** Sound/music settings */
  soundSettings: SoundSettings;

  // --- Level Results ---
  /** Stars earned on last completed level */
  lastLevelStars: number;
  /** Kills on last completed level */
  lastLevelKills: number;
  /** Max combo on last completed level */
  lastLevelMaxCombo: number;
  /** Coins earned on last completed level */
  lastLevelCoinsEarned: number;
  /** Health percentage at end of last level */
  lastLevelHealthPct: number;
  /** Total enemies on last completed level */
  lastLevelTotalEnemies: number;

  // --- Versus Mode ---
  /** Player 1 win count in current versus match */
  versusP1Wins: number;
  /** Player 2 win count in current versus match */
  versusP2Wins: number;
  /** Current round number in versus match */
  versusCurrentRound: number;
  /** Total rounds per versus match */
  versusTotalRounds: number;
  /** Winner of the current versus round (0=none, 1=P1, 2=P2, 3=draw) */
  versusRoundWinner: number;
  /** Overall winner of the versus match (0=none, 1=P1, 2=P2) */
  versusMatchWinner: number;

  // --- Cooldowns ---
  /** Remaining dash cooldown (frames) */
  dashCooldown: number;
  /** Remaining shield cooldown (frames) */
  shieldCooldown: number;
  /** Remaining special ability cooldown (frames) */
  specialCooldown: number;

  // --- UI State ---
  /** Whether waiting for the player to tap to start */
  waitingForTap: boolean;
}

/** All game store actions */
export interface GameActions {
  /** Sets the current game phase */
  setGamePhase: (phase: GamePhase) => void;
  /** Sets the current game mode */
  setGameMode: (mode: GameMode) => void;

  // --- Versus Mode ---
  /** Starts a versus mode match */
  startVersus: () => void;
  /** Records a round win in versus mode */
  versusRoundWin: (winner: 1 | 2 | 3) => void;
  /** Resets for the next versus round */
  versusResetRound: () => void;
  /** Ends the versus match with a winner */
  versusMatchEnd: (winner: 1 | 2) => void;

  // --- Game Flow ---
  /** Starts the game from the menu (resume or new) */
  startGame: () => void;
  /** Starts a specific level */
  startLevel: (levelId: number) => void;
  /** Shows a voice line overlay */
  showVoiceLine: (text: string, color: string, timer?: number) => void;
  /** Triggers a dramatic moment overlay */
  triggerDramaticMoment: (text: string, color: string, timer?: number) => void;
  /** Advances to the next wave */
  advanceWave: () => void;
  /** Completes the current level with a score */
  completeLevel: (score: number) => void;
  /** Handles game over state */
  gameOver: () => void;
  /** Proceeds to the next level */
  nextLevel: () => void;
  /** Retries the current level */
  retryLevel: () => void;
  /** Returns to the main menu */
  backToMenu: () => void;
  /** Revives the player after game over */
  revive: () => void;

  // --- Cutscenes ---
  /** Starts a cutscene by ID */
  startCutscene: (cutsceneId: string) => void;
  /** Advances to the next cutscene frame */
  advanceCutscene: () => void;
  /** Skips the current cutscene entirely */
  skipCutscene: () => void;

  // --- Save Management ---
  /** Saves current game state to localStorage */
  saveGame: () => void;
  /** Reloads save data from localStorage */
  loadGame: () => void;

  // --- Economy: Skins ---
  /** Buys a skin with coins. Returns true if successful */
  buySkin: (skinId: string) => boolean;
  /** Equips an owned skin */
  selectSkin: (skinId: string) => void;

  // --- Economy: Pets ---
  /** Buys a pet with coins. Returns true if successful */
  buyPet: (petId: string) => boolean;
  /** Equips an owned pet */
  selectPet: (petId: string) => void;
  /** Buys a pet skin with coins. Returns true if successful */
  buyPetSkin: (petSkinId: string) => boolean;
  /** Equips an owned pet skin (also switches to the associated pet) */
  selectPetSkin: (petSkinId: string) => void;

  // --- Economy: Coins ---
  /** Converts a score value to coins and adds to save */
  addCoinsFromScore: (score: number) => void;
  /** Adds a flat coin reward to save data */
  addCoinsReward: (coins: number) => void;

  // --- Sound Settings ---
  /** Updates sound settings and applies them to SoundManager */
  setSoundSettings: (settings: Partial<SoundSettings>) => void;

  // --- Profile ---
  /** Updates player profile fields */
  updateProfile: (updates: Partial<Pick<SaveData, "username" | "avatar" | "about" | "nationality">>) => void;
  /** Updates versus ranking after a match */
  updateRanking: (won: boolean) => void;

  // --- Skills ---
  /** Buys a skill with coins or via unlock method. Returns true if successful */
  buySkill: (skillId: string) => boolean;
  /** Equips a skill to a specific slot (0-2) */
  equipSkill: (skillId: string, slot: number) => void;
  /** Unequips the skill in a specific slot */
  unequipSkill: (slot: number) => void;
  /** Upgrades a skill level. Returns true if successful */
  upgradeSkill: (skillId: string) => boolean;

  // --- Daily Rewards ---
  /** Claims the daily reward. Returns reward info or null if not eligible */
  claimDailyReward: () => DailyRewardResult | null;
  /** Checks if a daily reward can be claimed */
  canClaimDaily: () => boolean;

  // --- Weapon Upgrades ---
  /** Upgrades a weapon with coins. Returns true if successful */
  upgradeWeapon: (weaponType: string) => boolean;
  /** Upgrades a weapon via ad reward (free) */
  upgradeWeaponByAd: (weaponType: string) => void;

  // --- Cooldowns ---
  /** Updates all ability cooldowns */
  updateCooldowns: (dash: number, shield: number, special: number) => void;

  // --- UI ---
  /** Handles tap-to-start interaction */
  tapToStart: () => void;

  // --- Skin Power ---
  /** Upgrades a skin's power level with coins. Returns true if successful */
  upgradeSkinPower: (skinId: string) => boolean;
  /** Upgrades a skin's power level via ad reward (free) */
  upgradeSkinPowerByAd: (skinId: string) => void;

  // --- Cloud Sync ---
  /** Enables/disables cloud sync */
  setCloudSync: (enabled: boolean) => void;
  /** Loads a cloud save, merging with local save (prefers higher progress) */
  loadCloudSave: (cloudSave: SaveData) => void;

  // --- Reset ---
  /** Resets all save data and returns to defaults */
  resetSave: () => void;
}

/** Combined store type */
export type GameStore = GameState & GameActions;

// ==========================================
// Store Creation
// ==========================================

/**
 * Creates the Zustand game store with all state and actions.
 * This is the central state management for the entire game.
 */
export const useGameStore = create<GameStore>()((set, get) => ({
  // --- Core Game State ---
  gamePhase: "menu" as GamePhase,
  gameMode: "single" as GameMode,
  currentLevel: 1,
  score: 0,
  totalScore: 0,
  currentWave: 0,
  totalWaves: 0,
  isBossLevel: false,
  canRevive: true,
  hasUsedRevive: false,
  revivedWithFullPower: false,

  // --- Story & Cutscene ---
  currentStoryChapter: 1,
  currentCutscene: null,
  cutsceneFrameIndex: 0,
  cutsceneTextProgress: 0,
  voiceLine: null,
  dramaticMoment: null,
  introText: null,
  introColor: "#00ffff",
  introTimer: 0,

  // --- Save & Settings ---
  saveData: loadSave(),
  soundSettings: soundManager.loadSettings(),

  // --- Level Results ---
  lastLevelStars: 0,
  lastLevelKills: 0,
  lastLevelMaxCombo: 0,
  lastLevelCoinsEarned: 0,
  lastLevelHealthPct: 0,
  lastLevelTotalEnemies: 0,

  // --- Versus Mode ---
  versusP1Wins: 0,
  versusP2Wins: 0,
  versusCurrentRound: 1,
  versusTotalRounds: 3,
  versusRoundWinner: 0,
  versusMatchWinner: 0,

  // --- Cooldowns ---
  dashCooldown: 0,
  shieldCooldown: 0,
  specialCooldown: 0,

  // --- UI State ---
  waitingForTap: false,

  // ==========================================
  // Actions
  // ==========================================

  setGamePhase: (phase) => set({ gamePhase: phase }),

  setGameMode: (mode) => set({ gameMode: mode }),

  // --- Versus Mode Actions ---

  startVersus: () => {
    set({
      gameMode: "versus",
      gamePhase: "playing",
      currentLevel: -1,
      score: 0,
      currentWave: 0,
      totalWaves: 0,
      isBossLevel: false,
      canRevive: false,
      hasUsedRevive: false,
      versusP1Wins: 0,
      versusP2Wins: 0,
      versusCurrentRound: 1,
      versusTotalRounds: 3,
      versusRoundWinner: 0,
      versusMatchWinner: 0,
      introText: "FIGHT!",
      introColor: "#ffd700",
      introTimer: 90,
      voiceLine: null,
      waitingForTap: false,
    });
  },

  versusRoundWin: (winner) => {
    const state = get();
    // Draw
    if (winner === 3) {
      set({
        versusRoundWinner: 3,
        versusCurrentRound: state.versusCurrentRound + 1,
      });
      return;
    }

    const p1Wins = winner === 1 ? state.versusP1Wins + 1 : state.versusP1Wins;
    const p2Wins = winner === 2 ? state.versusP2Wins + 1 : state.versusP2Wins;
    const winsNeeded = Math.ceil(state.versusTotalRounds / 2);

    if (p1Wins >= winsNeeded) {
      set({
        versusP1Wins: p1Wins,
        versusP2Wins: p2Wins,
        versusRoundWinner: winner,
        versusMatchWinner: 1,
      });
    } else if (p2Wins >= winsNeeded) {
      set({
        versusP1Wins: p1Wins,
        versusP2Wins: p2Wins,
        versusRoundWinner: winner,
        versusMatchWinner: 2,
      });
    } else {
      set({
        versusP1Wins: p1Wins,
        versusP2Wins: p2Wins,
        versusRoundWinner: winner,
        versusCurrentRound: state.versusCurrentRound + 1,
      });
    }
  },

  versusResetRound: () => {
    set({
      versusRoundWinner: 0,
      gamePhase: "playing",
      introText: `ROUND ${get().versusCurrentRound} — FIGHT!`,
      introColor: "#ffd700",
      introTimer: 90,
      waitingForTap: false,
    });
  },

  versusMatchEnd: (winner) => {
    set({
      versusMatchWinner: winner,
      gamePhase: "level-complete",
    });
  },

  // --- Game Flow Actions ---

  startGame: () => {
    const saveData = get().saveData;
    if (saveData.highestLevel >= 1) {
      get().startLevel(saveData.highestLevel);
    } else {
      get().startCutscene("ch1-intro");
    }
  },

  startLevel: (levelId) => {
    const levelDef =
      LEVEL_DEFINITIONS.find((l) => l.id === levelId) ||
      generateProceduralLevel(levelId);
    if (!levelDef) return;

    const totalWaves = levelDef.waves.length + (levelDef.bossWave ? 1 : 0);
    const cutsceneId = getCutsceneForLevel(levelId);
    const needsTapPrompt =
      levelId === 1 && !get().saveData.hasSeenTapToStart;

    if (cutsceneId && CUTSCENE_DEFINITIONS[cutsceneId]) {
      set({
        currentLevel: levelId,
        score: 0,
        currentWave: 0,
        totalWaves,
        isBossLevel: false,
        canRevive: true,
        hasUsedRevive: false,
        voiceLine: null,
      });
      get().startCutscene(cutsceneId);
    } else {
      set({
        currentLevel: levelId,
        score: 0,
        currentWave: 0,
        totalWaves,
        isBossLevel: false,
        canRevive: true,
        hasUsedRevive: false,
        gamePhase: "playing",
        voiceLine: null,
        introText: levelDef.introText,
        introColor: levelDef.introColor,
        introTimer: 60,
        waitingForTap: needsTapPrompt,
      });
    }
  },

  showVoiceLine: (text, color, timer = 90) => {
    set({
      voiceLine: { text, color, timer },
    });
  },

  triggerDramaticMoment: (text, color, timer = 150) => {
    set({
      dramaticMoment: { text, color, timer },
    });
  },

  advanceWave: () => {
    const { currentWave, totalWaves, currentLevel } = get();
    const nextWave = currentWave + 1;
    const levelDef =
      LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) ||
      generateProceduralLevel(currentLevel);

    if (nextWave >= totalWaves) {
      const finalScore = get().score + 200;
      get().completeLevel(finalScore);
      return;
    }

    // Check if next wave is a boss wave
    if (levelDef?.bossWave && nextWave === totalWaves - 1) {
      set({ isBossLevel: true });
    }

    set({ currentWave: nextWave });
  },

  completeLevel: (levelScore) => {
    const {
      currentLevel,
      totalScore,
      saveData,
      lastLevelStars,
      lastLevelKills,
      lastLevelMaxCombo,
      lastLevelHealthPct,
      lastLevelTotalEnemies,
    } = get();

    const newTotalScore = totalScore + levelScore;
    const coinsEarned = Math.floor(levelScore / 5);

    // Calculate star rating
    let stars = lastLevelStars;
    if (stars === 0 && lastLevelTotalEnemies > 0) {
      stars = 1;
      if (lastLevelHealthPct > 40 || lastLevelKills >= 0.5 * lastLevelTotalEnemies) {
        stars = 2;
      }
      if (lastLevelHealthPct > 70 && lastLevelKills >= 0.8 * lastLevelTotalEnemies) {
        stars = 3;
      }
    } else if (stars === 0) {
      stars = 1;
    }

    // Update save data with rewards and unlocks
    let updatedSave = { ...saveData };
    updatedSave = unlockLevelRewards(updatedSave, currentLevel);
    updatedSave = addCoinsToSave(updatedSave, coinsEarned);
    updatedSave.totalScore = newTotalScore;

    // Mark level as completed
    if (!updatedSave.missionsCompleted.includes(String(currentLevel))) {
      updatedSave.missionsCompleted = [
        ...updatedSave.missionsCompleted,
        String(currentLevel),
      ];
    }

    // Update star rating
    const levelKey = String(currentLevel);
    if (stars > (updatedSave.levelStars?.[levelKey] ?? 0)) {
      updatedSave.levelStars = {
        ...updatedSave.levelStars,
        [levelKey]: stars,
      };
    }

    // Unlock gang members from this level
    const levelDef =
      LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) ||
      generateProceduralLevel(currentLevel);
    if (levelDef) {
      for (const memberId of levelDef.gangMembersAvailable) {
        if (!updatedSave.gangMembersUnlocked.includes(memberId)) {
          const memberDef = GANG_MEMBER_DEFINITIONS.find(
            (m) => m.id === memberId
          );
          if (
            memberDef &&
            memberDef.joinChapter <=
              parseInt(levelDef.chapter.replace("CH.", ""))
          ) {
            updatedSave.gangMembersUnlocked = [
              ...updatedSave.gangMembersUnlocked,
              memberId,
            ];
          }
        }
      }
    }

    // Update chapter progression
    if (currentLevel <= 2) updatedSave.currentChapter = 1;
    else if (currentLevel <= 4) updatedSave.currentChapter = 2;
    else if (currentLevel <= 6) updatedSave.currentChapter = 3;
    else if (currentLevel <= 7) updatedSave.currentChapter = 4;
    else updatedSave.currentChapter = 5;

    // Advance highest level
    if (currentLevel >= updatedSave.highestLevel) {
      updatedSave.highestLevel = currentLevel + 1;
    }

    // Unlock new story chapters for high levels
    if (currentLevel > 8) {
      const newChapter = Math.min(
        Math.floor((currentLevel - 1) / 100) + 6,
        200
      );
      if (newChapter > get().currentStoryChapter) {
        set({ currentStoryChapter: newChapter });
      }
    }

    writeSave(updatedSave);
    set({
      score: levelScore,
      totalScore: newTotalScore,
      saveData: updatedSave,
      gamePhase: "level-complete",
    });
  },

  gameOver: () => {
    const { saveData, hasUsedRevive } = get();
    const updatedSave = {
      ...saveData,
      totalDeaths: saveData.totalDeaths + 1,
    };
    writeSave(updatedSave);
    soundManager.stopAll();
    set({
      gamePhase: "game-over",
      saveData: updatedSave,
      canRevive: !hasUsedRevive,
    });
  },

  nextLevel: () => {
    const nextLevelId = get().currentLevel + 1;
    if (nextLevelId <= 22000) {
      get().startLevel(nextLevelId);
    } else {
      set({ gamePhase: "menu" });
    }
  },

  retryLevel: () => {
    get().startLevel(get().currentLevel);
  },

  backToMenu: () => {
    soundManager.stopAll();
    set({
      gamePhase: "menu",
      gameMode: "single",
      voiceLine: null,
      dramaticMoment: null,
      introText: null,
      introTimer: 0,
      currentCutscene: null,
      versusP1Wins: 0,
      versusP2Wins: 0,
      versusCurrentRound: 1,
      versusRoundWinner: 0,
      versusMatchWinner: 0,
      waitingForTap: false,
    });
  },

  revive: () => {
    const { hasUsedRevive } = get();
    if (hasUsedRevive) return;

    set({
      hasUsedRevive: true,
      canRevive: false,
      revivedWithFullPower: true,
    });

    if (CUTSCENE_DEFINITIONS["revive"]) {
      get().startCutscene("revive");
    } else {
      set({
        gamePhase: "playing",
        waitingForTap: false,
      });
    }
  },

  // --- Cutscene Actions ---

  startCutscene: (cutsceneId) => {
    const cutscene = CUTSCENE_DEFINITIONS[cutsceneId] || null;

    if (!cutscene) {
      // No cutscene found - start the level directly
      const currentLevel = get().currentLevel;
      const levelDef =
        LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) ||
        generateProceduralLevel(currentLevel);
      set({
        gamePhase: "playing",
        waitingForTap: false,
        introText: levelDef?.introText || "GET READY!",
        introColor: levelDef?.introColor || "#00ffff",
        introTimer: 60,
      });
      return;
    }

    set({
      currentCutscene: cutscene,
      cutsceneFrameIndex: 0,
      cutsceneTextProgress: 0,
      gamePhase: "cutscene",
    });
  },

  advanceCutscene: () => {
    const { currentCutscene, cutsceneFrameIndex } = get();
    if (!currentCutscene) return;

    const nextIndex = cutsceneFrameIndex + 1;
    if (nextIndex < currentCutscene.frames.length) {
      set({
        cutsceneFrameIndex: nextIndex,
        cutsceneTextProgress: 0,
      });
    } else {
      // Cutscene finished - start the level
      set({
        currentCutscene: null,
        cutsceneFrameIndex: 0,
        cutsceneTextProgress: 0,
      });

      const currentLevel = get().currentLevel;
      const levelDef =
        LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) ||
        generateProceduralLevel(currentLevel);

      set({
        gamePhase: "playing",
        introText: levelDef?.introText,
        introColor: levelDef?.introColor,
        introTimer: 60,
        waitingForTap: false,
      });
    }
  },

  skipCutscene: () => {
    const { currentCutscene } = get();
    if (!currentCutscene) return;

    set({
      currentCutscene: null,
      cutsceneFrameIndex: 0,
      cutsceneTextProgress: 0,
    });

    const currentLevel = get().currentLevel;
    const levelDef =
      LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) ||
      generateProceduralLevel(currentLevel);

    if (levelDef) {
      set({
        gamePhase: "playing",
        introText: levelDef.introText,
        introColor: levelDef.introColor,
        introTimer: 60,
        waitingForTap: false,
      });
    } else if (currentLevel >= 22000) {
      set({ gamePhase: "victory" });
    } else {
      set({ gamePhase: "level-complete" });
    }
  },

  // --- Save Management ---

  saveGame: () => {
    writeSave(get().saveData);
  },

  loadGame: () => {
    set({ saveData: loadSave() });
  },

  // --- Economy: Skins ---

  buySkin: (skinId) => {
    const { saveData } = get();
    const skinDef = SKIN_DEFINITIONS.find((s) => s.id === skinId);

    // Can't buy if: not found, already owned, or can't afford
    if (
      !skinDef ||
      saveData.unlockedSkins.includes(skinId) ||
      saveData.totalCoins < skinDef.price
    ) {
      return false;
    }

    const updatedSave: SaveData = {
      ...saveData,
      totalCoins: saveData.totalCoins - skinDef.price,
      unlockedSkins: [...saveData.unlockedSkins, skinId],
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
    return true;
  },

  selectSkin: (skinId) => {
    const { saveData } = get();
    const updatedSave = saveData.unlockedSkins.includes(skinId)
      ? { ...saveData, currentSkin: skinId }
      : saveData;
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Economy: Pets ---

  buyPet: (petId) => {
    const { saveData } = get();
    const petDef = PET_DEFINITIONS.find((p) => p.id === petId);

    if (!petDef) return false;
    if (saveData.unlockedPets.includes(petId)) return false;
    if (saveData.totalCoins < petDef.price) return false;

    const updatedSave: SaveData = {
      ...saveData,
      totalCoins: saveData.totalCoins - petDef.price,
      unlockedPets: [...saveData.unlockedPets, petId],
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
    return true;
  },

  selectPet: (petId) => {
    const { saveData } = get();
    const updatedSave = saveData.unlockedPets.includes(petId)
      ? { ...saveData, currentPet: petId }
      : saveData;
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  buyPetSkin: (petSkinId) => {
    const { saveData } = get();
    const skinDef = PET_SKIN_DEFINITIONS.find((s) => s.id === petSkinId);

    if (
      !skinDef ||
      saveData.unlockedPetSkins.includes(petSkinId) ||
      saveData.totalCoins < skinDef.price
    ) {
      return false;
    }

    const updatedSave: SaveData = {
      ...saveData,
      totalCoins: saveData.totalCoins - skinDef.price,
      unlockedPetSkins: [...saveData.unlockedPetSkins, petSkinId],
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
    return true;
  },

  selectPetSkin: (petSkinId) => {
    const { saveData } = get();
    const updatedSave = applyPetSkin(saveData, petSkinId);
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Economy: Coins ---

  addCoinsFromScore: (score) => {
    const coins = Math.floor(score / 5);
    const { saveData } = get();
    set({ saveData: addCoinsToSave(saveData, coins) });
  },

  addCoinsReward: (coins) => {
    const { saveData } = get();
    const updatedSave = addCoinsToSave(saveData, coins);
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Sound Settings ---

  setSoundSettings: (settings) => {
    set({
      soundSettings: { ...get().soundSettings, ...settings },
    });

    if (settings.masterVolume !== undefined) {
      soundManager.setMasterVolume(settings.masterVolume);
    }
    if (settings.sfxVolume !== undefined) {
      soundManager.setSfxVolume(settings.sfxVolume);
    }
    if (settings.musicVolume !== undefined) {
      soundManager.setMusicVolume(settings.musicVolume);
    }
    if (settings.musicEnabled !== undefined) {
      soundManager.setMusicEnabled(settings.musicEnabled);
    }
    if (settings.sfxEnabled !== undefined) {
      soundManager.setSfxEnabled(settings.sfxEnabled);
    }
  },

  // --- Profile ---

  updateProfile: (updates) => {
    const { saveData } = get();
    const updatedSave = { ...saveData, ...updates };
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  updateRanking: (won) => {
    const { saveData } = get();
    const rankingData = { ...saveData.rankingData };
    if (won) {
      rankingData.wins++;
      rankingData.elo += 25;
    } else {
      rankingData.losses++;
      rankingData.elo = Math.max(0, rankingData.elo - 15);
    }
    const updatedSave = { ...saveData, rankingData };
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Skills ---

  buySkill: (skillId) => {
    const { saveData } = get();
    const skillDef = SKILL_DEFINITIONS.find((s) => s.id === skillId);

    if (!skillDef || saveData.unlockedSkills.includes(skillId)) return false;

    if (
      skillDef.unlockMethod === "ad" ||
      skillDef.unlockMethod === "purchase" ||
      skillDef.unlockMethod === "chest"
    ) {
      if (skillDef.unlockCost > 0 && saveData.totalCoins < skillDef.unlockCost) {
        return false;
      }
      const updatedSave: SaveData = {
        ...saveData,
        totalCoins:
          skillDef.unlockCost > 0
            ? saveData.totalCoins - skillDef.unlockCost
            : saveData.totalCoins,
        unlockedSkills: [...saveData.unlockedSkills, skillId],
      };
      writeSave(updatedSave);
      set({ saveData: updatedSave });
      return true;
    }

    return false;
  },

  equipSkill: (skillId, slot) => {
    const { saveData } = get();
    if (!saveData.unlockedSkills.includes(skillId) || slot < 0 || slot > 2) {
      return;
    }

    const equipped = [...saveData.equippedSkills];

    // Remove from current slot if already equipped
    const currentSlot = equipped.indexOf(skillId);
    if (currentSlot >= 0) {
      equipped[currentSlot] = "";
    }

    // Place in desired slot
    equipped[slot] = skillId;

    // Ensure exactly 3 slots
    while (equipped.length > 3) equipped.pop();
    while (equipped.length < 3) equipped.push("");

    const updatedSave: SaveData = {
      ...saveData,
      equippedSkills: equipped as [string, string, string],
    };
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  unequipSkill: (slot) => {
    const { saveData } = get();
    if (slot < 0 || slot > 2) return;

    const equipped = [...saveData.equippedSkills];
    equipped[slot] = "";

    while (equipped.length > 3) equipped.pop();
    while (equipped.length < 3) equipped.push("");

    const updatedSave: SaveData = {
      ...saveData,
      equippedSkills: equipped as [string, string, string],
    };
    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  upgradeSkill: (skillId) => {
    const { saveData } = get();
    const result = attemptSkillUpgrade(saveData, skillId);
    if (!result) return false;

    writeSave(result);
    set({ saveData: result });
    return true;
  },

  // --- Daily Rewards ---

  claimDailyReward: () => {
    const { saveData } = get();
    const result = calculateDailyReward(saveData);
    if (!result) return null;

    writeSave(result.save);
    set({ saveData: result.save });
    return { coins: result.coins, day: result.day };
  },

  canClaimDaily: () => {
    return canClaimDailyReward(get().saveData);
  },

  // --- Weapon Upgrades ---

  upgradeWeapon: (weaponType) => {
    const { saveData } = get();
    const currentLevel = saveData.weaponUpgrades[weaponType] ?? 0;
    const config = WEAPON_UPGRADES[weaponType];

    if (currentLevel >= config.maxLevel) return false;

    const cost = getWeaponUpgradeCost(weaponType, currentLevel);
    if (saveData.totalCoins < cost) return false;

    const updatedWeaponUpgrades = {
      ...saveData.weaponUpgrades,
      [weaponType]: currentLevel + 1,
    };
    const updatedSave: SaveData = {
      ...saveData,
      totalCoins: saveData.totalCoins - cost,
      weaponUpgrades: updatedWeaponUpgrades,
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
    return true;
  },

  upgradeWeaponByAd: (weaponType) => {
    const { saveData } = get();
    const currentLevel = saveData.weaponUpgrades[weaponType] ?? 0;
    const config = WEAPON_UPGRADES[weaponType];

    if (currentLevel >= config.maxLevel) return;

    const updatedWeaponUpgrades = {
      ...saveData.weaponUpgrades,
      [weaponType]: currentLevel + 1,
    };
    const updatedSave: SaveData = {
      ...saveData,
      weaponUpgrades: updatedWeaponUpgrades,
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Cooldowns ---

  updateCooldowns: (dash, shield, special) => {
    set({
      dashCooldown: dash,
      shieldCooldown: shield,
      specialCooldown: special,
    });
  },

  // --- UI ---

  tapToStart: () => {
    const { saveData } = get();
    const updatedSave = { ...saveData, hasSeenTapToStart: true };
    writeSave(updatedSave);
    set({ waitingForTap: false, saveData: updatedSave });

    // Haptic feedback on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },

  // --- Skin Power ---

  upgradeSkinPower: (skinId) => {
    const { saveData } = get();
    const skinDef = SKIN_DEFINITIONS.find((s) => s.id === skinId);

    if (!skinDef || !saveData.unlockedSkins.includes(skinId)) return false;

    const currentPower = saveData.skinUpgrades?.[skinId] ?? 0;
    const upgradeCost = Math.floor(
      (skinDef.price > 0 ? skinDef.price : 500) *
        Math.pow(2, currentPower + 1)
    );

    if (saveData.totalCoins < upgradeCost) return false;

    const updatedSkinUpgrades = {
      ...saveData.skinUpgrades,
      [skinId]: currentPower + 1,
    };
    const updatedSave: SaveData = {
      ...saveData,
      totalCoins: saveData.totalCoins - upgradeCost,
      skinUpgrades: updatedSkinUpgrades,
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
    return true;
  },

  upgradeSkinPowerByAd: (skinId) => {
    const { saveData } = get();
    if (
      !SKIN_DEFINITIONS.find((s) => s.id === skinId) ||
      !saveData.unlockedSkins.includes(skinId)
    ) {
      return;
    }

    const currentPower = saveData.skinUpgrades?.[skinId] ?? 0;
    const updatedSkinUpgrades = {
      ...saveData.skinUpgrades,
      [skinId]: currentPower + 1,
    };
    const updatedSave: SaveData = {
      ...saveData,
      skinUpgrades: updatedSkinUpgrades,
    };

    writeSave(updatedSave);
    set({ saveData: updatedSave });
  },

  // --- Cloud Sync ---

  setCloudSync: (enabled) => {
    setCloudSyncEnabled(enabled);
  },

  loadCloudSave: (cloudSave) => {
    const localSave = get().saveData;
    const localTotalScore = localSave.totalScore;
    const cloudTotalScore = cloudSave.totalScore;
    const localHighestLevel = localSave.highestLevel;
    const cloudHighestLevel = cloudSave.highestLevel;

    // Prefer save with higher progress; ties go to higher totalScore
    const mergedSave =
      cloudHighestLevel > localHighestLevel ||
      (cloudHighestLevel === localHighestLevel &&
        cloudTotalScore > localTotalScore)
        ? {
            ...cloudSave,
            totalCoins: Math.max(localSave.totalCoins, cloudSave.totalCoins),
          }
        : localSave;

    writeSave(mergedSave);
    set({ saveData: mergedSave });
  },

  // --- Reset ---

  resetSave: () => {
    clearSaveData();
    set({
      saveData: getDefaultSaveData(),
      soundSettings: {
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.5,
        musicEnabled: true,
        sfxEnabled: true,
      },
    });
  },
}));

// ==========================================
// Helper functions referenced by the store
// ==========================================

/**
 * Determines which cutscene should play for a given level.
 * Only levels 1 and every 10th level have cutscenes.
 * 
 * @param levelId - The level number
 * @returns The cutscene ID or null
 */
function getCutsceneForLevel(levelId: number): string | null {
  if (levelId !== 1 && levelId % 10 !== 0) return null;

  // Check for predefined cutscenes
  // (In the original code: F[levelId] for special boss cutscenes)
  if (levelId === 1) return "ch1-intro";
  if (levelId > 250 && levelId % 10 === 0) {
    const chapter = Math.floor((levelId - 1) / 100) + 6;
    return `ch${chapter}-zone`;
  }

  return null;
}

/**
 * Generates a procedural level definition for levels not in the predefined list.
 * Creates random level parameters based on the level number.
 * 
 * @param levelId - The level number to generate
 * @returns A procedurally generated level definition
 */
function generateProceduralLevel(levelId: number): LevelDefinition {
  // Placeholder for procedural generation logic
  // The original code has extensive procedural generation
  return {
    id: levelId,
    name: `LEVEL ${levelId}`,
    chapter: `CH.${Math.ceil(levelId / 2)}`,
    introText: "GET READY!",
    introColor: "#00ffff",
    waves: [],
    gangMembersAvailable: [],
  };
}

export default useGameStore;
