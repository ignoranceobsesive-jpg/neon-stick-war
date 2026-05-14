/**
 * MenuParticles — Floating neon particles background for menus
 * Extracted from component `eP` (lines 5181–5224)
 * 
 * Generates 30 floating neon particles with a perspective grid floor effect.
 * Used as a decorative background in the main menu and shop screens.
 */

import React, { useMemo } from 'react';
import { COLORS } from '../game/types';

/** Neon color palette for particles */
const PARTICLE_COLORS = [
  COLORS.cyan,   // #00ffff
  COLORS.magenta, // #ff00ff
  COLORS.green,   // #00ff66
  COLORS.gold,    // #ffd700
  COLORS.purple,  // #aa00ff
];

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
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${2 * p.size}px ${p.color}, 0 0 ${4 * p.size}px ${p.color}40`,
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            '--drift': `${p.drift}px`,
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
            backgroundSize: '30px 15px',
            transform: 'perspective(150px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>
    </div>
  );
}
