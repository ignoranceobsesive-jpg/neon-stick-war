/**
 * Player skin/cosmetic data for Neon Stick War.
 *
 * Player skins change the visual appearance of the player character's
 * body, glow, and trail. Skins are unlocked via purchase, level, or
 * other conditions. Higher-rarity skins may have special effects.
 *
 * Original minified variable: `C`
 * Color references replaced with hex values from colors.ts:
 *   n=#00ffff, i=#ff00ff, s=#00ff66, c=#ff6600,
 *   d=#ffff00, h=#aa00ff, f=#ff3333, m=#ffd700,
 *   g=#ffffff, u=#050510
 */

/** Rarity tier for player skins */
export type PlayerSkinRarity = "common" | "rare" | "epic" | "legendary";

/** Special visual effect type for legendary skins */
export type PlayerSkinEffect = "rainbow" | "sparkle" | "shadow" | "plasma" | "holy" | "abyss" | "glitch";

/** Data for a single player skin */
export interface PlayerSkinConfig {
  /** Unique skin identifier */
  id: string;
  /** Display name (uppercase) */
  name: string;
  /** Primary body color */
  color: string;
  /** Glow/aura color */
  glowColor: string;
  /** Trail particle color */
  trailColor: string;
  /** Coin cost to purchase (0 = default/free) */
  price: number;
  /** Rarity tier */
  rarity: PlayerSkinRarity;
  /** Optional: Player level required to unlock */
  unlockLevel?: number;
  /** Optional special visual effect (only on legendary skins) */
  effect?: PlayerSkinEffect;
}

/**
 * All 18 player skins available in the game.
 *
 * Ordered by rarity: common → rare → epic → legendary.
 * Prices in source used scientific notation: 3e3=3000, 5e3=5000, etc.
 */
export const PLAYER_SKINS: PlayerSkinConfig[] = [
  // ── COMMON ──
  {
    id: "neon-green",
    name: "TOXIC",
    color: "#00ff66",
    glowColor: "#00ff66",
    trailColor: "#00ff66",
    price: 0,
    rarity: "common",
  },

  // ── RARE ──
  {
    id: "fire-red",
    name: "BLAZE",
    color: "#ff3333",
    glowColor: "#ff6600",
    trailColor: "#ff6600",
    price: 5000,
    rarity: "rare",
  },
  {
    id: "royal-purple",
    name: "ROYAL",
    color: "#aa00ff",
    glowColor: "#ff00ff",
    trailColor: "#ff00ff",
    price: 5000,
    rarity: "rare",
    unlockLevel: 6,
  },
  {
    id: "crimson",
    name: "CRIMSON",
    color: "#ff2222",
    glowColor: "#ff6644",
    trailColor: "#ff2222",
    price: 3000,
    rarity: "rare",
  },
  {
    id: "emerald",
    name: "EMERALD",
    color: "#00cc66",
    glowColor: "#44ff88",
    trailColor: "#00cc66",
    price: 3000,
    rarity: "rare",
  },
  {
    id: "sapphire",
    name: "SAPPHIRE",
    color: "#2266ff",
    glowColor: "#4488ff",
    trailColor: "#2266ff",
    price: 3000,
    rarity: "rare",
  },

  // ── EPIC ──
  {
    id: "gold",
    name: "GOLDEN",
    color: "#ffd700",
    glowColor: "#ffff00",
    trailColor: "#ffff00",
    price: 15000,
    rarity: "epic",
  },
  {
    id: "shadow",
    name: "PHANTOM",
    color: "#4444ff",
    glowColor: "#8888ff",
    trailColor: "#aa00ff",
    price: 15000,
    rarity: "epic",
    unlockLevel: 10,
  },
  {
    id: "sunset",
    name: "SUNSET",
    color: "#ff8800",
    glowColor: "#ffaa44",
    trailColor: "#ff8800",
    price: 10000,
    rarity: "epic",
  },
  {
    id: "arctic",
    name: "ARCTIC",
    color: "#88ddff",
    glowColor: "#ffffff",
    trailColor: "#88ddff",
    price: 10000,
    rarity: "epic",
  },
  {
    id: "venom",
    name: "VENOM",
    color: "#88ff00",
    glowColor: "#aaff44",
    trailColor: "#88ff00",
    price: 10000,
    rarity: "epic",
  },
  {
    id: "neon-pink",
    name: "NEON PINK",
    color: "#ff44aa",
    glowColor: "#ff88cc",
    trailColor: "#ff44aa",
    price: 18000,
    rarity: "epic",
  },

  // ── LEGENDARY ──
  {
    id: "rainbow",
    name: "PRISM",
    color: "#ffffff",
    glowColor: "#ff00ff",
    trailColor: "#00ffff",
    price: 30000,
    rarity: "legendary",
    effect: "rainbow",
  },
  {
    id: "diamond",
    name: "DIAMOND",
    color: "#88ffff",
    glowColor: "#ffffff",
    trailColor: "#00ffff",
    price: 40000,
    rarity: "legendary",
    effect: "sparkle",
  },
  {
    id: "obsidian",
    name: "OBSIDIAN",
    color: "#333344",
    glowColor: "#666688",
    trailColor: "#333344",
    price: 30000,
    rarity: "legendary",
    effect: "shadow",
  },
  {
    id: "plasma",
    name: "PLASMA",
    color: "#ff44ff",
    glowColor: "#ff88ff",
    trailColor: "#ff44ff",
    price: 30000,
    rarity: "legendary",
    effect: "plasma",
  },
  {
    id: "celestial",
    name: "CELESTIAL",
    color: "#ffdd44",
    glowColor: "#ffffff",
    trailColor: "#ffdd44",
    price: 40000,
    rarity: "legendary",
    effect: "holy",
  },
  {
    id: "abyssal",
    name: "ABYSSAL",
    color: "#220044",
    glowColor: "#440088",
    trailColor: "#220044",
    price: 50000,
    rarity: "legendary",
    effect: "abyss",
  },
  {
    id: "cyber",
    name: "CYBER",
    color: "#00ffaa",
    glowColor: "#44ffcc",
    trailColor: "#00ffaa",
    price: 50000,
    rarity: "legendary",
    effect: "glitch",
  },
] as const;
