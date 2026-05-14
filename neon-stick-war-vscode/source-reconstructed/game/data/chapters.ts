// =============================================================================
// NEON STICK WAR - Handcrafted Chapter Levels
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js, lines 1615-2378
// Original variable name: G
// Contains 8 handcrafted levels across 5 chapters.
// =============================================================================

import type { LevelData } from '../types';

/** Color constants referenced from the source (original single-letter vars) */
const CYAN = '#00ffff';
const ORANGE = '#ff6600';
const PURPLE = '#aa00ff';
const MAGENTA = '#ff00ff';
const RED = '#ff3333';
const GOLD = '#ffd700';
const PINK = '#ff69b4';

/**
 * All handcrafted campaign levels.
 * Levels 1-2: Chapter 1 — Neon City intro
 * Levels 3-4: Chapter 2 — Meet Shadow & Warehouse raid
 * Levels 5-6: Chapter 3 — Rescue Mission & Red King's Throne (boss)
 * Level 7:    Chapter 4 — Protect Neon
 * Level 8:    Chapter 5 — The Final War (boss)
 */
export const handcraftedLevels: LevelData[] = [
  // =========================================================================
  // LEVEL 1 — FIRST STEPS (CH.1)
  // =========================================================================
  {
    id: 1,
    name: 'FIRST STEPS',
    chapter: 'CH.1',
    width: 2000,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 2000, height: 40, type: 'static' },
      { x: 400, y: 400, width: 120, height: 16, type: 'static' },
      { x: 800, y: 360, width: 120, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 600, y: 480, type: 'drone' },
        ],
        voiceLine: 'Who took her... I\'ll find out.',
      },
    ],
    background: 'city',
    introText: 'They took LUNA. Blue wakes up alone in the neon city. Your journey begins.',
    introColor: CYAN,
    missionType: 'fight',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 2 — LEARNING TO FIGHT (CH.1)
  // =========================================================================
  {
    id: 2,
    name: 'LEARNING TO FIGHT',
    chapter: 'CH.1',
    width: 2200,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 2200, height: 40, type: 'static' },
      { x: 500, y: 380, width: 120, height: 16, type: 'static' },
      { x: 1000, y: 350, width: 120, height: 16, type: 'static' },
      { x: 1500, y: 400, width: 120, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'drone' },
          { x: 700, y: 480, type: 'drone' },
        ],
        voiceLine: 'More of them. I can handle this.',
      },
      {
        enemies: [
          { x: 1200, y: 480, type: 'drone' },
          { x: 1400, y: 480, type: 'drone' },
        ],
        voiceLine: 'Luna... I\'m coming.',
      },
    ],
    background: 'city',
    introText: 'The streets are crawling with Red King\'s drones. Fight through.',
    introColor: ORANGE,
    missionType: 'fight',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 3 — MEET SHADOW (CH.2)
  // =========================================================================
  {
    id: 3,
    name: 'MEET SHADOW',
    chapter: 'CH.2',
    width: 2400,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 2400, height: 40, type: 'static' },
      { x: 400, y: 400, width: 120, height: 16, type: 'static' },
      { x: 900, y: 360, width: 120, height: 16, type: 'static' },
      { x: 1400, y: 400, width: 120, height: 16, type: 'static' },
      { x: 1900, y: 350, width: 120, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'drone' },
          { x: 700, y: 480, type: 'drone' },
          { x: 900, y: 480, type: 'drone' },
        ],
        voiceLine: 'Someone\'s fighting ahead...',
      },
      {
        enemies: [
          { x: 1300, y: 480, type: 'drone' },
          { x: 1500, y: 480, type: 'glitchWalker' },
        ],
        voiceLine: 'That fighter... he\'s good.',
      },
    ],
    background: 'warehouse',
    introText: 'A lone fighter stands against Red King\'s army. His name is SHADOW.',
    introColor: PURPLE,
    missionType: 'fight',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 4 — THE WAREHOUSE (CH.2)
  // =========================================================================
  {
    id: 4,
    name: 'THE WAREHOUSE',
    chapter: 'CH.2',
    width: 2600,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 3000, height: 40, type: 'static' },
      { x: 350, y: 380, width: 130, height: 16, type: 'static' },
      { x: 650, y: 320, width: 110, height: 16, type: 'static' },
      { x: 1000, y: 400, width: 120, height: 16, type: 'static' },
      {
        x: 1400, y: 350, width: 100, height: 16, type: 'moving',
        moveRange: 100, moveSpeed: 1.5, moveAxis: 'x', moveOffset: 0,
      },
      { x: 1800, y: 380, width: 130, height: 16, type: 'static' },
      { x: 2200, y: 340, width: 110, height: 16, type: 'static' },
      { x: 2600, y: 390, width: 120, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'drone' },
          { x: 650, y: 480, type: 'glitchWalker' },
        ],
        voiceLine: 'Shadow, cover the left!',
      },
      {
        enemies: [
          { x: 900, y: 480, type: 'glitchWalker' },
          { x: 1050, y: 480, type: 'voidGuardian' },
          { x: 1200, y: 480, type: 'drone' },
        ],
        voiceLine: 'Turret up ahead!',
      },
      {
        enemies: [
          { x: 1600, y: 480, type: 'glitchWalker' },
          { x: 1750, y: 480, type: 'glitchWalker' },
          { x: 1900, y: 480, type: 'drone' },
          { x: 2000, y: 480, type: 'drone' },
        ],
        voiceLine: 'The Blue Gang doesn\'t quit.',
      },
      {
        enemies: [
          { x: 2400, y: 480, type: 'voidGuardian' },
          { x: 2500, y: 480, type: 'glitchWalker' },
          { x: 2600, y: 480, type: 'glitchWalker' },
          { x: 2750, y: 480, type: 'drone' },
        ],
        voiceLine: 'Warehouse is ours.',
      },
    ],
    background: 'warehouse',
    introText: 'Blue and Shadow raid Red King\'s weapons warehouse.',
    introColor: PURPLE,
    missionType: 'fight',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 5 — RESCUE MISSION (CH.3)
  // =========================================================================
  {
    id: 5,
    name: 'RESCUE MISSION',
    chapter: 'CH.3',
    width: 2800,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 2800, height: 40, type: 'static' },
      { x: 400, y: 380, width: 120, height: 16, type: 'static' },
      { x: 700, y: 310, width: 110, height: 16, type: 'static' },
      { x: 1050, y: 390, width: 130, height: 16, type: 'static' },
      { x: 1500, y: 350, width: 100, height: 16, type: 'static' },
      {
        x: 1800, y: 300, width: 120, height: 16, type: 'moving',
        moveRange: 120, moveSpeed: 1.5, moveAxis: 'x', moveOffset: 0,
      },
      { x: 2200, y: 380, width: 100, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'glitchWalker' },
          { x: 650, y: 480, type: 'glitchWalker' },
          { x: 800, y: 480, type: 'voidGuardian' },
        ],
        voiceLine: 'Luna is close. I can feel it.',
      },
      {
        enemies: [
          { x: 1100, y: 480, type: 'voidGuardian' },
          { x: 1250, y: 480, type: 'glitchWalker' },
          { x: 1400, y: 480, type: 'drone' },
          { x: 1500, y: 480, type: 'drone' },
        ],
        voiceLine: 'Nothing stops me now.',
      },
      {
        enemies: [
          { x: 1900, y: 480, type: 'glitchWalker' },
          { x: 2000, y: 480, type: 'glitchWalker' },
          { x: 2100, y: 480, type: 'voidGuardian' },
        ],
        voiceLine: 'Shadow, BLAZE — cover me!',
      },
    ],
    background: 'firewall',
    introText: 'Luna is held in the Red King\'s fortress. The Blue Gang breaches the walls.',
    introColor: RED,
    missionType: 'rescue',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 6 — RED KING'S THRONE (CH.3) — BOSS LEVEL
  // =========================================================================
  {
    id: 6,
    name: 'RED KING\'S THRONE',
    chapter: 'CH.3',
    width: 2000,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      // Ground with a gap in the middle (pit)
      { x: 0, y: 520, width: 800, height: 40, type: 'static' },
      { x: 900, y: 520, width: 1100, height: 40, type: 'static' },
      { x: 350, y: 380, width: 120, height: 16, type: 'static' },
      { x: 600, y: 310, width: 100, height: 16, type: 'static' },
      { x: 1200, y: 380, width: 130, height: 16, type: 'static' },
      { x: 1600, y: 330, width: 110, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'glitchWalker' },
          { x: 650, y: 480, type: 'drone' },
        ],
        voiceLine: 'The throne room. This is it.',
      },
    ],
    bossWave: {
      enemies: [
        { x: 1500, y: 480, type: 'bossRedKing', bossName: 'RED KING', bossColor: RED },
      ],
      voiceLine: 'RED KING. Let her go. NOW.',
    },
    background: 'core',
    introText: 'The Red King himself. Luna is behind him. This ends now.',
    introColor: MAGENTA,
    missionType: 'boss',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 7 — PROTECT NEON (CH.4)
  // =========================================================================
  {
    id: 7,
    name: 'PROTECT NEON',
    chapter: 'CH.4',
    width: 2500,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 2500, height: 40, type: 'static' },
      { x: 300, y: 400, width: 120, height: 16, type: 'static' },
      { x: 600, y: 340, width: 100, height: 16, type: 'static' },
      { x: 900, y: 380, width: 130, height: 16, type: 'static' },
      { x: 1200, y: 350, width: 100, height: 16, type: 'static' },
      {
        x: 1600, y: 400, width: 120, height: 16, type: 'moving',
        moveRange: 80, moveSpeed: 1.5, moveAxis: 'x', moveOffset: 0,
      },
      { x: 2000, y: 340, width: 110, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 400, y: 480, type: 'glitchWalker' },
          { x: 550, y: 480, type: 'drone' },
          { x: 700, y: 480, type: 'drone' },
        ],
        voiceLine: 'They\'re coming for Mom. NOT happening.',
      },
      {
        enemies: [
          { x: 1000, y: 480, type: 'voidGuardian' },
          { x: 1150, y: 480, type: 'glitchWalker' },
          { x: 1300, y: 480, type: 'drone' },
          { x: 1400, y: 480, type: 'glitchWalker' },
        ],
        voiceLine: 'Gang, protect the left flank!',
      },
      {
        enemies: [
          { x: 1800, y: 480, type: 'glitchWalker' },
          { x: 1900, y: 480, type: 'glitchWalker' },
          { x: 2000, y: 480, type: 'voidGuardian' },
          { x: 2100, y: 480, type: 'drone' },
          { x: 2200, y: 480, type: 'drone' },
        ],
        voiceLine: 'She\'s safe. The Gang protects its own.',
      },
    ],
    background: 'city',
    introText: 'Red King\'s army attacks Blue\'s mother NEON. Protect her at all costs.',
    introColor: PINK,
    missionType: 'protect',
    gangMembersAvailable: [],
  },

  // =========================================================================
  // LEVEL 8 — THE FINAL WAR (CH.5) — BOSS LEVEL
  // =========================================================================
  {
    id: 8,
    name: 'THE FINAL WAR',
    chapter: 'CH.5',
    width: 3500,
    height: 600,
    playerSpawn: {
      x: 80 + Math.floor(Math.random() * 40),
      y: 460,
    },
    platforms: [
      { x: 0, y: 520, width: 3500, height: 40, type: 'static' },
      { x: 300, y: 380, width: 120, height: 16, type: 'static' },
      { x: 600, y: 310, width: 100, height: 16, type: 'static' },
      { x: 900, y: 380, width: 130, height: 16, type: 'static' },
      {
        x: 1300, y: 340, width: 110, height: 16, type: 'moving',
        moveRange: 100, moveSpeed: 2, moveAxis: 'x', moveOffset: 0,
      },
      { x: 1700, y: 370, width: 120, height: 16, type: 'static' },
      { x: 2100, y: 330, width: 100, height: 16, type: 'static' },
      { x: 2400, y: 380, width: 130, height: 16, type: 'static' },
      { x: 2800, y: 340, width: 110, height: 16, type: 'static' },
    ],
    waves: [
      {
        enemies: [
          { x: 500, y: 480, type: 'glitchWalker' },
          { x: 600, y: 480, type: 'drone' },
          { x: 700, y: 480, type: 'drone' },
          { x: 800, y: 480, type: 'voidGuardian' },
        ],
        voiceLine: 'The final war. EVERYONE fights!',
      },
      {
        enemies: [
          { x: 1200, y: 480, type: 'voidGuardian' },
          { x: 1350, y: 480, type: 'glitchWalker' },
          { x: 1500, y: 480, type: 'glitchWalker' },
          { x: 1600, y: 480, type: 'drone' },
          { x: 1700, y: 480, type: 'drone' },
        ],
        voiceLine: 'Blue Gang, UNLEASH!',
      },
      {
        enemies: [
          { x: 2200, y: 480, type: 'glitchWalker' },
          { x: 2300, y: 480, type: 'voidGuardian' },
          { x: 2400, y: 480, type: 'glitchWalker' },
          { x: 2500, y: 480, type: 'drone' },
        ],
        voiceLine: 'Push them back!',
      },
    ],
    bossWave: {
      enemies: [
        { x: 3000, y: 480, type: 'bossTitan', bossName: 'THE TITAN', bossColor: '#ff0000' },
      ],
      voiceLine: 'This is for EVERYONE you hurt. OVERLOAD!',
    },
    background: 'core',
    introText: 'THE FINAL WAR. The Blue Gang vs Red King\'s entire army. No retreat.',
    introColor: GOLD,
    missionType: 'boss',
    gangMembersAvailable: [],
  },
];
