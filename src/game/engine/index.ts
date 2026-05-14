/**
 * NeonStickWar Game Engine — barrel export.
 *
 * Re-exports all engine modules from a single entry point for convenient imports.
 *
 * @example
 * ```ts
 * import { GameEngine, Camera, InputManager, Renderer } from '@/game/engine';
 * import type { GamePhase, Player, Enemy, Platform } from '@/game/engine';
 * ```
 */

// Engine core
export { Camera } from './Camera';
export { InputManager } from './InputManager';
export type { TouchButton } from './InputManager';
export { Renderer } from './Renderer';
export { GameEngine } from './GameEngine';

// Shared types
export type {
  GamePhase,
  Platform,
  Player,
  Enemy,
  EnemyType,
  Portal,
  Projectile,
  PlayerSkin,
  WeatherType,
} from './types';
