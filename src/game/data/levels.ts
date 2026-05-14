// ============================================================================
// NeonStickWar — Level Data Definitions
// ============================================================================
// Handcrafted level layouts, enemy wave compositions, boss encounters,
// and a procedural level generator for endless mode.
// ============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** Platform type — static platforms don't move, moving platforms oscillate */
export type PlatformType = "static" | "moving";

/** A single platform in the level world */
export interface Platform {
  /** X position (left edge) in world coordinates */
  x: number;
  /** Y position (top edge) in world coordinates */
  y: number;
  /** Width of the platform in pixels */
  width: number;
  /** Height of the platform in pixels */
  height: number;
  /** Whether the platform is static or moves on a pattern */
  type: PlatformType;
}

/** Enemy type identifiers matching the enemy factory system */
export type EnemyType =
  | "drone"       // Basic flying enemy
  | "basic"       // Standard ground trooper
  | "fast"        // Quick melee attacker
  | "heavy"       // Slow, tanky enemy
  | "sniper"      // Ranged precision shooter
  | "boss"        // Level boss
  | "miniBoss"    // Sub-boss encounter
  | "elite";      // Upgraded version of basic types

/** Spawn point for a single enemy within a wave */
export interface EnemySpawn {
  /** X position in world coordinates */
  x: number;
  /** Y position in world coordinates */
  y: number;
  /** The type of enemy to spawn */
  type: EnemyType;
}

/** A single wave of enemies that must be defeated to progress */
export interface Wave {
  /** Array of enemies that appear simultaneously in this wave */
  enemies: EnemySpawn[];
}

/** Mission types that define level objectives */
export type MissionType =
  | "eliminate"   // Defeat all enemy waves
  | "boss"        // Defeat a boss enemy
  | "rescue"      // Reach and rescue a target
  | "protect"     // Protect a point/NPC from waves
  | "survive"     // Survive for a duration
  | "versus";     // Player vs player arena

/** Complete level definition */
export interface Level {
  /** Unique level identifier (1-8 for story, -1 for versus arena) */
  id: number;
  /** Display name shown in the HUD and level select */
  name: string;
  /** Chapter label (e.g. "CH.1") */
  chapter: string;
  /** Total world width in pixels — camera scrolls within this range */
  width: number;
  /** Total world height in pixels — always 600 for consistency */
  height: number;
  /** Starting position for the player character */
  playerSpawn: { x: number; y: number };
  /** All platforms (ground segments + floating platforms) */
  platforms: Platform[];
  /** Enemy waves — player must clear each wave to unlock the portal */
  waves: Wave[];
  /** Boss wave data — only present on boss levels */
  bossWave?: Wave;
  /** Biome key referencing BIOMES record for visual theme */
  background: string;
  /** Intro text displayed at level start */
  introText: string;
  /** Color of the intro text (hex) */
  introColor: string;
  /** Level objective type */
  missionType: MissionType;
}

// ============================================================================
// Handcrafted Story Levels (1-8)
// ============================================================================

/**
 * All story levels in order of progression.
 * Each level introduces new mechanics and escalates difficulty.
 */
