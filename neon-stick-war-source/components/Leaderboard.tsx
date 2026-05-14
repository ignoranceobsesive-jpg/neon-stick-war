/**
 * Leaderboard — Procedural fake leaderboard
 * Extracted from component `tA` (lines 15080–15247)
 * 
 * Generates 20 fake leaderboard entries using a seeded PRNG,
 * inserts the player, and sorts by ELO.
 */

import React, { useMemo } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

// ─── Fake player names ─────────────────────────────────────────────────────────
const FAKE_NAMES = [
  'NeonBlade99', 'PixelStorm', 'VoidRunner', 'CyberWolf', 'GridMaster',
  'DarkFlare', 'CrimsonX', 'GhostHack', 'StormPilot', 'ZeroGravity',
  'NightShade', 'IronPulse', 'FrostByte', 'ThunderCore', 'ShadowRift',
  'BlazeFury', 'OmegaZ', 'NovaStar', 'RogueAgent', 'ApexHunter',
];

/** Derive rank info from ELO */
function getRankFromElo(elo: number): { icon: string; rank: string } {
  if (elo >= 2000) return { icon: '🏆', rank: 'Champion' };
  if (elo >= 1500) return { icon: '💎', rank: 'Diamond' };
  if (elo >= 1200) return { icon: '⭐', rank: 'Platinum' };
  if (elo >= 900) return { icon: '🥇', rank: 'Gold' };
  if (elo >= 600) return { icon: '🥈', rank: 'Silver' };
  return { icon: '🥉', rank: 'Bronze' };
}

interface LeaderboardEntry {
  name: string;
  elo: number;
  wins: number;
  losses: number;
  isPlayer: boolean;
}

/**
 * Seeded PRNG for deterministic leaderboard generation.
 */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (9301 * s + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generate the leaderboard with fake players + the real player.
 */
function generateLeaderboard(playerElo: number, playerName: string): LeaderboardEntry[] {
  const rng = seededRandom(439939);
  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < 19; i++) {
    const elo = 800 + Math.floor(1200 * rng());
    entries.push({
      name: FAKE_NAMES[i],
      elo,
      wins: Math.floor(100 * rng()) + 5,
      losses: Math.floor(60 * rng()) + 2,
      isPlayer: false,
    });
  }

  entries.push({
    name: playerName,
    elo: playerElo,
    wins: 0,
    losses: 0,
    isPlayer: true,
  });

  entries.sort((a, b) => b.elo - a.elo);
  return entries;
}

/**
 * Procedural leaderboard overlay.
 * 
 * Features:
 * - 20 entries (19 fake + player)
 * - Player entry highlighted with gold border
 * - Top 3 have gold rank number
 * - ELO and win count displayed per entry
 */
export function Leaderboard() {
  const saveData = useGameStore((s) => s.saveData);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  const entries = useMemo(
    () => generateLeaderboard(saveData.rankingData.elo, saveData.username),
    [saveData.rankingData.elo, saveData.username]
  );

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div
        className="w-full max-w-md p-6 rounded-lg mx-4 pointer-events-auto max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'rgba(5,5,20,0.95)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 30px #ffd70020',
        }}
      >
        {/* Title */}
        <h2
          className="text-2xl font-bold text-center tracking-wider mb-4 font-mono"
          style={{ color: COLORS.gold, textShadow: '0 0 10px #ffd700' }}
        >
          🏆 LEADERBOARD
        </h2>

        {/* Entries */}
        <div className="flex flex-col gap-1.5">
          {entries.map((entry, index) => {
            const rank = getRankFromElo(entry.elo);
            return (
              <div
                key={entry.name}
                className="flex items-center gap-2 p-2 rounded"
                style={{
                  backgroundColor: entry.isPlayer
                    ? 'rgba(255,215,0,0.1)'
                    : 'rgba(0,0,0,0.2)',
                  border: entry.isPlayer
                    ? '1px solid #ffd70060'
                    : '1px solid #222',
                }}
              >
                <span
                  className="font-bold font-mono text-sm w-8 text-center"
                  style={{ color: index < 3 ? COLORS.gold : '#666' }}
                >
                  {index + 1}
                </span>
                <span className="text-lg">{rank.icon}</span>
                <span
                  className="flex-1 font-mono text-sm truncate"
                  style={{ color: entry.isPlayer ? COLORS.gold : COLORS.cyan }}
                >
                  {entry.name}
                </span>
                <span className="font-mono text-xs" style={{ color: COLORS.orange }}>
                  {entry.elo}
                </span>
                <span className="font-mono text-[10px]" style={{ color: '#555' }}>
                  {entry.isPlayer
                    ? `${saveData.rankingData.wins}W ${saveData.rankingData.losses}L`
                    : `${entry.wins}W`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Back button */}
        <button
          onClick={() => setGamePhase('menu')}
          className="neon-btn w-full py-2 px-4 text-sm tracking-wider mt-4"
          style={{ borderColor: '#666', color: '#888' }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
