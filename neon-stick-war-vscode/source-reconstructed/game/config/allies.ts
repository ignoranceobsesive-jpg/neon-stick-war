/**
 * Gang ally (companion) data for Neon Stick War.
 *
 * Allies join the player at specific chapter milestones during the
 * story campaign. Each has health, a special ability, and a unique color.
 *
 * Original minified variable: `k`
 */

/** Data for a single gang ally */
export interface AllyConfig {
  /** Unique identifier */
  id: string;
  /** Display name (uppercase) */
  name: string;
  /** Primary body color */
  color: string;
  /** Glow/aura color */
  glowColor: string;
  /** Special ability name */
  ability: string;
  /** Chapter number when this ally joins the player */
  joinChapter: number;
  /** Whether the ally is currently active in battle */
  active: boolean;
  /** Current health points */
  health: number;
  /** Maximum health points */
  maxHealth: number;
}

/**
 * All gang allies that join the player during the story campaign.
 *
 * - Shadow: Stealth fighter who joins in Chapter 2
 * - Blaze:  Fire specialist who joins in Chapter 3
 * - Volt:   Lightning striker who joins in Chapter 4
 * - Ice:    Frost defender who joins in Chapter 5
 */
export const ALLIES: AllyConfig[] = [
  {
    id: "shadow",
    name: "SHADOW",
    color: "#8800ff",
    glowColor: "#aa44ff",
    ability: "Stealth Dash",
    joinChapter: 2,
    active: false,
    health: 80,
    maxHealth: 80,
  },
  {
    id: "blaze",
    name: "BLAZE",
    color: "#ff4400",
    glowColor: "#ff8844",
    ability: "Fire Burst",
    joinChapter: 3,
    active: false,
    health: 100,
    maxHealth: 100,
  },
  {
    id: "volt",
    name: "VOLT",
    color: "#ffff00",
    glowColor: "#ffff88",
    ability: "Lightning Strike",
    joinChapter: 4,
    active: false,
    health: 70,
    maxHealth: 70,
  },
  {
    id: "ice",
    name: "ICE",
    color: "#44ddff",
    glowColor: "#88eeff",
    ability: "Freeze Blast",
    joinChapter: 5,
    active: false,
    health: 90,
    maxHealth: 90,
  },
] as const;
