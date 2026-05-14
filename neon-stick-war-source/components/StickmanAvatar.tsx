/**
 * StickmanAvatar — SVG stickman avatar component
 * Extracted from component `eA` (lines 5226–5289)
 * 
 * Renders an animated neon stickman figure as SVG.
 * Used in the main menu, shop, profile, and other screens.
 */

import React from 'react';

export interface StickmanAvatarProps {
  /** Stroke color for the stickman */
  color: string;
  /** Glow/drop-shadow color */
  glowColor: string;
  /** SVG width in pixels (default: 40) */
  width?: number;
  /** SVG height in pixels (default: 64) */
  height?: number;
}

/**
 * SVG neon stickman with animated bobbing effect.
 * The figure has a head (with eye), body, arms, and legs.
 */
export function StickmanAvatar({
  color,
  glowColor,
  width = 40,
  height = 64,
}: StickmanAvatarProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 64"
      style={{
        animation: 'stickman-bob 2s ease-in-out infinite',
        filter: `drop-shadow(0 0 4px ${glowColor})`,
      }}
    >
      {/* Head outline */}
      <circle cx="20" cy="10" r="7" fill="none" stroke={color} strokeWidth="2.5" />
      {/* Eye */}
      <circle cx="22" cy="9" r="1.5" fill={color} />
      {/* Body */}
      <line x1="20" y1="17" x2="20" y2="36" stroke={color} strokeWidth="2.5" />
      {/* Left arm */}
      <line x1="20" y1="23" x2="9" y2="30" stroke={color} strokeWidth="2" />
      {/* Right arm */}
      <line x1="20" y1="23" x2="31" y2="30" stroke={color} strokeWidth="2" />
      {/* Left leg */}
      <line x1="20" y1="36" x2="12" y2="54" stroke={color} strokeWidth="2" />
      {/* Right leg */}
      <line x1="20" y1="36" x2="28" y2="54" stroke={color} strokeWidth="2" />
    </svg>
  );
}
