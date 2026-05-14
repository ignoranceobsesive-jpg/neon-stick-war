/**
 * Cutscene — Cutscene viewer with typewriter text
 * Extracted from component `ta` (lines 11388–11538)
 * 
 * Displays cinematic cutscene frames with:
 * - Typewriter text effect (character-by-character reveal)
 * - Auto-advance based on frame duration
 * - Tap/click to skip or advance
 * - Frame progress dots
 * - Skip button
 * 
 * Also includes the cutscene scene theme data (`to`).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS, type ChapterTheme } from '../game/types';

// ─── Cutscene Scene Themes ─────────────────────────────────────────────────────

interface SceneTheme {
  bg: string;
  accent: string;
  icon: string;
}

const SCENE_THEMES: Record<string, SceneTheme> = {
  cityPan: { bg: '#050520', accent: COLORS.cyan, icon: '🌆' },
  kidnapping: { bg: '#200510', accent: COLORS.red, icon: '⚡' },
  blueWakes: { bg: '#050515', accent: COLORS.cyan, icon: '💙' },
  blueAngry: { bg: '#150505', accent: COLORS.red, icon: '🔥' },
  shadowAppears: { bg: '#100515', accent: COLORS.purple, icon: '👤' },
  handshake: { bg: '#051010', accent: COLORS.cyan, icon: '🤝' },
  gangForming: { bg: '#050a10', accent: COLORS.gold, icon: '⚔️' },
  lunaCaptured: { bg: '#150510', accent: COLORS.purple, icon: '🔒' },
  blueSeesLuna: { bg: '#050a10', accent: COLORS.cyan, icon: '💫' },
  motherThreat: { bg: '#100505', accent: COLORS.orange, icon: '⚠️' },
  protectMother: { bg: '#050510', accent: COLORS.cyan, icon: '🛡️' },
  bossIntro: { bg: '#150505', accent: COLORS.red, icon: '💀' },
  bossDefeated: { bg: '#051005', accent: COLORS.green, icon: '🏆' },
  reunion: { bg: '#050510', accent: COLORS.purple, icon: '💖' },
  victoryCelebration: { bg: '#050a05', accent: COLORS.gold, icon: '🎉' },
  revive: { bg: '#050510', accent: COLORS.cyan, icon: '⚡' },
  gangJoin: { bg: '#050a10', accent: COLORS.green, icon: '✊' },
  walking: { bg: '#050510', accent: COLORS.cyan, icon: '🚶' },
  warScene: { bg: '#150505', accent: COLORS.orange, icon: '⚔️' },
  darkRevelation: { bg: '#100510', accent: COLORS.purple, icon: '👁️' },
  betrayal: { bg: '#150505', accent: COLORS.red, icon: '💔' },
  flashback: { bg: '#0a0515', accent: '#8888ff', icon: '💭' },
  lunaVision: { bg: '#050510', accent: COLORS.purple, icon: '🔮' },
  shadowPast: { bg: '#0a0515', accent: COLORS.purple, icon: '🌑' },
  motherSecret: { bg: '#050a0a', accent: '#44ddaa', icon: '🤫' },
  voidRift: { bg: '#0a0515', accent: COLORS.magenta, icon: '🌀' },
  mysteryFigure: { bg: '#050510', accent: '#ff0044', icon: '❓' },
  sacrifice: { bg: '#150505', accent: COLORS.gold, icon: '🕊️' },
  truthRevealed: { bg: '#050510', accent: COLORS.gold, icon: '💡' },
  darkCorridor: { bg: '#050508', accent: '#666', icon: '🚪' },
  explosion: { bg: '#150800', accent: COLORS.orange, icon: '💥' },
  silentPrayer: { bg: '#050510', accent: COLORS.cyan, icon: '🙏' },
  stormApproaching: { bg: '#050510', accent: COLORS.yellow, icon: '⛈️' },
  hiddenBase: { bg: '#050808', accent: '#44ddaa', icon: '🏗️' },
  theDeal: { bg: '#100505', accent: COLORS.gold, icon: '🤝' },
  lastStand: { bg: '#150505', accent: COLORS.red, icon: '🗡️' },
  newDawn: { bg: '#050a05', accent: COLORS.gold, icon: '🌅' },
  gangOath: { bg: '#050510', accent: COLORS.cyan, icon: '✊' },
  redKingPlan: { bg: '#150505', accent: COLORS.red, icon: '👑' },
};

const DEFAULT_THEME: SceneTheme = { bg: '#050510', accent: COLORS.cyan, icon: '🎬' };

// ─── Cutscene Component ────────────────────────────────────────────────────────

/**
 * Cinematic cutscene viewer with typewriter text.
 * 
 * Features:
 * - Typewriter effect (30ms per character)
 * - Auto-advance based on frame duration
 * - Tap to immediately show full text, then advance
 * - Scene-specific background, accent color, and icon
 * - Frame progress dots
 * - Skip button
 */
