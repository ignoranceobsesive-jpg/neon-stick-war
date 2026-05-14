/**
 * Settings — Sound settings, controls, and pause menu
 * Extracted from component `ty` (lines 12792–13047)
 * 
 * Also serves as the in-game pause overlay when accessed during gameplay.
 * Features:
 * - Master volume slider
 * - SFX volume + toggle
 * - Music volume + toggle
 * - Controls reference (touch + keyboard)
 * - Tips section
 * - Resume (in-game) / Quit buttons
 */

import React, { useCallback } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

/** Generates inline styles for the custom range sliders */
function sliderStyle(color: string): React.CSSProperties {
  return {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: 6,
    borderRadius: 3,
    background: `linear-gradient(to right, ${color} 0%, ${color} var(--value), #222 var(--value), #222 100%)`,
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties;
}

/**
 * Settings / pause overlay.
 * 
 * When opened during gameplay (currentLevel > 0), shows a "PAUSED" title
 * and a Resume button. Otherwise shows "SETTINGS".
 */
export function Settings() {
  const soundSettings = useGameStore((s) => s.soundSettings);
  const setSoundSettings = useGameStore((s) => s.setSoundSettings);
  const backToMenu = useGameStore((s) => s.backToMenu);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const isInGame = useGameStore((s) => s.currentLevel > 0);

  /** Update a volume setting (0-100 → 0-1) */
  const handleVolumeChange = useCallback(
    (key: string, value: number) => {
      setSoundSettings({ [key]: value / 100 });
    },
    [setSoundSettings]
  );

  /** Toggle a boolean setting */
  const handleToggle = useCallback(
    (key: string, value: boolean) => {
      setSoundSettings({ [key]: value });
    },
    [setSoundSettings]
  );

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-6 pointer-events-auto mx-4"
        style={{
          backgroundColor: 'rgba(5, 5, 20, 0.97)',
          border: '2px solid #00ffff',
          boxShadow: '0 0 30px #00ffff20',
        }}
      >
        {/* Title */}
        <h1
          className="text-3xl font-bold text-center tracking-wider mb-6 font-mono"
          style={{ color: COLORS.green, textShadow: '0 0 10px #00ff66' }}
        >
          {isInGame ? 'PAUSED' : 'SETTINGS'}
        </h1>

        {/* ─── Volume Controls ─── */}
        <div className="space-y-5 mb-6">
          {/* Master Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="text-sm font-mono font-bold"
                style={{ color: COLORS.cyan, textShadow: '0 0 5px #00ffff' }}
              >
                MASTER VOLUME
              </label>
              <span className="text-sm font-mono" style={{ color: COLORS.cyan }}>
                {Math.round(100 * soundSettings.masterVolume)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(100 * soundSettings.masterVolume)}
              onChange={(e) => handleVolumeChange('masterVolume', parseInt(e.target.value))}
              className="w-full"
              style={{
                ...sliderStyle(COLORS.cyan),
                '--value': `${100 * soundSettings.masterVolume}%`,
              } as React.CSSProperties}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="text-sm font-mono font-bold"
                style={{ color: COLORS.orange, textShadow: '0 0 5px #ff6600' }}
              >
                SFX VOLUME
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono" style={{ color: COLORS.orange }}>
                  {Math.round(100 * soundSettings.sfxVolume)}%
                </span>
                <button
                  onClick={() => handleToggle('sfxEnabled', !soundSettings.sfxEnabled)}
                  className="px-2 py-0.5 text-xs font-mono font-bold rounded"
                  style={{
                    border: `1px solid ${soundSettings.sfxEnabled ? COLORS.green : '#555'}`,
                    color: soundSettings.sfxEnabled ? COLORS.green : '#555',
                    backgroundColor: soundSettings.sfxEnabled
                      ? 'rgba(0,255,102,0.1)'
                      : 'transparent',
                  }}
                >
                  {soundSettings.sfxEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(100 * soundSettings.sfxVolume)}
              onChange={(e) => handleVolumeChange('sfxVolume', parseInt(e.target.value))}
              className="w-full"
              style={{
                ...sliderStyle(COLORS.orange),
                '--value': `${100 * soundSettings.sfxVolume}%`,
              } as React.CSSProperties}
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="text-sm font-mono font-bold"
                style={{ color: COLORS.magenta, textShadow: '0 0 5px #ff00ff' }}
              >
                MUSIC VOLUME
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono" style={{ color: COLORS.magenta }}>
                  {Math.round(100 * soundSettings.musicVolume)}%
                </span>
                <button
                  onClick={() => handleToggle('musicEnabled', !soundSettings.musicEnabled)}
                  className="px-2 py-0.5 text-xs font-mono font-bold rounded"
                  style={{
                    border: `1px solid ${soundSettings.musicEnabled ? COLORS.green : '#555'}`,
                    color: soundSettings.musicEnabled ? COLORS.green : '#555',
                    backgroundColor: soundSettings.musicEnabled
                      ? 'rgba(0,255,102,0.1)'
                      : 'transparent',
                  }}
                >
                  {soundSettings.musicEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(100 * soundSettings.musicVolume)}
              onChange={(e) => handleVolumeChange('musicVolume', parseInt(e.target.value))}
              className="w-full"
              style={{
                ...sliderStyle(COLORS.magenta),
                '--value': `${100 * soundSettings.musicVolume}%`,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* ─── Controls Reference ─── */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{
            backgroundColor: 'rgba(0,255,255,0.03)',
            border: '1px solid rgba(0,255,255,0.15)',
          }}
        >
          <h3
            className="text-sm font-mono font-bold mb-3"
            style={{ color: COLORS.yellow, textShadow: '0 0 5px #ffff00' }}
          >
            CONTROLS
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Touch controls */}
            <div>
              <div
                className="text-xs font-mono font-bold mb-1.5"
                style={{ color: COLORS.cyan }}
              >
                TOUCH CONTROLS
              </div>
              <div className="text-[10px] font-mono space-y-0.5" style={{ color: '#888' }}>
                <p>Joystick — Move</p>
                <p>⬆ — Jump</p>
                <p>🔥 — Shoot</p>
                <p>⚡ — Dash/Skill 1</p>
                <p>🛡 — Shield/Skill 2</p>
                <p>✦ — Special/Skill 3</p>
              </div>
            </div>

            {/* Tips */}
            <div>
              <div
                className="text-xs font-mono font-bold mb-1.5"
                style={{ color: COLORS.purple }}
              >
                TIPS
              </div>
              <div className="text-[10px] font-mono space-y-0.5" style={{ color: '#888' }}>
                <p>Hold 🔥 for auto-fire</p>
                <p>Double-tap ⬆ for double jump</p>
                <p>Use skills wisely — they have cooldowns</p>
                <p>Watch ads to earn coins</p>
                <p>Complete levels to unlock skins</p>
                <p>Upgrade weapons for more power</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Action Buttons ─── */}
        <div className="flex gap-3">
          {isInGame && (
            <button
              onClick={() => setGamePhase('playing')}
              className="neon-btn flex-1 py-3 px-4 text-lg font-bold font-mono tracking-wider"
              style={{
                borderColor: COLORS.green,
                color: COLORS.green,
                textShadow: '0 0 10px #00ff66',
              }}
            >
              RESUME
            </button>
          )}
          <button
            onClick={backToMenu}
            className="neon-btn flex-1 py-3 px-4 text-sm font-bold font-mono tracking-wider"
            style={{ borderColor: '#666', color: '#888', textShadow: 'none' }}
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  );
}
