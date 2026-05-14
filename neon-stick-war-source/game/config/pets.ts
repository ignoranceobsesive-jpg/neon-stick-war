/**
 * Pet companion data for Neon Stick War.
 *
 * Each pet has combat stats (damage, shootRate) and a purchase price.
 * Pets auto-attack enemies alongside the player.
 *
 * Original minified variable: `v`
 * Color references replaced with hex values from colors.ts:
 *   n=#00ffff, i=#ff00ff, s=#00ff66, c=#ff6600,
 *   d=#ffff00, h=#aa00ff, f=#ff3333, m=#ffd700
 */

/** Data for a single pet companion */
export interface PetConfig {
  /** Unique identifier */
  id: string;
  /** Display name (uppercase) */
  name: string;
  /** Primary body color */
  color: string;
  /** Glow/aura color around the pet */
  glowColor: string;
  /** Color of the pet's projectiles */
  shootColor: string;
  /** Damage dealt per projectile hit */
  damage: number;
  /** Frames between shots (lower = faster) */
  shootRate: number;
  /** Flavor text description */
  description: string;
  /** Coin cost to purchase (0 = starter/free) */
  price: number;
}

/**
 * All pet companions in the game, ordered by price/tier.
 *
 * Prices in source used scientific notation: 2e3=2000, 3e3=3000, etc.
 */
export const PETS: PetConfig[] = [
  {
    id: "neonWolf",
    name: "NEON WOLF",
    color: "#00ffff",
    glowColor: "#00ffff",
    shootColor: "#00ffff",
    damage: 6,
    shootRate: 45,
    description: "Loyal companion. Balanced fighter.",
    price: 0,
  },
  {
    id: "plasmaFalcon",
    name: "PLASMA FALCON",
    color: "#ff6600",
    glowColor: "#ffff00",
    shootColor: "#ff6600",
    damage: 4,
    shootRate: 30,
    description: "Fast attacks. Quick and agile.",
    price: 2000,
  },
  {
    id: "shadowSpider",
    name: "SHADOW SPIDER",
    color: "#aa00ff",
    glowColor: "#ff00ff",
    shootColor: "#aa00ff",
    damage: 8,
    shootRate: 60,
    description: "Slow but devastating hits.",
    price: 3500,
  },
  {
    id: "crystalGolem",
    name: "CRYSTAL GOLEM",
    color: "#00ff66",
    glowColor: "#00ff66",
    shootColor: "#00ff66",
    damage: 5,
    shootRate: 50,
    description: "Tanky. Absorbs damage for you.",
    price: 5500,
  },
  {
    id: "voidDrake",
    name: "VOID DRAKE",
    color: "#ff00ff",
    glowColor: "#ff3333",
    shootColor: "#ff00ff",
    damage: 10,
    shootRate: 55,
    description: "Legendary power. Devastating attacks.",
    price: 25000,
  },
  {
    id: "neonCat",
    name: "NEON CAT",
    color: "#ff44aa",
    glowColor: "#ff88cc",
    shootColor: "#ff44aa",
    damage: 5,
    shootRate: 40,
    description: "Agile and quick. Lands critical hits.",
    price: 3000,
  },
  {
    id: "thunderBird",
    name: "THUNDER BIRD",
    color: "#ffff00",
    glowColor: "#ffffff",
    shootColor: "#ffff00",
    damage: 7,
    shootRate: 50,
    description: "Strikes with lightning bolts.",
    price: 4500,
  },
  {
    id: "iceFox",
    name: "ICE FOX",
    color: "#88eeff",
    glowColor: "#ffffff",
    shootColor: "#88eeff",
    damage: 6,
    shootRate: 42,
    description: "Freezing attacks slow enemies.",
    price: 7500,
  },
  {
    id: "magmaSnail",
    name: "MAGMA SNAIL",
    color: "#ff4400",
    glowColor: "#ff8844",
    shootColor: "#ff4400",
    damage: 9,
    shootRate: 70,
    description: "Slow but devastating fireballs.",
    price: 15000,
  },
  {
    id: "cosmicOwl",
    name: "COSMIC OWL",
    color: "#aa44ff",
    glowColor: "#dd88ff",
    shootColor: "#aa44ff",
    damage: 11,
    shootRate: 58,
    description: "Legendary wisdom. Devastating cosmic blasts.",
    price: 40000,
  },
] as const;
