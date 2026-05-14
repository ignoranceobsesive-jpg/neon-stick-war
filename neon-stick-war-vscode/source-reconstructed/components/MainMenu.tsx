/**
 * MainMenu — Full main menu system with splash, navigation, shop, and daily rewards
 *
 * Reconstructed from beautified source:
 *   - TapToStart: `e6` (lines 10394–10447)
 *   - MainMenu:   `eI` (lines 5341–6216)
 *   - Skin Shop:  `tc` (lines 11717–12150)
 *   - Skill Shop: `tg` (lines 12244–12790)
 *   - DailyRewards: `tG` (lines 16147–16340)
 *   - WeaponUpgrades: `tV` (lines 16416–16610)
 *   - MenuParticles: `eP` (lines 5181–5224)
 *   - StickmanAvatar: `eA` (lines 5226–5289)
 *   - PetAvatar: `eR` (lines 5291–5339)
 *
 * Features:
 *   - "TAP TO START" splash screen with neon glow pulse
 *   - Main menu with buttons: WEAPONS, LEVEL MAP, SKINS, ONLINE, PROFILE, SETTINGS
 *   - Coin counter, rank display, level progress bar
 *   - Daily reward popup with 7-day streak tracker
 *   - Shop with tabs (SKINS, PETS, SKILLS) — skin/pet/skill purchase UI
 *   - Weapon upgrade shop with 5 upgrade categories
 *   - Background neon particle effects
 *   - Ad overlay integration for free coins/upgrades
 *
 * Original minified color mappings:
 *   n = #00ffff (cyan),  i = #ff00ff (magenta), s = #00ff66 (green),
 *   c = #ff6600 (orange), d = #ffff00 (yellow),  h = #aa00ff (purple),
 *   f = #ff3333 (red),    m = #ffd700 (gold)
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useGameStore } from '../game/systems/gameStore';
import { soundManager } from '../audio/SoundManager';
import { AdOverlay } from './AdOverlay';
import { COLORS } from '../game/config/colors';
import { DAILY_REWARDS } from '../game/config/dailyRewards';
import { PLAYER_SKINS } from '../game/config/playerSkins';
import { PETS } from '../game/config/pets';
import { PET_SKINS } from '../game/config/petSkins';
import { SKILLS } from '../game/config/skills';
import { UPGRADE_CONFIG, getUpgradeCost } from '../game/config/upgrades';
import type { SaveData, PlayerSkinConfig, PetConfig, PetSkinDefinition, SkillConfig } from '../game/types';

// =============================================================================
// Color constants (from minified source)
// =============================================================================

const CYAN = COLORS.cyan;       // #00ffff
const MAGENTA = COLORS.magenta; // #ff00ff
const GREEN = COLORS.green;     // #00ff66
const ORANGE = COLORS.orange;   // #ff6600
const YELLOW = COLORS.yellow;   // #ffff00
const PURPLE = COLORS.purple;   // #aa00ff
const RED = COLORS.red;         // #ff3333
const GOLD = COLORS.gold;       // #ffd700

// =============================================================================
// Lookup tables
// =============================================================================

/** Ranking tier definitions — original minified variable: `W` */
const RANKING_TIERS = [
  { rank: "Bronze", min: 0, icon: "🥉" },
  { rank: "Silver", min: 1000, icon: "🥈" },
  { rank: "Gold", min: 1200, icon: "🥇" },
  { rank: "Platinum", min: 1400, icon: "💎" },
  { rank: "Diamond", min: 1600, icon: "💠" },
  { rank: "Master", min: 2000, icon: "👑" },
];

/** Element colors — original minified variable: `eS` / `th` */
const ELEMENT_COLORS: Record<string, string> = {
  fire: "#ff4400",
  frost: "#88eeff",
  shadow: "#8800ff",
  summon: "#aa00ff",
  death: "#330033",
  lightning: "#ffff00",
  void: "#ff00ff",
  blood: "#cc0000",
};

/** Element icons — original minified variable: `eZ` */
const ELEMENT_ICONS: Record<string, string> = {
  fire: "🔥",
  frost: "❄️",
  shadow: "👤",
  summon: "👻",
  death: "💀",
  lightning: "⚡",
  void: "🌀",
  blood: "🩸",
};

/** Element labels — original minified variable: `eT` / `tf` */
const ELEMENT_LABELS: Record<string, string> = {
  fire: "FIRE",
  frost: "FROST",
  shadow: "SHADOW",
  summon: "SUMMON",
  death: "DEATH",
  lightning: "LIGHTNING",
  void: "VOID",
  blood: "BLOOD",
};

/** Rarity colors — original minified variable: `tl` / `tu` */
const RARITY_COLORS: Record<string, string> = {
  common: "#888888",
  rare: CYAN,
  epic: MAGENTA,
  legendary: GOLD,
};

/** Rarity short labels — original minified variable: `tr` */
const RARITY_LABELS: Record<string, string> = {
  common: "COM",
  rare: "RAR",
  epic: "EPC",
  legendary: "LEG",
};

/** Skill slot names — original minified variable: `tm` */
const SKILL_SLOT_NAMES = ["DASH", "SHIELD", "SPECIAL"];

/** Skill slot icons — original minified variable: `tx` */
const SKILL_SLOT_ICONS = ["⚡", "🛡", "✨"];

/** Skill upgrade costs per level — original minified variable: `M` */
const SKILL_UPGRADE_COSTS = [0, 500, 1200, 2500, 5000];

/** Whether each skill level requires an ad — original minified variable: `j` */
const SKILL_UPGRADE_REQUIRES_AD = [false, false, true, true, true];

/** Skill damage multipliers per upgrade level — original minified variable: `S` */
const SKILL_DAMAGE_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];

/** Skill cooldown multipliers per upgrade level — original minified variable: `T` */
const SKILL_COOLDOWN_MULTIPLIERS = [1, 0.9, 0.8, 0.7, 0.6, 0.5];

/** Weapon upgrade icons — original minified variable: `t$` */
const WEAPON_ICONS: Record<string, string> = {
  damage: "⚔️",
  fireRate: "🔥",
  bulletSpeed: "💨",
  bulletSize: "⭕",
  criticalChance: "💥",
};

/** Weapon upgrade colors — original minified variable: `tF` */
const WEAPON_COLORS: Record<string, string> = {
  damage: RED,
  fireRate: ORANGE,
  bulletSpeed: CYAN,
  bulletSize: MAGENTA,
  criticalChance: GOLD,
};

/** Weapon upgrade descriptions — original minified variable: `tH` */
const WEAPON_DESCRIPTIONS: Record<string, string> = {
  damage: "+15% damage per level",
  fireRate: "+10% faster shooting per level",
  bulletSpeed: "+12% bullet speed per level",
  bulletSize: "+10% bullet size per level",
  criticalChance: "+2% crit chance per level (max 50)",
};

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Gets the ranking tier for a given ELO rating.
 * Original minified function: `O`
 */
function getRankingTier(elo: number): { rank: string; icon: string } {
  let tier = RANKING_TIERS[0];
  for (const t of RANKING_TIERS) {
    if (elo >= t.min) tier = t;
  }
  return { rank: tier.rank, icon: tier.icon };
}

/**
 * Parse a hex color to RGB string for use in rgba().
 * Original minified function: `e2`
 */
function hexToRgb(hex: string): string {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? `${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)}`
    : "255,255,255";
}

/**
 * Attempt fullscreen + landscape orientation.
 * Original minified function: `ev`
 */
async function tryFullscreenAndLandscape() {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
  } catch { /* ignore */ }
  try {
    const orient = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    if (orient?.lock) await orient.lock("landscape");
  } catch { /* ignore */ }
}

/**
 * Get unlock description text for a skill based on its unlock method.
 * Original inline function in skills tab rendering.
 */
function getSkillUnlockDescription(skill: SkillConfig): string {
  switch (skill.unlockMethod) {
    case "level": return `Reach Lv.${skill.unlockLevel}`;
    case "boss": return `Defeat ${skill.unlockBoss || "Boss"}`;
    case "chest": return skill.unlockCost > 0 ? `${skill.unlockCost} Coins` : "Find in Chest";
    case "purchase": return `${skill.unlockCost} Coins`;
    case "ad": return `🎬 Watch Ad — ${skill.unlockCost} Coins`;
    case "story": return "Story Unlock";
    default: return "???";
  }
}

// =============================================================================
// MenuParticles — Floating neon particles background
// Extracted from component `eP` (lines 5181–5224)
// =============================================================================

/** Neon color palette for particles */
const PARTICLE_COLORS = [CYAN, MAGENTA, GREEN, GOLD, PURPLE];

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  drift: number;
}

/**
 * Animated floating particles layer with a perspective grid floor.
 * Purely decorative; no interactivity.
 */
export function MenuParticles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${100 * Math.random()}%`,
        size: 2 + 4 * Math.random(),
        duration: 6 + 10 * Math.random(),
        delay: 8 * Math.random(),
        color: PARTICLE_COLORS[Math.floor(5 * Math.random())],
        drift: -20 + 40 * Math.random(),
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Floating neon particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${2 * p.size}px ${p.color}, 0 0 ${4 * p.size}px ${p.color}40`,
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Perspective grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-15">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "30px 15px",
            transform: "perspective(150px) rotateX(60deg)",
            transformOrigin: "bottom",
          }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// StickmanAvatar — SVG stickman avatar
// Extracted from component `eA` (lines 5226–5289)
// =============================================================================

export interface StickmanAvatarProps {
  color: string;
  glowColor: string;
  width?: number;
  height?: number;
}

