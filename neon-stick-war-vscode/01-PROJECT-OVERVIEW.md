# Neon Stick War - Project Overview

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 App                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  page.tsx │  │ layout   │  │  React Components    │  │
│  │ (iframe)  │  │ .tsx     │  │  (Menu, Shop, etc.)  │  │
│  └─────┬─────┘  └──────────┘  └──────────┬───────────┘  │
│        │                                    │             │
│        ▼                                    ▼             │
│  ┌─────────────────────────────────────────────────────┐│
│  │         0cf1o-rq41zxz.js (THE GAME CHUNK)          ││
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────────┐  ││
│  │  │ Config  │ │  Engine  │ │   State/Store      │  ││
│  │  │ Colors  │ │ Canvas   │ │   Zustand          │  ││
│  │  │ Pets    │ │ Physics  │ │   localStorage     │  ││
│  │  │ Skins   │ │ AI       │ │   Save/Load        │  ││
│  │  │ Skills  │ │ Controls │ │   Auth             │  ││
│  │  │ Levels  │ │ Rendering│ │   Ads              │  ││
│  │  └─────────┘ └──────────┘ └────────────────────┘  ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  ┌──────────────┐   ┌──────────────┐
  │  Capacitor   │   │   Firebase   │
  │  Android     │   │   Auth       │
  │  AdMob       │   │   Firestore  │
  └──────────────┘   └──────────────┘
```

## The Single-File Game Architecture

### Why one file?

The game was built with Next.js and compiled by Turbopack into static chunks. The entire game code — config, engine, rendering, AI, state, UI components — was bundled into a single JavaScript chunk (`0cf1o-rq41zxz.js`). When the original source code was lost, only this minified output remained.

### File Structure Inside the Chunk

The minified game file (~383KB, ~15,295 lines when beautified) contains these logical sections:

| Beautified Lines | Section | Description |
|---|---|---|
| 1-57 | **Webpack/Runtime** | Module system, CSS-in-JS (styled-jsx) |
| 58-93 | **Zustand** | State management library (bundled inline) |
| 94-142 | **Config: Colors & Upgrades** | Color constants, weapon upgrade definitions |
| 148-487 | **Config: Pets & Pet Skins** | 10 pet types, 25 pet skins with stats |
| 488-528 | **Config: Allies** | 4 ally definitions (Shadow, Blaze, Volt, Ice) |
| 529-690 | **Config: Player Skins** | 18 player skins with effects |
| 691-953 | **Config: Skills** | 15 skills across 5 elements |
| 954-1290 | **Config: Misc** | Daily rewards, ranking tiers, voice lines, zones |
| 1291-3500 | **Data: Levels & Chapters** | 8 story chapters, procedural level generator, cutscenes |
| 3501-3600 | **Audio: Sound Manager** | Web Audio API sound effects |
| 3601-6400 | **UI: Menu & Shop** | RotateScreen, TapToStart, MainMenu, Shop, WeaponUpgrades, DailyReward |
| 6401-10100 | **Engine: Game Canvas** | ★ THE CORE - Canvas rendering, game loop, physics, controls, combat, AI |
| 10101-13000 | **State: Zustand Store** | Game state, save/load, localStorage persistence |
| 13001-14200 | **Versus: PvP Arena** | PvP mode, ELO ranking, arena logic |
| 14200-end | **Misc: Asset Loading** | React components, page wrapper, Firebase, AdMob |

## State Management Flow

```
User Action → React Component → Zustand Store → localStorage
                    ↓
              Game Canvas reads
              store state each frame
                    ↓
              Canvas rendering loop
              (requestAnimationFrame)
