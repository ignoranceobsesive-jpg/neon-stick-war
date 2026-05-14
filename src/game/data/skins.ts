// ============================================================================
// NeonStickWar — Character Skin Definitions
// ============================================================================
// Skins are cosmetic character appearances that can be purchased with
// in-game currency. Each skin changes the stickman's color scheme:
// body color, glow outline, and movement trail.
//
// Rarity affects the shop UI presentation and crystal cost scaling.
// ============================================================================

/** Skin rarity tiers — affect shop presentation and perceived value */
export type SkinRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/** A character skin that changes the player's visual appearance */
export interface Skin {
  /** Unique skin identifier (used in save data and shop logic) */
  id: string;

  /** Display name shown in the skin shop */
  name: string;

  /** Primary body color (hex) — the stickman's fill color */
  color: string;

  /** Glow outline color (hex) — neon aura around the character */
  glowColor: string;

  /** Movement trail color (hex) — particle trail when dashing/running */
  trailColor: string;

  /** Price in crystals — 0 means free/default */
  price: number;

  /** Rarity tier — affects shop UI borders and background effects */
  rarity: SkinRarity;
}

// ============================================================================
// Skin Definitions
// ============================================================================

/**
 * All available character skins.
 * The first skin (neon-green) is the default and costs 0 crystals.
 * Skins are purely cosmetic — no gameplay advantages.
 */
export const SKINS: Skin[] = [
  // --------------------------------------------------------------------------
  // COMMON — Default skin, free
  // --------------------------------------------------------------------------
  {
    id: "neon-green",
    name: "NEON",
    color: "#00ff66",
    glowColor: "#00ff66",
    trailColor: "#00ff44",
    price: 0,
    rarity: "common",
  },

  // --------------------------------------------------------------------------
  // UNCOMMON — Affordable palette swaps
  // --------------------------------------------------------------------------
  {
    id: "cyan",
    name: "CYBER",
    color: "#00ffff",
    glowColor: "#00ffff",
    trailColor: "#00ddff",
    price: 500,
    rarity: "uncommon",
  },
  {
    id: "red",
    name: "CRIMSON",
    color: "#ff3333",
    glowColor: "#ff3333",
    trailColor: "#ff2222",
    price: 800,
    rarity: "uncommon",
  },

  // --------------------------------------------------------------------------
  // RARE — Distinct themed skins
  // --------------------------------------------------------------------------
  {
    id: "fire",
    name: "INFERNO",
    color: "#ff6600",
    glowColor: "#ff8800",
    trailColor: "#ff4400",
    price: 1500,
    rarity: "rare",
  },
  {
    id: "ice",
    name: "FROST",
    color: "#88eeff",
    glowColor: "#aaffff",
    trailColor: "#66ccff",
    price: 1500,
    rarity: "rare",
  },
  {
    id: "shadow",
    name: "PHANTOM",
    color: "#cc00ff",
    glowColor: "#dd44ff",
    trailColor: "#aa00dd",
    price: 2400,
    rarity: "rare",
  },

  // --------------------------------------------------------------------------
  // EPIC — Premium golden skin
  // --------------------------------------------------------------------------
  {
    id: "gold",
    name: "GOLDEN",
    color: "#ffd700",
    glowColor: "#ffed4a",
    trailColor: "#ffcc00",
    price: 15000,
    rarity: "epic",
  },

  // --------------------------------------------------------------------------
  // LEGENDARY — The ultimate skin
  // --------------------------------------------------------------------------
  {
    id: "void",
    name: "VOID",
    color: "#ff0066",
    glowColor: "#ff4488",
    trailColor: "#dd0044",
    price: 30000,
    rarity: "legendary",
  },
];

/**
 * Helper: get the default skin (always the first, free skin)
 */
export const DEFAULT_SKIN = SKINS[0];

/**
 * Helper: find a skin by its id
 */
export function getSkinById(id: string): Skin | undefined {
  return SKINS.find((skin) => skin.id === id);
}

/**
 * Helper: get all skins of a given rarity
 */
export function getSkinsByRarity(rarity: SkinRarity): Skin[] {
  return SKINS.filter((skin) => skin.rarity === rarity);
}
