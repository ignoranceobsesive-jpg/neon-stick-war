# Neon Stick War - Architecture Documentation

Detailed technical architecture of the Neon Stick War game engine.

---

## System Architecture

### Component Hierarchy

```
page.tsx (Next.js page)
└── Game Canvas (iframe on web, direct on Android)
    └── 0cf1o-rq41zxz.js (THE game chunk)
        ├── Config Layer
        │   ├── Color constants (n, i, s, c, d, h, f, u, m, x, p, g)
        │   ├── Weapon upgrades (y)
        │   ├── Pet definitions (v)
        │   ├── Pet skins (w)
        │   ├── Ally definitions (k)
        │   ├── Player skins (C)
        │   ├── Skills (P)
        │   ├── Daily rewards (N)
        │   ├── Voice lines (_)
        │   └── Zone configs
        │
        ├── Data Layer
        │   ├── Story chapters (G) - 8 chapters, ~25 hand-crafted levels
        │   ├── Versus arena (L)
        │   ├── Cutscene data
        │   └── Procedural generator (U) - generates levels beyond 100
        │
        ├── Engine Layer (GameCanvas component - eq)
        │   ├── Game loop (requestAnimationFrame)
        │   ├── Physics system
        │   ├── Player controller (e9)
        │   ├── Enemy AI
        │   ├── Pet AI
        │   ├── Ally AI
        │   ├── Bullet system
        │   ├── Particle system
        │   ├── Rendering pipeline
        │   └── Wave/Portal lifecycle
        │
        ├── State Layer (Zustand store - ea)
        │   ├── Game phase management
        │   ├── Save/Load (localStorage)
        │   ├── Cloud sync (Firebase)
        │   └── Ad integration (AdMob)
        │
        └── UI Layer (React components)
            ├── RotateScreen
            ├── TapToStart (e6)
            ├── MainMenu (eI)
            ├── Shop (3 tabs)
            ├── WeaponUpgrades (tV)
            ├── DailyRewardDialog (tG)
            ├── Profile
            ├── Settings
            ├── LevelComplete
            ├── VictoryScreen
            └── GameOver
```

---

## State Management Flow

### Zustand Store (`ea`)

The store is created with Zustand's `create` function. All game state flows through this single store.

```javascript
// Store creation (simplified)
const ea = create((set, get) => ({
  gamePhase: 'splash',
  gameMode: 'campaign',
  currentLevel: 0,
  saveData: { ...defaultSave },
  versusRoundWinner: 0,
  isBossLevel: false,
  waitingForTap: false,
  revivedWithFullPower: false,
  dramaticMoment: null,
  introText: '',
  introColor: '',
  introTimer: 0,
  
  // Actions
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  addCoins: (amount) => set(s => ({
    saveData: { ...s.saveData, totalCoins: s.saveData.totalCoins + amount }
  })),
  updateCooldowns: (dash, shield, special) => { /* ... */ },
  // ... more actions
}))
```

### State Subscriptions

The game canvas subscribes to store changes to react to game phase transitions:

```javascript
ea.subscribe(state => {
  // When level changes → reinitialize level
  if (state.gamePhase === 'playing' && state.currentLevel !== lastLevel) {
    initLevel(state.currentLevel);
  }
  // When game phase changes → handle music, UI, etc.
  if (state.gamePhase === 'menu' && lastPhase === 'playing') {
    stopMusic(); startMenuMusic();
  }
  // When revived → reset player health
  if (state.revivedWithFullPower) {
    player.health = player.maxHealth;
  }
})
```

---

## Wave/Enemy/Portal Lifecycle

This is the most critical system to understand for debugging.

### Wave System

```
Level Data (B.current)
│
├─ waves[] array
│   ├─ Wave 0: { enemies: [{type, x?, y?, count?}] }
│   ├─ Wave 1: { enemies: [...] }
│   └─ Wave N: { enemies: [...] }
│
└─ bossWave? (optional boss wave after normal waves)
```

### Spawn Queue

Enemies are queued for spawning via `eR.current` (pending spawn queue):

```javascript
// When a new wave starts, enemies are added to the spawn queue
eR.current = wave.enemies.map(enemyConfig => ({
  ...enemyConfig,
  spawnDelay: staggerDelay,
  spawned: false
}))
```

