# Neon Stick War - Source Code Package

> **A neon-lit stickman combat platformer** built with Next.js 16, React 19, HTML5 Canvas, and Capacitor for Android.

## Project Overview

Neon Stick War is a side-scrolling action platformer where you control a neon stickman fighting through waves of enemies across 100+ levels, 8 story chapters, and endless procedural generation. The game features:

- **100+ Campaign Levels** across 8 story chapters with boss fights
- **Procedural Level Generation** for levels beyond the hand-crafted content
- **10 Pets** with unique abilities (Neon Wolf, Plasma Falcon, Void Drake, etc.)
- **18 Player Skins** with visual effects (rainbow, sparkle, plasma, holy, abyss)
- **15 Skills** across 5 elements (fire, frost, shadow, summon, death)
- **5 Weapon Upgrades** (damage, fire rate, bullet speed, bullet size, critical hit)
- **4 Ally NPCs** (Shadow, Blaze, Volt, Ice) that join during story chapters
- **Versus PvP Mode** with ELO ranking
- **AdMob Integration** for rewarded ads (coins, skill unlocks)
- **Firebase Auth + Firestore** for online features

## Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun** runtime
- **JDK 21** (for Android builds)
- **Android SDK** (via Android Studio or command-line tools)

### Development Server
```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Game runs at http://localhost:3000
```

### Android Build
```bash
# Sync web assets to Android project
npx cap sync android

# Build debug APK
cd android && JAVA_HOME=/path/to/jdk-21 ./gradlew assembleDebug

# Build release APK
cd android && JAVA_HOME=/path/to/jdk-21 ./gradlew assembleRelease

# Build release AAB (for Play Store)
cd android && JAVA_HOME=/path/to/jdk-21 ./gradlew bundleRelease
```

## Directory Structure

```
neon-stick-war-vscode/
├── README.md                          # This file
├── 01-PROJECT-OVERVIEW.md             # Architecture overview
├── 02-BUG-FIXES-LOG.md                # All bug fixes applied
├── 03-BUILD-GUIDE.md                  # How to build APK/AAB
├── 04-ARCHITECTURE.md                 # Code architecture docs
│
├── source-reconstructed/              # Partially reconstructed TypeScript source
│   ├── components/                    # React UI components (15 files)
│   └── game/
│       ├── config/                    # Game data configs (12 files)
│       ├── data/                      # Levels, cutscenes, procedural gen (5 files)
│       ├── engine/                    # Physics, AI, controls (5 files)
│       ├── systems/                   # Store, save, auth, ads (4 files)
│       ├── types/                     # TypeScript type definitions (2 files)
│       └── audio/                     # Sound manager (1 file)
│
├── source-minified/                   # The ACTUAL running code
│   ├── game-full.js                   # Full minified game (~383KB)
│   ├── sections/                      # Split into logical sections (14 files)
│   └── BUG-TRACKER.md                 # Minified variable → concept mapping
│
├── android-project/                   # Android/Capacitor config
│   ├── AndroidManifest.xml
│   ├── build.gradle
│   ├── capacitor.config.ts
│   └── signing/keystore.properties
│
├── builds/                            # Pre-built APK/AAB files
│   ├── NeonStickWar-debug.apk         # ~13MB
│   ├── NeonStickWar-release.apk       # ~11MB
│   └── NeonStickWar-release.aab       # ~10MB
│
├── scripts/                           # Helper scripts
│   ├── build-debug.sh
│   ├── build-release.sh
│   └── sync-android.sh
│
└── .vscode/                           # VS Code configuration
    ├── settings.json
    ├── launch.json
    └── extensions.json
```

## How to Edit the Game

### IMPORTANT: All game logic is in ONE minified file

The entire game engine, rendering, AI, physics, and state management lives in a single minified JavaScript file:
```
source-minified/game-full.js
```

This is the **actual running code**. The `source-reconstructed/` directory contains a partial TypeScript reconstruction for reference only — it is NOT compiled or used at runtime.

### Editing Workflow

1. **Find what you want to change** in the reconstructed source (readable)
2. **Search for that same text** in `source-minified/game-full.js` (Ctrl+Shift+F)
3. **Make your edit** in the minified file
4. **Test** by copying the edited file to the Next.js project:
   ```bash
   cp source-minified/game-full.js /path/to/project/public/game/_next/static/chunks/0cf1o-rq41zxz.js
   bun run dev
   ```
5. **Build** for Android when satisfied:
   ```bash
   npx cap sync android
   cd android && ./gradlew assembleRelease
   ```

### Common Edit Patterns

| What to Change | Search For | Example |
|---|---|---|
| Pet damage | `damage:6` or `damage:4` | Change `damage:6` to `damage:8` |
| Skin prices | `price:2400` or `price:5000` | Change `price:2400` to `price:1200` |
| Menu labels | `WEAPONS` or `SKINS` | Change label text |
| Upgrade costs | `baseCost:500` | Change cost value |
| Enemy health | `health:` near enemy types | Adjust health values |
| Level cap | `22e3` or `22000` | Change to desired max level |
| Colors | Hex values near `#00ffff` | Change color constants |

### Key Variable Mappings

See `source-minified/BUG-TRACKER.md` for the complete mapping of minified variable names to their purposes. Critical ones:

| Minified | Concept | Type |
|---|---|---|
| `ee` | allEnemiesSpawned flag | useRef(boolean) |
| `ea` | Zustand game store | Zustand store |
| `eJ` | Total enemies spawned | useRef(number) |
| `eR` | Pending spawn queue | useRef(array) |
| `I` | All entities (enemies) | useRef(array) |
| `D` | Bullets array | useRef(array) |
| `W` | Particles array | useRef(array) |
| `J` / `eS` | Portal/exit object | useRef(object) |
| `j` | Player entity | useRef(PlayerEntity) |
| `N` | Player 2 (versus) | useRef(PlayerEntity) |
| `ec` | Pet entity | useRef(PetEntity) |
| `es` | Gang/ally members | useRef(array) |
| `B` | Current level data | useRef(LevelData) |
| `ek` | Coins/collectibles | useRef(array) |
| `eM` | Total enemies in level | useRef(number) |

## Color Constants

| Minified | Color | Hex |
|---|---|---|
| `n` | CYAN | `#00ffff` |
| `i` | MAGENTA | `#ff00ff` |
| `s` | GREEN | `#00ff66` |
| `c` | ORANGE | `#ff6600` |
| `d` | YELLOW | `#ffff00` |
| `h` | PURPLE | `#aa00ff` |
| `f` | RED | `#ff3333` |
| `u` | BG_DARK | `#050510` |
| `m` | GOLD | `#ffd700` |
| `x` | PINK | `#ff69b4` |
| `p` | BLUE | `#4488ff` |
| `g` | WHITE | `#ffffff` |

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **UI**: React 19 + Radix UI + Tailwind CSS 4
- **State**: Zustand 5.0.6 with localStorage persistence
- **Rendering**: HTML5 Canvas 2D Context
- **Mobile**: Capacitor 8.3.3 (Android)
- **Ads**: AdMob via @capacitor-community/admob
- **Auth**: Firebase Auth + Firestore
- **Build**: Gradle 8.x + Android SDK 35

## License

Private project. All rights reserved.