```

### Zustand Store (`ea`)

The game store is accessed via `ea.getState()` and `ea.setState()`. Key state slices:

```typescript
{
  // Game phase control
  gamePhase: 'splash' | 'menu' | 'playing' | 'game-over' | 'level-complete' | 'victory' | 'settings' | ...,
  gameMode: 'campaign' | 'versus' | 'online',
  currentLevel: number,
  
  // Player save data (persisted to localStorage)
  saveData: {
    currentChapter: number,
    highestLevel: number,
    totalCoins: number,
    totalScore: number,
    currentSkin: string,
    currentPet: string,
    currentPetSkin: string,
    unlockedSkins: string[],
    unlockedPets: string[],
    unlockedPetSkins: string[],
    unlockedSkills: string[],
    equippedSkills: [string, string, string],
    skillUpgrades: Record<string, number>,
    weaponUpgrades: Record<string, number>,
    gangMembersUnlocked: string[],
    lastDailyRewardDay: string,
    dailyRewardStreak: number,
    // ... more fields
  },
  
  // Versus mode
  versusRoundWinner: number,
  elo: number,
  
  // UI state
  introText: string,
  introColor: string,
  introTimer: number,
  dramaticMoment: { text: string, color: string, timer: number },
  isBossLevel: boolean,
  revivedWithFullPower: boolean,
  waitingForTap: boolean,
}
```

### Save/Load System

- **Save**: On state changes, `saveData` is serialized and written to `localStorage` under key `"neon-stick-war-save"`
- **Load**: On app init, save data is read from localStorage and merged with defaults
- **Cloud**: Firebase Firestore sync for online profiles (optional)

## Game Loop Architecture

```
requestAnimationFrame callback
│
├─ Frame timing check (60fps desktop / 30fps mobile)
│
├─ Read Zustand store state
│
├─ If gamePhase === "playing":
│   │
│   ├─ Update player position (e9 function)
│   │   ├─ Process keyboard/joystick input
│   │   ├─ Apply velocity + gravity
│   │   ├─ Platform collision detection
│   │   ├─ Boundary clamping
│   │   └─ Expression/animation update
│   │
│   ├─ Update enemies
│   │   ├─ Spawn from wave queue
│   │   ├─ AI movement patterns
│   │   ├─ Shoot at player
│   │   └─ Boss enrage logic
│   │
│   ├─ Update pet
│   │   ├─ Follow player
│   │   ├─ Shoot at enemies
│   │   └─ Respawn on death
│   │
│   ├─ Update bullets
│   │   ├─ Move by velocity
│   │   ├─ Hit detection (player→enemy, enemy→player)
│   │   └─ Remove dead bullets
│   │
│   ├─ Update particles (fade out)
│   │
│   ├─ Update coins/collectibles
│   │
│   ├─ Wave completion check
│   │   ├─ All enemies dead? → Open portal
│   │   └─ Player reached portal? → Level complete
│   │
│   └─ Boss music check
│
├─ Render everything to Canvas
│   ├─ Background (zone-specific)
│   ├─ Platforms
│   ├─ Coins & chests
│   ├─ Enemies
│   ├─ Player
│   ├─ Pet
│   ├─ Allies
│   ├─ Bullets
│   ├─ Particles
│   ├─ Portal (if active)
│   ├─ HUD (health, score, wave, combo)
│   └─ Screen overlays (text, effects)
│
└─ Request next frame
```

## Key Technical Details

### Frame Rate
- **Desktop**: 60fps (16.67ms per frame)
- **Mobile**: 30fps (33.33ms per frame)
- Mobile detection: `eB()` checks for Capacitor native platform, touch media query, or mobile user agent
- Time scale: `e$` = 0.4 on mobile, 1.0 on desktop (affects particle counts)

### Physics
- Gravity: `0.5 * difficultyMultiplier` per frame
- Max fall speed: `10 * difficultyMultiplier`
- Ground speed: 5 px/frame, Air speed: 3.5 px/frame
- Dash speed: 18 px/frame for 8 frames
- Double jump: `maxJumps: 2`
- Platform collision: top-only (one-way platforms)

### Canvas Scaling
- Canvas uses `devicePixelRatio` (capped at 1.5x) for crisp rendering
- Virtual resolution: width × 600 (aspect-ratio independent)
- All positions are in virtual coordinates, scaled by `q` (DPR)

### Enemy Types
22 enemy types including: `drone`, `glitchWalker`, `voidGuardian`, `dragon`, `phoenix`, `mechGolem`, `shadowAssassin`, `voidBat`, `stormEagle`, `emberWisp`, `frostWraith`, `shadowDrake`, `plasmaSerpent`, `neonWyrm`, `crystalMoth`, `zombie`, `giant`, `necromancer`, `bomber`, `eliteDrone`, `heavyWalker`

### Boss Types
8 boss types: `boss`, `bossRedKing`, `bossTitan`, `bossDragon`, `bossPhoenix`, `bossMechGolem`, `bossCorrupted`, `bossFather`, `bossTwin`
