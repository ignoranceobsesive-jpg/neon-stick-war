/**
 * VictoryScreen — End-of-chapter victory screen
 * Extracted from component `tt` (lines 11103–11389)
 * 
 * Displays "VICTORY" with final score, play-next or all-complete button,
 * and main menu option.
 */

import React from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

/**
 * End-of-chapter victory overlay.
 * 
 * Shows the player's final score and offers to continue to the next chapter
 * or return to the main menu. If all levels are complete, shows a special
 * trophy message instead.
 */
export function VictoryScreen() {
  const totalScore = useGameStore((s) => s.totalScore);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const backToMenu = useGameStore((s) => s.backToMenu);
  const nextLevel = useGameStore((s) => s.nextLevel);

  const isAllComplete = currentLevel >= 22000;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="text-center pointer-events-auto">
        {/* Title */}
        <h1
          className="text-5xl sm:text-7xl font-bold tracking-wider mb-4"
          style={{
            color: COLORS.green,
            textShadow:
              '0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 80px #00ff66',
            animation: 'neon-pulse 2s ease-in-out infinite',
          }}
        >
          VICTORY
        </h1>

        {/* Quote */}
        <p
          className="font-mono text-sm mb-2"
          style={{ color: COLORS.cyan, textShadow: '0 0 5px #00ffff' }}
        >
          &quot;Lights back on. Grid&apos;s running. I could use a reboot.&quot;
        </p>
        <p
          className="font-mono text-xs mb-6"
          style={{ color: COLORS.purple, textShadow: '0 0 5px #aa00ff' }}
        >
          — Spark
        </p>

        {/* Final score */}
        <p
          className="font-mono text-2xl mb-8"
          style={{ color: COLORS.orange, textShadow: '0 0 10px #ff6600' }}
        >
          Final Score: {totalScore}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 items-center">
          {isAllComplete ? (
            <button
              onClick={backToMenu}
              className="neon-btn w-64 py-4 px-8 text-2xl font-bold font-mono tracking-wider"
              style={{
                borderColor: '#ffaa00',
                color: '#ffaa00',
                textShadow: '0 0 10px #ffaa00, 0 0 20px #ffaa00',
                boxShadow:
                  '0 0 20px rgba(255,170,0,0.4), 0 0 40px rgba(255,170,0,0.15)',
                background:
                  'linear-gradient(135deg, rgba(255,170,0,0.15), rgba(255,170,0,0.05))',
              }}
            >
              🏆 ALL LEVELS COMPLETE
            </button>
          ) : (
            <button
              onClick={() => nextLevel()}
              className="neon-btn w-64 py-4 px-8 text-2xl font-bold font-mono tracking-wider"
              style={{
                borderColor: COLORS.green,
                color: COLORS.green,
                textShadow:
                  '0 0 10px #00ff66, 0 0 20px #00ff66, 0 0 40px #00ff66',
                boxShadow:
                  '0 0 20px rgba(0,255,102,0.4), 0 0 40px rgba(0,255,102,0.15), inset 0 0 20px rgba(0,255,102,0.1)',
                background:
                  'linear-gradient(135deg, rgba(0,255,102,0.15), rgba(0,255,102,0.05))',
                animation: 'neon-pulse 2s ease-in-out infinite',
              }}
            >
              ▶ PLAY NEXT
            </button>
          )}

          <button
            onClick={backToMenu}
            className="neon-btn w-48 py-3 px-6 text-lg font-bold font-mono tracking-wider"
            style={{ borderColor: '#666', color: '#888' }}
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