export function Cutscene() {
  const currentCutscene = useGameStore((s) => s.currentCutscene);
  const cutsceneFrameIndex = useGameStore((s) => s.cutsceneFrameIndex);
  const advanceCutscene = useGameStore((s) => s.advanceCutscene);
  const skipCutscene = useGameStore((s) => s.skipCutscene);

  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [fadeState, setFadeState] = useState<'in' | 'visible' | 'out'>('in');
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTappedOnce = useRef(true);
  const currentFrameRef = useRef<typeof currentFrame | null>(null);

  const currentFrame = currentCutscene?.frames[cutsceneFrameIndex];
  const theme = (currentFrame && SCENE_THEMES[currentFrame.scene]) || DEFAULT_THEME;

  currentFrameRef.current = currentFrame;
  hasTappedOnce.current = isTyping;

  /** Handle tap/click to advance or skip typing */
  const handleTap = useCallback(() => {
    const frame = currentFrameRef.current;
    if (!frame) return;

    if (hasTappedOnce.current) {
      // First tap: show full text immediately
      setCharIndex(frame.dialogue.length);
      setIsTyping(false);
      hasTappedOnce.current = false;
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        setFadeState('out');
        setTimeout(() => advanceCutscene(), 200);
      }, 1500);
      return;
    }

    // Second tap: advance immediately
    setFadeState('out');
    setTimeout(() => advanceCutscene(), 200);
  }, [advanceCutscene]);

  // Typewriter effect + auto-advance
  useEffect(() => {
    if (!currentFrame) return;

    setCharIndex(0);
    setIsTyping(true);
    hasTappedOnce.current = true;
    setFadeState('in');

    const dialogue = currentFrame.dialogue;
    let idx = 0;

    if (typewriterInterval.current) clearInterval(typewriterInterval.current);
    typewriterInterval.current = setInterval(() => {
      setCharIndex(++idx);
      if (idx >= dialogue.length) {
        if (typewriterInterval.current) clearInterval(typewriterInterval.current);
        setIsTyping(false);
        hasTappedOnce.current = false;
      }
    }, 30);

    const showTimeout = setTimeout(() => setFadeState('visible'), 300);

    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      handleTap();
    }, currentFrame.duration * (1000 / 60));

    return () => {
      if (typewriterInterval.current) clearInterval(typewriterInterval.current);
      clearTimeout(showTimeout);
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [cutsceneFrameIndex, currentCutscene?.id, currentFrame, handleTap]);

  if (!currentCutscene || !currentFrame) return null;

  const visibleText = currentFrame.dialogue.slice(0, charIndex);
  const speakerColor = currentFrame.speakerColor || theme.accent;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        backgroundColor: theme.bg,
        opacity: fadeState === 'in' ? 0.7 : fadeState === 'out' ? 0.3 : 1,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleTap}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTap();
      }}
      role="button"
      aria-label="Tap to advance cutscene"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.accent}08 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + (7 * i) % 80}%`,
              bottom: '-10px',
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              backgroundColor: i % 2 === 0 ? theme.accent : `${theme.accent}80`,
              boxShadow: `0 0 ${4 + (i % 4)}px ${theme.accent}40`,
              animation: `particle-float ${6 + (i % 8)}s linear ${i % 5}s infinite`,
              '--drift': `${-10 + (7 * i) % 20}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Scene icon */}
      <div
        className="text-4xl sm:text-5xl mb-4"
        style={{
          filter: `drop-shadow(0 0 15px ${theme.accent})`,
          animation: 'neon-pulse 3s ease-in-out infinite',
        }}
      >
        {theme.icon}
      </div>

      {/* Speaker name */}
      <div
        className="text-sm sm:text-base font-bold font-mono tracking-widest mb-2 px-3 py-1 rounded"
        style={{
          color: speakerColor,
          textShadow: `0 0 10px ${speakerColor}, 0 0 20px ${speakerColor}40`,
          backgroundColor: `${speakerColor}10`,
          border: `1px solid ${speakerColor}30`,
        }}
      >
        {currentFrame.speaker}
      </div>

      {/* Dialogue text (typewriter effect) */}
      <div className="text-center px-8 max-w-lg">
        <p
          className="text-lg sm:text-2xl font-bold font-mono tracking-wide leading-relaxed"
          style={{
            color: '#e0e0e0',
            textShadow: `0 0 8px ${theme.accent}40`,
          }}
        >
          {visibleText}
          {isTyping && (
            <span
              className="inline-block w-2 h-5 ml-1 align-middle"
              style={{
                backgroundColor: theme.accent,
                animation: 'blink 0.6s step-end infinite',
              }}
            />
          )}
        </p>
      </div>

      {/* Frame progress dots */}
      <div className="flex gap-2 mt-6">
        {currentCutscene.frames.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < cutsceneFrameIndex || i === cutsceneFrameIndex ? theme.accent : '#333',
              boxShadow: i === cutsceneFrameIndex ? `0 0 8px ${theme.accent}` : 'none',
              transform: i === cutsceneFrameIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Tap to continue hint */}
      <div
        className="text-xs font-mono mt-8"
        style={{
          color: '#444',
          animation: 'neon-pulse 2s ease-in-out infinite',
        }}
      >
        TAP TO CONTINUE
      </div>

      {/* Skip button */}
      <button
        className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded z-50"
        style={{
          color: '#555',
          border: '1px solid #333',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          skipCutscene();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
          skipCutscene();
        }}
      >
        SKIP ▸▸
      </button>
    </div>
  );
}