export function StickmanAvatar({ color, glowColor, width = 40, height = 64 }: StickmanAvatarProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 64"
      style={{
        animation: "stickman-bob 2s ease-in-out infinite",
        filter: `drop-shadow(0 0 4px ${glowColor})`,
      }}
    >
      <circle cx="20" cy="10" r="7" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="22" cy="9" r="1.5" fill={color} />
      <line x1="20" y1="17" x2="20" y2="36" stroke={color} strokeWidth="2.5" />
      <line x1="20" y1="23" x2="9" y2="30" stroke={color} strokeWidth="2" />
      <line x1="20" y1="23" x2="31" y2="30" stroke={color} strokeWidth="2" />
      <line x1="20" y1="36" x2="12" y2="54" stroke={color} strokeWidth="2" />
      <line x1="20" y1="36" x2="28" y2="54" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// =============================================================================
// PetAvatar — SVG pet avatar
// Extracted from component `eR` (lines 5291–5339)
// =============================================================================

export interface PetAvatarProps {
  color: string;
  glowColor: string;
  size?: number;
}

export function PetAvatar({ color, glowColor, size = 28 }: PetAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}
    >
      <circle cx="20" cy="15" r="8" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="13" r="2" fill={glowColor} />
      <ellipse cx="20" cy="30" rx="10" ry="6" fill="none" stroke={color} strokeWidth="2" />
      <line x1="12" y1="34" x2="8" y2="39" stroke={color} strokeWidth="1.5" />
      <line x1="28" y1="34" x2="32" y2="39" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// =============================================================================
// StarRating — Animated star display for level-complete screen
// Extracted from component `e7` (lines 10651–10671)
// =============================================================================

export function StarRating({ filled, delay }: { filled: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className="inline-block text-2xl sm:text-4xl transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
        color: filled ? GOLD : "#333333",
        textShadow: filled
          ? "0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ff8c00"
          : "none",
        filter: filled ? "drop-shadow(0 0 6px #ffd700)" : "none",
        animation: filled && visible ? "star-pulse 1.5s ease-in-out infinite" : "none",
      }}
    >
      ★
    </span>
  );
}

// =============================================================================
// TapToStart — "TAP TO START" splash screen overlay
// Extracted from component `e6` (lines 10394–10447)
// =============================================================================

export function TapToStart() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const waitingForTap = useGameStore((s) => s.waitingForTap);
  const introTimer = useGameStore((s) => s.introTimer);
  const tapToStart = useGameStore((s) => s.tapToStart);

  const isVisible = gamePhase === "playing" && waitingForTap && introTimer <= 0;

  const handleTap = useCallback(() => {
    if (isVisible) tapToStart();
  }, [isVisible, tapToStart]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer select-none pointer-events-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleTap}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTap();
      }}
      role="button"
      aria-label="Tap to start the game"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest"
          style={{
            color: CYAN,
            animation: "tap-start-pulse 1.5s ease-in-out infinite",
          }}
        >
          TAP TO START
        </div>
        <div
          className="text-sm sm:text-base tracking-wide"
          style={{
            color: "rgba(0, 255, 255, 0.5)",
            animation: "tap-start-pulse 1.5s ease-in-out infinite 0.5s",
          }}
        >
          ⚡ Tap anywhere to begin ⚡
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DailyRewardDialog — Daily reward popup with 7-day streak tracker
// Extracted from component `tG` (lines 16147–16340)
// =============================================================================