export const LEVELS: Level[] = [
  // ==========================================================================
  // Level 1: FIRST STEPS — Tutorial level in Neon City
  // Teaches: basic movement, jumping, shooting
  // ==========================================================================
  {
    id: 1,
    name: "FIRST STEPS",
    chapter: "CH.1",
    width: 2000,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground
      { x: 0, y: 520, width: 2000, height: 40, type: "static" },
      // Floating platforms for vertical traversal
      { x: 400, y: 400, width: 120, height: 16, type: "static" },
      { x: 800, y: 360, width: 120, height: 16, type: "static" },
    ],
    waves: [
      {
        enemies: [
          { x: 600, y: 480, type: "drone" },
        ],
      },
    ],
    background: "neonCity",
    introText: "Welcome to the neon battlefield. Eliminate the drone.",
    introColor: "#00ffff",
    missionType: "eliminate",
  },

  // ==========================================================================
  // Level 2: LEARNING TO FIGHT — Two enemies in Neon City
  // Teaches: engaging multiple enemies
  // ==========================================================================
  {
    id: 2,
    name: "LEARNING TO FIGHT",
    chapter: "CH.1",
    width: 2200,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground
      { x: 0, y: 520, width: 2200, height: 40, type: "static" },
      // Floating platforms
      { x: 500, y: 380, width: 120, height: 16, type: "static" },
      { x: 1000, y: 350, width: 120, height: 16, type: "static" },
      { x: 1500, y: 400, width: 120, height: 16, type: "static" },
    ],
    waves: [
      {
        enemies: [
          { x: 700, y: 480, type: "drone" },
          { x: 1200, y: 480, type: "drone" },
        ],
      },
    ],
    background: "neonCity",
    introText: "Two hostiles detected. Stay mobile.",
    introColor: "#00ffff",
    missionType: "eliminate",
  },

  // ==========================================================================
  // Level 3: MEET SHADOW — First mixed enemy wave in Scorched Wasteland
  // Introduces: "basic" ground enemy type alongside drones
  // ==========================================================================
  {
    id: 3,
    name: "MEET SHADOW",
    chapter: "CH.2",
    width: 2400,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground
      { x: 0, y: 520, width: 2400, height: 40, type: "static" },
      // Floating platforms
      { x: 400, y: 400, width: 120, height: 16, type: "static" },
      { x: 900, y: 360, width: 120, height: 16, type: "static" },
      { x: 1400, y: 400, width: 120, height: 16, type: "static" },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: "drone" },
          { x: 1000, y: 480, type: "basic" },
          { x: 1600, y: 480, type: "drone" },
        ],
      },
    ],
    background: "scorchedWasteland",
    introText: "A shadow soldier emerges from the wasteland.",
    introColor: "#ff6600",
    missionType: "eliminate",
  },

  // ==========================================================================
  // Level 4: THE WAREHOUSE — Multi-wave level with fast enemies
  // Introduces: "fast" enemy type, multiple sequential waves
  // ==========================================================================
  {
    id: 4,
    name: "THE WAREHOUSE",
    chapter: "CH.2",
    width: 2600,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: extended to 3000 for warehouse feel
      { x: 0, y: 520, width: 3000, height: 40, type: "static" },
      // Floating platforms — warehouse shelving aesthetic
      { x: 350, y: 380, width: 130, height: 16, type: "static" },
      { x: 650, y: 320, width: 110, height: 16, type: "static" },
      { x: 1000, y: 400, width: 120, height: 16, type: "static" },
    ],
    waves: [
      // Wave 1: Mixed ground and air
      {
        enemies: [
          { x: 600, y: 480, type: "basic" },
          { x: 900, y: 480, type: "drone" },
        ],
      },
      // Wave 2: Fast assault
      {
        enemies: [
          { x: 800, y: 480, type: "fast" },
          { x: 1100, y: 480, type: "fast" },
        ],
      },
      // Wave 3: Full pressure
      {
        enemies: [
          { x: 500, y: 480, type: "fast" },
          { x: 900, y: 480, type: "basic" },
          { x: 1300, y: 480, type: "drone" },
        ],
      },
    ],
    background: "shadowRealm",
    introText: "The warehouse is crawling with hostiles. Watch for the fast ones.",
    introColor: "#cc00ff",
    missionType: "eliminate",
  },

  // ==========================================================================
  // Level 5: RESCUE MISSION — Boss encounter in Frozen Tundra
  // Introduces: miniBoss type, rescue mission objective
  // ==========================================================================
  {
    id: 5,
    name: "RESCUE MISSION",
    chapter: "CH.3",
    width: 2800,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground
      { x: 0, y: 520, width: 2800, height: 40, type: "static" },
      // Floating platforms
      { x: 400, y: 380, width: 120, height: 16, type: "static" },
      { x: 700, y: 310, width: 110, height: 16, type: "static" },
      { x: 1050, y: 390, width: 130, height: 16, type: "static" },
    ],
    waves: [
      // Wave 1: Advance guard
      {
        enemies: [
          { x: 600, y: 480, type: "basic" },
          { x: 1000, y: 480, type: "drone" },
        ],
      },
      // Wave 2: Reinforcements
      {
        enemies: [
          { x: 800, y: 480, type: "fast" },
          { x: 1200, y: 480, type: "basic" },
          { x: 1500, y: 480, type: "drone" },
        ],
      },
    ],
    // Boss wave — the miniBoss guards the rescue target
    bossWave: {
      enemies: [
        { x: 1600, y: 420, type: "miniBoss" },
      ],
    },
    background: "frozenTundra",
    introText: "Someone is trapped beyond the ice. Fight through to rescue them.",
    introColor: "#88eeff",
    missionType: "rescue",
  },

  // ==========================================================================
  // Level 6: RED KING'S THRONE — Full boss level in Volcanic Core
  // Introduces: true boss fight with a gap in the ground (two ground segments)
  // ==========================================================================
  {
    id: 6,
    name: "RED KING'S THRONE",
    chapter: "CH.3",
    width: 2000,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: split into two segments with a gap over lava
      { x: 0, y: 520, width: 800, height: 40, type: "static" },
      { x: 900, y: 520, width: 1100, height: 40, type: "static" },
      // Floating platforms — stepping stones across the gap
      { x: 350, y: 380, width: 120, height: 16, type: "static" },
      { x: 600, y: 310, width: 100, height: 16, type: "static" },
    ],
    waves: [
      // Pre-boss wave: guards
      {
        enemies: [
          { x: 500, y: 480, type: "heavy" },
          { x: 700, y: 480, type: "basic" },
        ],
      },
    ],
    // The Red King — final boss of Chapter 3
    bossWave: {
      enemies: [
        { x: 1400, y: 420, type: "boss" },
      ],
    },
    background: "volcanicCore",
    introText: "The Red King awaits on his throne of fire.",
    introColor: "#ff3300",
    missionType: "boss",
  },

  // ==========================================================================
  // Level 7: PROTECT NEON — Defense mission in Crystal Caves
  // Introduces: protect mission type — enemies come in waves toward a point
  // ==========================================================================
  {
    id: 7,
    name: "PROTECT NEON",
    chapter: "CH.4",
    width: 2500,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground
      { x: 0, y: 520, width: 2500, height: 40, type: "static" },
      // Floating platforms
      { x: 300, y: 400, width: 120, height: 16, type: "static" },
      { x: 600, y: 340, width: 100, height: 16, type: "static" },
      { x: 900, y: 380, width: 130, height: 16, type: "static" },
    ],
    waves: [
      // Wave 1: Initial assault
      {
        enemies: [
          { x: 800, y: 480, type: "basic" },
          { x: 1200, y: 480, type: "drone" },
          { x: 1600, y: 480, type: "basic" },
        ],
      },
      // Wave 2: Flanking attack
      {
        enemies: [
          { x: 600, y: 480, type: "fast" },
          { x: 1000, y: 480, type: "fast" },
          { x: 1400, y: 480, type: "drone" },
          { x: 1800, y: 480, type: "basic" },
        ],
      },
      // Wave 3: Full siege
      {
        enemies: [
          { x: 500, y: 480, type: "elite" },
          { x: 900, y: 480, type: "fast" },
          { x: 1300, y: 480, type: "heavy" },
          { x: 1700, y: 480, type: "drone" },
          { x: 2000, y: 480, type: "basic" },
        ],
      },
    ],
    background: "crystalCaves",
    introText: "Defend the neon core at all costs. Enemies approach from all sides.",
    introColor: "#00ff88",
    missionType: "protect",
  },

  // ==========================================================================
  // Level 8: THE FINAL WAR — Epic conclusion in Blood Moon biome
  // Full-scale battle with elite enemies and an epic boss
  // ==========================================================================
  {
    id: 8,
    name: "THE FINAL WAR",
    chapter: "CH.5",
    width: 3500,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms: [
      // Ground: full-width solid ground — longest level
      { x: 0, y: 520, width: 3500, height: 40, type: "static" },
      // Floating platforms
      { x: 300, y: 380, width: 120, height: 16, type: "static" },
      { x: 600, y: 310, width: 100, height: 16, type: "static" },
      { x: 900, y: 380, width: 130, height: 16, type: "static" },
    ],
    waves: [
      // Wave 1: Vanguard
      {
        enemies: [
          { x: 600, y: 480, type: "elite" },
          { x: 900, y: 480, type: "fast" },
          { x: 1200, y: 480, type: "heavy" },
        ],
      },
      // Wave 2: Assault force
      {
        enemies: [
          { x: 500, y: 480, type: "drone" },
          { x: 800, y: 480, type: "elite" },
          { x: 1100, y: 480, type: "fast" },
          { x: 1400, y: 480, type: "heavy" },
          { x: 1700, y: 480, type: "sniper" },
        ],
      },
      // Wave 3: Overwhelming numbers
      {
        enemies: [
          { x: 400, y: 480, type: "elite" },
          { x: 700, y: 480, type: "fast" },
          { x: 1000, y: 480, type: "drone" },
          { x: 1300, y: 480, type: "basic" },
          { x: 1600, y: 480, type: "heavy" },
          { x: 1900, y: 480, type: "sniper" },
        ],
      },
    ],
    // Epic boss — the final challenge
    bossWave: {
      enemies: [
        { x: 2400, y: 380, type: "boss" },
      ],
    },
    background: "bloodMoon",
    introText: "This is it. The final war begins under the blood moon.",
    introColor: "#cc0033",
    missionType: "boss",
  },
];

