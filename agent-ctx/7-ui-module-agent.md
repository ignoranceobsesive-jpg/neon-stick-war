# Task 7 — UI Module Agent

## Task
Create UI files under src/game/ui/ for the NeonStickWar game. These handle drawing the game's user interface on the canvas.

## Work Log
- Read worklog.md to understand project context (Tasks 1-6 previous work)
- Read existing entity and engine files to understand types and patterns:
  - Player.ts: PlayerState interface with health, dash/skill cooldowns, facing, etc.
  - Enemy.ts: EnemyState interface with type, health, combat stats
  - Renderer.ts: Renderer class with static setGlow/clearGlow neon helpers
  - types.ts: GamePhase, Player, Enemy, Portal, Projectile, PlayerSkin, WeatherType
- Created src/game/ui/ directory structure
- Wrote HUD.ts with drawHUD function for in-game overlay (health bar, score, level name, wave indicator, dash/skill cooldowns)
- Wrote Controls.ts with TouchButton interface, createTouchButtons factory, drawTouchButtons renderer, hitTestButtons utility
- Wrote Screens.ts with ScreenType union, drawSplashScreen, drawMenuScreen (returns playBtn bounds), drawLevelCompleteScreen, drawGameOverScreen
- Verified TypeScript compilation passes (tsc --noEmit -p tsconfig.json) with zero errors in game/ui files
- Verified ESLint passes on all 3 UI files with zero errors/warnings
- Dev server running cleanly with no compilation errors

## Files Created
- src/game/ui/HUD.ts (111 lines) — drawHUD: health bar (green/orange/red with glow), score (neon text), level name, wave indicator "WAVE X/Y", dash cooldown (⚡ purple), skill cooldown (🔥 orange)
- src/game/ui/Controls.ts (191 lines) — TouchButton interface, createTouchButtons (5 buttons: left/◀, right/▶, jump/▲, attack/⚔, skill/✦), drawTouchButtons (rounded rects with press glow), hitTestButtons (coordinate → button ID)
- src/game/ui/Screens.ts (226 lines) — ScreenType union, ScreenButton interface, drawSplashScreen (pulsing title), drawMenuScreen (particles + stats + PLAY button with bounds return), drawLevelCompleteScreen (gold celebration), drawGameOverScreen (red retry)

## Key Design Decisions
1. HUD uses Renderer.setGlow/clearGlow from the engine module for consistent neon glow effects
2. Controls uses a Map<string, TouchButton> for O(1) button lookup by ID
3. All functions are pure/functional — they receive ctx and draw state, no side effects
4. Rounded rectangle paths extracted into local helpers (Controls.ts and Screens.ts) to avoid cross-file coupling
5. Menu screen returns button bounds for external click detection rather than handling events internally
6. Unicode symbols used for button labels (◀▶▲⚔✦⚡🔥) for canvas rendering without font dependencies
7. Time parameter (ms) used for deterministic animations (pulse, hover, blink) — re-draws at same time produce identical output
