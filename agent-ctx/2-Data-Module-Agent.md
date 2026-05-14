# Task 2 — Data Module Agent

## Task: Create game data TypeScript modules under src/game/data/

## Work Summary

Created 4 static configuration data files for the NeonStickWar game rewrite:

### Files Created

1. **src/game/data/biomes.ts** (119 lines)
   - `Biome` interface with 10 fields (name, skyColor, skyGradient, groundColor, platformColor, platformGlow, particleColor, weatherType, ambientDescription)
   - `WeatherType` union type (none, rain, snow, embers, glitch, voidParticles, sandstorm)
   - `BIOMES` record with 10 biome definitions: neonCity, scorchedWasteland, frozenTundra, shadowRealm, volcanicCore, crystalCaves, voidDimension, cyberForest, stormPlains, bloodMoon

2. **src/game/data/levels.ts** (339 lines)
   - `Platform`, `Wave`, `EnemySpawn`, `Level` interfaces
   - `PlatformType`, `EnemyType`, `MissionType` union types
   - `LEVELS` array with 8 handcrafted story levels
   - `VERSUS_ARENA` constant (id: -1, symmetric PvP layout)
   - `generateProceduralLevel(levelNum)` function with difficulty scaling (wider levels, more waves, harder enemies, ground gaps, moving platforms, boss encounters every 5 levels)

3. **src/game/data/skins.ts** (111 lines)
   - `Skin` interface with id, name, color, glowColor, trailColor, price, rarity
   - `SkinRarity` union type (common, uncommon, rare, epic, legendary)
   - `SKINS` array with 8 skins: neon-green (free), cyan (500), red (800), fire (1500), ice (1500), shadow (2400), gold (15000), void (30000)
   - Helper functions: `getSkinById`, `getSkinsByRarity`, `DEFAULT_SKIN`

4. **src/game/data/skills.ts** (144 lines)
   - `Skill` interface with id, name, element, description, unlockMethod, unlockCost, cooldown, duration, damage
   - `Weapon` interface with id, name, damage, fireRate, projectileSpeed, pelletsPerShot
   - `SKILLS` array with 4 skills: fireball, iceShard, shadowStep, dash
   - `WEAPONS` array with 3 weapons: pistol, shotgun (3 pellets × 6 dmg), rifle
   - Helper functions: `getSkillById`, `getWeaponById`, `getSkillsByElement`, `getPurchasableSkills`, `getWeaponDPS`

## Verification
- TypeScript compilation: PASSED (tsc --noEmit, zero errors)
- Dev server: Running cleanly, no compilation errors
