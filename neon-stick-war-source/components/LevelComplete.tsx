/**
 * LevelComplete — Level complete screen with stars, coins, and next level
 * Extracted from component `te` (lines 10673–11102)
 * 
 * Also includes the `e7` star animation sub-component.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

// ─── Star Animation Sub-component ──────────────────────────────────────────────

interface StarProps {
  filled: boolean;
  delay: number;
}

/** Animated star that flips in with a delay */
function Star({ filled, delay }: StarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <span
      className="inline-block text-2xl sm:text-4xl transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
        color: filled ? COLORS.gold : '#333333',
        textShadow: filled
          ? '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ff8c00'
          : 'none',
        filter: filled ? 'drop-shadow(0 0 6px #ffd700)' : 'none',
        animation: filled && visible ? 'star-pulse 1.5s ease-in-out infinite' : 'none',
      }}
    >
      ★
    </span>
  );
}

// ─── Level Complete Component ───────────────────────────────────────────────────

/**
 * Level complete overlay.
 * 
 * Features:
 * - "ZONE CLEARED" header with green neon glow
 * - 3 star rating animation
 * - Level stats (kills, health, combo, coins)
 * - Optional ad for 2x coins
 * - New skill unlock notification
 * - Next level, retry, level map, skills, and main menu buttons
 */
