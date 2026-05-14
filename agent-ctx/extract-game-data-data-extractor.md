# Task: Extract Game Data from Beautified Bundle

## Task ID: extract-game-data

## Summary

Successfully extracted all game DATA files from `/home/z/my-project/public/game/_next/static/chunks/0cf1o-rq41zxz.beautified.js` and created 6 clean TypeScript files.

## Files Created

### 1. `/home/z/my-project/neon-stick-war-source/game/types.ts` (569 lines)
- Comprehensive TypeScript type definitions for all game data structures
- Includes: Position, Velocity, PlayerEntity, EnemyEntity, Bullet, Particle, Platform, PetEntity, SkillState, LevelData, Wave, EnemySpawn, BossWave, SaveData, GamePhase, ZoneConfig, CutsceneData, SkillDefinition, PetDefinition, SkinDefinition, UpgradeConfig, AllyDefinition, DailyReward, VoiceLines, EventTrigger, etc.
- Also exports: COLOR_PALETTE, DIFFICULTY_SCALING, FLYING_ENEMY_TYPES constants

### 2. `/home/z/my-project/neon-stick-war-source/game/data/defaultSave.ts` (67 lines)
- Extracted from lines 1580-1614 (original variable: B)
- Default save data with all fields mapped to readable names
- Also includes defaultRankingData (original variable: D), SAVE_KEY, SOUND_KEY, defaultSoundSettings

### 3. `/home/z/my-project/neon-stick-war-source/game/data/versusArena.ts` (54 lines)
- Extracted from lines 1465-1540 (original variable: L)
- Complete versus arena level config with symmetric PvP layout
- 9 platforms including center moving platform

### 4. `/home/z/my-project/neon-stick-war-source/game/data/chapters.ts` (449 lines)
- Extracted from lines 1615-2378 (original variable: G)
- 8 handcrafted levels across 5 chapters
- CH.1: First Steps, Learning to Fight
- CH.2: Meet Shadow, The Warehouse
- CH.3: Rescue Mission, Red King's Throne (boss)
- CH.4: Protect Neon
- CH.5: The Final War (boss with THE TITAN)

### 5. `/home/z/my-project/neon-stick-war-source/game/data/proceduralGen.ts` (457 lines)
- Extracted from lines 2379-2664 (original variables: $, F, H, U, V, E)
- Seeded PRNG function (LCG: 9301*t + 49297 mod 233280)
- Complete procedural level generator with:
  - Chapter names for levels 6+
  - Cutscene triggers by level number
  - Event triggers (ambush, betrayal, rescue, etc.)
  - Dynamic enemy pools, wave counts, platform generation
  - Boss waves every 10 levels from 50, special twin boss at 100

### 6. `/home/z/my-project/neon-stick-war-source/game/data/cutscenes.ts` (458 lines)
- Extracted from lines 2665-3375 (original variables: z, _)
- 24 cutscene definitions with complete frame data
- Categories: chapter intros, victory/revive, story milestones, boss intros, boss defeated, rescue scenes
- Voice lines organized by 21 categories (kill, damage, waveClear, dash, shield, special, gang, rescue, protect, dramatic, bossEnrage, pet, dragon, phoenix, mechGolem, shadowAssassin, voidBat, stormEagle, emberWisp, frostWraith, shadowDrake, plasmaSerpent, neonWyrm, crystalMoth)

## Key Deobfuscation Mappings

| Original | Deobfuscated |
|----------|-------------|
| n | CYAN (#00ffff) |
| i | MAGENTA (#ff00ff) |
| s | GREEN (#00ff66) |
| c | ORANGE (#ff6600) |
| d | YELLOW (#ffff00) |
| h | PURPLE (#aa00ff) |
| f | RED (#ff3333) |
| u | DARK_BG (#050510) |
| m | GOLD (#ffd700) |
| x | PINK (#ff69b4) |
| p | BLUE (#4488ff) |
| g | WHITE (#ffffff) |
| B | defaultSave |
| D | defaultRankingData |
| G | handcraftedLevels |
| L | versusArenaLevel |
| $ | CHAPTER_NAMES |
| F | CUTSCENE_TRIGGERS |
| H | EVENT_TRIGGERS |
| U | generateProceduralLevel |
| V | createSeededPRNG |
| E | isFlyingEnemy |
| z | allCutscenes |
| _ | voiceLines |
| K | SAVE_KEY |
| W | rankingTiers |
| O | getRankForElo |

## Verification
- Lint: No errors or warnings in the created files
- All data verified against the original beautified source
