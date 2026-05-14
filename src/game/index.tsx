/**
 * NeonStickWar — Game Entry Point
 *
 * Exports a React component that mounts the game canvas and initializes
 * the GameEngine. This replaces the old iframe-based approach, fixing
 * the "black preview screen" bug.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────┐
 * │  page.tsx (React)                                   │
 * │  └── GameCanvas component                           │
 * │      └── <canvas> element                           │
 * │          └── GameEngine (game loop, physics, AI)    │
 * │              ├── Camera (viewport, scrolling)       │
 * │              ├── InputManager (keyboard + touch)     │
 * │              ├── Renderer (canvas drawing)           │
 * │              ├── WaveManager (wave progression)      │
 * │              ├── AudioManager (sound effects)        │
 * │              └── Level Data (platforms, enemies)     │
 * └─────────────────────────────────────────────────────┘
 */

'use client';

import { useEffect, useRef } from 'react';
import { GameEngine } from './engine/GameEngine';

/**
 * GameCanvas — Full-screen game component.
 *
 * Renders a canvas element that fills the viewport and runs the
 * NeonStickWar game engine directly. No iframe, no external HTML.
 *
 * BUG FIX: Black preview screen was caused by the game being
 * loaded in an iframe with a broken static export. By rendering
 * the game directly on a canvas in the React tree, the game
 * is guaranteed to display correctly.
 */
export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Initialize the game engine when the canvas mounts
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      const engine = new GameEngine();
      engine.init(canvasRef.current);
      engineRef.current = engine;
    }

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      engineRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    // Also handle orientation change (mobile)
    if (typeof screen.orientation !== 'undefined') {
      screen.orientation.addEventListener('change', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (typeof screen.orientation !== 'undefined') {
        screen.orientation.removeEventListener('change', handleResize);
      }
    };
  }, []);

  // Handle visibility change (pause when app goes to background)
  useEffect(() => {
    const handleVisibility = () => {
      engineRef.current?.handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Pause audio on blur
    const handleBlur = () => {
      engineRef.current?.pause();
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Prevent default touch behaviors (zooming, scrolling) on the game area
  useEffect(() => {
    const preventDefaults = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefaults, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefaults);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#050510',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
