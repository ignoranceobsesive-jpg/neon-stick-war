// ============================================================================
// NeonStickWar — Skill & Weapon Definitions
// ============================================================================
// Skills are active abilities the player can trigger during gameplay.
// Weapons define the projectile-based attack system.
// Both are defined as static data here and referenced by the combat system.
// ============================================================================

// ---------------------------------------------------------------------------
// Skill Interfaces
// ---------------------------------------------------------------------------

/** Element types for skills — determines visual effects and enemy interactions */
export type SkillElement = "fire" | "ice" | "shadow" | "dash";

/** How a skill is unlocked — affects the shop UI and progression system */
export type UnlockMethod = "purchase" | "chest" | "ad" | "story";

/** A player skill that can be activated during combat */
export interface Skill {
  /** Unique skill identifier (used in save data and upgrade system) */
  id: string;

  /** Display name shown in the skill shop and HUD */
  name: string;

  /** Element type — determines VFX style and damage interactions */
  element: SkillElement;

  /** In-game description shown in the shop */
  description: string;

  /** How this skill is unlocked — affects shop UI flow */
  unlockMethod: UnlockMethod;

  /** Cost in crystals to unlock (0 for story-granted skills) */
  unlockCost: number;

  /** Cooldown between uses in milliseconds */
  cooldown: number;

  /** Duration of the skill effect in milliseconds (e.g. projectile lifetime) */
  duration: number;

  /** Base damage dealt by the skill */
  damage: number;
}

// ---------------------------------------------------------------------------
// Weapon Interfaces
// ---------------------------------------------------------------------------

/** A weapon type that modifies the player's basic attack */
export interface Weapon {
  /** Unique weapon identifier */
  id: string;

  /** Display name shown in weapon select UI */
  name: string;

  /** Damage per hit (or per pellet for multi-projectile weapons) */
  damage: number;

  /** Minimum time between shots in milliseconds */
  fireRate: number;

  /** Speed of the projectile in pixels per frame */
  projectileSpeed: number;

  /** Number of projectiles fired per shot (1 for single-shot, 3+ for spread) */
  pelletsPerShot: number;
}

// ============================================================================
// Skill Definitions
// ============================================================================

/**
 * All player skills. The dash skill is unlocked through story progression;
 * all others can be purchased from the skill shop.
 */
export const SKILLS: Skill[] = [
  // --------------------------------------------------------------------------
  // FIREBALL — Classic ranged AoE fire attack
  // --------------------------------------------------------------------------
  {
    id: "fireball",
    name: "FIREBALL",
    element: "fire",
    description: "Launch a searing fireball",
    unlockMethod: "purchase",
    unlockCost: 800,
    cooldown: 2000,
    duration: 500,
    damage: 25,
  },

  // --------------------------------------------------------------------------
  // ICE SHARD — Ranged freeze attack
  // --------------------------------------------------------------------------
  {
    id: "iceShard",
    name: "ICE SHARD",
    element: "ice",
    description: "Freeze enemies with crystal shards",
    unlockMethod: "purchase",
    unlockCost: 800,
    cooldown: 2500,
    duration: 400,
    damage: 20,
  },

  // --------------------------------------------------------------------------
  // SHADOW STEP — Phase-shift movement ability
  // --------------------------------------------------------------------------
  {
    id: "shadowStep",
    name: "SHADOW STEP",
    element: "shadow",
    description: "Phase through the shadow dimension",
    unlockMethod: "purchase",
    unlockCost: 1200,
    cooldown: 3000,
    duration: 200,
    damage: 15,
  },

  // --------------------------------------------------------------------------
  // DASH — Quick burst of speed (granted through story, always available)
  // --------------------------------------------------------------------------
  {
    id: "dash",
    name: "DASH",
    element: "dash",
    description: "Burst forward with neon speed",
    unlockMethod: "story",
    unlockCost: 0,
    cooldown: 500,
    duration: 150,
    damage: 10,
  },
];

// ============================================================================
// Weapon Definitions
// ============================================================================

/**
 * All weapon types. Each weapon modifies the player's basic attack pattern.
 * The pistol is the default weapon; shotgun and rifle can be unlocked.
 */
export const WEAPONS: Weapon[] = [
  // --------------------------------------------------------------------------
  // PISTOL — Default weapon, balanced fire rate and damage
  // --------------------------------------------------------------------------
  {
    id: "pistol",
    name: "PISTOL",
    damage: 10,
    fireRate: 300,
    projectileSpeed: 12,
    pelletsPerShot: 1,
  },

  // --------------------------------------------------------------------------
  // SHOTGUN — Close-range spread: 3 pellets × 6 damage = 18 total
  // Higher damage at close range but slow fire rate
  // --------------------------------------------------------------------------
  {
    id: "shotgun",
    name: "SHOTGUN",
    damage: 6,
    fireRate: 800,
    projectileSpeed: 10,
    pelletsPerShot: 3,
  },

  // --------------------------------------------------------------------------
  // RIFLE — Long-range precision weapon: high single-shot damage
  // Slower fire rate but highest per-hit damage
  // --------------------------------------------------------------------------
  {
    id: "rifle",
    name: "RIFLE",
    damage: 20,
    fireRate: 600,
    projectileSpeed: 16,
    pelletsPerShot: 1,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper: find a skill by its id
 */
export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find((skill) => skill.id === id);
}

/**
 * Helper: find a weapon by its id
 */
export function getWeaponById(id: string): Weapon | undefined {
  return WEAPONS.find((weapon) => weapon.id === id);
}

/**
 * Helper: get all skills of a given element
 */
export function getSkillsByElement(element: SkillElement): Skill[] {
  return SKILLS.filter((skill) => skill.element === element);
}

/**
 * Helper: get purchasable skills (excludes story-granted ones)
 */
export function getPurchasableSkills(): Skill[] {
  return SKILLS.filter((skill) => skill.unlockMethod === "purchase");
}

/**
 * Helper: calculate the total damage per second for a weapon
 */
export function getWeaponDPS(weapon: Weapon): number {
  const shotsPerSecond = 1000 / weapon.fireRate;
  const damagePerShot = weapon.damage * weapon.pelletsPerShot;
  return damagePerShot * shotsPerSecond;
}
