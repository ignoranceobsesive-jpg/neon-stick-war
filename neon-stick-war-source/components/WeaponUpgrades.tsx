/**
 * WeaponUpgrades — Weapon upgrade shop
 * Extracted from component `tV` (lines 16416–16610)
 * 
 * Allows upgrading 5 weapon stats: damage, fireRate, bulletSpeed, bulletSize, criticalChance.
 * Each upgrade can be purchased with coins or earned by watching an ad.
 */

import React, { useState, useCallback } from 'react';
import useGameStore from '../game/systems/gameStore';
import { AdOverlay } from './AdOverlay';
import { COLORS } from '../game/types';

// ─── Weapon Upgrade Configuration ──────────────────────────────────────────────

const WEAPON_ICONS: Record<string, string> = {
  damage: '⚔️',
  fireRate: '🔥',
  bulletSpeed: '💨',
  bulletSize: '⭕',
  criticalChance: '💥',
};

const WEAPON_COLORS: Record<string, string> = {
  damage: COLORS.red,
  fireRate: COLORS.orange,
  bulletSpeed: COLORS.cyan,
  bulletSize: COLORS.magenta,
  criticalChance: COLORS.gold,
};

const WEAPON_DESCRIPTIONS: Record<string, string> = {
  damage: '+15% damage per level',
  fireRate: '+10% faster shooting per level',
  bulletSpeed: '+12% bullet speed per level',
  bulletSize: '+10% bullet size per level',
  criticalChance: '+2% crit chance per level (max 50)',
};

/** Simplified upgrade config — in the original, this comes from `y` and `b()` */
interface UpgradeConfig {
  name: string;
  maxLevel: number;
  effectPerLevel: number;
}

const UPGRADE_CONFIGS: Record<string, UpgradeConfig> = {
  damage: { name: 'Damage', maxLevel: 50, effectPerLevel: 0.15 },
  fireRate: { name: 'Fire Rate', maxLevel: 50, effectPerLevel: 0.10 },
  bulletSpeed: { name: 'Bullet Speed', maxLevel: 50, effectPerLevel: 0.12 },
  bulletSize: { name: 'Bullet Size', maxLevel: 50, effectPerLevel: 0.10 },
  criticalChance: { name: 'Critical Chance', maxLevel: 50, effectPerLevel: 0.02 },
};

/** Calculate upgrade cost (exponential scaling) */
function getUpgradeCost(type: string, level: number): number {
  const baseCosts: Record<string, number> = {
    damage: 100,
    fireRate: 80,
    bulletSpeed: 60,
    bulletSize: 50,
    criticalChance: 120,
  };
  return Math.floor((baseCosts[type] || 100) * Math.pow(1.5, level));
}

/**
 * Weapon upgrade shop overlay.
 * 
 * Features:
 * - 5 upgradeable weapon stats
 * - Each shows current level, current/next effect, progress bar
 * - Purchase with coins or watch ad for free upgrade
 * - "MAX LEVEL" indicator when fully upgraded
 */
