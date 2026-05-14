// =============================================================================
// NEON STICK WAR - Procedural Level Generator & Seeded PRNG
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js, lines 2379-2664
// Original variable names:
//   $ = chapterNames (zone names for levels 6+)
//   F = cutsceneTriggerLevels (which level triggers which cutscene)
//   H = eventTriggers (special events at specific procedural levels)
//   U = generateProceduralLevel (the main generator function)
//   V = createSeededPRNG (seeded pseudo-random number generator)
//   E = isFlyingEnemy (helper to determine enemy y position)
// =============================================================================

import type { LevelData, Platform, Wave, BossWave, EventTrigger, EnvironmentalObject } from '../types';

// ---------------------------------------------------------------------------
// Color constants (same as source)
// ---------------------------------------------------------------------------
const CYAN = '#00ffff';
const ORANGE = '#ff6600';
const MAGENTA = '#ff00ff';
const PURPLE = '#aa00ff';
const RED = '#ff3333';
const GREEN = '#00ff66';
const GOLD = '#ffd700';
const BLUE = '#4488ff';

// ---------------------------------------------------------------------------
// Flying enemy types (from source: E function, line 1462)
// ---------------------------------------------------------------------------
const FLYING_ENEMY_TYPES = [
  'voidBat', 'stormEagle', 'emberWisp', 'frostWraith', 'shadowDrake',
  'plasmaSerpent', 'neonWyrm', 'crystalMoth', 'dragon', 'phoenix',
];

/** Returns true if the enemy type is a flying enemy */
function isFlyingEnemy(type: string): boolean {
  return FLYING_ENEMY_TYPES.includes(type);
}

// ---------------------------------------------------------------------------
// Chapter / Zone names for procedural levels (original: $)
// ---------------------------------------------------------------------------
const CHAPTER_NAMES: Record<number, string> = {
  6: 'THE INFINITE GRID',
  7: "DRAGON'S DOMAIN",
  8: 'MECH WARFARE',
  9: 'SHADOW REALM',
  10: 'PHOENIX RISING',
  11: 'THE VOID AWAKENS',
  12: 'CORRUPTED KINGDOM',
  13: 'NEON APOCALYPSE',
  14: 'THE FINAL FRONTIER',
  15: 'ETERNAL WAR',
};

// ---------------------------------------------------------------------------
// Cutscene triggers by level number (original: F)
// Maps a procedural level number to a cutscene ID.
// ---------------------------------------------------------------------------
export const CUTSCENE_TRIGGERS: Record<number, string> = {
  1: 'ch1-intro',
  10: 'ch2-intro',
  20: 'ch3-intro',
  30: 'lv20-luna',
  40: 'lv40-mother',
  50: 'lv50-void',
  60: 'ch4-intro',
  70: 'lv70-betrayal',
  80: 'lv80-truth',
  90: 'lv90-final',
  100: 'lv100-turning',
  110: 'ch5-intro',
  120: 'ch1-intro',
  130: 'ch2-intro',
  140: 'ch3-intro',
  150: 'ch4-intro',
  160: 'ch5-intro',
  170: 'ch1-intro',
  180: 'ch2-intro',
  190: 'ch3-intro',
  200: 'ch4-intro',
  210: 'ch5-intro',
  220: 'ch1-intro',
  230: 'ch2-intro',
  240: 'ch3-intro',
  250: 'lv250-father',
};

// ---------------------------------------------------------------------------
// Event triggers at specific procedural levels (original: H)
// These create dramatic moments in the procedural campaign.
// ---------------------------------------------------------------------------
export const EVENT_TRIGGERS: Record<number, EventTrigger> = {
  5: {
    type: 'ambush',
    text: 'BEHIND YOU!',
    color: RED,
    spawnEnemies: ['glitchWalker', 'drone'],
    enemyCount: 4,
    duration: 120,
  },
  15: {
    type: 'thugsAppear',
    text: 'THUGS BLOCKING THE PATH!',
    color: ORANGE,
    spawnEnemies: ['glitchWalker'],
    enemyCount: 5,
    duration: 120,
  },
  25: {
    type: 'allyArrives',
    text: 'SHADOW: "Need a hand?"',
    color: PURPLE,
    spawnEnemies: [],
    duration: 150,
  },
  35: {
    type: 'trapTriggered',
    text: 'THE FLOOR IS COLLAPSING!',
    color: RED,
    spawnEnemies: [],
    duration: 90,
  },
  45: {
    type: 'voidRift',
    text: 'A VOID RIFT! SOMETHING IS COMING THROUGH!',
    color: MAGENTA,
    spawnEnemies: ['voidGuardian'],
    enemyCount: 3,
    duration: 120,
  },
  55: {
    type: 'betrayal',
    text: 'WAIT... WHOSE SIDE ARE YOU ON?!',
    color: ORANGE,
    spawnEnemies: ['eliteDrone'],
    enemyCount: 3,
    duration: 150,
  },
  65: {
    type: 'rescue',
    text: 'SOMEONE IS TRAPPED AHEAD! SAVE THEM!',
    color: '#ff69b4',
    spawnEnemies: [],
    duration: 150,
  },
  75: {
    type: 'bossSurprise',
    text: 'A HIDDEN BOSS AWAKENS!',
    color: RED,
    spawnEnemies: ['bossCorrupted'],
    enemyCount: 1,
    duration: 180,
  },
  85: {
    type: 'flashback',
    text: "Blue sees his father's memory...",
    color: CYAN,
    spawnEnemies: [],
    duration: 120,
  },
  95: {
    type: 'earthquake',
    text: 'THE GRID IS SHAKING! PLATFORMS SHIFTING!',
    color: GOLD,
    spawnEnemies: [],
    duration: 90,
  },
};

