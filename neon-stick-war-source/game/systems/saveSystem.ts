/**
 * Save System - Handles persistent game data storage
 * 
 * Manages saving and loading game state to/from localStorage.
 * Includes cloud sync support, daily rewards, and coin management.
 */

/** Ranking data for versus/competitive mode */
export interface RankingData {
  /** ELO rating score */
  elo: number;
  /** Number of versus wins */
  wins: number;
  /** Number of versus losses */
  losses: number;
}

/** Complete save data structure persisted to localStorage */
export interface SaveData {
  /** Current story chapter (1-5+) */
  currentChapter: number;
  /** Highest level reached (next unlock) */
  highestLevel: number;
  /** Total coins accumulated */
  totalCoins: number;
  /** Total score accumulated across all levels */
  totalScore: number;
  /** Array of unlocked skin IDs */
  unlockedSkins: string[];
  /** Currently equipped skin ID */
  currentSkin: string;
  /** Currently equipped pet ID */
  currentPet: string;
  /** Array of unlocked pet IDs */
  unlockedPets: string[];
  /** Currently equipped pet skin ID */
  currentPetSkin: string;
  /** Array of unlocked pet skin IDs */
  unlockedPetSkins: string[];
  /** Array of unlocked gang member IDs */
  gangMembersUnlocked: string[];
  /** Array of completed mission level IDs (as strings) */
  missionsCompleted: string[];
  /** Highest score in endless mode */
  endlessHighScore: number;
  /** Highest wave reached in endless mode */
  endlessHighestWave: number;
  /** Total enemies killed across all modes */
  totalKills: number;
  /** Total player deaths across all modes */
  totalDeaths: number;
  /** Timestamp of last save */
  lastSaveTime: number;
  /** Versus/competitive ranking data */
  rankingData: RankingData;
  /** Player display username */
  username: string;
  /** Player avatar emoji */
  avatar: string;
  /** Player about/bio text */
  about: string;
  /** Player nationality */
  nationality: string;
  /** Array of unlocked skill IDs */
  unlockedSkills: string[];
  /** Equipped skill IDs in 3 slots (empty string = no skill) */
  equippedSkills: [string, string, string];
  /** Skill upgrade levels keyed by skill ID */
  skillUpgrades: Record<string, number>;
  /** Date string of last daily reward claim (YYYY-MM-DD) */
  lastDailyRewardDay: string;
  /** Current daily reward streak (1-7) */
  dailyRewardStreak: number;
  /** Star ratings per level keyed by level ID string */
  levelStars: Record<string, number>;
  /** Weapon upgrade levels keyed by weapon type */
  weaponUpgrades: Record<string, number>;
  /** Whether the player has seen the tap-to-start tutorial */
  hasSeenTapToStart: boolean;
  /** Skin power upgrade levels keyed by skin ID */
  skinUpgrades: Record<string, number>;
}

/** Default ranking data for new players */
const DEFAULT_RANKING_DATA: RankingData = {
  elo: 1000,
  wins: 0,
  losses: 0,
};

/** Default save data for new players */
const DEFAULT_SAVE_DATA: SaveData = {
  currentChapter: 1,
  highestLevel: 1,
  totalCoins: 0,
  totalScore: 0,
  unlockedSkins: ["neon-green"],
  currentSkin: "neon-green",
  currentPet: "crystalGolem",
  unlockedPets: ["neonWolf", "crystalGolem"],
  currentPetSkin: "wolf-default",
  unlockedPetSkins: ["wolf-default"],
  gangMembersUnlocked: [],
  missionsCompleted: [],
  endlessHighScore: 0,
  endlessHighestWave: 0,
  totalKills: 0,
  totalDeaths: 0,
  lastSaveTime: 0,
  rankingData: { ...DEFAULT_RANKING_DATA },
  username: "NeonWarrior",
  avatar: "⚔️",
  about: "",
  nationality: "",
  unlockedSkills: [],
  equippedSkills: ["", "", ""],
  skillUpgrades: {},
  lastDailyRewardDay: "",
  dailyRewardStreak: 0,
  levelStars: {},
  weaponUpgrades: {},
  hasSeenTapToStart: false,
  skinUpgrades: {},
};

/** localStorage key for the main save data */
const SAVE_KEY = "neonStickman_save_v4";

/** localStorage key for sound settings (used during reset) */
const SOUND_KEY = "neonStickman_sound_v1";

/** Cloud sync upload callback - set externally by the game store */
let cloudSyncEnabled = false;

/**
 * Uploads save data to cloud if cloud sync is enabled.
 * Silently fails if cloud sync is unavailable.
 * 
 * @param saveData - The save data to upload to cloud storage
 */
async function uploadToCloud(saveData: SaveData): Promise<void> {
  if (cloudSyncEnabled) {
    try {
      const { uploadSaveToCloud } = await import("@/lib/firebase/cloudStorage");
      if (await uploadSaveToCloud(saveData)) {
        try {
          const { logAnalyticsEvent } = await import("@/lib/firebase/analytics");
          logAnalyticsEvent("cloud_sync", {
            level: saveData.highestLevel,
            coins: saveData.totalCoins,
          });
        } catch {
          // Analytics not available
        }
      }
    } catch {
      // Cloud upload not available
    }
  }
}

/**
 * Loads the save data from localStorage.
 * Falls back to default values for missing or corrupted data.
 * Ensures "neon-green" is always in unlockedSkins and is the fallback currentSkin.
 * Normalizes equippedSkills to exactly 3 slots.
 * 
 * @returns The loaded SaveData with defaults applied for missing fields
 */
