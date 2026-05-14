/**
 * AdOverlay — Ad watching progress bar overlay
 * Extracted from components `eN` (lines 5128–5179), `tB` (16094–16146), `tU` (16363–16415)
 * 
 * Three variants exist in the original bundle:
 *   - AdOverlay (eN): Generic ad with "🎬 WATCHING AD" label — used in shop/customization
 *   - AdOverlay2x (tB): "2x Reward unlocked!" message — used in daily reward
 *   - AdOverlayFree (tU): "Free upgrade unlocked!" message — used in weapon shop
 * 
 * All three share the same progress bar logic; only the completion text differs.
 */

import React, { useState, useEffect } from 'react';
import { COLORS } from '../game/types';

export interface AdOverlayProps {
  /** Called when the ad timer reaches 100% */
  onComplete: () => void;
  /** Variant: determines the completion message */
  variant?: 'default' | '2x-reward' | 'free-upgrade';
}

/**
 * Simulated ad-watching overlay with a progress bar.
 * Fills from 0% to 100% over ~3 seconds, then calls `onComplete`.
 */
export function AdOverlay({ onComplete, variant = 'default' }: AdOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? (clearInterval(interval), 100) : p + 2));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onComplete, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const completionText =
    variant === '2x-reward'
      ? '✅ 2x Reward unlocked!'
      : variant === 'free-upgrade'
        ? '✅ Free upgrade unlocked!'
        : '✅ Reward unlocked!';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
    >
      <div className="text-center">
        {/* Title */}
        <div
          className="text-2xl font-bold font-mono mb-4"
          style={{
            color: COLORS.gold,
            textShadow: '0 0 15px #ffd700',
          }}
        >
          🎬 WATCHING AD
        </div>

        {/* Progress bar */}
        <div
          className="w-64 h-3 rounded-full mx-auto mb-3"
          style={{ backgroundColor: '#222', border: '1px solid #444' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: COLORS.cyan,
              boxShadow: '0 0 10px #00ffff',
            }}
          />
        </div>

        {/* Status text */}
        <div
          className="text-sm font-mono"
          style={{ color: '#888' }}
        >
          {progress < 100 ? 'Please wait...' : completionText}
        </div>
      </div>
    </div>
  );
}
