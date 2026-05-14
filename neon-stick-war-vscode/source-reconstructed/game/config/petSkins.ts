/**
 * Pet skin/cosmetic data for Neon Stick War.
 *
 * Each pet can have multiple skins that change its visual appearance.
 * Skins are organized by the pet they belong to (petId).
 * Some legendary skins have special visual effects.
 *
 * Original minified variable: `w`
 * Color references replaced with hex values from colors.ts:
 *   n=#00ffff, i=#ff00ff, s=#00ff66, c=#ff6600,
 *   d=#ffff00, h=#aa00ff, f=#ff3333, m=#ffd700,
 *   g=#ffffff
 */

/** Rarity tier for pet skins */
export type PetSkinRarity = "common" | "rare" | "epic" | "legendary";

/** Special visual effect type for legendary skins */
export type PetSkinEffect = "rainbow" | "fire";

/** Data for a single pet skin */
export interface PetSkinConfig {
  /** Unique skin identifier (format: "{petPrefix}-{skinName}") */
  id: string;
  /** Display name (uppercase) */
  name: string;
  /** The pet this skin belongs to */
  petId: string;
  /** Primary body color */
  color: string;
  /** Glow/aura color */
  glowColor: string;
  /** Trail particle color */
  trailColor: string;
  /** Coin cost to purchase (0 = default/free) */
  price: number;
  /** Rarity tier */
  rarity: PetSkinRarity;
  /** Optional special visual effect (only on legendary skins) */
  effect?: PetSkinEffect;
}

/**
 * All 25 pet skins across all 10 pets.
 *
 * Each pet has at least a free "common" default skin.
 * Higher-rarity skins cost more and may have special effects.
 */