// ============================================================================
// Versus Arena Level
// ============================================================================

/**
 * Special versus arena level for player-vs-player combat.
 * Compact symmetric layout — no waves, no boss, no enemies.
 */
export const VERSUS_ARENA: Level = {
  id: -1,
  name: "VERSUS ARENA",
  chapter: "PVP",
  width: 1200,
  height: 600,
  playerSpawn: { x: 80, y: 460 },
  platforms: [
    // Ground: solid floor across the arena
    { x: 0, y: 520, width: 1200, height: 40, type: "static" },
    // Symmetrical floating platforms for tactical height advantage
    { x: 200, y: 380, width: 120, height: 16, type: "static" },
    { x: 880, y: 380, width: 120, height: 16, type: "static" },
    // Center platform — contested high ground
    { x: 500, y: 320, width: 200, height: 16, type: "static" },
    // Side platforms
    { x: 50, y: 440, width: 80, height: 16, type: "static" },
    { x: 1070, y: 440, width: 80, height: 16, type: "static" },
  ],
  waves: [],
  background: "neonCity",
  introText: "Fight for supremacy in the neon arena.",
  introColor: "#00ffff",
  missionType: "versus",
};

// ============================================================================
// Procedural Level Generator
// ============================================================================

/** Biome keys available for procedural generation (cycles through these) */
const PROCEDURAL_BIOMES: string[] = [
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
];