export function WeaponUpgrades() {
  const saveData = useGameStore((s) => s.saveData);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const upgradeWeapon = useGameStore((s) => s.upgradeWeapon);
  const upgradeWeaponByAd = useGameStore((s) => s.upgradeWeaponByAd);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adWeaponType, setAdWeaponType] = useState<string | null>(null);

  /** Helper to play click sound then execute action */
  const withClick = useCallback((action: () => void) => {
    // eo.init(); eo.playMenuClick()
    action();
  }, []);

  /** Called when ad watching completes */
  const handleAdComplete = useCallback(() => {
    setIsWatchingAd(false);
    if (adWeaponType) {
      addCoinsReward(200);
      upgradeWeaponByAd(adWeaponType);
      setAdWeaponType(null);
    }
  }, [adWeaponType, addCoinsReward, upgradeWeaponByAd]);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col pointer-events-auto"
      style={{ backgroundColor: 'rgba(5,5,16,0.92)' }}
    >
      {/* Ad overlay */}
      {isWatchingAd && <AdOverlay onComplete={handleAdComplete} variant="free-upgrade" />}

      <div
        className="flex-1 overflow-y-auto px-3 py-4"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <h2
              className="text-xl font-bold font-mono tracking-wider"
              style={{
                color: COLORS.red,
                textShadow: '0 0 15px #ff3333, 0 0 30px #ff333366',
              }}
            >
              🔫 WEAPON UPGRADES
            </h2>
            <div
              className="text-xs font-mono mt-1"
              style={{ color: COLORS.gold }}
            >
              🪙 {saveData.totalCoins.toLocaleString()} COINS
            </div>
          </div>

          {/* Upgrade cards */}
          <div className="space-y-2.5">
            {(
              ['damage', 'fireRate', 'bulletSpeed', 'bulletSize', 'criticalChance'] as const
            ).map((type) => {
              const config = UPGRADE_CONFIGS[type];
              const level = saveData.weaponUpgrades[type] ?? 0;
              const cost = getUpgradeCost(type, level);
              const canAfford = saveData.totalCoins >= cost;
              const isMaxed = level >= config.maxLevel;
              const color = WEAPON_COLORS[type];
              const icon = WEAPON_ICONS[type];
              const description = WEAPON_DESCRIPTIONS[type];
              const currentEffect =
                level > 0
                  ? `+${(level * config.effectPerLevel * 100).toFixed(0)}%`
                  : 'Base';
              const nextEffect = isMaxed
                ? 'MAX'
                : `+${((level + 1) * config.effectPerLevel * 100).toFixed(0)}%`;

              return (
                <div
                  key={type}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: `${color}08`,
                    border: `1.5px solid ${color}30`,
                    boxShadow: `0 0 12px ${color}08`,
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-sm font-mono"
                          style={{ color }}
                        >
                          {config.name}
                        </span>
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          LV {level}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono" style={{ color: '#888' }}>
                        {description}
                      </div>
                    </div>
                  </div>

                  {/* Current → Next */}
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-mono">
                    <span style={{ color: '#666' }}>Current:</span>
                    <span style={{ color: level > 0 ? COLORS.green : '#555' }}>
                      {currentEffect}
                    </span>
                    {!isMaxed && (
                      <>
                        <span style={{ color: '#444' }}>→</span>
                        <span style={{ color }}>{nextEffect}</span>
                      </>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div
                    className="w-full h-1.5 rounded-full mb-2"
                    style={{ backgroundColor: '#1a1a2a' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: isMaxed
                          ? '100%'
                          : `${Math.min(
                              100,
                              (level / Math.min(config.maxLevel, 50)) * 100
                            )}%`,
                        backgroundColor: isMaxed ? COLORS.gold : color,
                        boxShadow: `0 0 6px ${isMaxed ? COLORS.gold : color}66`,
                      }}
                    />
                  </div>

                  {/* Action buttons */}
                  {!isMaxed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          withClick(() => {
                            if (upgradeWeapon(type)) {
                              // play coin sound
                            }
                          })
                        }
                        className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all"
                        style={{
                          backgroundColor: canAfford
                            ? 'rgba(255,215,0,0.12)'
                            : 'rgba(0,0,0,0.3)',
                          border: `1.5px solid ${canAfford ? '#ffd700' : '#333'}`,
                          color: canAfford ? '#ffd700' : '#555',
                          textShadow: canAfford ? '0 0 6px #ffd70066' : 'none',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                        }}
                      >
                        🪙 {cost.toLocaleString()}
                      </button>
                      <button
                        onClick={() =>
                          withClick(() => {
                            setIsWatchingAd(true);
                            setAdWeaponType(type);
                          })
                        }
                        className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all"
                        style={{
                          backgroundColor: 'rgba(0,255,255,0.08)',
                          border: '1.5px solid rgba(0,255,255,0.4)',
                          color: COLORS.cyan,
                          textShadow: '0 0 6px #00ffff66',
                          cursor: 'pointer',
                        }}
                      >
                        🎬 AD (FREE)
                      </button>
                    </div>
                  )}

                  {isMaxed && (
                    <div
                      className="text-center text-xs font-mono font-bold py-1"
                      style={{
                        color: COLORS.gold,
                        textShadow: '0 0 8px #ffd700',
                      }}
                    >
                      ★ MAX LEVEL ★
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer info */}
          <div
            className="text-center mt-4 text-[8px] font-mono"
            style={{ color: '#ffffff22' }}
          >
            Watch ads for free upgrades • Prices increase exponentially • No limit on
            upgrades
          </div>

          {/* Back button */}
          <button
            onClick={() => withClick(() => setGamePhase('menu'))}
            className="neon-btn w-full py-2 mt-3 text-xs tracking-wider font-mono font-bold"
            style={{ borderColor: '#666', color: '#888' }}
          >
            ← BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
