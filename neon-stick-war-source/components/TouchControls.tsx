/**
 * TouchControls — Touch controls (joystick + action buttons) and pause overlay
 * Extracted from components `e5` + `e3` + `e4` (lines 9964–10332+)
 * 
 * Three sub-components:
 * 1. TouchControlsManager (e5) — Renders controls or pause overlay based on game phase
 * 2. PauseOverlay (e3) — Pause menu with Resume and Quit
 * 3. TouchControls (e4) — Full joystick + action button overlay
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import useGameStore from '../game/systems/gameStore';
import { COLORS } from '../game/types';

// ─── Pause Overlay ─────────────────────────────────────────────────────────────

interface PauseOverlayProps {
  onResume: () => void;
}

/** In-game pause overlay with Resume and Quit buttons */
function PauseOverlay({ onResume }: PauseOverlayProps) {
  const backToMenu = useGameStore((s) => s.backToMenu);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', touchAction: 'none' }}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className="text-3xl font-bold tracking-widest"
          style={{
            color: COLORS.cyan,
            textShadow: `0 0 20px ${COLORS.cyan}`,
          }}
        >
          ⏸ PAUSED
        </div>

        <button
          className="px-8 py-3 rounded-xl font-bold text-lg tracking-wider select-none active:scale-95 transition-transform"
          style={{
            backgroundColor: `rgba(0, 255, 255, 0.15)`,
            border: '2px solid rgba(0, 255, 255, 0.6)',
            color: COLORS.cyan,
            textShadow: `0 0 8px ${COLORS.cyan}`,
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
            touchAction: 'none',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            onResume();
          }}
          onClick={onResume}
          aria-label="Resume game"
        >
          ▶ RESUME
        </button>

        <button
          className="px-8 py-3 rounded-xl font-bold text-lg tracking-wider select-none active:scale-95 transition-transform"
          style={{
            backgroundColor: 'rgba(255, 0, 255, 0.1)',
            border: '2px solid rgba(255, 0, 255, 0.4)',
            color: COLORS.magenta,
            textShadow: `0 0 8px ${COLORS.magenta}`,
            touchAction: 'none',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            backToMenu();
          }}
          onClick={() => backToMenu()}
          aria-label="Quit to menu"
        >
          ✕ QUIT
        </button>
      </div>
    </div>
  );
}

// ─── Touch Controls ─────────────────────────────────────────────────────────────

interface SkillSlot {
  key: string;
  icon: string;
  color: string;
  label: string;
  cooldown: number;
  maxCooldown: number;
  skillId: string;
}

/**
 * Full touch control overlay with joystick and action buttons.
 * 
 * Left side: Virtual joystick for movement
 * Right side: Jump, Shoot (hold), and 3 skill buttons
 * Top-right: Pause button
 * 
 * Skill buttons adapt based on equipped skills from the store.
 */