export function DailyRewardDialog() {
  const saveData = useGameStore((s) => s.saveData);
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);

  const [claimed, setClaimed] = useState(false);
  const [claimedCoins, setClaimedCoins] = useState(0);
  const [claimedDay, setClaimedDay] = useState(0);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);

  const streak = saveData.dailyRewardStreak || 0;
  const displayDay = claimedDay || Math.min(streak, 7);

  const handleClaim = useCallback(() => {
    soundManager.init();
    soundManager.playCoinCollect();
    const result = claimDailyReward();
    if (result) {
      setClaimed(true);
      setClaimedCoins(result.coins);
      setClaimedDay(result.day);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }
  }, [claimDailyReward]);

  const handleWatchAd = useCallback(() => {
    setWatchingAd(true);
  }, []);

  const handleAdComplete = useCallback(() => {
    setWatchingAd(false);
    addCoinsReward(claimedCoins);
    setBonusClaimed(true);
    soundManager.playCoinCollect();
  }, [claimedCoins, addCoinsReward]);

  const handleDismiss = useCallback(() => {
    soundManager.init();
    soundManager.playMenuClick();
    window.dispatchEvent(new Event("daily-reward-dismissed"));
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
    >
      {watchingAd && <AdOverlay onComplete={handleAdComplete} variant="2x-reward" />}

      <div
        className="text-center p-6 rounded-xl max-w-sm w-full mx-4"
        style={{
          backgroundColor: "#0a0a20",
          border: "2px solid #ffd70060",
          boxShadow: "0 0 40px rgba(255,215,0,0.2), inset 0 0 40px rgba(255,215,0,0.05)",
        }}
      >
        <h2
          className="text-2xl font-bold font-mono tracking-wider mb-1"
          style={{ color: GOLD, textShadow: "0 0 15px #ffd700" }}
        >
          📅 DAILY REWARD
        </h2>
        <p className="text-xs font-mono mb-4" style={{ color: "#888" }}>
          Login every day for bigger rewards!
        </p>

        {/* 7-day grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAILY_REWARDS.map((reward, idx) => {
            const dayNum = idx + 1;
            const isNext = dayNum === (claimed ? displayDay : Math.min(streak + 1, 7));
            const isPast = dayNum <= streak || (claimed && dayNum < displayDay);
            const isJustClaimed = claimed && dayNum === displayDay;

            return (
              <div
                key={dayNum}
                className="flex flex-col items-center p-1.5 rounded"
                style={{
                  backgroundColor: isJustClaimed
                    ? "rgba(255,215,0,0.15)"
                    : isNext
                      ? "rgba(0,255,255,0.1)"
                      : isPast
                        ? "rgba(0,255,102,0.08)"
                        : "rgba(0,0,0,0.3)",
                  border: `1px solid ${
                    isJustClaimed
                      ? "#ffd700"
                      : isNext
                        ? CYAN
                        : isPast
                          ? "#00ff6640"
                          : "#33333330"
                  }`,
                }}
              >
                <div
                  className="text-[7px] font-mono font-bold"
                  style={{
                    color: isJustClaimed ? GOLD : isNext ? CYAN : isPast ? GREEN : "#444",
                  }}
                >
                  D{dayNum}
                </div>
                <div
                  className="text-[9px] font-mono font-bold"
                  style={{ color: isJustClaimed ? GOLD : isPast ? "#888" : "#555" }}
                >
                  {isJustClaimed ? "✓" : `${reward.coins}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's reward preview (before claiming) */}
        {!claimed && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(255,215,0,0.08)", border: "1px solid #ffd70030" }}
          >
            <div className="text-xs font-mono mb-1" style={{ color: "#888" }}>
              TODAY&apos;S REWARD
            </div>
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: GOLD, textShadow: "0 0 15px #ffd700" }}
            >
              🪙 {DAILY_REWARDS[Math.min(streak, 6)]?.coins || 50}
            </div>
          </div>
        )}

        {/* Claimed reward display (with pulse animation) */}
        {claimed && showPulse && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{
              backgroundColor: "rgba(0,255,102,0.1)",
              border: "1px solid rgba(0,255,102,0.3)",
              animation: "neon-pulse 0.5s ease-out",
            }}
          >
            <div
              className="text-xl font-bold font-mono"
              style={{ color: GREEN, textShadow: "0 0 15px #00ff66" }}
            >
              +{claimedCoins} 🪙
            </div>
            {bonusClaimed && (
              <div
                className="text-lg font-bold font-mono mt-1"
                style={{ color: MAGENTA, textShadow: "0 0 10px #ff00ff" }}
              >
                +{claimedCoins} BONUS! 🎬
              </div>
            )}
          </div>
        )}

        {/* Claimed reward (no pulse) */}
        {claimed && !showPulse && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(0,255,102,0.1)", border: "1px solid rgba(0,255,102,0.3)" }}
          >
            <div
              className="text-xl font-bold font-mono"
              style={{ color: GREEN, textShadow: "0 0 15px #00ff66" }}
            >
              +{claimedCoins} 🪙 CLAIMED!
            </div>
            {bonusClaimed && (
              <div
                className="text-lg font-bold font-mono mt-1"
                style={{ color: MAGENTA, textShadow: "0 0 10px #ff00ff" }}
              >
                +{claimedCoins} BONUS! 🎬
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {!claimed && (
            <button
              onClick={handleClaim}
              className="neon-btn w-full py-3 px-4 text-lg font-bold font-mono tracking-wider"
              style={{
                borderColor: GOLD,
                color: GOLD,
                textShadow: "0 0 10px #ffd700",
                boxShadow: "0 0 20px rgba(255,215,0,0.3)",
                animation: "neon-pulse 2s ease-in-out infinite",
              }}
              onMouseEnter={() => {
                soundManager.init();
                soundManager.playMenuHover();
              }}
            >
              🪙 CLAIM
            </button>
          )}
          {claimed && !bonusClaimed && (
            <button
              onClick={handleWatchAd}
              className="neon-btn w-full py-2 px-4 text-sm font-bold font-mono tracking-wider"
              style={{ borderColor: CYAN, color: CYAN, textShadow: "0 0 8px #00ffff" }}
              onMouseEnter={() => {
                soundManager.init();
                soundManager.playMenuHover();
              }}
            >
              🎬 WATCH AD FOR 2X
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-xs font-mono px-4 py-1.5 rounded"
            style={{ color: "#666", border: "1px solid #333" }}
          >
            {claimed ? "CLOSE" : "SKIP"}
          </button>
        </div>

        <div className="mt-3 text-[9px] font-mono" style={{ color: "#555" }}>
          Streak: {claimed ? displayDay : streak} / 7 days
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// WeaponUpgrades — Weapon upgrade shop
// Extracted from component `tV` (lines 16416–16610)
// =============================================================================

export function WeaponUpgrades() {
  const saveData = useGameStore((s) => s.saveData);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const upgradeWeapon = useGameStore((s) => s.upgradeWeapon);
  const upgradeWeaponByAd = useGameStore((s) => s.upgradeWeaponByAd);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);

  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adUpgradeType, setAdUpgradeType] = useState<string | null>(null);

  const withSound = useCallback((action: () => void) => {
    soundManager.init();
    soundManager.playMenuClick();
    action();
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowAdOverlay(false);
    if (adUpgradeType) {
      addCoinsReward(200);
      upgradeWeaponByAd(adUpgradeType);
      soundManager.playCoinCollect();
      setAdUpgradeType(null);
    }
  }, [adUpgradeType, addCoinsReward, upgradeWeaponByAd]);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col pointer-events-auto"
      style={{ backgroundColor: "rgba(5,5,16,0.92)" }}
    >
      {showAdOverlay && <AdOverlay onComplete={handleAdComplete} />}

      <div className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <h2
              className="text-xl font-bold font-mono tracking-wider"
              style={{ color: RED, textShadow: "0 0 15px #ff3333, 0 0 30px #ff333366" }}
            >
              🔫 WEAPON UPGRADES
            </h2>
            <div className="text-xs font-mono mt-1" style={{ color: GOLD }}>
              🪙 {saveData.totalCoins.toLocaleString()} COINS
            </div>
          </div>

          {/* Upgrade list */}
          <div className="space-y-2.5">
            {(["damage", "fireRate", "bulletSpeed", "bulletSize", "criticalChance"] as const).map(
              (upgradeType) => {
                const config = UPGRADE_CONFIG[upgradeType];
                const currentLevel = saveData.weaponUpgrades[upgradeType] ?? 0;
                const cost = getUpgradeCost(upgradeType, currentLevel);
                const canAfford = saveData.totalCoins >= cost;
                const isMaxed = currentLevel >= config.maxLevel;
                const color = WEAPON_COLORS[upgradeType];
                const icon = WEAPON_ICONS[upgradeType];
                const description = WEAPON_DESCRIPTIONS[upgradeType];
                const currentBonus =
                  currentLevel > 0
                    ? `+${(currentLevel * config.effectPerLevel * 100).toFixed(0)}%`
                    : "Base";
                const nextBonus = isMaxed
                  ? "MAX"
                  : `+${((currentLevel + 1) * config.effectPerLevel * 100).toFixed(0)}%`;

                return (
                  <div
                    key={upgradeType}
                    className="rounded-xl p-3"
                    style={{
                      backgroundColor: `${color}08`,
                      border: `1.5px solid ${color}30`,
                      boxShadow: `0 0 12px ${color}08`,
                    }}
                  >
                    {/* Title row */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm font-mono" style={{ color }}>
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
                            LV {currentLevel}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono" style={{ color: "#888" }}>
                          {description}
                        </div>
                      </div>
                    </div>

                    {/* Current → Next */}
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-mono">
                      <span style={{ color: "#666" }}>Current:</span>
                      <span style={{ color: currentLevel > 0 ? GREEN : "#555" }}>
                        {currentBonus}
                      </span>
                      {!isMaxed && (
                        <>
                          <span style={{ color: "#444" }}>→</span>
                          <span style={{ color }}>{nextBonus}</span>
                        </>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div
                      className="w-full h-1.5 rounded-full mb-2"
                      style={{ backgroundColor: "#1a1a2a" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: isMaxed
                            ? "100%"
                            : `${Math.min(100, (currentLevel / Math.min(config.maxLevel, 50)) * 100)}%`,
                          backgroundColor: isMaxed ? GOLD : color,
                          boxShadow: `0 0 6px ${isMaxed ? GOLD : color}66`,
                        }}
                      />
                    </div>

                    {/* Buy / Ad buttons */}
                    {!isMaxed && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            withSound(() => {
                              if (upgradeWeapon(upgradeType)) {
                                soundManager.playCoinCollect();
                              }
                            })
                          }
                          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all"
                          style={{
                            backgroundColor: canAfford
                              ? "rgba(255,215,0,0.12)"
                              : "rgba(0,0,0,0.3)",
                            border: `1.5px solid ${canAfford ? "#ffd700" : "#333"}`,
                            color: canAfford ? "#ffd700" : "#555",
                            textShadow: canAfford ? "0 0 6px #ffd70066" : "none",
                            cursor: canAfford ? "pointer" : "not-allowed",
                          }}
                        >
                          🪙 {cost.toLocaleString()}
                        </button>
                        <button
                          onClick={() =>
                            withSound(() => {
                              setShowAdOverlay(true);
                              setAdUpgradeType(upgradeType);
                            })
                          }
                          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all"
                          style={{
                            backgroundColor: "rgba(0,255,255,0.08)",
                            border: "1.5px solid rgba(0,255,255,0.4)",
                            color: CYAN,
                            textShadow: "0 0 6px #00ffff66",
                            cursor: "pointer",
                          }}
                        >
                          🎬 AD (FREE)
                        </button>
                      </div>
                    )}
                    {isMaxed && (
                      <div
                        className="text-center text-xs font-mono font-bold py-1"
                        style={{ color: GOLD, textShadow: "0 0 8px #ffd700" }}
                      >
                        ★ MAX LEVEL ★
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div
            className="text-center mt-4 text-[8px] font-mono"
            style={{ color: "#ffffff22" }}
          >
            Watch ads for free upgrades • Prices increase exponentially • No limit on upgrades
          </div>

          <button
            onClick={() => withSound(() => setGamePhase("menu" as never))}
            className="neon-btn w-full py-2 mt-3 text-xs tracking-wider font-mono font-bold"
            style={{ borderColor: "#666", color: "#888" }}
          >
            ← BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SkinShop — Full skin shop with character skins + pet skins
// Extracted from component `tc` (lines 11717–12150)
// =============================================================================

export function SkinShop() {
  const saveData = useGameStore((s) => s.saveData);
  const buySkin = useGameStore((s) => s.buySkin);
  const selectSkin = useGameStore((s) => s.selectSkin);
  const buyPetSkin = useGameStore((s) => s.buyPetSkin);
  const selectPetSkin = useGameStore((s) => s.selectPetSkin);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);
  const backToMenu = useGameStore((s) => s.backToMenu);

  const [activeTab, setActiveTab] = useState<"character" | "pet">("character");
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);

  const withSound = useCallback((action: () => void) => {
    soundManager.init();
    soundManager.playMenuClick();
    action();
  }, []);

  const watchAdFor = useCallback((afterAd: () => void) => {
    setShowAdOverlay(true);
    setAdCallback(() => afterAd);
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowAdOverlay(false);
    addCoinsReward(200);
    soundManager.playCoinCollect();
    if (adCallback) {
      adCallback();
      setAdCallback(null);
    }
  }, [adCallback, addCoinsReward]);

  /** Group pet skins by petId */
  const petSkinsByPet = useMemo(() => {
    const groups: Record<string, PetSkinDefinition[]> = {};
    for (const ps of PET_SKINS) {
      if (!groups[ps.petId]) groups[ps.petId] = [];
      groups[ps.petId].push(ps);
    }
    return groups;
  }, []);

  const unlockedPetIds = useMemo(() => new Set(saveData.unlockedPets), [saveData.unlockedPets]);

  /** Render a single character skin card */
  const renderCharacterSkin = useCallback(
    (skin: PlayerSkinConfig) => {
      const isUnlocked = saveData.unlockedSkins.includes(skin.id);
      const isEquipped = saveData.currentSkin === skin.id;
      const canAfford = saveData.totalCoins >= skin.price;
      const isFree = skin.price === 0;
      const rarityColor = RARITY_COLORS[skin.rarity] || "#888888";

      return (
        <div
          key={skin.id}
          className="rounded-lg flex flex-col items-center p-2 relative"
          style={{
            width: "120px",
            minWidth: "120px",
            backgroundColor: isEquipped
              ? `${skin.color}15`
              : isUnlocked
                ? `${skin.color}08`
                : "rgba(0,0,0,0.3)",
            border: `2px solid ${isEquipped ? skin.color : isUnlocked ? `${skin.color}60` : "#333"}`,
            boxShadow: isEquipped
              ? `0 0 12px ${skin.color}40, inset 0 0 12px ${skin.color}10`
              : "none",
          }}
        >
          {/* Rarity badge */}
          <div
            className="absolute top-1 right-1 text-[7px] font-bold font-mono px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${rarityColor}30`,
              color: rarityColor,
              border: `1px solid ${rarityColor}60`,
            }}
          >
            {RARITY_LABELS[skin.rarity]}
          </div>

          {/* Stickman avatar */}
          <div className="flex justify-center mb-1 mt-1">
            <StickmanAvatar color={skin.color} glowColor={skin.glowColor} />
          </div>

          {/* Skin name */}
          <div
            className="font-bold text-[10px] font-mono mb-1 text-center leading-tight"
            style={{ color: skin.color }}
          >
            {skin.name}
          </div>

          {/* Effect badge */}
          {skin.effect && (
            <div
              className="text-[7px] font-mono font-bold mb-1 px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${MAGENTA}15`,
                color: MAGENTA,
                border: `1px solid ${MAGENTA}40`,
              }}
            >
              ✨ {skin.effect.toUpperCase()}
            </div>
          )}

          {/* Action button area */}
          <div className="w-full mt-auto">
            {isEquipped ? (
              <div
                className="text-[10px] font-mono font-bold py-2 px-2 rounded text-center"
                style={{
                  color: GREEN,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.5)",
                  textShadow: "0 0 8px rgba(0,255,102,0.6)",
                  boxShadow: "0 0 10px rgba(0,255,102,0.2), inset 0 0 8px rgba(0,255,102,0.05)",
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓ EQUIPPED
              </div>
            ) : isUnlocked ? (
              <button
                onClick={() => withSound(() => selectSkin(skin.id))}
                className="w-full text-[11px] font-mono font-bold py-2 px-2 rounded"
                style={{
                  minHeight: 36,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.7)",
                  color: "#ffffff",
                  textShadow: "0 0 6px rgba(0,255,102,0.5)",
                  boxShadow: "0 0 8px rgba(0,255,102,0.15)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,255,102,0.2)";
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,102,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,255,102,0.12)";
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(0,255,102,0.15)";
                }}
              >
                ▶ EQUIP
              </button>
            ) : (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    (canAfford || isFree) &&
                      withSound(() => {
                        if (buySkin(skin.id)) {
                          selectSkin(skin.id);
                          soundManager.playCoinCollect();
                        }
                      });
                  }}
                  className="w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded"
                  style={{
                    minHeight: 32,
                    backgroundColor: canAfford || isFree ? "rgba(255,215,0,0.12)" : "rgba(0,0,0,0.2)",
                    border: `2px solid ${canAfford || isFree ? "#ffd700" : "#444"}`,
                    color: canAfford || isFree ? "#ffd700" : "#555",
                    textShadow: canAfford || isFree ? "0 0 6px rgba(255,215,0,0.4)" : "none",
                    cursor: canAfford || isFree ? "pointer" : "default",
                    transition: "all 0.15s ease",
                    opacity: isFree ? 1 : undefined,
                  }}
                >
                  {isFree ? "🪙 FREE" : `BUY ${skin.price} 🪙`}
                </button>
                <button
                  onClick={() => {
                    watchAdFor(() => {
                      withSound(() => {
                        if (buySkin(skin.id)) {
                          selectSkin(skin.id);
                          soundManager.playCoinCollect();
                        }
                      });
                    });
                  }}
                  className="w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded"
                  style={{
                    minHeight: 32,
                    backgroundColor: "rgba(0,255,255,0.08)",
                    border: "2px solid rgba(0,255,255,0.5)",
                    color: CYAN,
                    textShadow: "0 0 6px rgba(0,255,255,0.4)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,255,255,0.15)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(0,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  🎬 WATCH AD
                </button>
              </div>
            )}
          </div>
        </div>
      );
    },
    [saveData, withSound, watchAdFor, buySkin, selectSkin]
  );

  /** Render a single pet skin card */
  const renderPetSkin = useCallback(
    (petSkin: PetSkinDefinition) => {
      const isUnlocked = saveData.unlockedPetSkins.includes(petSkin.id);
      const isEquipped = saveData.currentPetSkin === petSkin.id;
      const canAfford = saveData.totalCoins >= petSkin.price;
      const isFree = petSkin.price === 0;
      const rarityColor = RARITY_COLORS[petSkin.rarity] || "#888888";
      const parentPet = PETS.find((p) => p.id === petSkin.petId);
      const hasParentPet = unlockedPetIds.has(petSkin.petId);

      return (
        <div
          key={petSkin.id}
          className="rounded-lg flex flex-col items-center p-2 relative"
          style={{
            width: "120px",
            minWidth: "120px",
            backgroundColor: isEquipped
              ? `${petSkin.color}15`
              : isUnlocked
                ? `${petSkin.color}08`
                : "rgba(0,0,0,0.3)",
            border: `2px solid ${isEquipped ? petSkin.color : isUnlocked ? `${petSkin.color}60` : "#333"}`,
            boxShadow: isEquipped
              ? `0 0 12px ${petSkin.color}40, inset 0 0 12px ${petSkin.color}10`
              : "none",
            opacity: hasParentPet ? 1 : 0.5,
          }}
        >
          <div
            className="absolute top-1 right-1 text-[7px] font-bold font-mono px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${rarityColor}30`,
              color: rarityColor,
              border: `1px solid ${rarityColor}60`,
            }}
          >
            {RARITY_LABELS[petSkin.rarity]}
          </div>
          <div className="flex justify-center mb-1 mt-1">
            <PetAvatar color={petSkin.color} glowColor={petSkin.glowColor} />
          </div>
          <div
            className="font-bold text-[10px] font-mono mb-0.5 text-center leading-tight"
            style={{ color: petSkin.color }}
          >
            {petSkin.name}
          </div>
          <div className="text-[7px] font-mono mb-1 text-center" style={{ color: "#666" }}>
            {parentPet?.name || petSkin.petId}
          </div>
          {petSkin.effect && (
            <div
              className="text-[7px] font-mono font-bold mb-1 px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${MAGENTA}15`,
                color: MAGENTA,
                border: `1px solid ${MAGENTA}40`,
              }}
            >
              ✨ {petSkin.effect.toUpperCase()}
            </div>
          )}

          <div className="w-full mt-auto">
            {hasParentPet ? (
              isEquipped ? (
                <div
                  className="text-[10px] font-mono font-bold py-2 px-2 rounded text-center"
                  style={{
                    color: GREEN,
                    backgroundColor: "rgba(0,255,102,0.12)",
                    border: "2px solid rgba(0,255,102,0.5)",
                    textShadow: "0 0 8px rgba(0,255,102,0.6)",
                    minHeight: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✓ EQUIPPED
                </div>
              ) : isUnlocked ? (
                <button
                  onClick={() => withSound(() => selectPetSkin(petSkin.id))}
                  className="w-full text-[11px] font-mono font-bold py-2 px-2 rounded"
                  style={{
                    minHeight: 36,
                    backgroundColor: "rgba(0,255,102,0.12)",
                    border: "2px solid rgba(0,255,102,0.7)",
                    color: "#ffffff",
                    textShadow: "0 0 6px rgba(0,255,102,0.5)",
                    cursor: "pointer",
                  }}
                >
                  ▶ EQUIP
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      (canAfford || isFree) &&
                        withSound(() => {
                          if (buyPetSkin(petSkin.id)) {
                            selectPetSkin(petSkin.id);
                            soundManager.playCoinCollect();
                          }
                        });
                    }}
                    className="w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded"
                    style={{
                      minHeight: 32,
                      backgroundColor: canAfford || isFree ? "rgba(255,215,0,0.12)" : "rgba(0,0,0,0.2)",
                      border: `2px solid ${canAfford || isFree ? "#ffd700" : "#444"}`,
                      color: canAfford || isFree ? "#ffd700" : "#555",
                      cursor: canAfford || isFree ? "pointer" : "default",
                    }}
                  >
                    {isFree ? "🪙 FREE" : `BUY ${petSkin.price} 🪙`}
                  </button>
                  <button
                    onClick={() =>
                      watchAdFor(() => {
                        withSound(() => {
                          if (buyPetSkin(petSkin.id)) {
                            selectPetSkin(petSkin.id);
                            soundManager.playCoinCollect();
                          }
                        });
                      })
                    }
                    className="w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded"
                    style={{
                      minHeight: 32,
                      backgroundColor: "rgba(0,255,255,0.08)",
                      border: "2px solid rgba(0,255,255,0.5)",
                      color: CYAN,
                      cursor: "pointer",
                    }}
                  >
                    🎬 WATCH AD
                  </button>
                </div>
              )
            ) : (
              <div
                className="text-[8px] font-mono text-center py-1.5 rounded"
                style={{
                  color: "#555",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  border: "1px solid #333",
                  minHeight: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🔒 UNLOCK PET FIRST
              </div>
            )}
          </div>
        </div>
      );
    },
    [saveData, unlockedPetIds, withSound, watchAdFor, buyPetSkin, selectPetSkin]
  );

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col pointer-events-auto"
      style={{ backgroundColor: "rgba(5, 5, 20, 0.97)" }}
    >
      {showAdOverlay && <AdOverlay onComplete={handleAdComplete} />}

      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(0,255,255,0.12)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="text-base sm:text-lg font-bold tracking-wider font-mono"
          style={{ color: CYAN, textShadow: "0 0 10px #00ffff, 0 0 20px rgba(0,255,255,0.3)" }}
        >
          🎨 SKIN SHOP
        </div>
        <div
          className="font-mono text-sm font-bold px-3 py-1 rounded-lg"
          style={{
            color: GOLD,
            backgroundColor: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.2)",
            textShadow: "0 0 8px #ffd700",
          }}
        >
          🪙 {saveData.totalCoins.toLocaleString()}
        </div>
        <button
          onClick={() => withSound(() => backToMenu())}
          className="neon-btn py-1.5 px-4 text-xs font-bold tracking-wider font-mono"
          style={{ borderColor: "#555", color: "#ccc" }}
        >
          ← BACK
        </button>
      </div>

      {/* Tab selector */}
      <div
        className="flex gap-1 px-3 py-2"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        {[
          { id: "character" as const, label: "CHARACTER", color: CYAN },
          { id: "pet" as const, label: "PET", color: GREEN },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => withSound(() => setActiveTab(tab.id))}
            className="flex-1 py-2 text-[10px] font-bold font-mono tracking-wider rounded"
            style={{
              backgroundColor: activeTab === tab.id ? `${tab.color}20` : "rgba(0,0,0,0.3)",
              border: `1px solid ${activeTab === tab.id ? tab.color : "#333"}`,
              color: activeTab === tab.id ? tab.color : "#666",
              textShadow: activeTab === tab.id ? `0 0 8px ${tab.color}` : "none",
              minHeight: 36,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {activeTab === "character" && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {PLAYER_SKINS.map(renderCharacterSkin)}
          </div>
        )}
        {activeTab === "pet" && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {PET_SKINS.map(renderPetSkin)}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SkillShop — Skill purchase/equip/upgrade screen
// Extracted from component `tg` (lines 12244–12790)
// =============================================================================

export function SkillShop() {
  const saveData = useGameStore((s) => s.saveData);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const buySkill = useGameStore((s) => s.buySkill);
  const equipSkill = useGameStore((s) => s.equipSkill);
  const unequipSkill = useGameStore((s) => s.unequipSkill);
  const upgradeSkill = useGameStore((s) => s.upgradeSkill);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);

  const [elementFilter, setElementFilter] = useState("all");
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [pressedSkill, setPressedSkill] = useState<string | null>(null);
  const [unequipFlash, setUnequipFlash] = useState<string | null>(null);

  const withSound = useCallback((action: () => void) => {
    soundManager.init();
    soundManager.playMenuClick();
    action();
  }, []);

  const watchAdFor = useCallback((afterAd: () => void) => {
    setShowAdOverlay(true);
    setAdCallback(() => afterAd);
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowAdOverlay(false);
    addCoinsReward(200);
    if (adCallback) {
      adCallback();
      setAdCallback(null);
    }
  }, [adCallback, addCoinsReward]);

  const handleUnequip = useCallback(
    (slot: number, skillId: string) => {
      withSound(() => {
        unequipSkill(slot);
        soundManager.playDamage();
        setUnequipFlash(skillId);
        setTimeout(() => setUnequipFlash(null), 800);
      });
    },
    [withSound, unequipSkill]
  );

  const filteredSkills =
    elementFilter === "all" ? SKILLS : SKILLS.filter((s) => s.element === elementFilter);
  const equippedSkills = saveData.equippedSkills;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center bg-[#050510ee] overflow-hidden">
      {showAdOverlay && <AdOverlay onComplete={handleAdComplete} />}

      <div className="w-full max-w-2xl px-4 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-3xl font-bold tracking-wider"
            style={{ color: ORANGE, textShadow: "0 0 15px #ff6600, 0 0 30px #ff6600" }}
          >
            ⚡ SKILLS
          </h2>
          <div className="flex items-center gap-3 font-mono text-sm">
            <span style={{ color: GOLD, textShadow: "0 0 8px #ffd700" }}>
              🪙 {saveData.totalCoins}
            </span>
          </div>
        </div>

        {/* Equipped skills slots */}
        <div
          className="mb-3 p-3 rounded-lg"
          style={{ backgroundColor: "rgba(255,102,0,0.08)", border: "1px solid #ff660030" }}
        >
          <div
            className="text-xs font-mono mb-2 flex items-center gap-2"
            style={{ color: ORANGE }}
          >
            <span>⚔️ EQUIPPED SKILLS</span>
            <span style={{ color: "#666" }}>(3 slots — tap UNEQUIP to remove)</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((slot) => {
              const skillId = equippedSkills[slot];
              const skill = skillId ? SKILLS.find((s) => s.id === skillId) : null;
              const upgradeLevel = skillId ? saveData.skillUpgrades[skillId] ?? 1 : 0;

              return (
                <div
                  key={slot}
                  className="flex-1 p-2 rounded text-center"
                  style={{
                    backgroundColor: skill ? `${skill.color}15` : "rgba(0,0,0,0.3)",
                    border: `2px solid ${skill ? skill.color + "80" : "#33333340"}`,
                    minHeight: 70,
                    transition: "all 0.3s ease",
                    boxShadow: skill ? `0 0 12px ${skill.color}30` : "none",
                  }}
                >
                  {skill ? (
                    <div className="flex flex-col items-center">
                      <div
                        className="text-[10px] font-mono font-bold"
                        style={{ color: skill.color }}
                      >
                        {skill.name}
                      </div>
                      <div
                        className="text-[9px] font-mono mt-0.5"
                        style={{ color: "#ffaa00" }}
                      >
                        LV {upgradeLevel} / 5
                      </div>
                      <div className="text-[8px] font-mono mt-0.5" style={{ color: "#888" }}>
                        [Slot {slot + 1}: {SKILL_SLOT_NAMES[slot]}]
                      </div>
                      <button
                        onClick={() => handleUnequip(slot, skillId)}
                        className="mt-1.5 text-[8px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(255,51,51,0.15)",
                          border: "1px solid rgba(255,51,51,0.5)",
                          color: "#ff5555",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255,51,51,0.3)";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255,51,51,0.15)";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        ✕ UNEQUIP
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: "#555" }}
                      >
                        {SKILL_SLOT_NAMES[slot]}
                      </span>
                      <span className="text-[8px] font-mono mt-0.5" style={{ color: "#444" }}>
                        [{SKILL_SLOT_ICONS[slot]}]
                      </span>
                      <span
                        className="text-[8px] font-mono mt-1.5 px-2 py-0.5 rounded"
                        style={{
                          color: "#555",
                          backgroundColor: "rgba(0,255,255,0.05)",
                          border: "1px solid rgba(0,255,255,0.15)",
                        }}
                      >
                        Empty Slot
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Element filter tabs */}
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <button
            onClick={() => withSound(() => setElementFilter("all"))}
            className="px-2.5 py-1 rounded text-[10px] font-mono font-bold"
            style={{
              backgroundColor:
                elementFilter === "all" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)",
              border: `1px solid ${elementFilter === "all" ? "#ffffff60" : "#33333340"}`,
              color: elementFilter === "all" ? "#ffffff" : "#666",
            }}
          >
            ALL
          </button>
          {Object.keys(ELEMENT_LABELS).map((element) => (
            <button
              key={element}
              onClick={() => withSound(() => setElementFilter(element))}
              className="px-2.5 py-1 rounded text-[10px] font-mono font-bold"
              style={{
                backgroundColor:
                  elementFilter === element
                    ? `${ELEMENT_COLORS[element]}25`
                    : "rgba(0,0,0,0.3)",
                border: `1px solid ${elementFilter === element ? ELEMENT_COLORS[element] + "60" : "#33333340"}`,
                color: elementFilter === element ? ELEMENT_COLORS[element] : "#666",
              }}
            >
              {ELEMENT_LABELS[element]}
            </button>
          ))}
        </div>
      </div>

      {/* Skill list */}
      <div
        className="flex-1 w-full max-w-2xl px-4 overflow-y-auto pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col gap-2">
          {filteredSkills.map((skill) => {
            const isUnlocked = saveData.unlockedSkills.includes(skill.id);
            const equippedSlot = equippedSkills.indexOf(skill.id);
            const isEquipped = equippedSlot >= 0;
            const canAfford = saveData.totalCoins >= skill.unlockCost;
            const isAdUnlock = skill.unlockMethod === "ad";
            const canBuyWithCoins =
              (skill.unlockMethod === "purchase" || skill.unlockMethod === "chest") &&
              !isUnlocked &&
              canAfford;
            const upgradeLevel = isUnlocked ? saveData.skillUpgrades[skill.id] ?? 1 : 0;
            const isMaxLevel = upgradeLevel >= 5;
            const nextLevel = upgradeLevel + 1;
            const upgradeCost = isUnlocked && !isMaxLevel ? SKILL_UPGRADE_COSTS[nextLevel - 1] ?? 0 : 0;
            const nextLevelRequiresAd = isUnlocked && !isMaxLevel ? SKILL_UPGRADE_REQUIRES_AD[nextLevel - 1] ?? false : false;
            const canAffordUpgrade = saveData.totalCoins >= upgradeCost;
            const damageMultiplier = isUnlocked ? SKILL_DAMAGE_MULTIPLIERS[upgradeLevel - 1] : 1;
            const cooldownMultiplier = isUnlocked ? SKILL_COOLDOWN_MULTIPLIERS[upgradeLevel - 1] : 1;
            const isHovered = hoveredSkill === skill.id;
            const isPressed = pressedSkill === skill.id;
            const isUnequipFlash = unequipFlash === skill.id;

            return (
              <div
                key={skill.id}
                className="p-3 rounded-lg flex gap-3"
                style={{
                  backgroundColor: isUnlocked ? `${skill.color}08` : "rgba(0,0,0,0.2)",
                  border: `2px solid ${isEquipped ? skill.color : isUnlocked ? skill.color + "40" : "#33333330"}`,
                  boxShadow: isEquipped
                    ? `0 0 15px ${skill.color}30, inset 0 0 15px ${skill.color}08`
                    : "none",
                  transition: "all 0.3s ease",
                  transform: isPressed
                    ? "scale(1.02)"
                    : isUnequipFlash
                      ? "scale(0.98)"
                      : "scale(1)",
                }}
              >
                {/* Skill icon */}
                <div
                  className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 relative"
                  style={{
                    backgroundColor: `${skill.color}15`,
                    border: `1px solid ${skill.color}40`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.glowColor}`,
                    }}
                  />
                  {isUnlocked && (
                    <div
                      className="absolute -top-1 -right-1 text-[7px] font-mono font-bold px-1 rounded"
                      style={{
                        backgroundColor: upgradeLevel >= 4 ? "#ffaa00" : "#333",
                        color: upgradeLevel >= 4 ? "#000" : "#ccc",
                        border: `1px solid ${upgradeLevel >= 4 ? "#ffaa00" : "#555"}`,
                      }}
                    >
                      LV{upgradeLevel}
                    </div>
                  )}
                </div>

                {/* Skill info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-bold text-sm font-mono"
                      style={{ color: isUnlocked ? skill.color : "#555" }}
                    >
                      {skill.name}
                    </span>
                    {isUnlocked && (
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${RARITY_COLORS[skill.rarity]}20`,
                          border: `1px solid ${RARITY_COLORS[skill.rarity]}40`,
                          color: RARITY_COLORS[skill.rarity],
                        }}
                      >
                        LV {upgradeLevel} / 5
                      </span>
                    )}
                    <span
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${RARITY_COLORS[skill.rarity]}20`,
                        border: `1px solid ${RARITY_COLORS[skill.rarity]}40`,
                        color: RARITY_COLORS[skill.rarity],
                      }}
                    >
                      {skill.rarity.toUpperCase()}
                    </span>
                    <span
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${ELEMENT_COLORS[skill.element]}15`,
                        border: `1px solid ${ELEMENT_COLORS[skill.element]}30`,
                        color: ELEMENT_COLORS[skill.element],
                      }}
                    >
                      {ELEMENT_LABELS[skill.element]}
                    </span>
                  </div>
                  <div
                    className="text-[10px] font-mono mt-0.5"
                    style={{ color: isUnlocked ? "#888" : "#444" }}
                  >
                    {skill.description}
                  </div>
                  <div
                    className="flex items-center gap-3 mt-1 text-[9px] font-mono"
                    style={{ color: "#666" }}
                  >
                    <span>
                      DMG:{" "}
                      <span style={{ color: skill.color }}>
                        {isUnlocked ? Math.round(skill.damage * damageMultiplier) : skill.damage}
                      </span>
                      {isUnlocked && damageMultiplier > 1 && (
                        <span style={{ color: "#ffaa00" }}> (×{damageMultiplier})</span>
                      )}
                    </span>
                    <span>
                      CD:{" "}
                      <span style={{ color: "#aaa" }}>
                        {((skill.cooldown * cooldownMultiplier) / 60).toFixed(1)}s
                      </span>
                    </span>
                    {isUnlocked && !isMaxLevel && (
                      <button
                        onClick={() => {
                          if (canAffordUpgrade && !nextLevelRequiresAd) {
                            withSound(() => {
                              if (upgradeSkill(skill.id)) {
                                soundManager.playCoinCollect();
                              }
                            });
                          } else if (nextLevelRequiresAd) {
                            watchAdFor(() => {
                              withSound(() => {
                                if (upgradeSkill(skill.id)) {
                                  soundManager.playCoinCollect();
                                }
                              });
                            });
                          }
                        }}
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: canAffordUpgrade
                            ? "rgba(255,215,0,0.12)"
                            : "rgba(0,0,0,0.2)",
                          border: `1px solid ${canAffordUpgrade ? "#ffd70060" : "#333"}`,
                          color: canAffordUpgrade ? "#ffd700" : "#555",
                          cursor: "pointer",
                        }}
                      >
                        ⬆ LV{nextLevel} {upgradeCost > 0 ? `${upgradeCost}🪙` : nextLevelRequiresAd ? "🎬AD" : "FREE"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0">
                  {isUnlocked ? (
                    isEquipped ? (
                      <span
                        className="text-[8px] font-mono font-bold px-2 py-1 rounded inline-block"
                        style={{
                          color: GREEN,
                          backgroundColor: "rgba(0,255,102,0.1)",
                          border: "1px solid rgba(0,255,102,0.3)",
                        }}
                      >
                        EQUIPPED
                      </span>
                    ) : (
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => withSound(() => equipSkill(skill.id, slot))}
                            className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[24px]"
                            style={{
                              backgroundColor: `${skill.color}20`,
                              border: `1px solid ${skill.color}50`,
                              color: skill.color,
                            }}
                          >
                            {["1", "2", "3"][slot]}
                          </button>
                        ))}
                      </div>
                    )
                  ) : isAdUnlock ? (
                    <button
                      onClick={() =>
                        canAfford
                          ? withSound(() => {
                              if (buySkill(skill.id)) {
                                soundManager.playCoinCollect();
                              }
                            })
                          : watchAdFor(() => {
                              withSound(() => {
                                if (buySkill(skill.id)) {
                                  soundManager.playCoinCollect();
                                }
                              });
                            })
                      }
                      className="text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]"
                      style={{
                        backgroundColor: canAfford
                          ? "rgba(255,215,0,0.15)"
                          : "rgba(0,255,255,0.1)",
                        border: `1px solid ${canAfford ? "#ffd700" : CYAN}`,
                        color: canAfford ? "#ffd700" : CYAN,
                      }}
                    >
                      {canAfford ? `${skill.unlockCost} 🪙` : "🔒 WATCH AD"}
                    </button>
                  ) : canBuyWithCoins ? (
                    <button
                      onClick={() =>
                        canAfford &&
                        withSound(() => {
                          if (buySkill(skill.id)) {
                            soundManager.playCoinCollect();
                          }
                        })
                      }
                      className="text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]"
                      style={{
                        backgroundColor: canAfford ? "rgba(255,215,0,0.15)" : "rgba(0,0,0,0.3)",
                        border: `1px solid ${canAfford ? "#ffd700" : "#333"}`,
                        color: canAfford ? "#ffd700" : "#555",
                      }}
                    >
                      {skill.unlockCost} 🪙
                    </button>
                  ) : (
                    <span className="text-[6px] font-mono" style={{ color: "#555" }}>
                      {getSkillUnlockDescription(skill)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MainMenu — Main menu screen with shop integration
// Extracted from component `eI` (lines 5341–6216)
// =============================================================================

export function MainMenu() {
  // --- Store bindings ---
  const startGame = useGameStore((s) => s.startGame);
  const saveData = useGameStore((s) => s.saveData);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const setGameMode = useGameStore((s) => s.setGameMode);
  const selectPet = useGameStore((s) => s.selectPet);
  const buyPet = useGameStore((s) => s.buyPet);
  const buySkin = useGameStore((s) => s.buySkin);
  const selectSkin = useGameStore((s) => s.selectSkin);
  const buyPetSkin = useGameStore((s) => s.buyPetSkin);
  const selectPetSkin = useGameStore((s) => s.selectPetSkin);
  const buySkill = useGameStore((s) => s.buySkill);
  const equipSkill = useGameStore((s) => s.equipSkill);
  const unequipSkill = useGameStore((s) => s.unequipSkill);
  const addCoinsReward = useGameStore((s) => s.addCoinsReward);

  // --- Local UI state ---
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState<"skins" | "pets" | "skills">("skins");
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [slideAnim, setSlideAnim] = useState<string>("");

  // --- Derived data ---
  const ranking = useMemo(() => getRankingTier(saveData.rankingData.elo), [saveData.rankingData.elo]);
  const currentSkinDef = useMemo(
    () => PLAYER_SKINS.find((s) => s.id === saveData.currentSkin) || PLAYER_SKINS[0],
    [saveData.currentSkin]
  );
  const currentPetDef = useMemo(
    () => PETS.find((p) => p.id === saveData.currentPet) || PETS[0],
    [saveData.currentPet]
  );

  // --- Callbacks ---
  const withSound = useCallback((action: () => void) => {
    soundManager.init();
    soundManager.playMenuClick();
    action();
  }, []);

  const watchAdFor = useCallback((afterAd: () => void) => {
    setShowAdOverlay(true);
    setAdCallback(() => afterAd);
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowAdOverlay(false);
    addCoinsReward(200);
    if (adCallback) {
      adCallback();
      setAdCallback(null);
    }
  }, [adCallback, addCoinsReward]);

  const handleWatchAdCoins = useCallback(() => {
    watchAdFor(() => {
      soundManager.playCoinCollect();
    });
  }, [watchAdFor]);

  const openShop = useCallback(() => {
    setSlideAnim("animate-slide-in-right");
    withSound(() => setShowShop(true));
  }, [withSound]);

  const closeShop = useCallback(() => {
    setSlideAnim("animate-slide-in-left");
    withSound(() => setShowShop(false));
  }, [withSound]);

  // --- Menu button definitions ---
  // Original minified variable: `Z` (lines 5386–5416)
  const menuButtons = useMemo(
    () => [
      { icon: "🔫", label: "WEAPONS", color: RED, action: () => setGamePhase("weapon-shop" as never) },
      { icon: "🗺️", label: "LEVEL MAP", color: ORANGE, action: () => setGamePhase("level-map" as never) },
      { icon: "🎨", label: "SKINS", color: GREEN, action: () => openShop() },
      { icon: "🌐", label: "ONLINE", color: GOLD, action: () => setGamePhase("online-arena" as never) },
      { icon: "👤", label: "PROFILE", color: PURPLE, action: () => setGamePhase("profile" as never) },
      { icon: "⚙️", label: "SETTINGS", color: "#555", action: () => setGamePhase("settings" as never) },
    ],
    [setGamePhase, openShop]
  );

  // --- Skill filter helpers for shop ---
  const filteredSkills = useMemo(
    () => (skillFilter === "all" ? SKILLS : SKILLS.filter((s) => s.element === skillFilter)),
    [skillFilter]
  );

  const unlockedPetIds = useMemo(() => new Set(saveData.unlockedPets), [saveData.unlockedPets]);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col pointer-events-none"
      style={{ backgroundColor: "rgba(5,5,20,0.95)" }}
    >
      {/* Ad overlay (when watching an ad for coins) */}
      {showAdOverlay && <AdOverlay onComplete={handleAdComplete} />}

      {/* Background neon particles */}
      <MenuParticles />

      {/* ────────────── SHOP / CUSTOMIZATION VIEW ────────────── */}
      {showShop ? (
        <div className="flex-1 flex flex-col pointer-events-auto overflow-hidden">
          {/* Shop header */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              borderBottom: "1px solid rgba(0,255,255,0.1)",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={closeShop}
              className="neon-btn py-1.5 px-3 text-xs font-bold tracking-wider font-mono"
              style={{ borderColor: "#555", color: "#888", minHeight: 36 }}
            >
              ← BACK
            </button>
            <h2
              className="text-sm font-bold tracking-wider font-mono"
              style={{ color: GREEN, textShadow: "0 0 10px #00ff66" }}
            >
              🎨 CUSTOMIZATION
            </h2>
            <div
              className="font-mono text-xs"
              style={{ color: GOLD, textShadow: "0 0 8px #ffd700" }}
            >
              🪙 {saveData.totalCoins.toLocaleString()}
            </div>
          </div>

          {/* Shop tab navigation */}
          <div
            className="flex gap-1 px-4 py-2"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            {(
              [
                { id: "skins" as const, label: "SKINS", color: CYAN },
                { id: "pets" as const, label: "PETS", color: GREEN },
                { id: "skills" as const, label: "SKILLS", color: ORANGE },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => withSound(() => setShopTab(tab.id))}
                className="flex-1 py-2 text-[10px] font-bold font-mono tracking-wider rounded"
                style={{
                  backgroundColor: shopTab === tab.id ? `${tab.color}20` : "rgba(0,0,0,0.3)",
                  border: `1px solid ${shopTab === tab.id ? tab.color : "#333"}`,
                  color: shopTab === tab.id ? tab.color : "#666",
                  textShadow: shopTab === tab.id ? `0 0 8px ${tab.color}` : "none",
                  minHeight: 36,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════════════ SKINS TAB ══════════════════ */}
          {shopTab === "skins" && (
            <div
              className="flex-1 overflow-y-auto px-4 py-2 dark-scroll"
              style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
            >
              <div className="space-y-3">
                {/* Character skins */}
                <div
                  className="text-[10px] font-mono font-bold mb-1"
                  style={{ color: CYAN, textShadow: "0 0 5px rgba(0,255,255,0.3)" }}
                >
                  CHARACTER SKINS
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PLAYER_SKINS.map((skin) => {
                    const isUnlocked = saveData.unlockedSkins.includes(skin.id);
                    const isEquipped = saveData.currentSkin === skin.id;
                    const canAfford = saveData.totalCoins >= skin.price;
                    const isExpensive = skin.price >= 2000;

                    return (
                      <div
                        key={skin.id}
                        className="rounded-lg p-1.5 text-center"
                        style={{
                          backgroundColor: isEquipped ? `${skin.color}15` : "rgba(0,0,0,0.3)",
                          border: `1px solid ${isEquipped ? skin.color : isUnlocked ? `${skin.color}60` : "#333"}`,
                          boxShadow: isEquipped
                            ? `0 0 8px ${skin.color}30, inset 0 0 8px ${skin.color}10`
                            : "none",
                        }}
                      >
                        <div className="relative mx-auto mb-0.5 flex justify-center">
                          <StickmanAvatar
                            color={skin.color}
                            glowColor={skin.glowColor}
                            width={20}
                            height={32}
                          />
                          <div
                            className="absolute -top-0.5 -right-0.5 text-[5px] font-bold font-mono px-0.5 rounded"
                            style={{ backgroundColor: RARITY_COLORS[skin.rarity], color: "#000" }}
                          >
                            {skin.rarity.slice(0, 3).toUpperCase()}
                          </div>
                        </div>
                        <div
                          className="font-bold text-[8px] font-mono mb-0.5"
                          style={{ color: skin.color }}
                        >
                          {skin.name}
                        </div>
                        {isEquipped ? (
                          <div
                            className="text-[7px] font-mono font-bold"
                            style={{ color: GREEN, textShadow: "0 0 5px rgba(0,255,102,0.4)" }}
                          >
                            EQUIPPED
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => withSound(() => selectSkin(skin.id))}
                            className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: `${skin.color}20`,
                              border: `1px solid ${skin.color}60`,
                              color: skin.color,
                            }}
                          >
                            EQUIP
                          </button>
                        ) : isExpensive ? (
                          <button
                            onClick={() =>
                              canAfford
                                ? withSound(() => {
                                    buySkin(skin.id);
                                    selectSkin(skin.id);
                                    soundManager.playCoinCollect();
                                  })
                                : watchAdFor(() => {
                                    withSound(() => {
                                      buySkin(skin.id);
                                      selectSkin(skin.id);
                                      soundManager.playCoinCollect();
                                    });
                                  })
                            }
                            className="text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: canAfford
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(0,255,255,0.1)",
                              border: `1px solid ${canAfford ? "#ffd700" : CYAN}`,
                              color: canAfford ? "#ffd700" : CYAN,
                            }}
                          >
                            {canAfford ? `${skin.price} 🪙` : "🔒 WATCH AD"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              canAfford &&
                              withSound(() => {
                                buySkin(skin.id);
                                selectSkin(skin.id);
                                soundManager.playCoinCollect();
                              })
                            }
                            className="text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: canAfford
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(0,0,0,0.3)",
                              border: `1px solid ${canAfford ? "#ffd700" : "#333"}`,
                              color: canAfford ? "#ffd700" : "#555",
                            }}
                          >
                            {skin.price} 🪙
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pet skins section */}
                <div
                  className="text-[10px] font-mono font-bold mb-1 mt-3"
                  style={{ color: GREEN, textShadow: "0 0 5px rgba(0,255,102,0.3)" }}
                >
                  PET SKINS — {currentPetDef.name}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PET_SKINS.filter((ps) => ps.petId === saveData.currentPet).map((petSkin) => {
                    const isUnlocked = saveData.unlockedPetSkins.includes(petSkin.id);
                    const isEquipped = saveData.currentPetSkin === petSkin.id;
                    const canAfford = saveData.totalCoins >= petSkin.price;
                    const isExpensive = petSkin.price >= 800;

                    return (
                      <div
                        key={petSkin.id}
                        className="rounded-lg p-1.5 text-center"
                        style={{
                          backgroundColor: isEquipped ? `${petSkin.color}15` : "rgba(0,0,0,0.3)",
                          border: `1px solid ${isEquipped ? petSkin.color : isUnlocked ? `${petSkin.color}60` : "#333"}`,
                        }}
                      >
                        <div className="relative mx-auto mb-0.5 flex justify-center">
                          <PetAvatar color={petSkin.color} glowColor={petSkin.glowColor} size={22} />
                          <div
                            className="absolute -top-0.5 -right-0.5 text-[5px] font-bold font-mono px-0.5 rounded"
                            style={{ backgroundColor: RARITY_COLORS[petSkin.rarity], color: "#000" }}
                          >
                            {petSkin.rarity.slice(0, 3).toUpperCase()}
                          </div>
                        </div>
                        <div
                          className="font-bold text-[8px] font-mono mb-0.5"
                          style={{ color: petSkin.color }}
                        >
                          {petSkin.name}
                        </div>
                        {isEquipped ? (
                          <div
                            className="text-[7px] font-mono font-bold"
                            style={{ color: GREEN }}
                          >
                            EQUIPPED
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => withSound(() => selectPetSkin(petSkin.id))}
                            className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: `${petSkin.color}20`,
                              border: `1px solid ${petSkin.color}60`,
                              color: petSkin.color,
                            }}
                          >
                            EQUIP
                          </button>
                        ) : isExpensive ? (
                          <button
                            onClick={() =>
                              canAfford
                                ? withSound(() => {
                                    buyPetSkin(petSkin.id);
                                    selectPetSkin(petSkin.id);
                                    soundManager.playCoinCollect();
                                  })
                                : watchAdFor(() => {
                                    withSound(() => {
                                      buyPetSkin(petSkin.id);
                                      selectPetSkin(petSkin.id);
                                      soundManager.playCoinCollect();
                                    });
                                  })
                            }
                            className="text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: canAfford
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(0,255,255,0.1)",
                              border: `1px solid ${canAfford ? "#ffd700" : CYAN}`,
                              color: canAfford ? "#ffd700" : CYAN,
                            }}
                          >
                            {canAfford ? `${petSkin.price} 🪙` : "🔒 WATCH AD"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              canAfford &&
                              withSound(() => {
                                buyPetSkin(petSkin.id);
                                selectPetSkin(petSkin.id);
                                soundManager.playCoinCollect();
                              })
                            }
                            className="text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]"
                            style={{
                              backgroundColor: canAfford
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(0,0,0,0.3)",
                              border: `1px solid ${canAfford ? "#ffd700" : "#333"}`,
                              color: canAfford ? "#ffd700" : "#555",
                            }}
                          >
                            {petSkin.price} 🪙
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ PETS TAB ══════════════════ */}
          {shopTab === "pets" && (
            <div
              className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5"
              style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
            >
              {PETS.map((pet) => {
                const isUnlocked = saveData.unlockedPets.includes(pet.id);
                const isActive = saveData.currentPet === pet.id;
                const canAfford = saveData.totalCoins >= pet.price;
                const isExpensive = pet.price >= 1500;

                return (
                  <div
                    key={pet.id}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: isActive
                        ? `${pet.color}15`
                        : isUnlocked
                          ? `${pet.color}08`
                          : "rgba(0,0,0,0.2)",
                      border: `1px solid ${isActive ? pet.color : isUnlocked ? `${pet.color}40` : "#33333340"}`,
                      boxShadow: isActive ? `0 0 8px ${pet.color}20` : "none",
                    }}
                  >
                    {/* Pet avatar */}
                    <div className="flex-shrink-0">
                      <PetAvatar color={pet.color} glowColor={pet.glowColor} size={32} />
                    </div>

                    {/* Pet info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-bold text-[9px] font-mono"
                        style={{ color: isUnlocked ? pet.color : "#555" }}
                      >
                        {pet.name}
                      </div>
                      <div
                        className="text-[8px] font-mono truncate"
                        style={{ color: isUnlocked ? "#888" : "#444" }}
                      >
                        {pet.description}
                      </div>
                      <div className="text-[7px] font-mono mt-0.5" style={{ color: "#666" }}>
                        DMG:{pet.damage} | SPD:
                        {pet.shootRate > 0 ? (60 / pet.shootRate).toFixed(1) : "0"}/s
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 min-w-[60px] text-right">
                      {isActive ? (
                        <span
                          className="text-[8px] font-mono font-bold px-2 py-1 rounded inline-block"
                          style={{
                            color: GREEN,
                            backgroundColor: "rgba(0,255,102,0.1)",
                            border: "1px solid rgba(0,255,102,0.3)",
                          }}
                        >
                          ACTIVE
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => withSound(() => selectPet(pet.id))}
                          className="text-[8px] font-mono font-bold px-2 py-1 rounded min-h-[28px]"
                          style={{
                            backgroundColor: `${pet.color}20`,
                            border: `1px solid ${pet.color}60`,
                            color: pet.color,
                          }}
                        >
                          SELECT
                        </button>
                      ) : isExpensive ? (
                        <button
                          onClick={() =>
                            canAfford
                              ? withSound(() => {
                                  buyPet(pet.id);
                                  soundManager.playCoinCollect();
                                })
                              : watchAdFor(() => {
                                  withSound(() => {
                                    buyPet(pet.id);
                                    soundManager.playCoinCollect();
                                  });
                                })
                          }
                          className="text-[8px] font-mono font-bold px-1.5 py-1 rounded min-h-[28px]"
                          style={{
                            backgroundColor: canAfford
                              ? "rgba(255,215,0,0.15)"
                              : "rgba(0,255,255,0.1)",
                            border: `1px solid ${canAfford ? "#ffd700" : CYAN}`,
                            color: canAfford ? "#ffd700" : CYAN,
                          }}
                        >
                          {canAfford ? `${pet.price} 🪙` : "🔒 WATCH AD"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            canAfford &&
                            withSound(() => {
                              buyPet(pet.id);
                              soundManager.playCoinCollect();
                            })
                          }
                          className="text-[8px] font-mono font-bold px-1.5 py-1 rounded min-h-[28px]"
                          style={{
                            backgroundColor: canAfford
                              ? "rgba(255,215,0,0.15)"
                              : "rgba(0,0,0,0.3)",
                            border: `1px solid ${canAfford ? "#ffd700" : "#333"}`,
                            color: canAfford ? "#ffd700" : "#555",
                          }}
                        >
                          {pet.price} 🪙
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════ SKILLS TAB ══════════════════ */}
          {shopTab === "skills" && (
            <div
              className="flex-1 overflow-y-auto px-4 py-2 dark-scroll"
              style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
            >
              <div className="space-y-2">
                {/* Equipped skills slots */}
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: "rgba(255,102,0,0.06)",
                    border: "1px solid #ff660020",
                  }}
                >
                  <div
                    className="text-[8px] font-mono font-bold mb-1.5"
                    style={{ color: ORANGE, textShadow: "0 0 5px rgba(255,102,0,0.3)" }}
                  >
                    EQUIPPED SKILLS
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((slot) => {
                      const skillId = saveData.equippedSkills[slot];
                      const skill = skillId ? SKILLS.find((s) => s.id === skillId) : null;
                      const upgradeLevel = skillId
                        ? saveData.skillUpgrades[skillId] || 1
                        : 0;

                      return (
                        <div
                          key={slot}
                          className="flex-1 p-1.5 rounded text-center cursor-pointer min-h-[48px] flex flex-col items-center justify-center"
                          style={{
                            backgroundColor: skill ? `${skill.color}15` : "rgba(0,0,0,0.3)",
                            border: `1px solid ${skill ? skill.color + "60" : "#33333340"}`,
                          }}
                          onClick={() => withSound(() => unequipSkill(slot))}
                          role="button"
                          aria-label={
                            skill
                              ? `Unequip ${skill.name} from slot ${slot + 1}`
                              : `Empty skill slot ${slot + 1}`
                          }
                        >
                          {skill ? (
                            <>
                              <div
                                className="text-[8px] font-mono font-bold"
                                style={{ color: skill.color }}
                              >
                                {skill.name}
                              </div>
                              <div className="text-[7px] font-mono" style={{ color: "#666" }}>
                                CD:{(skill.cooldown / 60).toFixed(1)}s Lv.{upgradeLevel}
                              </div>
                              <div
                                className="w-full h-1 rounded-full mt-0.5"
                                style={{ backgroundColor: "#222" }}
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (skill.cooldown / 600) * 100)}%`,
                                    backgroundColor: skill.color,
                                    opacity: 0.6,
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <div className="text-[8px] font-mono" style={{ color: "#555" }}>
                              {["⚡", "🛡", "✨"][slot]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Element filter */}
                <div className="flex gap-0.5 flex-wrap">
                  <button
                    onClick={() => withSound(() => setSkillFilter("all"))}
                    className="px-1.5 py-0.5 rounded text-[7px] font-mono font-bold min-h-[22px]"
                    style={{
                      backgroundColor:
                        skillFilter === "all" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.3)",
                      border: `1px solid ${skillFilter === "all" ? "#ffffff50" : "#333"}`,
                      color: skillFilter === "all" ? "#fff" : "#666",
                    }}
                  >
                    ALL
                  </button>
                  {Object.keys(ELEMENT_LABELS).map((element) => (
                    <button
                      key={element}
                      onClick={() => withSound(() => setSkillFilter(element))}
                      className="px-1.5 py-0.5 rounded text-[7px] font-mono font-bold min-h-[22px]"
                      style={{
                        backgroundColor:
                          skillFilter === element
                            ? `${ELEMENT_COLORS[element]}25`
                            : "rgba(0,0,0,0.3)",
                        border: `1px solid ${skillFilter === element ? ELEMENT_COLORS[element] + "60" : "#333"}`,
                        color: skillFilter === element ? ELEMENT_COLORS[element] : "#666",
                      }}
                    >
                      {ELEMENT_ICONS[element]}
                    </button>
                  ))}
                </div>

                {/* Skill list */}
                <div
                  className="flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {filteredSkills.map((skill) => {
                    const isUnlocked = saveData.unlockedSkills.includes(skill.id);
                    const isEquipped = saveData.equippedSkills.includes(skill.id);
                    const canAfford = saveData.totalCoins >= skill.unlockCost;
                    const isAdUnlock = skill.unlockMethod === "ad";

                    return (
                      <div
                        key={skill.id}
                        className="p-1.5 rounded-lg flex gap-1.5 items-center"
                        style={{
                          backgroundColor: isUnlocked ? `${skill.color}08` : "rgba(0,0,0,0.2)",
                          border: `1px solid ${isEquipped ? skill.color : isUnlocked ? skill.color + "40" : "#33333330"}`,
                          boxShadow: isEquipped ? `0 0 6px ${skill.color}15` : "none",
                        }}
                      >
                        {/* Skill orb */}
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${skill.color}15`,
                            border: `1px solid ${skill.color}40`,
                          }}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full"
                            style={{
                              backgroundColor: skill.color,
                              boxShadow: `0 0 8px ${skill.glowColor}`,
                            }}
                          />
                        </div>

                        {/* Skill info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span
                              className="font-bold text-[8px] font-mono"
                              style={{ color: isUnlocked ? skill.color : "#555" }}
                            >
                              {skill.name}
                            </span>
                            <span
                              className="text-[6px] font-mono px-0.5 rounded"
                              style={{
                                backgroundColor: `${RARITY_COLORS[skill.rarity]}20`,
                                color: RARITY_COLORS[skill.rarity],
                              }}
                            >
                              {skill.rarity.slice(0, 3).toUpperCase()}
                            </span>
                            <span
                              className="text-[6px] font-mono px-0.5 rounded"
                              style={{
                                backgroundColor: `${ELEMENT_COLORS[skill.element]}15`,
                                color: ELEMENT_COLORS[skill.element],
                              }}
                            >
                              {ELEMENT_ICONS[skill.element]}
                            </span>
                          </div>
                          <div
                            className="text-[7px] font-mono truncate"
                            style={{ color: isUnlocked ? "#777" : "#444" }}
                          >
                            {skill.description}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div
                              className="flex-1 h-1 rounded-full"
                              style={{ backgroundColor: "#222" }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, (skill.cooldown / 600) * 100)}%`,
                                  backgroundColor: skill.color,
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                            <span className="text-[6px] font-mono flex-shrink-0" style={{ color: "#666" }}>
                              {(skill.cooldown / 60).toFixed(1)}s
                            </span>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="flex-shrink-0">
                          {isUnlocked ? (
                            isEquipped ? (
                              <span
                                className="text-[8px] font-mono font-bold px-2 py-1 rounded inline-block"
                                style={{
                                  color: GREEN,
                                  backgroundColor: "rgba(0,255,102,0.1)",
                                  border: "1px solid rgba(0,255,102,0.3)",
                                }}
                              >
                                EQUIPPED
                              </span>
                            ) : (
                              <div className="flex gap-0.5">
                                {[0, 1, 2].map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => withSound(() => equipSkill(skill.id, slot))}
                                    className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[24px]"
                                    style={{
                                      backgroundColor: `${skill.color}20`,
                                      border: `1px solid ${skill.color}50`,
                                      color: skill.color,
                                    }}
                                  >
                                    {["1", "2", "3"][slot]}
                                  </button>
                                ))}
                              </div>
                            )
                          ) : isAdUnlock ? (
                            <button
                              onClick={() =>
                                canAfford
                                  ? withSound(() => {
                                      buySkill(skill.id);
                                      soundManager.playCoinCollect();
                                    })
                                  : watchAdFor(() => {
                                      withSound(() => {
                                        buySkill(skill.id);
                                        soundManager.playCoinCollect();
                                      });
                                    })
                              }
                              className="text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]"
                              style={{
                                backgroundColor: canAfford
                                  ? "rgba(255,215,0,0.15)"
                                  : "rgba(0,255,255,0.1)",
                                border: `1px solid ${canAfford ? "#ffd700" : CYAN}`,
                                color: canAfford ? "#ffd700" : CYAN,
                              }}
                            >
                              {canAfford ? `${skill.unlockCost} 🪙` : "🔒 WATCH AD"}
                            </button>
                          ) : skill.unlockMethod === "purchase" ||
                            skill.unlockMethod === "chest" ? (
                            <button
                              onClick={() =>
                                canAfford &&
                                withSound(() => {
                                  buySkill(skill.id);
                                  soundManager.playCoinCollect();
                                })
                              }
                              className="text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]"
                              style={{
                                backgroundColor: canAfford
                                  ? "rgba(255,215,0,0.15)"
                                  : "rgba(0,0,0,0.3)",
                                border: `1px solid ${canAfford ? "#ffd700" : "#333"}`,
                                color: canAfford ? "#ffd700" : "#555",
                              }}
                            >
                              {skill.unlockCost} 🪙
                            </button>
                          ) : (
                            <span className="text-[6px] font-mono" style={{ color: "#555" }}>
                              {getSkillUnlockDescription(skill)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer hint */}
          <div
            className="text-center py-1.5 text-[7px] font-mono"
            style={{
              color: "rgba(255,255,255,0.2)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            Watch ads to earn coins • Complete levels to unlock more
          </div>
        </div>
      ) : (
        /* ────────────── MAIN MENU VIEW ────────────── */
        <div className="flex-1 flex pointer-events-auto">
          {/* Left: Title + stats + play button */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
            {/* Desktop: avatar + title side by side */}
            <div className="flex items-center gap-3 mb-1">
              <div className="hidden sm:block">
                <StickmanAvatar
                  color={currentSkinDef.color}
                  glowColor={currentSkinDef.glowColor}
                  width={44}
                  height={70}
                />
              </div>
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider leading-tight font-mono"
                  style={{
                    color: CYAN,
                    textShadow:
                      "0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.3)",
                    animation: "neon-pulse 3s ease-in-out infinite",
                  }}
                >
                  NEON STICKMAN
                </h1>
                <p
                  className="text-sm sm:text-lg md:text-xl tracking-widest leading-tight font-mono"
                  style={{
                    color: MAGENTA,
                    textShadow:
                      "0 0 10px #ff00ff, 0 0 25px #ff00ff, 0 0 50px rgba(255,0,255,0.3)",
                    animation: "neon-pulse 3s ease-in-out infinite 0.5s",
                  }}
                >
                  STICK WAR
                </p>
              </div>
            </div>

            {/* Mobile: smaller avatar below title */}
            <div className="sm:hidden">
              <StickmanAvatar
                color={currentSkinDef.color}
                glowColor={currentSkinDef.glowColor}
                width={32}
                height={50}
              />
            </div>

            {/* Stats bar: Coins | Rank | Level */}
            <div
              className="flex items-center justify-center gap-3 font-mono text-xs px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <span style={{ color: GOLD, textShadow: "0 0 8px #ffd700" }}>
                🪙 {saveData.totalCoins.toLocaleString()}
              </span>
              <span style={{ color: "#444" }}>│</span>
              <span style={{ color: ORANGE, textShadow: "0 0 5px #ff6600" }}>
                {ranking.icon} {ranking.rank}
              </span>
              <span style={{ color: "#444" }}>│</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                LV {saveData.highestLevel}/{(22000).toLocaleString()}
              </span>
            </div>

            {/* Level progress bar */}
            <div className="w-full max-w-[260px]">
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid #222" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (saveData.highestLevel / 22000) * 100)}%`,
                    backgroundColor: CYAN,
                    boxShadow: "0 0 6px #00ffff",
                  }}
                />
              </div>
            </div>

            {/* PLAY / CONTINUE button */}
            <button
              onClick={() =>
                withSound(() => {
                  tryFullscreenAndLandscape();
                  setGameMode("single");
                  startGame();
                })
              }
              className="neon-btn w-full max-w-[280px] py-3 px-6 text-lg font-bold tracking-wider font-mono"
              style={{
                borderColor: saveData.highestLevel > 0 ? GREEN : CYAN,
                color: saveData.highestLevel > 0 ? GREEN : CYAN,
                textShadow:
                  saveData.highestLevel > 0
                    ? "0 0 15px #00ff66, 0 0 30px #00ff66"
                    : "0 0 15px #00ffff, 0 0 30px #00ffff",
                animation: "continue-pulse 2s ease-in-out infinite",
                minHeight: 56,
              }}
            >
              {saveData.highestLevel > 0 ? "▶ CONTINUE" : "⚔️ PLAY"}
            </button>

            {/* Watch ad for +200 coins */}
            <button
              onClick={() => withSound(handleWatchAdCoins)}
              className="neon-btn w-full max-w-[280px] py-2 px-4 text-sm font-bold tracking-wider font-mono"
              style={{
                borderColor: GOLD,
                color: GOLD,
                textShadow: "0 0 8px #ffd700",
                backgroundImage:
                  "linear-gradient(90deg, transparent, rgba(255,215,0,0.06), transparent)",
                backgroundSize: "200% 100%",
                animation: "ad-shimmer 3s linear infinite",
                minHeight: 44,
              }}
            >
              🎬 WATCH AD +200 🪙
            </button>
          </div>

          {/* Right: Menu buttons grid */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div
              className="w-full max-w-[320px] rounded-xl p-3"
              style={{
                border: "1px solid rgba(0,255,255,0.15)",
                animation: "neon-border-glow 4s ease-in-out infinite",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                {menuButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => withSound(btn.action)}
                    className="neon-btn py-2.5 px-3 text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5"
                    style={{
                      borderColor: btn.color,
                      color: btn.color,
                      textShadow: `0 0 8px ${btn.color}`,
                      minHeight: 48,
                    }}
                  >
                    <span className="text-base">{btn.icon}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* ELO / Win-Loss footer */}
              <div
                className="mt-2 text-center text-[8px] font-mono"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {ranking.icon} ELO {saveData.rankingData.elo} •{" "}
                {saveData.rankingData.wins}W/{saveData.rankingData.losses}L
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
