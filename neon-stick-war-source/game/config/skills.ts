/**
 * Skill/spell definitions for Neon Stick War.
 *
 * Skills are powerful abilities the player can unlock and use in combat.
 * They are organized by element and have varying rarities and unlock methods.
 *
 * Unlock methods:
 *   - "level":    Unlocked automatically at a specific player level
 *   - "boss":     Unlocked by defeating a specific boss
 *   - "chest":    Unlocked by purchasing from a chest
 *   - "purchase": Unlocked by purchasing with coins
 *   - "ad":       Unlocked by watching an ad (with coin alternative)
 *
 * Effect types:
 *   - "projectile": Fires one or more projectiles
 *   - "aoe":        Area-of-effect damage within a radius
 *   - "beam":       Directed beam attack
 *   - "buff":       Applies a temporary buff to the player
 *   - "summon":     Summons creatures to fight alongside the player
 *
 * Original minified variable: `P`
 */

/** Rarity tier for skills */
export type SkillRarity = "common" | "rare" | "epic" | "legendary";

/** How the skill can be unlocked */
export type SkillUnlockMethod = "level" | "boss" | "chest" | "purchase" | "ad";

/** What kind of visual/mechanical effect the skill produces */
export type SkillEffectType = "projectile" | "aoe" | "beam" | "buff" | "summon";

/** Element/type classification for skills */
export type SkillElement = "fire" | "frost" | "shadow" | "summon" | "death" | "lightning" | "void" | "blood";

/** Data for a single skill/spell */
export interface SkillConfig {
  /** Unique identifier */
  id: string;
  /** Display name (uppercase) */
  name: string;
  /** Element classification */
  element: SkillElement;
  /** Flavor text description */
  description: string;
  /** Base damage dealt */
  damage: number;
  /** Cooldown in frames */
  cooldown: number;
  /** Duration in frames */
  duration: number;
  /** Primary effect color */
  color: string;
  /** Glow/aura color */
  glowColor: string;
  /** Rarity tier */
  rarity: SkillRarity;
  /** How this skill is unlocked */
  unlockMethod: SkillUnlockMethod;
  /** Coin cost for purchase/ad-unlock methods (0 = free/boss/level) */
  unlockCost: number;
  /** Player level required (only for "level" unlock method) */
  unlockLevel?: number;
  /** Boss that must be defeated (only for "boss" unlock method) */
  unlockBoss?: string;
  /** Type of visual/mechanical effect */
  effectType: SkillEffectType;
  /** Number of projectiles fired (only for "projectile" effect type) */
  projectileCount?: number;
  /** Radius of effect (only for "aoe" effect type) */
  effectRadius?: number;
  /** Number of summons (only for "summon" effect type) */
  summonCount?: number;
}

/**
 * All 20 skill/spell definitions in the game.
 *
 * Organized by element: Fire → Frost → Shadow → Summon → Death → Lightning → Void → Blood
 */