// ---------------------------------------------------------------------------
// Seeded PRNG (original: V)
// Uses a linear congruential generator.
// Formula: t = (9301 * t + 49297) % 233280; return t / 233280
// ---------------------------------------------------------------------------
export function createSeededPRNG(seed: number): () => number {
  let state = 9301 * seed + 49297;
  return () => {
    state = (9301 * state + 49297) % 233280;
    return state / 233280;
  };
}

// ---------------------------------------------------------------------------
// Procedural Level Generator (original: U)
// Generates a complete LevelData for any level number >= 9.
// Uses seeded randomness for deterministic generation.
// ---------------------------------------------------------------------------
export function generateProceduralLevel(level: number): LevelData {
  const rng = createSeededPRNG(level);

  // --- Determine chapter/zone ---
  const chapter = Math.min(Math.floor((level - 1) / 100) + 6, 200);
  const chapterName = CHAPTER_NAMES[chapter] ?? `ZONE ${chapter}`;

  // --- Calculate level width based on level number ---
  let levelWidth: number;
  if (level <= 3) {
    levelWidth = 2700 + 150 * level;
  } else if (level <= 10) {
    levelWidth = 3000 + 75 * level;
  } else if (level <= 50) {
    levelWidth = 3750 + (level - 10) * 75;
  } else if (level <= 200) {
    levelWidth = 6750 + (level - 50) * 45;
  } else {
    levelWidth = Math.min(13500 + (level - 200) * 30, 30000);
  }

  // --- Generate ground platforms (with optional gaps) ---
  const platforms: Platform[] = [];
  const groundSegments: Platform[] = [];
  let groundX = 0;
  const hasGaps = level > 50 && rng() > 0.6;

  while (groundX < levelWidth) {
    const segmentWidth = 200 + Math.floor(400 * rng());
    groundSegments.push({
      x: groundX,
      y: 520,
      width: segmentWidth,
      height: 40,
      type: 'static',
    });
    groundX += segmentWidth;

    // Add a gap
    if (hasGaps && rng() > 0.6 && groundX > 300 && groundX < levelWidth - 300) {
      groundX += 80 + Math.floor(60 * rng());
    }
  }
  platforms.push(...groundSegments);

  // --- Generate elevated platforms ---
  let elevatedCount: number;
  if (level <= 10) elevatedCount = 2;
  else if (level <= 30) elevatedCount = 2 + Math.floor(2 * rng());
  else if (level <= 50) elevatedCount = 3 + Math.floor(2 * rng());
  else if (level <= 200) elevatedCount = 4 + Math.floor(2 * rng());
  else elevatedCount = 5 + Math.floor(Math.min(level / 100, 8));

  for (let i = 0; i < elevatedCount; i++) {
    const platX = 200 + Math.floor(rng() * (levelWidth - 400));
    const platY = 280 + Math.floor(180 * rng());
    const platWidth = 80 + Math.floor(80 * rng());
    const isMoving = rng() > 0.7;

    platforms.push({
      x: platX,
      y: platY,
      width: platWidth,
      height: 16,
      type: isMoving ? 'moving' : 'static',
      ...(isMoving ? {
        moveRange: 60 + Math.floor(60 * rng()),
        moveSpeed: 0.8 + 1.5 * rng(),
        moveAxis: 'x' as const,
        moveOffset: 0,
      } : {}),
    });
  }

  // --- Calculate wave count ---
  let waveCount: number;
  if (level <= 3 || level <= 5) waveCount = 1;
  else if (level <= 10 || level <= 30) waveCount = 2;
  else if (level <= 50) waveCount = 2 + Math.floor(2 * rng());
  else if (level <= 100) waveCount = 3 + Math.floor(2 * rng());
  else if (level <= 200) waveCount = 5 + Math.floor(3 * rng());
  else if (level <= 500) waveCount = 7 + Math.floor(4 * rng());
  else waveCount = 10 + Math.floor(5 * rng());

  // --- Build enemy type pool based on level ---
  const enemyPool: string[] = [];
  if (level <= 15) {
    enemyPool.push('drone');
  } else if (level <= 30) {
    enemyPool.push('drone', 'glitchWalker');
  } else if (level <= 50) {
    enemyPool.push('drone', 'drone', 'glitchWalker', 'voidGuardian');
  } else {
    enemyPool.push('drone', 'glitchWalker', 'voidGuardian');
  }
  if (level >= 50) enemyPool.push('shadowAssassin', 'eliteDrone');
  if (level >= 80) enemyPool.push('dragon');
  if (level >= 100) enemyPool.push('voidBat', 'stormEagle', 'emberWisp', 'zombie');
  if (level >= 150) enemyPool.push('frostWraith', 'shadowDrake', 'plasmaSerpent', 'giant');
  if (level >= 200) enemyPool.push('neonWyrm', 'crystalMoth', 'necromancer');
  if (level >= 300) enemyPool.push('mechGolem');
  if (level >= 400) enemyPool.push('phoenix');
  if (level >= 500) enemyPool.push('bomber');
  if (level >= 700) enemyPool.push('heavyWalker');

  // --- Voice line pool ---
  const voiceLines = [
    'Stay focused. They\'re coming.',
    'Another wave... bring it.',
    'We\'ve come too far to stop now.',
    'This zone is crawling with them.',
    'Keep pushing. Don\'t look back.',
    'They think they can stop us?',
    'For Luna. For everyone.',
    'This is getting intense...',
    'We will beat the Red King!',
    'I can do this all day.',
    'The Grid trembles before us.',
    'No retreat. No surrender.',
    'I am the Neon Stickman. I don\'t go dark.',
    'Every battle makes me stronger.',
    'This realm will know my name.',
  ];

  // --- Generate waves ---
  const waves: Wave[] = [];
  let introText = `Level ${level} — ${chapterName}`;
  if (level % 100 === 1) {
    introText = `CHAPTER ${chapter}: ${chapterName} — A new frontier awaits!`;
  }

  for (let w = 0; w < waveCount; w++) {
    // Enemies per wave scales with level
    let enemiesPerWave: number;
    if (level <= 3) enemiesPerWave = 1;
    else if (level <= 5) enemiesPerWave = 1 + Math.floor(+rng());
    else if (level <= 10) enemiesPerWave = 1 + Math.floor(2 * rng());
    else if (level <= 30) enemiesPerWave = 2 + Math.floor(+rng());
    else if (level <= 50) enemiesPerWave = 2 + Math.floor(2 * rng());
    else if (level <= 100) enemiesPerWave = 4 + Math.floor(3 * rng());
    else if (level <= 200) enemiesPerWave = 5 + Math.floor(4 * rng());
    else if (level <= 500) enemiesPerWave = 7 + Math.floor(5 * rng());
    else enemiesPerWave = 10 + Math.floor(6 * rng());

    const waveStartX = 300 + Math.floor(w / waveCount * (levelWidth - 800));
    const waveEndX = waveStartX + Math.floor((levelWidth - 800) / waveCount);

    const enemies: Array<{ x: number; y: number; type: string }> = [];
    for (let e = 0; e < enemiesPerWave; e++) {
      const enemyType = enemyPool[Math.floor(rng() * enemyPool.length)];
      const flying = isFlyingEnemy(enemyType);
      enemies.push({
        x: waveStartX + Math.floor(rng() * (waveEndX - waveStartX)),
        y: flying ? 150 + Math.floor(200 * rng()) : 480,
        type: enemyType,
      });
    }

    waves.push({
      enemies,
      voiceLine: w === 0 ? voiceLines[Math.floor(rng() * voiceLines.length)] : undefined,
    });
  }

  // --- Boss wave (every 10th level from 50, guaranteed at 100, every 50th from 100) ---
  const hasBossEvery10 = level >= 50 && level % 10 === 0;
  const hasBossEvery50 = level >= 100 && level % 50 === 0;
  let bossWave: BossWave | undefined;

  if (hasBossEvery10 || hasBossEvery50) {
    if (level === 100) {
      // Special: Twin brother boss at level 100
      bossWave = {
        enemies: [{
          x: levelWidth - 400,
          y: 480,
          type: 'bossTwin',
          bossName: 'YOUR TWIN BROTHER',
          bossColor: BLUE,
        }],
        voiceLine: 'You... you look just like me!',
      };
    } else {
      // Random boss from pool
      const bossTypes = [
        'bossRedKing', 'bossTitan', 'bossCorrupted', 'bossDragon',
        'bossPhoenix', 'bossMechGolem', 'bossFather', 'bossTwin',
      ];
      const bossNames = [
        'CORRUPTED KING', 'THE ABYSS', 'VOID EMPEROR', 'DARK TITAN',
        'SHADOW LORD', 'PLASMA REAPER', 'NEON DEVOURER', 'THE INFINITE',
        'DRAGON KING', 'PHOENIX LORD', 'MECH OVERLORD', 'VOID SERPENT',
        'CHROME REAPER', 'THE HUNGRY DARK', 'IRON JUGGERNAUT', 'PHANTOM WYRM',
        'CRYSTAL TYRANT', 'THE NAMELESS', 'STORM BRINGER', 'DOOM WEAVER',
        'FATHER', 'THE PATRIARCH', "BLUE'S FATHER", 'YOUR TWIN',
      ];
      const bossColors = [RED, PURPLE, MAGENTA, ORANGE, '#ff0044', '#8800ff', GOLD, CYAN, BLUE];

      bossWave = {
        enemies: [{
          x: levelWidth - 400,
          y: 480,
          type: bossTypes[Math.floor(rng() * bossTypes.length)],
          bossName: bossNames[Math.floor(rng() * bossNames.length)],
          bossColor: bossColors[Math.floor(rng() * bossColors.length)],
        }],
        voiceLine: 'This ends NOW!',
      };
    }
  }

  // --- Determine background, mission type, and level name ---
  const backgrounds = ['city', 'corrupted', 'firewall', 'warehouse', 'rooftop', 'void', 'core', 'grid'];
  const background = backgrounds[Math.floor(rng() * backgrounds.length)];

  const missionTypes = ['fight', 'fight', 'fight', 'rescue', 'protect', 'escape'];
  const missionType = (hasBossEvery10 || hasBossEvery50) ? 'boss' : missionTypes[Math.floor(rng() * missionTypes.length)];

  const levelNames = [
    'NEON ALLEY', 'DARK CORRIDOR', 'FIRE ZONE', 'VOID SECTOR', 'CORRUPTED PATH', 'GRID MAZE',
    'SHADOW TUNNEL', 'CRYSTAL CAVE', 'PLASMA BRIDGE', 'DEATH ROW', 'BURNING HALL', 'FROZEN GATE',
    'THE ABYSS', 'CHASM WALK', 'IRON GAUNTLET', 'TOXIC DRAIN', 'DATA STREAM', 'GLITCH HIGHWAY',
    'RENDER ZONE', 'DEEP CORE', "DRAGON'S LAIR", 'MECH FACTORY', 'PHOENIX NEST', 'SHADOW CITADEL',
    'CHROME WASTES', 'EMBER FIELDS', 'FROST SPIRE', 'VOLT ARENA', 'SILENT RUINS', 'WARP TUNNEL',
    'PHANTOM GATE', 'NEON CATHEDRAL', 'BLOOD GRID', 'SOUL REEF', 'NULL ZONE',
  ];
  const levelName = levelNames[Math.floor(rng() * levelNames.length)];

  // --- Environmental objects ---
  const envTypes = ['neonSign', 'brokenPillar', 'glitchCrystal', 'voidRift', 'dataStream'];
  const envCount = 3 + Math.floor(6 * rng());
  const environmentalObjects: EnvironmentalObject[] = [];
  for (let i = 0; i < envCount; i++) {
    environmentalObjects.push({
      x: 100 + Math.floor(rng() * (levelWidth - 200)),
      y: 350 + Math.floor(150 * rng()),
      type: envTypes[Math.floor(rng() * envTypes.length)],
    });
  }

  // --- Weather type ---
  const weatherTypes = ['none', 'none', 'rain', 'snow', 'glitch', 'embers', 'voidParticles'];
  const weatherType = weatherTypes[Math.floor(rng() * weatherTypes.length)];

  // --- Assemble the level ---
  return {
    id: level,
    name: levelName,
    chapter: `CH.${chapter}`,
    width: levelWidth,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms,
    waves,
    bossWave,
    background,
    introText,
    introColor: [CYAN, ORANGE, MAGENTA, PURPLE, GREEN, GOLD][Math.floor(6 * rng())],
    missionType,
    gangMembersAvailable: [],
    isProcedural: true,
    environmentalObjects,
    weatherType,
  };
}
