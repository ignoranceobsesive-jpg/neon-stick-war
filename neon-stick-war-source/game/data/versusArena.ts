// =============================================================================
// NEON STICK WAR - Versus Arena Level Config
// =============================================================================
// Extracted from: 0cf1o-rq41zxz.beautified.js, lines 1465-1540
// Original variable name: L
// =============================================================================

import type { LevelData } from '../types';

/**
 * The versus arena level — a symmetric PvP battleground.
 * No waves; players fight each other on a balanced layout with
 * multiple platform tiers for vertical play.
 */
export const versusArenaLevel: LevelData = {
  id: -1,
  name: 'VERSUS ARENA',
  chapter: 'VS',
  width: 1200,
  height: 600,
  playerSpawn: {
    x: 100,
    y: 460,
  },
  platforms: [
    // Ground
    { x: 0, y: 520, width: 1200, height: 40, type: 'static' },
    // Left lower platform
    { x: 80, y: 380, width: 150, height: 16, type: 'static' },
    // Left mid platform
    { x: 320, y: 320, width: 130, height: 16, type: 'static' },
    // Center moving platform
    {
      x: 500, y: 260, width: 120, height: 16, type: 'moving',
      moveRange: 80, moveSpeed: 1, moveAxis: 'x', moveOffset: 0,
    },
    // Right mid platform
    { x: 700, y: 320, width: 130, height: 16, type: 'static' },
    // Right lower platform
    { x: 920, y: 380, width: 150, height: 16, type: 'static' },
    // Left upper platform
    { x: 200, y: 220, width: 80, height: 16, type: 'static' },
    // Right upper platform
    { x: 880, y: 220, width: 80, height: 16, type: 'static' },
    // Top center platform
    { x: 520, y: 160, width: 100, height: 16, type: 'static' },
  ],
  waves: [],
  background: 'core',
  introText: 'FIGHT!',
  introColor: '#ffd700',
  missionType: 'fight',
  gangMembersAvailable: [],
};