export function LevelComplete() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const score = useGameStore((s) => s.score);
  const totalScore = useGameStore((s) => s.totalScore);
  const saveData = useGameStore((s) => s.saveData);
  const nextLevel = useGameStore((s) => s.nextLevel);
  const retryLevel = useGameStore((s) => s.retryLevel);
  const backToMenu = useGameStore((s) => s.backToMenu);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const lastLevelStars = useGameStore((s) => s.lastLevelStars);
  const lastLevelKills = useGameStore((s) => s.lastLevelKills);
  const lastLevelMaxCombo = useGameStore((s) => s.lastLevelMaxCombo);
  const lastLevelCoinsEarned = useGameStore((s) => s.lastLevelCoinsEarned);
  const lastLevelHealthPct = useGameStore((s) => s.lastLevelHealthPct);
  const lastLevelTotalEnemies = useGameStore((s) => s.lastLevelTotalEnemies);

  const [isWatchingInterstitial, setIsWatchingInterstitial] = useState(false);
  const [interstitialProgress, setInterstitialProgress] = useState(0);
  const [canSkipInterstitial, setCanSkipInterstitial] = useState(false);
  const [isBonusClaimed, setIsBonusClaimed] = useState(false);
  const [isWatchingBonusAd, setIsWatchingBonusAd] = useState(false);
  const [bonusAdProgress, setBonusAdProgress] = useState(0);

  const coinsEarned = lastLevelCoinsEarned || Math.floor(score / 5);
  const isEndGame = currentLevel >= 22000;

  // Skills that unlock at this level
  const unlockedSkills = useMemo(
    () => [], // Would be filtered from skill data: P.filter(s => s.unlockMethod === 'level' && s.unlockLevel === currentLevel)
    [currentLevel]
  );

  // Interstitial ad simulation
  useEffect(() => {
    if (!isWatchingInterstitial) return;
    const interval = setInterval(() => {
      setInterstitialProgress((p) => {
        if (p >= 20) setCanSkipInterstitial(true);
        return p + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isWatchingInterstitial]);

  /** Watch ad for 2x coins bonus */
  const handleWatchBonusAd = useCallback(() => {
    if (isBonusClaimed || isWatchingBonusAd) return;
    setIsWatchingBonusAd(true);
    setBonusAdProgress(0);
    // Simulated ad
    const interval = setInterval(() => {
      setBonusAdProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 60);
    setTimeout(() => {
      clearInterval(interval);
      setIsWatchingBonusAd(false);
      setIsBonusClaimed(true);
    }, 3200);
  }, [isBonusClaimed, isWatchingBonusAd]);

  // ── Interstitial ad overlay ──
  if (isWatchingInterstitial) {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
      >
        <div className="text-center px-4">
          <div
            className="text-base sm:text-lg font-mono font-bold mb-3"
            style={{ color: COLORS.gold, textShadow: '0 0 10px #ffd700' }}
          >
            🎬 ADVERTISEMENT
          </div>
          <div
            className="w-64 sm:w-72 h-32 sm:h-40 rounded-lg mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: '#111', border: '1px solid #333' }}
          >
            <div>
              <div
                className="text-xl sm:text-2xl font-bold font-mono mb-1"
                style={{ color: COLORS.cyan, textShadow: '0 0 10px #00ffff' }}
              >
                NEON STICKMAN
              </div>
              <div
                className="text-[10px] sm:text-xs font-mono"
                style={{ color: '#888' }}
              >
                Stick War — Coming Soon
              </div>
            </div>
          </div>
          <div
            className="w-64 sm:w-72 h-2 rounded-full overflow-hidden mx-auto mb-2"
            style={{ backgroundColor: '#222' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${interstitialProgress}%`,
                backgroundColor: COLORS.gold,
                boxShadow: '0 0 8px #ffd700',
              }}
            />
          </div>
          {canSkipInterstitial ? (
            <button
              onClick={() => setIsWatchingInterstitial(false)}
              className="text-xs font-mono px-4 py-1.5 rounded min-h-[44px]"
              style={{ color: '#888', border: '1px solid #444' }}
            >
              SKIP AD ▶
            </button>
          ) : (
            <div className="text-xs font-mono" style={{ color: '#555' }}>
              Ad playing...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Bonus ad overlay ──
  if (isWatchingBonusAd) {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
      >
        <div className="text-center px-4">
          <div
            className="text-base sm:text-lg font-mono font-bold mb-3"
            style={{ color: COLORS.gold, textShadow: '0 0 10px #ffd700' }}
          >
            🎬 WATCHING AD FOR 2X COINS
          </div>
          <div
            className="w-64 sm:w-72 h-32 sm:h-40 rounded-lg mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: '#111', border: '1px solid #333' }}
          >
            <div>
              <div
                className="text-xl sm:text-2xl font-bold font-mono mb-1"
                style={{ color: COLORS.gold, textShadow: '0 0 10px #ffd700' }}
              >
                2X BONUS
              </div>
              <div
                className="text-[10px] sm:text-xs font-mono"
                style={{ color: '#888' }}
              >
                Double your coins!
              </div>
            </div>
          </div>
          <div
            className="w-64 sm:w-72 h-3 rounded-full mx-auto mb-3"
            style={{ backgroundColor: '#222', border: '1px solid #444' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${bonusAdProgress}%`,
                backgroundColor: COLORS.cyan,
                boxShadow: '0 0 10px #00ffff',
              }}
            />
          </div>
          <div className="text-sm font-mono" style={{ color: '#888' }}>
            {bonusAdProgress < 100 ? 'Please wait...' : '✅ 2x Bonus unlocked!'}
          </div>
        </div>
      </div>
    );
  }

  // ── Main level complete screen ──
  return (
    <div
      className="absolute inset-0 z-20 overflow-y-auto"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        maxHeight: '100dvh',
        overscrollBehavior: 'contain',
      }}
    >
      <div
        className="text-center pointer-events-auto px-3 max-w-md w-full mx-auto flex flex-col items-center"
        style={{
          minHeight: '100dvh',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 2.5rem)',
        }}
      >
        <div className="my-auto w-full py-6">
          {/* Title */}
          <h1
            className="text-2xl sm:text-4xl font-bold tracking-wider mb-1 sm:mb-2"
            style={{
              color: COLORS.green,
              textShadow:
                '0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 80px #00ff66',
              animation: 'neon-pulse 2s ease-in-out infinite',
            }}
          >
            ZONE CLEARED
          </h1>

          {/* Stars */}
          <div className="flex justify-center gap-1 sm:gap-2 mb-2">
            <Star filled={lastLevelStars >= 1} delay={300} />
            <Star filled={lastLevelStars >= 2} delay={600} />
            <Star filled={lastLevelStars >= 3} delay={900} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0.5 sm:gap-y-1 mb-2 mx-auto max-w-xs">
            <div
              className="text-right font-mono text-xs sm:text-sm"
              style={{ color: COLORS.orange, textShadow: '0 0 5px #ff6600' }}
            >
              Kills: {lastLevelKills}/{lastLevelTotalEnemies}
            </div>
            <div
              className="text-left font-mono text-xs sm:text-sm"
              style={{ color: COLORS.green, textShadow: '0 0 5px #00ff66' }}
            >
              Health: {lastLevelHealthPct}%
            </div>
            <div
              className="text-right font-mono text-xs sm:text-sm"
              style={{ color: COLORS.yellow, textShadow: '0 0 5px #ffff00' }}
            >
              Combo: {lastLevelMaxCombo}x
            </div>
            <div
              className="text-left font-mono text-xs sm:text-sm"
              style={{ color: COLORS.gold, textShadow: '0 0 5px #ffd700' }}
            >
              Coins: +{coinsEarned}
            </div>
          </div>

          {/* Score */}
          <p
            className="font-mono text-base sm:text-lg mb-0.5"
            style={{ color: COLORS.orange, textShadow: '0 0 10px #ff6600' }}
          >
            Score: {score}
          </p>

          {/* Coins earned */}
          <p
            className="font-mono text-xs sm:text-sm mb-0.5"
            style={{ color: COLORS.gold, textShadow: '0 0 10px #ffd700' }}
          >
            +{coinsEarned} COINS
            {isBonusClaimed && (
              <span style={{ color: COLORS.orange }}> +{coinsEarned} BONUS!</span>
            )}
          </p>

          {/* Total */}
          <p
            className="font-mono text-[10px] sm:text-xs mb-2"
            style={{ color: COLORS.purple, textShadow: '0 0 5px #aa00ff' }}
          >
            Total: {totalScore} | Coins: {saveData.totalCoins + (isBonusClaimed ? coinsEarned : 0)}
          </p>

          {/* Watch ad for 2x coins */}
          {!isBonusClaimed && !isEndGame && (
            <button
              onClick={handleWatchBonusAd}
              className="neon-btn w-56 sm:w-64 py-2.5 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider mb-2 min-h-[44px]"
              style={{
                borderColor: COLORS.gold,
                color: COLORS.gold,
                textShadow: '0 0 8px #ffd700, 0 0 16px #ffd700',
                background:
                  'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,102,0,0.08))',
                boxShadow: '0 0 12px rgba(255,215,0,0.2)',
              }}
            >
              🎬 WATCH AD FOR 2X COINS
            </button>
          )}

          {isBonusClaimed && (
            <div
              className="font-mono text-xs sm:text-sm mb-2"
              style={{ color: COLORS.green }}
            >
              BONUS CLAIMED!
            </div>
          )}

          {/* New skill unlock */}
          {unlockedSkills.length > 0 && (
            <div
              className="mb-2 p-2 sm:p-3 rounded-lg mx-auto max-w-sm"
              style={{
                backgroundColor: 'rgba(255,102,0,0.1)',
                border: '1px solid rgba(255,102,0,0.4)',
              }}
            >
              <div
                className="text-[10px] sm:text-xs font-mono font-bold mb-1"
                style={{ color: COLORS.orange, textShadow: '0 0 8px #ff6600' }}
              >
                NEW SKILL UNLOCKED!
              </div>
              <div className="text-[8px] sm:text-[9px] font-mono mt-1" style={{ color: '#aaa' }}>
                Go to SKILLS to equip!
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-1.5 sm:gap-2 items-center">
            {!isEndGame && (
              <button
                onClick={() => nextLevel()}
                className="neon-btn w-56 sm:w-64 py-3 px-4 text-lg sm:text-2xl font-bold font-mono tracking-wider min-h-[44px]"
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
              onClick={() => retryLevel()}
              className="neon-btn w-40 sm:w-48 py-2.5 px-3 text-sm sm:text-base font-bold font-mono tracking-wider min-h-[44px]"
              style={{
                borderColor: COLORS.orange,
                color: COLORS.orange,
                textShadow: '0 0 8px #ff6600',
              }}
            >
              ↻ RETRY
            </button>

            <button
              onClick={() => setGamePhase('level-map')}
              className="neon-btn w-40 sm:w-48 py-2.5 px-3 text-sm sm:text-base font-bold font-mono tracking-wider min-h-[44px]"
              style={{
                borderColor: COLORS.cyan,
                color: COLORS.cyan,
                textShadow: '0 0 8px #00ffff',
              }}
            >
              LEVEL MAP
            </button>

            <button
              onClick={() => backToMenu()}
              className="neon-btn w-32 sm:w-40 py-2 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider mt-0.5 min-h-[44px]"
              style={{ borderColor: '#666', color: '#888' }}
            >
              MAIN MENU
            </button>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`@keyframes star-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
    </div>
  );
}
