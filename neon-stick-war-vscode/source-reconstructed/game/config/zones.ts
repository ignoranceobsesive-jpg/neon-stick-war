/**
 * Zone/environment system for Neon Stick War.
 *
 * The game world is divided into themed zones that change every 10 levels.
 * After level 100, zones cycle through all environments.
 * Each zone has unique sky colors, ground colors, particle effects, and weather.
 *
 * Original minified functions:
 *   A(e) → getZoneByLevel(level)
 *   R(e) → getZoneEnvironment(zoneName)
 *
 * Color references replaced with hex values from colors.ts:
 *   n=#00ffff, i=#ff00ff, s=#00ff66, c=#ff6600,
 *   d=#ffff00, h=#aa00ff, f=#ff3333
 */

/** All possible zone identifiers */
export type ZoneId =
  | "neonCity"
  | "scorchedWasteland"
  | "frozenTundra"
  | "shadowRealm"
  | "volcanicCore"
  | "crystalCaves"
  | "voidDimension"
  | "cyberForest"
  | "stormPlains"
  | "bloodMoon";

/** Weather type per zone */
export type WeatherType =
  | "rain"
  | "embers"
  | "snow"
  | "glitch"
  | "none"
  | "voidParticles";

/** Visual configuration for a zone's environment */
export interface ZoneEnvironment {
  /** Sky background color */
  skyColor: string;
  /** Sky gradient colors (top → bottom) */
  skyGradient: [string, string, string];
  /** Ground/platform base color */
  groundColor: string;
  /** Platform surface color */
  platformColor: string;
  /** Platform edge glow color */
  platformGlow: string;
  /** Ambient particle color */
  particleColor: string;
  /** Weather effect type */
  weatherType: WeatherType;
  /** Atmospheric description text */
  ambientDescription: string;
}

/** Ordered list of all zone IDs, used for cycling after level 100 */
export const ZONE_ORDER: ZoneId[] = [
  "neonCity",
  "scorchedWasteland",
  "frozenTundra",
  "shadowRealm",
  "volcanicCore",
  "crystalCaves",
  "voidDimension",
  "cyberForest",
  "stormPlains",
  "bloodMoon",
] as const;

/**
 * Determine which zone the player is in based on their current level.
 *
 * Levels 1–10:   neonCity
 * Levels 11–20:  scorchedWasteland
 * Levels 21–30:  frozenTundra
 * Levels 31–40:  shadowRealm
 * Levels 41–50:  volcanicCore
 * Levels 51–60:  crystalCaves
 * Levels 61–70:  voidDimension
 * Levels 71–80:  cyberForest
 * Levels 81–90:  stormPlains
 * Levels 91–100: bloodMoon
 * Level 101+:    Cycles through all zones
 *
 * Original minified name: A()
 *
 * @param level - Current player level
 * @returns The zone identifier for this level
 */
export function getZoneByLevel(level: number): ZoneId {
  if (level <= 10) return "neonCity";
  if (level <= 20) return "scorchedWasteland";
  if (level <= 30) return "frozenTundra";
  if (level <= 40) return "shadowRealm";
  if (level <= 50) return "volcanicCore";
  if (level <= 60) return "crystalCaves";
  if (level <= 70) return "voidDimension";
  if (level <= 80) return "cyberForest";
  if (level <= 90) return "stormPlains";
  if (level <= 100) return "bloodMoon";
  // After level 100, cycle through all zones
  return ZONE_ORDER[(level - 101) % 10];
}

/**
 * Get the visual environment configuration for a given zone.
 *
 * Each zone has unique colors, gradients, weather, and atmosphere.
 * Used by the renderer to draw backgrounds, particles, and effects.
 *
 * Original minified name: R()
 *
 * @param zoneName - The zone identifier
 * @returns Environment configuration for rendering
 */
export function getZoneEnvironment(zoneName: ZoneId): ZoneEnvironment {
  switch (zoneName) {
    case "neonCity":
      return {
        skyColor: "#020210",
        skyGradient: ["#020210", "#040418", "#020212"],
        groundColor: "#000a0a",
        platformColor: "#000a0a",
        platformGlow: "#00ffff",
        particleColor: "#00ffff",
        weatherType: "rain",
        ambientDescription: "The neon city pulses with digital energy",
      };
    case "scorchedWasteland":
      return {
        skyColor: "#080300",
        skyGradient: ["#080300", "#0c0500", "#060200"],
        groundColor: "#0a0500",
        platformColor: "#0a0500",
        platformGlow: "#ff6600",
        particleColor: "#ff6600",
        weatherType: "embers",
        ambientDescription: "The wasteland burns under a dying sun",
      };
    case "frozenTundra":
      return {
        skyColor: "#010408",
        skyGradient: ["#010408", "#030810", "#02060a"],
        groundColor: "#000810",
        platformColor: "#000810",
        platformGlow: "#88eeff",
        particleColor: "#88eeff",
        weatherType: "snow",
        ambientDescription: "Ice covers everything in this frozen digital tundra",
      };
    case "shadowRealm":
      return {
        skyColor: "#050008",
        skyGradient: ["#050008", "#080012", "#040006"],
        groundColor: "#050008",
        platformColor: "#080010",
        platformGlow: "#aa00ff",
        particleColor: "#aa00ff",
        weatherType: "glitch",
        ambientDescription: "Shadows twist and writhe in this corrupted realm",
      };
    case "volcanicCore":
      return {
        skyColor: "#080000",
        skyGradient: ["#080000", "#0c0200", "#060000"],
        groundColor: "#0a0200",
        platformColor: "#0a0200",
        platformGlow: "#ff3333",
        particleColor: "#ff3333",
        weatherType: "embers",
        ambientDescription: "Molten data flows through the volcanic core",
      };
    case "crystalCaves":
      return {
        skyColor: "#000a08",
        skyGradient: ["#000a08", "#000c0a", "#000605"],
        groundColor: "#000a08",
        platformColor: "#000a08",
        platformGlow: "#00ff66",
        particleColor: "#00ff66",
        weatherType: "none",
        ambientDescription: "Crystals hum with ancient power",
      };
    case "voidDimension":
      return {
        skyColor: "#060006",
        skyGradient: ["#060006", "#0a000a", "#030003"],
        groundColor: "#050008",
        platformColor: "#050008",
        platformGlow: "#ff00ff",
        particleColor: "#ff00ff",
        weatherType: "voidParticles",
        ambientDescription: "Reality fractures in the void dimension",
      };
    case "cyberForest":
      return {
        skyColor: "#000805",
        skyGradient: ["#000805", "#000c08", "#000403"],
        groundColor: "#000c08",
        platformColor: "#000c08",
        platformGlow: "#00ff66",
        particleColor: "#00ff66",
        weatherType: "rain",
        ambientDescription: "Digital trees pulse with living code",
      };
    case "stormPlains":
      return {
        skyColor: "#080800",
        skyGradient: ["#080800", "#0a0a04", "#060600"],
        groundColor: "#080800",
        platformColor: "#080800",
        platformGlow: "#ffff00",
        particleColor: "#ffff00",
        weatherType: "glitch",
        ambientDescription: "Lightning tears across the storm plains",
      };
    case "bloodMoon":
      return {
        skyColor: "#080002",
        skyGradient: ["#080002", "#0c0004", "#060001"],
        groundColor: "#080002",
        platformColor: "#080002",
        platformGlow: "#cc0033",
        particleColor: "#cc0033",
        weatherType: "embers",
        ambientDescription: "The blood moon watches. Everything ends here.",
      };
  }
}
