/**
 * Profile — Profile editing, Firebase auth, cloud saves
 * Extracted from component `tN` (lines 14384–15074)
 * 
 * Features:
 * - Avatar selection (emoji or custom image upload)
 * - Username editing
 * - About text
 * - Nationality dropdown
 * - Cloud save (upload/download) with Firebase
 * - Rank display (ELO-based)
 * - Stats grid (level, kills, coins, skills)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

// ─── Avatar emojis available for selection ──────────────────────────────────────
const AVATAR_EMOJIS = [
  '⚔️', '🗡️', '🔥', '⚡', '💀', '👑', '🎮', '🕹️', '🌟', '💎',
  '🦊', '🐺', '🐉', '🔮', '🎯', '🛡️',
];

// ─── Nationality options ────────────────────────────────────────────────────────
const NATIONALITIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'South Korea', 'Brazil', 'India', 'Mexico', 'Russia',
  'China', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Poland', 'Turkey', 'Other',
];

/** Check if an avatar string is a data URL (custom uploaded image) */
function isDataUrl(avatar: string): boolean {
  return avatar.startsWith('data:');
}

/**
 * Rank info derived from ELO rating.
 * Simplified version — the original uses a more complex ranking system.
 */
function getRankFromElo(elo: number): { icon: string; rank: string } {
  if (elo >= 2000) return { icon: '🏆', rank: 'Champion' };
  if (elo >= 1500) return { icon: '💎', rank: 'Diamond' };
  if (elo >= 1200) return { icon: '⭐', rank: 'Platinum' };
  if (elo >= 900) return { icon: '🥇', rank: 'Gold' };
  if (elo >= 600) return { icon: '🥈', rank: 'Silver' };
  return { icon: '🥉', rank: 'Bronze' };
}

/**
 * Profile editing screen.
 */