export const PET_SKINS: PetSkinConfig[] = [
  // ── NEON WOLF skins ──
  {
    id: "wolf-default",
    name: "CYAN",
    petId: "neonWolf",
    color: "#00ffff",
    glowColor: "#00ffff",
    trailColor: "#00ffff",
    price: 0,
    rarity: "common",
  },
  {
    id: "wolf-crimson",
    name: "CRIMSON",
    petId: "neonWolf",
    color: "#ff3333",
    glowColor: "#ff6600",
    trailColor: "#ff3333",
    price: 2400,
    rarity: "rare",
  },
  {
    id: "wolf-golden",
    name: "GOLDEN",
    petId: "neonWolf",
    color: "#ffd700",
    glowColor: "#ffff00",
    trailColor: "#ffd700",
    price: 15000,
    rarity: "legendary",
  },

  // ── PLASMA FALCON skins ──
  {
    id: "falcon-default",
    name: "FLAME",
    petId: "plasmaFalcon",
    color: "#ff6600",
    glowColor: "#ffff00",
    trailColor: "#ff6600",
    price: 0,
    rarity: "common",
  },
  {
    id: "falcon-ice",
    name: "ICE",
    petId: "plasmaFalcon",
    color: "#88eeff",
    glowColor: "#ffffff",
    trailColor: "#88eeff",
    price: 2400,
    rarity: "rare",
  },

  // ── SHADOW SPIDER skins ──
  {
    id: "spider-default",
    name: "VOID",
    petId: "shadowSpider",
    color: "#aa00ff",
    glowColor: "#ff00ff",
    trailColor: "#aa00ff",
    price: 0,
    rarity: "common",
  },
  {
    id: "spider-toxic",
    name: "TOXIC",
    petId: "shadowSpider",
    color: "#00ff66",
    glowColor: "#00ff66",
    trailColor: "#00ff66",
    price: 4000,
    rarity: "rare",
  },

  // ── CRYSTAL GOLEM skins ──
  {
    id: "golem-default",
    name: "CRYSTAL",
    petId: "crystalGolem",
    color: "#00ff66",
    glowColor: "#00ff66",
    trailColor: "#00ff66",
    price: 0,
    rarity: "common",
  },
  {
    id: "golem-magma",
    name: "MAGMA",
    petId: "crystalGolem",
    color: "#ff3333",
    glowColor: "#ff6600",
    trailColor: "#ff6600",
    price: 5500,
    rarity: "epic",
  },

  // ── VOID DRAKE skins ──
  {
    id: "drake-default",
    name: "ABYSS",
    petId: "voidDrake",
    color: "#ff00ff",
    glowColor: "#ff3333",
    trailColor: "#ff00ff",
    price: 0,
    rarity: "common",
  },
  {
    id: "drake-prism",
    name: "PRISM",
    petId: "voidDrake",
    color: "#ffffff",
    glowColor: "#00ffff",
    trailColor: "#ff00ff",
    price: 25000,
    rarity: "legendary",
    effect: "rainbow",
  },

  // ── NEON CAT skins ──
  {
    id: "cat-default",
    name: "PINK",
    petId: "neonCat",
    color: "#ff44aa",
    glowColor: "#ff88cc",
    trailColor: "#ff44aa",
    price: 0,
    rarity: "common",
  },
  {
    id: "cat-shadow",
    name: "SHADOW",
    petId: "neonCat",
    color: "#442244",
    glowColor: "#664466",
    trailColor: "#442244",
    price: 2400,
    rarity: "rare",
  },
  {
    id: "cat-cosmic",
    name: "COSMIC",
    petId: "neonCat",
    color: "#aa44ff",
    glowColor: "#dd88ff",
    trailColor: "#aa44ff",
    price: 8000,
    rarity: "epic",
  },

  // ── THUNDER BIRD skins ──
  {
    id: "bird-default",
    name: "STORM",
    petId: "thunderBird",
    color: "#ffff00",
    glowColor: "#ffffff",
    trailColor: "#ffff00",
    price: 0,
    rarity: "common",
  },
  {
    id: "bird-plasma",
    name: "PLASMA",
    petId: "thunderBird",
    color: "#ff6600",
    glowColor: "#ffff00",
    trailColor: "#ff6600",
    price: 2400,
    rarity: "rare",
  },
  {
    id: "bird-void",
    name: "VOID STORM",
    petId: "thunderBird",
    color: "#8800ff",
    glowColor: "#ff00ff",
    trailColor: "#8800ff",
    price: 9000,
    rarity: "epic",
  },

  // ── ICE FOX skins ──
  {
    id: "fox-default",
    name: "FROST",
    petId: "iceFox",
    color: "#88eeff",
    glowColor: "#ffffff",
    trailColor: "#88eeff",
    price: 0,
    rarity: "common",
  },
  {
    id: "fox-arctic",
    name: "ARCTIC",
    petId: "iceFox",
    color: "#ffffff",
    glowColor: "#ccffff",
    trailColor: "#ffffff",
    price: 4000,
    rarity: "rare",
  },
  {
    id: "fox-aurora",
    name: "AURORA",
    petId: "iceFox",
    color: "#44ff88",
    glowColor: "#88ffcc",
    trailColor: "#44ff88",
    price: 12000,
    rarity: "legendary",
    effect: "rainbow",
  },

  // ── MAGMA SNAIL skins ──
  {
    id: "snail-default",
    name: "LAVA",
    petId: "magmaSnail",
    color: "#ff4400",
    glowColor: "#ff8844",
    trailColor: "#ff4400",
    price: 0,
    rarity: "common",
  },
  {
    id: "snail-obsidian",
    name: "OBSIDIAN",
    petId: "magmaSnail",
    color: "#333344",
    glowColor: "#666688",
    trailColor: "#333344",
    price: 7000,
    rarity: "rare",
  },
  {
    id: "snail-infernal",
    name: "INFERNAL",
    petId: "magmaSnail",
    color: "#ff0000",
    glowColor: "#ffaa00",
    trailColor: "#ff0000",
    price: 20000,
    rarity: "legendary",
    effect: "fire",
  },

  // ── COSMIC OWL skins ──
  {
    id: "owl-default",
    name: "NEBULA",
    petId: "cosmicOwl",
    color: "#aa44ff",
    glowColor: "#dd88ff",
    trailColor: "#aa44ff",
    price: 0,
    rarity: "common",
  },
  {
    id: "owl-stellar",
    name: "STELLAR",
    petId: "cosmicOwl",
    color: "#ffdd44",
    glowColor: "#ffffff",
    trailColor: "#ffdd44",
    price: 12000,
    rarity: "rare",
  },
  {
    id: "owl-eternity",
    name: "ETERNITY",
    petId: "cosmicOwl",
    color: "#ffffff",
    glowColor: "#ff44ff",
    trailColor: "#ffffff",
    price: 35000,
    rarity: "legendary",
    effect: "rainbow",
  },
] as const;