### Enemy Spawn Counter

```javascript
eJ.current  // Total enemies spawned so far (increments as enemies are created)
eM.current  // Total enemies in the ENTIRE level (all waves + boss wave)
```

### Portal Activation Logic

```
┌─────────────────────────────────────────────┐
│           PORTAL ACTIVATION FLOW             │
├─────────────────────────────────────────────┤
│                                             │
│  1. All waves spawned?                      │
│     (eJ.current >= eM.current)              │
│          │                                  │
│          ▼ YES                              │
│  2. Set ee.current = true                   │
│     (allEnemiesSpawned flag)                │
│          │                                  │
│          ▼                                  │
│  3. All enemies in I.current dead?          │
│     (I.current.length === 0 OR              │
│      I.current.every(e => !e.active))       │
│          │                                  │
│          ▼ YES                              │
│  4. Activate portal: eS.current.active=true │
│     Portal appears at right side of level   │
│          │                                  │
│          ▼                                  │
│  5. Player walks into portal                │
│     (boxCollision with portal rect)         │
│          │                                  │
│          ▼                                  │
│  6. ea.setGamePhase('level-complete')       │
│                                             │
│  ★ CRITICAL: ee.current must be true for    │
│    step 3-4 to work!                        │
└─────────────────────────────────────────────┘
```

### The Portal Bug (FIXED)

The bug was that `ee.current` was being reset to `false` in the wave initialization code:

```javascript
// BUG: This line reset ee.current every time a new level was initialized,
// even during wave transitions, preventing the portal from ever opening.
ee.current = !1;  // Always false!

// FIX: ee.current should only be set to true when ALL enemies have been
// spawned. The initialization resets it to false, and the spawn logic
// sets it to true when eJ.current >= eM.current.
```

---

## Physics System

### Gravity & Movement

```javascript
// Per-frame physics update (simplified)
const d = ew.current; // difficulty multiplier (1.0 desktop, 2.0 mobile)

// Gravity
entity.vy += 0.5 * d;
if (entity.vy > 10 * d) entity.vy = 10 * d; // Terminal velocity

// Position update
entity.x += entity.vx * d;
entity.y += entity.vy * d;

// Platform collision (one-way, top-only)
for (let platform of platforms) {
  if (entity.x + entity.width > platform.px + 4 &&
      entity.x < platform.px + platform.width - 4 &&
      entity.y >= platform.py - 4 &&
      entity.y - entity.vy * d <= platform.py + Math.max(10, Math.abs(entity.vy) * d + 8)) {
    entity.y = platform.py;
    entity.vy = 0;
    entity.grounded = true;
    entity.jumpCount = 0;
  }
}
```

### Collision Detection

Box collision (`eO`):
```javascript
function eO(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
```

Platform position with movement (`eV`):
```javascript
function eV(platform) {
  return {
    px: platform.type === 'moving' && platform.moveAxis === 'x' && platform.moveRange
      ? platform.x + Math.sin(platform.moveOffset || 0) * platform.moveRange
      : platform.x,
    py: platform.type === 'moving' && platform.moveAxis === 'y' && platform.moveRange
      ? platform.y + Math.sin(platform.moveOffset || 0) * platform.moveRange
      : platform.y
  }
}
```

### Enemy Collision Heights

The function `ez` returns different collision heights for different enemy types:

| Type | Height |
|---|---|
| Boss/Giant | 80 |
| Void Guardian | 30 |
| Dragon/Phoenix | 50 |
| MechGolem/HeavyWalker/Zombie | 55 |
| ShadowAssassin/EliteDrone/Necromancer | 50 |
| Bomber | 45 |
| VoidBat | 30 |
| StormEagle | 45 |
| EmberWisp | 30 |
| Default | 50 |

---

## Player Controls

### Keyboard (Desktop)
- **A/D** or **←/→**: Move left/right
- **W** or **↑** or **Space**: Jump (double jump supported)
- **J** or **Left Click**: Shoot
- **K**: Dash (90 frame cooldown)
- **L**: Shield (300 frame cooldown)
- **I**: Special attack (360 frame cooldown)
- **1/2/3**: Use equipped skill