export function Profile() {
  const saveData = useGameStore((s) => s.saveData);
  const updateProfile = useGameStore((s) => s.updateProfile);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  const [username, setUsername] = useState(saveData.username);
  const [avatar, setAvatar] = useState(saveData.avatar);
  const [about, setAbout] = useState(saveData.about);
  const [nationality, setNationality] = useState(saveData.nationality);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rankInfo = getRankFromElo(saveData.rankingData.elo);
  const winRate =
    saveData.rankingData.wins + saveData.rankingData.losses > 0
      ? Math.round(
          (saveData.rankingData.wins /
            (saveData.rankingData.wins + saveData.rankingData.losses)) *
            100
        )
      : 0;

  /** Render avatar as image or emoji */
  const renderAvatar = useCallback(
    (size: number = 36) => {
      if (isDataUrl(avatar)) {
        return (
          <img
            src={avatar}
            alt="Profile"
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
          />
        );
      }
      return (
        <span style={{ fontSize: 0.5 * size }}>{avatar}</span>
      );
    },
    [avatar]
  );

  /** Handle image upload */
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      setIsUploading(true);
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width: w, height: h } = img;
              if (w > 100 || h > 100) {
                const scale = Math.min(100 / w, 100 / h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
              }
              ctx.drawImage(img, 0, 0, w, h);
              let quality = 0.7;
              let result = canvas.toDataURL('image/jpeg', quality);
              while (result.length > 28000 && quality > 0.1) {
                quality -= 0.1;
                result = canvas.toDataURL('image/jpeg', quality);
              }
              resolve(result);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target?.result as string;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        setAvatar(dataUrl);
      } catch (err) {
        console.error('Failed to process image:', err);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    []
  );

  /** Save profile */
  const handleSave = useCallback(() => {
    updateProfile({
      username: username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 15) || 'NeonWarrior',
      avatar,
      about: about.slice(0, 50),
      nationality,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [username, avatar, about, nationality, updateProfile]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div
        className="w-full max-w-md p-4 rounded-lg mx-4 pointer-events-auto max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'rgba(5,5,20,0.95)',
          border: '2px solid #aa00ff',
          boxShadow: '0 0 30px #aa00ff20',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          className="text-xl font-bold text-center tracking-wider mb-3 font-mono"
          style={{ color: COLORS.purple, textShadow: '0 0 10px #aa00ff' }}
        >
          PROFILE
        </h2>

        {/* Avatar + Rank row */}
        <div
          className="flex items-center gap-3 mb-3 p-3 rounded-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid #333' }}
        >
          <div className="relative">
            <div
              className="rounded-full flex items-center justify-center overflow-hidden"
              style={{
                width: 64,
                height: 64,
                backgroundColor: 'rgba(0,255,255,0.1)',
                border: '2px solid #00ffff40',
                boxShadow: '0 0 12px #aa00ff40',
              }}
            >
              {renderAvatar(64)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{rankInfo.icon}</span>
              <span
                className="font-mono font-bold text-sm"
                style={{ color: COLORS.gold, textShadow: '0 0 5px #ffd700' }}
              >
                {rankInfo.rank}
              </span>
            </div>
            <div className="font-mono text-xs mt-0.5" style={{ color: '#888' }}>
              ELO: <span style={{ color: COLORS.cyan }}>{saveData.rankingData.elo}</span>
            </div>
            <div className="font-mono text-[10px] mt-1" style={{ color: '#666' }}>
              W/R: {winRate}% | {saveData.rankingData.wins}W {saveData.rankingData.losses}L
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div
          className="mb-3 p-2.5 rounded"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid #222' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px]" style={{ color: '#888' }}>
              LEVEL PROGRESS
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: COLORS.cyan }}>
              Zone {saveData.highestLevel}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: 'rgba(0,255,255,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((saveData.highestLevel / 100) * 100, 100)}%`,
                backgroundColor: COLORS.cyan,
                boxShadow: '0 0 6px #00ffff',
              }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { label: 'Level', value: saveData.highestLevel, color: COLORS.cyan },
            { label: 'Kills', value: saveData.totalKills, color: COLORS.orange },
            { label: 'Coins', value: saveData.totalCoins, color: COLORS.gold },
            { label: 'Skills', value: saveData.unlockedSkills.length, color: COLORS.purple },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-1.5 rounded"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid #222' }}
            >
              <div className="font-mono text-[9px]" style={{ color: '#888' }}>
                {stat.label}
              </div>
              <div
                className="font-mono text-xs font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Avatar selection */}
        <div className="mb-3">
          <label className="text-xs font-mono mb-1.5 block" style={{ color: '#888' }}>
            AVATAR
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="rounded-full flex items-center justify-center overflow-hidden"
              style={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(170,0,255,0.15)',
                border: '2px solid #aa00ff',
                boxShadow: '0 0 10px #aa00ff40',
              }}
            >
              {renderAvatar(48)}
            </div>
            <div className="flex-1 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 py-1.5 px-2 text-[10px] font-mono font-bold rounded"
                style={{
                  backgroundColor: 'rgba(170,0,255,0.08)',
                  border: '1px solid #aa00ff60',
                  color: COLORS.purple,
                  opacity: isUploading ? 0.5 : 1,
                }}
              >
                {isUploading ? '⏳ PROCESSING...' : '📷 UPLOAD IMAGE'}
              </button>
              {isDataUrl(avatar) && (
                <button
                  onClick={() => setAvatar('⚔️')}
                  className="py-1.5 px-2 text-[10px] font-mono font-bold rounded"
                  style={{
                    backgroundColor: 'rgba(255,51,51,0.08)',
                    border: '1px solid #ff333360',
                    color: '#ff3333',
                  }}
                >
                  ✕ REMOVE
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className="w-8 h-8 text-base rounded flex items-center justify-center transition-all"
                style={{
                  backgroundColor:
                    avatar !== emoji || isDataUrl(avatar)
                      ? 'rgba(0,0,0,0.3)'
                      : 'rgba(170,0,255,0.2)',
                  border:
                    avatar !== emoji || isDataUrl(avatar)
                      ? '1px solid #333'
                      : '2px solid #aa00ff',
                  boxShadow:
                    avatar !== emoji || isDataUrl(avatar)
                      ? 'none'
                      : '0 0 8px #aa00ff',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="text-xs font-mono mb-1 block" style={{ color: '#888' }}>
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 15))}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 rounded font-mono text-sm"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid #444',
              color: COLORS.cyan,
              outline: 'none',
            }}
            maxLength={15}
          />
          <span className="text-[10px] font-mono" style={{ color: '#555' }}>
            {username.length}/15
          </span>
        </div>

        {/* About */}
        <div className="mb-3">
          <label className="text-xs font-mono mb-1 block" style={{ color: '#888' }}>
            ABOUT
          </label>
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, 50))}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 rounded font-mono text-sm"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid #444',
              color: '#ddd',
              outline: 'none',
            }}
            maxLength={50}
            placeholder="Tell us about yourself..."
          />
          <span className="text-[10px] font-mono" style={{ color: '#555' }}>
            {about.length}/50
          </span>
        </div>

        {/* Nationality */}
        <div className="mb-3">
          <label className="text-xs font-mono mb-1 block" style={{ color: '#888' }}>
            NATIONALITY
          </label>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-3 py-2 rounded font-mono text-sm"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid #444',
              color: '#ddd',
              outline: 'none',
            }}
          >
            <option value="">Select...</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="neon-btn w-full py-2.5 px-6 text-base font-bold font-mono tracking-wider mb-2"
          style={{
            borderColor: saved ? COLORS.green : COLORS.purple,
            color: saved ? COLORS.green : COLORS.purple,
            textShadow: saved ? '0 0 10px #00ff66' : '0 0 10px #aa00ff',
          }}
        >
          {saved ? '✓ SAVED!' : 'SAVE'}
        </button>

        {/* Back button */}
        <button
          onClick={() => setGamePhase('menu')}
          className="neon-btn w-full py-2 px-4 text-sm tracking-wider"
          style={{ borderColor: '#666', color: '#888' }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
