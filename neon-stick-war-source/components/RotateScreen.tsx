/**
 * RotateScreen — Rotate screen overlay for portrait mode
 * Extracted from component `eC` (lines 4968–5030+)
 * 
 * Detects mobile devices and prompts the user to rotate to landscape.
 * Currently disabled in the original bundle (always returns null).
 */

import React, { useEffect, useSyncExternalStore, useCallback } from 'react';
import { COLORS } from '../game/types';

/** No-op unsubscribe — used for useSyncExternalStore */
const noopUnsubscribe = () => {};

/**
 * Checks if the device is a touch device (mobile/tablet).
 */
function isTouchDevice(): boolean {
  return (
    window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

/**
 * Attempts to enter fullscreen and lock orientation to landscape.
 */
async function requestFullscreenLandscape() {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
  } catch {}
  try {
    const orient = screen.orientation as any;
    if (orient && orient.lock) await orient.lock('landscape');
  } catch {}
}

/**
 * Rotate screen overlay component.
 * 
 * In the original game, this component is DISABLED — the condition
 * `false` short-circuits to return null. The code below preserves
 * the full implementation for reference.
 */
export function RotateScreen() {
  const isMobile = useSyncExternalStore(
    noopUnsubscribe,
    () => isTouchDevice(),
    () => false
  );

  const subscribeResize = useCallback(
    (callback: () => void) => {
      window.addEventListener('resize', callback);
      window.addEventListener('orientationchange', callback);
      return () => {
        window.removeEventListener('resize', callback);
        window.removeEventListener('orientationchange', callback);
      };
    },
    []
  );

  const isPortrait = useSyncExternalStore(
    subscribeResize,
    () =>
      window.innerHeight > 1.4 * window.innerWidth &&
      !(() => {
        try {
          return (screen.orientation as any).type.includes('landscape');
        } catch {
          return false;
        }
      })(),
    () => false
  );

  useEffect(() => {
    if (isMobile) requestFullscreenLandscape();
  }, []);

  // ── DISABLED in original game — always returns null ──
  if (true) return null;

  // The code below is preserved but never reached:
  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#050510] flex flex-col items-center justify-center gap-6"
    >
      {/* Phone outline with rotation hint */}
      <div
        className="relative w-20 h-32 border-2 border-cyan-400 rounded-lg rotate-90 transition-transform"
        style={{
          animation: 'landscape-hint 2s ease-in-out infinite',
          boxShadow:
            '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)',
        }}
      >
        <div
          className="absolute inset-2 border border-cyan-400/40 rounded"
          style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
        >
          <div className="flex items-center justify-center h-full">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2L14 8L8 14"
                stroke={COLORS.cyan}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <p
        className="text-sm font-mono tracking-widest"
        style={{
          color: COLORS.cyan,
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
        }}
      >
        ROTATE TO LANDSCAPE
      </p>
    </div>
  );
}