function TouchControlsOverlay() {
  const dashCooldown = useGameStore((s) => s.dashCooldown);
  const shieldCooldown = useGameStore((s) => s.shieldCooldown);
  const specialCooldown = useGameStore((s) => s.specialCooldown);
  const saveData = useGameStore((s) => s.saveData);

  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickCenter = useRef({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);
  const shootIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMobile = useMemo(
    () =>
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    []
  );

  // Build skill slot configuration
  const skillSlots: SkillSlot[] = useMemo(() => {
    const slots: SkillSlot[] = [
      {
        key: 'dash',
        icon: '⚡',
        color: COLORS.cyan,
        label: '',
        cooldown: dashCooldown,
        maxCooldown: 90,
        skillId: '',
      },
      {
        key: 'shield',
        icon: '🛡',
        color: COLORS.green,
        label: '',
        cooldown: shieldCooldown,
        maxCooldown: 300,
        skillId: '',
      },
      {
        key: 'special',
        icon: '✦',
        color: COLORS.magenta,
        label: '',
        cooldown: specialCooldown,
        maxCooldown: 360,
        skillId: '',
      },
    ];
    return slots;
  }, [dashCooldown, shieldCooldown, specialCooldown, saveData.equippedSkills]);

  // Joystick touch handlers
  const handleJoystickMove = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - joystickCenter.current.x;
      const dy = clientY - joystickCenter.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, 40);
      const angle = Math.atan2(dy, dx);

      const normX = dist > 0 ? (clampedDist / 40) * Math.cos(angle) : 0;
      const normY = dist > 0 ? (clampedDist / 40) * Math.sin(angle) : 0;

      setJoystickPos({
        x: dist > 0 ? clampedDist * Math.cos(angle) : 0,
        y: dist > 0 ? clampedDist * Math.sin(angle) : 0,
      });

      // In production: playerRef.setJoystick({ active: true, dx: normX, dy: normY })
      // playerRef.moveLeft/Right/stopMove based on normX
    },
    []
  );

  const handleJoystickStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.changedTouches[0];
      if (touchIdRef.current !== null) return;
      touchIdRef.current = touch.identifier;
      setJoystickActive(true);

      const rect = joystickRef.current?.getBoundingClientRect();
      if (rect) {
        joystickCenter.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      handleJoystickMove(touch.clientX, touch.clientY);
    },
    [handleJoystickMove]
  );

  const handleJoystickMoveEvent = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          handleJoystickMove(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [handleJoystickMove]
  );

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setJoystickPos({ x: 0, y: 0 });
        // playerRef.setJoystick({ active: false, dx: 0, dy: 0 })
        // playerRef.stopMove()
        break;
      }
    }
  }, []);

  // Clean up shoot interval on unmount
  useEffect(() => {
    return () => {
      if (shootIntervalRef.current) clearInterval(shootIntervalRef.current);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none"
      style={{ touchAction: 'none' }}
    >
      {/* ─── Joystick (bottom-left) ─── */}
      <div
        className="absolute pointer-events-auto"
        style={{ left: 12, bottom: 18, touchAction: 'none' }}
      >
        <div
          ref={joystickRef}
          className="relative rounded-full"
          style={{
            width: 130,
            height: 130,
            backgroundColor: joystickActive
              ? 'rgba(0, 255, 255, 0.12)'
              : 'rgba(0, 255, 255, 0.06)',
            border: `2.5px solid ${
              joystickActive ? 'rgba(0, 255, 255, 0.7)' : 'rgba(0, 255, 255, 0.35)'
            }`,
            boxShadow: joystickActive
              ? '0 0 20px rgba(0, 255, 255, 0.25), inset 0 0 12px rgba(0, 255, 255, 0.06)'
              : '0 0 12px rgba(0, 255, 255, 0.1), inset 0 0 8px rgba(0, 255, 255, 0.03)',
            transition: joystickActive
              ? 'none'
              : 'box-shadow 0.3s, background-color 0.3s, border-color 0.3s',
            animation: joystickActive ? 'none' : 'joystick-idle-pulse 2s ease-in-out infinite',
          }}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMoveEvent}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
        >
          {/* Direction labels */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200"
            style={{
              opacity: joystickActive ? 0 : 0.7,
              color: COLORS.cyan,
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: '0.15em',
              textShadow:
                '0 0 12px rgba(0, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.3)',
            }}
          >
            <span>⬍</span>
          </div>

          {/* Joystick thumb */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(0, 255, 255, 0.3)',
              border: '2px solid rgba(0, 255, 255, 0.6)',
              left: 45 + joystickPos.x,
              top: 45 + joystickPos.y,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
              transition: joystickActive ? 'none' : 'left 0.15s, top 0.15s',
            }}
          />
        </div>
      </div>

      {/* ─── Action Buttons (bottom-right) ─── */}
      <div
        className="absolute pointer-events-auto flex items-end gap-2"
        style={{ right: 12, bottom: 18, touchAction: 'none' }}
      >
        {/* Jump button */}
        <button
          className="rounded-full flex items-center justify-center font-bold font-mono"
          style={{
            width: 60,
            height: 60,
            backgroundColor: 'rgba(0, 255, 102, 0.12)',
            border: '2px solid rgba(0, 255, 102, 0.5)',
            color: COLORS.green,
            fontSize: 18,
            textShadow: '0 0 8px #00ff66',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            // playerRef.jump()
          }}
          aria-label="Jump"
        >
          ⬆
        </button>

        {/* Shoot button */}
        <button
          className="rounded-full flex items-center justify-center font-bold font-mono"
          style={{
            width: 72,
            height: 72,
            backgroundColor: 'rgba(255, 0, 255, 0.12)',
            border: '2px solid rgba(255, 0, 255, 0.5)',
            color: COLORS.magenta,
            fontSize: 14,
            textShadow: '0 0 8px #ff00ff',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            // playerRef.shoot()
            shootIntervalRef.current = setInterval(() => {
              // playerRef.shoot()
            }, 150);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            // playerRef.stopShoot()
            if (shootIntervalRef.current) {
              clearInterval(shootIntervalRef.current);
              shootIntervalRef.current = null;
            }
          }}
          aria-label="Shoot"
        >
          🔥
        </button>
      </div>

      {/* ─── Skill Buttons (bottom-right, above action buttons) ─── */}
      <div
        className="absolute pointer-events-auto flex gap-1.5"
        style={{ right: 12, bottom: 95 }}
      >
        {skillSlots.map((slot) => {
          const isReady = slot.cooldown <= 0;
          return (
            <button
              key={slot.key}
              className="rounded-lg flex flex-col items-center justify-center font-bold font-mono"
              style={{
                width: 44,
                height: 44,
                backgroundColor: isReady ? `${slot.color}20` : 'rgba(0,0,0,0.3)',
                border: `2px solid ${isReady ? slot.color : '#333'}`,
                color: isReady ? slot.color : '#555',
                fontSize: 16,
                textShadow: isReady ? `0 0 6px ${slot.color}` : 'none',
                opacity: isReady ? 1 : 0.6,
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                // playerRef.executeSkill(slot.skillId) or dash/shield/special
              }}
              aria-label={slot.key}
            >
              {slot.icon}
            </button>
          );
        })}
      </div>

      {/* ─── Pause Button (top-right) ─── */}
      <button
        className="absolute top-3 right-3 pointer-events-auto w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: '1px solid #444',
          color: '#888',
          fontSize: 18,
        }}
        onClick={() => {
          // playerRef.pause()
        }}
        aria-label="Pause game"
      >
        ⏸
      </button>
    </div>
  );
}

// ─── Manager Component ──────────────────────────────────────────────────────────

/**
 * Touch controls manager.
 * Renders the pause overlay or touch controls based on game phase.
 */
export function TouchControlsManager() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  if (gamePhase === 'playing') {
    return <TouchControlsOverlay />;
  }

  if (gamePhase === 'settings' && currentLevel > 0) {
    return (
      <PauseOverlay onResume={() => setGamePhase('playing')} />
    );
  }

  return null;
}

export { TouchControlsOverlay, PauseOverlay };
export default TouchControlsManager;