/** Enemy types available for procedural generation (tiered by difficulty) */
const EASY_ENEMIES: EnemyType[] = ["drone", "basic"];
const MEDIUM_ENEMIES: EnemyType[] = ["drone", "basic", "fast"];
const HARD_ENEMIES: EnemyType[] = ["fast", "heavy", "sniper", "elite"];

/**
 * Generates a procedural level for endless mode.
 *
 * @param levelNum - The procedural level number (1-based). Higher numbers
 *   produce wider levels, more waves, harder enemies, and boss encounters.
 * @returns A complete Level object with procedurally generated content.
 */
export function generateProceduralLevel(levelNum: number): Level {
  // --- Scale difficulty parameters with level number ---
  const width = Math.min(2000 + levelNum * 200, 5000);
  const waveCount = Math.min(1 + Math.floor(levelNum / 2), 6);
  const enemiesPerWave = Math.min(1 + Math.floor(levelNum / 3), 8);
  const hasBoss = levelNum % 5 === 0; // Boss every 5th level
  const biomeIndex = (levelNum - 1) % PROCEDURAL_BIOMES.length;
  const biome = PROCEDURAL_BIOMES[biomeIndex];

  // --- Choose enemy pool based on difficulty ---
  let enemyPool: EnemyType[];
  if (levelNum <= 3) {
    enemyPool = EASY_ENEMIES;
  } else if (levelNum <= 8) {
    enemyPool = MEDIUM_ENEMIES;
  } else {
    enemyPool = HARD_ENEMIES;
  }

  // --- Generate ground segments with occasional gaps at higher levels ---
  const platforms: Platform[] = [];
  let groundX = 0;

  if (levelNum < 6) {
    // Early levels: solid continuous ground
    platforms.push({ x: 0, y: 520, width: width, height: 40, type: "static" });
  } else {
    // Later levels: ground with gaps for challenge
    const segmentWidth = 500 + Math.floor(Math.random() * 400);
    while (groundX < width) {
      const segW = Math.min(segmentWidth + Math.floor(Math.random() * 200), width - groundX);
      platforms.push({
        x: groundX,
        y: 520,
        width: segW,
        height: 40,
        type: "static",
      });
      groundX += segW;
      // Add a gap (100-200px) between segments at higher levels
      if (groundX < width - 400 && Math.random() < 0.3) {
        groundX += 100 + Math.floor(Math.random() * 100);
      }
    }
  }

  // --- Generate floating platforms ---
  const platformCount = 3 + Math.floor(levelNum / 3);
  for (let i = 0; i < platformCount; i++) {
    const px = 200 + Math.floor((width - 400) * (i / platformCount)) + Math.floor(Math.random() * 100);
    const py = 280 + Math.floor(Math.random() * 160);
    const pw = 80 + Math.floor(Math.random() * 60);
    // Some platforms move at higher levels
    const type: PlatformType = levelNum > 5 && Math.random() < 0.25 ? "moving" : "static";
    platforms.push({ x: px, y: py, width: pw, height: 16, type });
  }

  // --- Generate enemy waves ---
  const waves: Wave[] = [];
  for (let w = 0; w < waveCount; w++) {
    const enemies: EnemySpawn[] = [];
    const count = enemiesPerWave + (Math.random() < 0.3 ? 1 : 0);
    for (let e = 0; e < count; e++) {
      // Spread enemies across the level width, avoiding the player spawn area
      const ex = 300 + Math.floor(Math.random() * (width - 500));
      const ey = 480; // Ground-level spawn
      const etype = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      enemies.push({ x: ex, y: ey, type: etype });
    }
    waves.push({ enemies });
  }

  // --- Boss wave (every 5th level) ---
  let bossWave: Wave | undefined;
  if (hasBoss) {
    bossWave = {
      enemies: [
        { x: width * 0.7, y: 400, type: levelNum > 15 ? "boss" : "miniBoss" },
      ],
    };
  }

  // --- Mission type based on level characteristics ---
  let missionType: MissionType = "eliminate";
  if (hasBoss) {
    missionType = "boss";
  } else if (levelNum % 7 === 0) {
    missionType = "survive";
  } else if (levelNum % 11 === 0) {
    missionType = "protect";
  }

  // --- Intro text based on biome and mission ---
  const missionTexts: Record<string, string> = {
    eliminate: "Clear the area of all hostiles.",
    boss: "A powerful enemy awaits. Prepare yourself.",
    survive: "Hold your ground. Survive the onslaught.",
    protect: "Defend the target at all costs.",
  };

  return {
    id: 100 + levelNum, // Procedural levels start at ID 101
    name: `SECTOR ${levelNum}`,
    chapter: `END.${Math.ceil(levelNum / 5)}`,
    width,
    height: 600,
    playerSpawn: { x: 80, y: 460 },
    platforms,
    waves,
    bossWave,
    background: biome,
    introText: missionTexts[missionType] ?? "Eliminate all enemies.",
    introColor: "#ffffff",
    missionType,
  };
}