export function loadSave(): SaveData {
  try {
    const stored = localStorage.getItem(SAVE_KEY);
    if (!stored) {
      return {
        ...DEFAULT_SAVE_DATA,
        rankingData: { ...DEFAULT_RANKING_DATA },
      };
    }

    const parsed = JSON.parse(stored);

    // Ensure neon-green is always in unlockedSkins
    const unlockedSkins = parsed.unlockedSkins || ["neon-green"];
    if (!unlockedSkins.includes("neon-green")) {
      unlockedSkins.push("neon-green");
    }

    // Default skin falls back to neon-green if invalid
    const currentSkin =
      parsed.currentSkin === "default"
        ? "neon-green"
        : parsed.currentSkin || "neon-green";

    // Normalize equippedSkills to exactly 3 slots
    const equippedSkills = (
      parsed.equippedSkills ?? DEFAULT_SAVE_DATA.equippedSkills
    )
      .slice(0, 3)
      .concat(["", "", ""])
      .slice(0, 3) as [string, string, string];

    return {
      ...DEFAULT_SAVE_DATA,
      ...parsed,
      unlockedSkins,
      currentSkin,
      rankingData: {
        ...DEFAULT_RANKING_DATA,
        ...(parsed.rankingData || {}),
      },
      unlockedPets: parsed.unlockedPets || ["neonWolf"],
      unlockedPetSkins: parsed.unlockedPetSkins || ["wolf-default"],
      username: parsed.username || DEFAULT_SAVE_DATA.username,
      avatar: parsed.avatar || DEFAULT_SAVE_DATA.avatar,
      about: parsed.about ?? DEFAULT_SAVE_DATA.about,
      nationality: parsed.nationality ?? DEFAULT_SAVE_DATA.nationality,
      unlockedSkills: parsed.unlockedSkills ?? DEFAULT_SAVE_DATA.unlockedSkills,
      equippedSkills,
      skillUpgrades: parsed.skillUpgrades ?? DEFAULT_SAVE_DATA.skillUpgrades,
      lastDailyRewardDay:
        parsed.lastDailyRewardDay ?? DEFAULT_SAVE_DATA.lastDailyRewardDay,
      dailyRewardStreak:
        parsed.dailyRewardStreak ?? DEFAULT_SAVE_DATA.dailyRewardStreak,
      levelStars: parsed.levelStars ?? DEFAULT_SAVE_DATA.levelStars,
      weaponUpgrades: parsed.weaponUpgrades ?? DEFAULT_SAVE_DATA.weaponUpgrades,
      hasSeenTapToStart:
        parsed.hasSeenTapToStart ?? DEFAULT_SAVE_DATA.hasSeenTapToStart,
      skinUpgrades: parsed.skinUpgrades ?? DEFAULT_SAVE_DATA.skinUpgrades,
      gangMembersUnlocked:
        parsed.gangMembersUnlocked ?? DEFAULT_SAVE_DATA.gangMembersUnlocked,
      missionsCompleted:
        parsed.missionsCompleted ?? DEFAULT_SAVE_DATA.missionsCompleted,
    };
  } catch {
    return {
      ...DEFAULT_SAVE_DATA,
      rankingData: { ...DEFAULT_RANKING_DATA },
    };
  }
}

/**
 * Writes save data to localStorage and triggers cloud upload if enabled.
 * Adds the current timestamp as lastSaveTime before writing.
 * Silently fails if localStorage is unavailable.
 * 
 * @param saveData - The complete save data to persist
 */
export function writeSave(saveData: SaveData): void {
  try {
    saveData.lastSaveTime = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    uploadToCloud(saveData);
  } catch {
    // localStorage unavailable or quota exceeded
  }
}

/**
 * Adds coins to the save data and returns a new save data object.
 * Does NOT write to localStorage - caller must call writeSave() if needed.
 * 
 * @param saveData - The current save data
 * @param coins - Number of coins to add
 * @returns New save data with updated totalCoins
 */
export function addCoinsToSave(saveData: SaveData, coins: number): SaveData {
  return {
    ...saveData,
    totalCoins: saveData.totalCoins + coins,
  };
}

/**
 * Checks whether the player is eligible to claim a daily reward.
 * A daily reward can be claimed once per calendar day.
 * 
 * @param saveData - The current save data
 * @returns True if the player hasn't claimed today's reward yet
 */
export function canClaimDailyReward(saveData: SaveData): boolean {
  const today = new Date().toISOString().split("T")[0];
  return saveData.lastDailyRewardDay !== today;
}

/**
 * Enables or disables cloud sync for save data uploads.
 * When enabled, writeSave() will attempt to upload saves to the cloud.
 * 
 * @param enabled - Whether cloud sync should be enabled
 */
export function setCloudSyncEnabled(enabled: boolean): void {
  cloudSyncEnabled = enabled;
}

/**
 * Deletes all saved game data from localStorage.
 * Removes both the main save and sound settings.
 */
export function clearSaveData(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SOUND_KEY);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Returns the default save data template.
 * Useful for resetting save data or initializing new games.
 * 
 * @returns A fresh copy of the default save data
 */
export function getDefaultSaveData(): SaveData {
  return {
    ...DEFAULT_SAVE_DATA,
    rankingData: { ...DEFAULT_RANKING_DATA },
  };
}

export { DEFAULT_SAVE_DATA, DEFAULT_RANKING_DATA, SAVE_KEY, SOUND_KEY };
