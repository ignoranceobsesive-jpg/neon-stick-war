// ============================================================================
// NeonStickWar — Biome Theme Definitions
// ============================================================================
// Each biome defines the visual atmosphere for a level's background rendering.
// Biomes control sky colors, ground tones, platform appearance, particle effects,
// and weather systems that bring each level to life.
// ============================================================================

/** Weather effect types available for biomes */
export type WeatherType =
  | "none"         // No weather particles
  | "rain"         // Falling rain streaks
  | "snow"         // Drifting snowflakes
  | "embers"       // Rising ember particles
  | "glitch"       // Digital glitch distortion effect
  | "voidParticles" // Eldritch void particles
  | "sandstorm";   // Blowing sand (reserved for future use)

/** Represents a single biome theme used for level background rendering */
export interface Biome {
  /** Display name of the biome */
  name: string;

  /** Top sky color (hex) — used as the base canvas fill */
  skyColor: string;

  /** Sky gradient stops (3 colors) — rendered top to bottom for depth */
  skyGradient: [string, string, string];

  /** Ground fill color (hex) — the base terrain color */
  groundColor: string;

  /** Platform surface color (hex) — floating platform fill */
  platformColor: string;

  /** Neon glow color (hex) — platform edge glow and accent lighting */
  platformGlow: string;

  /** Particle color (hex) — used for weather and ambient particle effects */
  particleColor: string;

  /** Weather system to render in this biome */
  weatherType: WeatherType;

  /** Flavor text describing the biome's atmosphere */
  ambientDescription: string;
}

// ============================================================================
// Biome Definitions
// ============================================================================

/**
 * All biome themes keyed by their identifier.
 * Referenced by level data via the `background` field.
 */
export const BIOMES: Record<string, Biome> = {
  // --------------------------------------------------------------------------
  // CH.1 — Neon City: Cyberpunk metropolis with neon rain
  // --------------------------------------------------------------------------
  neonCity: {
    name: "Neon City",
    skyColor: "#020210",
    skyGradient: ["#020210", "#040418", "#020212"],
    groundColor: "#000a0a",
    platformColor: "#000a0a",
    platformGlow: "#00ffff",
    particleColor: "#00ffff",
    weatherType: "rain",
    ambientDescription: "Rain falls through neon-lit canyons of steel and glass",
  },

  // --------------------------------------------------------------------------
  // CH.2 — Scorched Wasteland: Burning desert with rising embers
  // --------------------------------------------------------------------------
  scorchedWasteland: {
    name: "Scorched Wasteland",
    skyColor: "#080300",
    skyGradient: ["#080300", "#0c0500", "#060200"],
    groundColor: "#0a0500",
    platformColor: "#0a0500",
    platformGlow: "#ff6600",
    particleColor: "#ff6600",
    weatherType: "embers",
    ambientDescription: "Embers drift through the ashen remains of a scorched world",
  },

  // --------------------------------------------------------------------------
  // CH.3 — Frozen Tundra: Icy wasteland with drifting snow
  // --------------------------------------------------------------------------
  frozenTundra: {
    name: "Frozen Tundra",
    skyColor: "#010408",
    skyGradient: ["#010408", "#030810", "#02060a"],
    groundColor: "#000810",
    platformColor: "#000810",
    platformGlow: "#88eeff",
    particleColor: "#88eeff",
    weatherType: "snow",
    ambientDescription: "Crystalline snow falls across an endless frozen expanse",
  },

  // --------------------------------------------------------------------------
  // Shadow Realm: Dark dimension with digital glitch effects
  // --------------------------------------------------------------------------
  shadowRealm: {
    name: "Shadow Realm",
    skyColor: "#050008",
    skyGradient: ["#050008", "#080012", "#040006"],
    groundColor: "#050008",
    platformColor: "#080010",
    platformGlow: "#cc00ff",
    particleColor: "#cc00ff",
    weatherType: "glitch",
    ambientDescription: "Reality fractures in this dimension of shadow and static",
  },

  // --------------------------------------------------------------------------
  // Volcanic Core: Molten underground with rising embers
  // --------------------------------------------------------------------------
  volcanicCore: {
    name: "Volcanic Core",
    skyColor: "#080000",
    skyGradient: ["#080000", "#0c0200", "#060000"],
    groundColor: "#0a0200",
    platformColor: "#0a0200",
    platformGlow: "#ff3300",
    particleColor: "#ff3300",
    weatherType: "embers",
    ambientDescription: "Molten rivers carve through obsidian caverns deep underground",
  },

  // --------------------------------------------------------------------------
  // Crystal Caves: Subterranean glow with no weather — pure ambient light
  // --------------------------------------------------------------------------
  crystalCaves: {
    name: "Crystal Caves",
    skyColor: "#000a08",
    skyGradient: ["#000a08", "#000c0a", "#000605"],
    groundColor: "#000a08",
    platformColor: "#000a08",
    platformGlow: "#00ff88",
    particleColor: "#00ff88",
    weatherType: "none",
    ambientDescription: "Bioluminescent crystals pulse in the silence of the deep",
  },

  // --------------------------------------------------------------------------
  // Void Dimension: Eldritch space with void particle effects
  // --------------------------------------------------------------------------
  voidDimension: {
    name: "Void Dimension",
    skyColor: "#060006",
    skyGradient: ["#060006", "#0a000a", "#030003"],
    groundColor: "#050008",
    platformColor: "#050008",
    platformGlow: "#ff00ff",
    particleColor: "#ff00ff",
    weatherType: "voidParticles",
    ambientDescription: "The void whispers between dimensions of impossible geometry",
  },

  // --------------------------------------------------------------------------
  // Cyber Forest: Digital jungle with neon rain
  // --------------------------------------------------------------------------
  cyberForest: {
    name: "Cyber Forest",
    skyColor: "#000805",
    skyGradient: ["#000805", "#000c08", "#000403"],
    groundColor: "#000c08",
    platformColor: "#000c08",
    platformGlow: "#00ff66",
    particleColor: "#00ff66",
    weatherType: "rain",
    ambientDescription: "Digital rain filters through circuits grown like vines",
  },

  // --------------------------------------------------------------------------
  // Storm Plains: Electric badlands with glitch lightning
  // --------------------------------------------------------------------------
  stormPlains: {
    name: "Storm Plains",
    skyColor: "#080800",
    skyGradient: ["#080800", "#0a0a04", "#060600"],
    groundColor: "#080800",
    platformColor: "#080800",
    platformGlow: "#ffff00",
    particleColor: "#ffff00",
    weatherType: "glitch",
    ambientDescription: "Perpetual lightning storms scar the yellowed plains",
  },

  // --------------------------------------------------------------------------
  // Blood Moon: Crimson apocalypse with rising embers
  // --------------------------------------------------------------------------
  bloodMoon: {
    name: "Blood Moon",
    skyColor: "#080002",
    skyGradient: ["#080002", "#0c0004", "#060001"],
    groundColor: "#080002",
    platformColor: "#080002",
    platformGlow: "#cc0033",
    particleColor: "#cc0033",
    weatherType: "embers",
    ambientDescription: "The blood moon hangs eternal over a dying world",
  },
};
