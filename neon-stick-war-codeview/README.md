# NeonStickWar - Code View

## HOW TO USE THIS

1. **READ** the section files (config/, engine/, ui/, etc.) to understand the code
2. **EDIT** RUNNING-GAME-MINIFIED.js to make changes (this is the actual running file)
3. Use Ctrl+Shift+F in VS Code to search for text in the minified file

## FILE GUIDE

| File | Lines | What's Inside |
|------|-------|---------------|
| `config/01-colors-pets-skins-skills.ts` | 338-1290 | All game data: colors, pets, skins, skills, allies, upgrades, daily rewards |
| `levels/01-chapters-bosses-cutscenes.ts` | 1291-3500 | 8 story missions, boss fights, procedural level generator, cutscenes |
| `audio/01-sound-manager.ts` | 3501-3600 | Sound effects using Web Audio API |
| `ui/01-rotate-splash-menu-shop.ts` | 3601-6400 | Rotate screen, TAP TO START, main menu, shop, weapon upgrades, daily rewards |
| `engine/01-game-canvas-loop-physics.ts` | 6401-10100 | ★ THE GAME ENGINE - canvas rendering, game loop, physics, controls, combat, AI |
| `state/01-zustand-store-save.ts` | 10101-13000 | Zustand state management, save/load system, game state |
| `versus/01-pvp-elo-arena.ts` | 13001-14200 | PvP mode, ELO ranking, arena |
| `versus/02-asset-loading-misc.ts` | 14200-end | Asset loading, misc components |

## WRAPPER FILES

| File | Purpose |
|------|---------|
| `page.tsx` | Next.js page - loads game in iframe, Firebase, AdMob, matchmaking |
| `index.html` | Game HTML shell - touch management, audio hooks |
| `capacitor.config.ts` | Android build config |
| `firebase.ts` | Firebase initialization |
| `admob.ts` | AdMob ad integration |
| `android/app.build.gradle` | Android signing + dependencies |
| `package.json` | Project dependencies |

## THE RUNNING FILE

`RUNNING-GAME-MINIFIED.js` = The actual game that runs. Edit this to make changes.

### How to Edit
1. Find what you want to change in the section files (readable)
2. Search for that same text in RUNNING-GAME-MINIFIED.js
3. Make your edit
4. Run `bun run dev` to test
5. Run `npx cap sync android` then rebuild APK/AAB

### Key Variable Mappings
- `n` = cyan (#00ffff)
- `i` = magenta (#ff00ff)  
- `s` = green (#00ff66)
- `c` = orange (#ff6600)
- `d` = yellow (#ffff00)
- `h` = purple (#aa00ff)
- `f` = red (#ff3333)
- `m` = gold (#ffd700)
- `eG` = isMobile
- `e$` = mobile time scale (0.4 mobile, 1 desktop)

### How to Change Common Things
- Change pet damage: search `damage:6` or `damage:4` etc
- Change skin prices: search `price:2400` or `price:5000` etc
- Change menu labels: search `WEAPONS` or `SKINS` etc
- Change splash text: search `TAP TO START`
- Change upgrade costs: search `baseCost:500` etc
- Change enemy health: search `health:` near enemy type names