### Touch (Mobile)
- **Virtual joystick**: Move
- **Jump button**: Jump
- **Shoot button**: Shoot
- **Dash/Shield/Special buttons**: Abilities
- **Skill buttons**: Use equipped skills

### Mobile Controls (Window API)

Controls are exposed via `window.__neonWarriorControls`:

```javascript
window.__neonWarriorControls = {
  moveLeft(), moveRight(), stopMove(),
  jump(), shoot(), stopShoot(),
  dash(), shield(), special(),
  setJoystick(data), setP2Joystick(data),
  p2Jump(), p2Shoot(), p2StopShoot(),
  p2Dash(), p2Shield(), p2Special(),
  executeSkill(id), pause()
}
```

---

## Rendering Pipeline

### Draw Order (back to front)

1. **Background** (`eD` / `eW`): Zone-specific gradient + grid + floating particles
2. **Weather effects**: Rain, snow, embers, glitch particles (zone-dependent)
3. **Platforms**: Rectangles with zone-specific glow colors
4. **Coins & Chests**: Animated collectibles
5. **Enemies**: Type-specific rendering with health bars
6. **Player**: Stickman with animation frames, skin effects, expressions
7. **Pet**: Following player, with skin effects
8. **Allies**: Following player, with unique colors
9. **Bullets**: Colored circles with trails
10. **Particles**: Fade-out effects
11. **Portal**: Glowing doorway (when active)
12. **HUD**: Health bar, score, wave counter, combo display
13. **Overlays**: Text popups, dramatic moments

### Zone Backgrounds

| Zone | Background | Weather | Platform Color |
|---|---|---|---|
| Cyber City | Dark blue grid | Neon rain | Cyan glow |
| Void Wastes | Deep purple | Void particles | Purple glow |
| Crystal Caves | Teal gradient | Sparkles | Green glow |
| Inferno Pits | Dark red/orange | Embers | Orange glow |
| Frost Peaks | Ice blue | Snow | White glow |
| Shadow Realm | Near black | Glitch | Purple glow |
| Sky Fortress | Light blue | Clouds | Gold glow |
| Corrupted Core | Dark glitchy | Corrupt | Red glow |

---

## How to Trace Bugs in Minified Code

### Step-by-Step Debugging Process

1. **Identify the symptom**: What's happening that shouldn't be?

2. **Find the relevant section**: Use `BUG-TRACKER.md` to find which minified variable is involved

3. **Beautify the code**: The beautified version is at:
   ```
   public/game/_next/static/chunks/0cf1o-rq41zxz.beautified.js
   ```
   This has proper line breaks and indentation.

4. **Search for key strings**: 
   - Use Ctrl+Shift+F in VS Code to search the beautified file
   - Search for string literals like "BOSS!", health bar drawing code, etc.
   - Use the section guide in `01-PROJECT-OVERVIEW.md` to narrow down line ranges

5. **Trace variable flow**:
   - Find where a variable is declared (search for `useRef`)
   - Find where it's read (search for variable name)
   - Find where it's written (search for `.current =`)

6. **Add console.log**: Insert `console.log("DEBUG:", variableName)` in the minified code to trace values at runtime

7. **Test the fix**: 
   - Apply the fix to `0cf1o-rq41zxz.js` (minified)
   - Run `bun run dev` to test
   - Verify with `node --check` that there are no syntax errors

8. **Build for Android**:
   ```bash
   npx cap sync android
   cd android && ./gradlew assembleRelease
   ```

### Common Bug Patterns

| Pattern | Example | Fix |
|---|---|---|
| Wrong boolean logic | `!0` vs `!1` | `!0` = true, `!1` = false |
| Operator precedence | `a+b*c` | Add parens: `(a+b)*c` |
| Off-by-one | `i < length` vs `i <= length` | Check boundary conditions |
| Stale refs | `useRef` not reset on level change | Reset in `e3` (initLevel) |
| Missing null check | `j.current` when null | Add `if (!j.current) return` |

### Using the Beautified File

The beautified file (`0cf1o-rq41zxz.beautified.js`) is for **reading only**. Never edit it directly. Instead:

1. Find the bug in the beautified file
2. Find the SAME text in the minified file (`0cf1o-rq41zxz.js`)
3. Apply the fix to the minified file
4. Optionally re-beautify for verification