export const SKILLS: SkillConfig[] = [
  // ══════════ FIRE SKILLS ══════════
  {
    id: "fireball",
    name: "FIREBALL",
    element: "fire",
    description: "Launch a devastating fireball that explodes on impact, dealing area damage to all nearby enemies.",
    damage: 25,
    cooldown: 180,
    duration: 30,
    color: "#ff4400",
    glowColor: "#ff8844",
    rarity: "common",
    unlockMethod: "level",
    unlockCost: 0,
    unlockLevel: 2,
    effectType: "projectile",
    projectileCount: 1,
  },
  {
    id: "fireStorm",
    name: "FIRE STORM",
    element: "fire",
    description: "Rain fire from above! Multiple fireballs cascade across the battlefield, creating a devastating inferno.",
    damage: 40,
    cooldown: 360,
    duration: 60,
    color: "#ff2200",
    glowColor: "#ff6600",
    rarity: "rare",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossRedKing",
    effectType: "aoe",
    effectRadius: 200,
  },
  {
    id: "inferno",
    name: "INFERNO",
    element: "fire",
    description: "Unleash the ultimate fire technique. A massive pillar of flame erupts from the ground, incinerating everything.",
    damage: 60,
    cooldown: 480,
    duration: 90,
    color: "#ff0000",
    glowColor: "#ffaa00",
    rarity: "legendary",
    unlockMethod: "ad",
    unlockCost: 4000,
    effectType: "beam",
    effectRadius: 150,
  },

  // ══════════ FROST SKILLS ══════════
  {
    id: "iceShard",
    name: "ICE SHARD",
    element: "frost",
    description: "Fire razor-sharp ice shards that pierce through enemies and slow their movement.",
    damage: 20,
    cooldown: 150,
    duration: 60,
    color: "#88eeff",
    glowColor: "#ffffff",
    rarity: "common",
    unlockMethod: "level",
    unlockCost: 0,
    unlockLevel: 5,
    effectType: "projectile",
    projectileCount: 3,
  },
  {
    id: "blizzard",
    name: "BLIZZARD",
    element: "frost",
    description: "Summon a raging blizzard that freezes all enemies in a wide area.",
    damage: 35,
    cooldown: 300,
    duration: 90,
    color: "#44ddff",
    glowColor: "#ffffff",
    rarity: "rare",
    unlockMethod: "chest",
    unlockCost: 1800,
    effectType: "aoe",
    effectRadius: 250,
  },
  {
    id: "absoluteZero",
    name: "ABSOLUTE ZERO",
    element: "frost",
    description: "Flash-freeze the entire battlefield, stopping ALL enemies in their tracks.",
    damage: 50,
    cooldown: 600,
    duration: 120,
    color: "#ffffff",
    glowColor: "#88eeff",
    rarity: "legendary",
    unlockMethod: "ad",
    unlockCost: 5000,
    effectType: "aoe",
    effectRadius: 500,
  },

  // ══════════ SHADOW SKILLS ══════════
  {
    id: "shadowStep",
    name: "SHADOW STEP",
    element: "shadow",
    description: "Teleport behind the nearest enemy and strike from the shadows. Grants brief invincibility.",
    damage: 30,
    cooldown: 200,
    duration: 20,
    color: "#8800ff",
    glowColor: "#aa44ff",
    rarity: "common",
    unlockMethod: "level",
    unlockCost: 0,
    unlockLevel: 8,
    effectType: "buff",
  },
  {
    id: "shadowClone",
    name: "SHADOW CLONE",
    element: "shadow",
    description: "Create shadow clones that fight alongside you and draw enemy fire.",
    damage: 15,
    cooldown: 360,
    duration: 180,
    color: "#6600cc",
    glowColor: "#9933ff",
    rarity: "epic",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossCorrupted",
    effectType: "summon",
    summonCount: 2,
  },
  {
    id: "voidWalk",
    name: "VOID WALK",
    element: "shadow",
    description: "Enter the void dimension, becoming invisible and invincible. Next attack deals 3x damage.",
    damage: 45,
    cooldown: 480,
    duration: 60,
    color: "#4400aa",
    glowColor: "#8800ff",
    rarity: "legendary",
    unlockMethod: "ad",
    unlockCost: 4000,
    effectType: "buff",
  },

  // ══════════ SUMMON SKILLS ══════════
  {
    id: "summonWraith",
    name: "SUMMON WRAITH",
    element: "summon",
    description: "Summon a spectral wraith that hunts down enemies and drains their life force.",
    damage: 12,
    cooldown: 240,
    duration: 200,
    color: "#aa00ff",
    glowColor: "#ff00ff",
    rarity: "common",
    unlockMethod: "purchase",
    unlockCost: 1200,
    effectType: "summon",
    summonCount: 1,
  },
  {
    id: "summonLegion",
    name: "SUMMON LEGION",
    element: "summon",
    description: "Raise an army of shadow soldiers that charge forward, overwhelming enemies with numbers.",
    damage: 20,
    cooldown: 420,
    duration: 180,
    color: "#8800cc",
    glowColor: "#cc44ff",
    rarity: "epic",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossMechGolem",
    effectType: "summon",
    summonCount: 5,
  },
  {
    id: "summonDeathKnight",
    name: "DEATH KNIGHT",
    element: "summon",
    description: "Summon the legendary Death Knight, an unstoppable warrior that cleaves through enemies.",
    damage: 35,
    cooldown: 600,
    duration: 240,
    color: "#440066",
    glowColor: "#8800aa",
    rarity: "legendary",
    unlockMethod: "ad",
    unlockCost: 6000,
    effectType: "summon",
    summonCount: 1,
  },

  // ══════════ DEATH SKILLS ══════════
  {
    id: "deathTouch",
    name: "DEATH TOUCH",
    element: "death",
    description: "Channel the power of death. A close-range touch that instantly kills weaker enemies.",
    damage: 50,
    cooldown: 300,
    duration: 15,
    color: "#330033",
    glowColor: "#660066",
    rarity: "rare",
    unlockMethod: "chest",
    unlockCost: 2400,
    effectType: "beam",
  },
  {
    id: "soulHarvest",
    name: "SOUL HARVEST",
    element: "death",
    description: "Reap the souls of nearby enemies, dealing damage and healing yourself for each hit.",
    damage: 30,
    cooldown: 360,
    duration: 45,
    color: "#220022",
    glowColor: "#550055",
    rarity: "epic",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossFather",
    effectType: "aoe",
    effectRadius: 200,
  },
  {
    id: "annihilation",
    name: "ANNIHILATION",
    element: "death",
    description: "Obliterate everything in a massive radius. Non-boss enemies are instantly killed.",
    damage: 999,
    cooldown: 900,
    duration: 30,
    color: "#110011",
    glowColor: "#330033",
    rarity: "legendary",
    unlockMethod: "ad",
    unlockCost: 10000,
    effectType: "aoe",
    effectRadius: 400,
  },

  // ══════════ LIGHTNING SKILLS ══════════
  {
    id: "lightningBolt",
    name: "LIGHTNING BOLT",
    element: "lightning",
    description: "Strike enemies with a bolt of lightning that chains between nearby targets.",
    damage: 22,
    cooldown: 160,
    duration: 20,
    color: "#ffff00",
    glowColor: "#ffffff",
    rarity: "common",
    unlockMethod: "level",
    unlockCost: 0,
    unlockLevel: 12,
    effectType: "projectile",
    projectileCount: 1,
  },
  {
    id: "thunderStorm",
    name: "THUNDER STORM",
    element: "lightning",
    description: "Call down a devastating thunder storm that repeatedly strikes the battlefield.",
    damage: 38,
    cooldown: 350,
    duration: 90,
    color: "#ffff44",
    glowColor: "#ffffff",
    rarity: "epic",
    unlockMethod: "purchase",
    unlockCost: 3600,
    effectType: "aoe",
    effectRadius: 300,
  },

  // ══════════ VOID SKILLS ══════════
  {
    id: "voidBlast",
    name: "VOID BLAST",
    element: "void",
    description: "Fire a concentrated blast of void energy that tears through enemies and distorts reality.",
    damage: 28,
    cooldown: 200,
    duration: 40,
    color: "#ff00ff",
    glowColor: "#ff44ff",
    rarity: "rare",
    unlockMethod: "level",
    unlockCost: 0,
    unlockLevel: 20,
    effectType: "projectile",
    projectileCount: 1,
  },
  {
    id: "voidRift",
    name: "VOID RIFT",
    element: "void",
    description: "Tear open a rift in reality that continuously damages and slows all enemies within.",
    damage: 20,
    cooldown: 400,
    duration: 150,
    color: "#cc00cc",
    glowColor: "#ff44ff",
    rarity: "epic",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossDragon",
    effectType: "aoe",
    effectRadius: 180,
  },

  // ══════════ BLOOD SKILLS ══════════
  {
    id: "bloodStrike",
    name: "BLOOD STRIKE",
    element: "blood",
    description: "Sacrifice health to deal massive damage. The lower your health, the more damage this deals.",
    damage: 35,
    cooldown: 180,
    duration: 15,
    color: "#cc0000",
    glowColor: "#ff3333",
    rarity: "rare",
    unlockMethod: "purchase",
    unlockCost: 1500,
    effectType: "projectile",
    projectileCount: 1,
  },
  {
    id: "bloodFury",
    name: "BLOOD FURY",
    element: "blood",
    description: "Enter a blood rage that massively increases attack speed and damage, but drains health.",
    damage: 0,
    cooldown: 420,
    duration: 180,
    color: "#990000",
    glowColor: "#ff0000",
    rarity: "epic",
    unlockMethod: "boss",
    unlockCost: 0,
    unlockBoss: "bossPhoenix",
    effectType: "buff",
  },
] as const;
