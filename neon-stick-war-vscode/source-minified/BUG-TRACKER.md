# Neon Stick War - Bug Tracker & Variable Mapping

Complete mapping of minified variable names to their conceptual purpose. This is the most critical reference for debugging the game.

---

## Critical Variables (Portal / Wave System)

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `ee` | allEnemiesSpawned | `useRef(false)` | `false` | **★ CRITICAL** — Set to true when all enemies have been spawned. Portal only opens when this is true AND all enemies are dead. |
| `eJ` | totalEnemiesSpawned | `useRef(0)` | `0` | Counter of how many enemies have been created so far in the current level |
| `eM` | totalEnemiesInLevel | `useRef(0)` | `0` | Total count of enemies across ALL waves (including boss wave). Calculated when level initializes. |
| `eR` | pendingSpawnQueue | `useRef([])` | `[]` | Queue of enemies waiting to be spawned (staggered spawn for each wave) |
| `eS` | portal/exitObject | `useRef({x,y,active})` | `{x:0,y:0,active:false}` | The portal/exit that appears when all enemies are killed. `.active` must be true for portal to render. |
| `eT` | portalActivationTimer | `useRef(0)` | `0` | Timer for portal glow animation |
| `eJ` (in store) | versusRoundWinner | state | `0` | In versus mode, which player won |
| `X` | screenShakeTimer | `useRef(0)` | `0` | Frames remaining for screen shake effect |

## Entity Variables

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `j` | playerEntity | `useRef(null)` | `null` | Player 1 entity with position, velocity, health, skills, etc. |
| `N` | player2Entity | `useRef(null)` | `null` | Player 2 entity (versus/coop mode only). Null in campaign. |
| `I` | allEntities | `useRef([])` | `[]` | Array of ALL active enemy entities on screen |
| `D` | bulletsArray | `useRef([])` | `[]` | Array of all active bullets (from player, enemies, pet, allies) |
| `W` | particlesArray | `useRef([])` | `[]` | Array of visual particle effects |
| `ec` | petEntity | `useRef(null)` | `null` | The player's pet companion entity |
| `es` | gangMembers | `useRef([])` | `[]` | Array of ally NPCs that fight alongside the player |
| `ek` | coinsCollectibles | `useRef([])` | `[]` | Array of collectible coins on the level |
| `O` | platformsArray | `useRef([])` | `[]` | Array of platform objects (with moveOffset for moving platforms) |
| `e2` | chestsArray | `useRef([])` | `[]` | Array of treasure chests on the level |

## Level / State Variables

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `B` | currentLevelData | `useRef(null)` | `null` | Full level data object (platforms, waves, width, etc.) |
| `J.current` (was `R`) | levelThemeData | computed | - | Visual theme data for the current level (colors, weather, background style) |
| `ed` | gamePhase (canvas) | `useRef("menu")` | `"menu"` | Canvas-side game phase (synced with store) |
| `ew` | difficultyMultiplier | `useRef(1)` | `1` | Physics/game speed multiplier: 1 on desktop, 2 on mobile |
| `eA` | enemySpawnRate | `useRef(1)` | `1` | Multiplier for enemy spawn speed, scales with level number |
| `z` | currentScore | `useRef(0)` | `0` | Score accumulated in the current level |
| `$` | killCount | `useRef(0)` | `0` | Total enemies killed in current level |
| `F` | frameCounter | `useRef(0)` | `0` | Global frame counter (increments each game loop iteration) |
| `q` | devicePixelRatio | `useRef(1)` | `1` | Canvas scaling factor (capped at 1.5) |
| `_` | isMobileDevice | `useRef(false)` | `false` | Whether the game is running on a mobile device |
| `K` | isMobileCached | `useRef(false)` | `false` | Cached mobile detection result |
| `ev` | lowPowerMode | `useRef(false)` | `false` | Activated when mobile frame drops detected |

## Player Stats Variables

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `ef` | comboCounter | `useRef(0)` | `0` | Current kill combo count |
| `eu` | comboText | `useRef("")` | `""` | Current combo display text |
| `em` | comboColor | `useRef(n)` | cyan | Current combo display color |
| `ex` | comboTimer | `useRef(0)` | `0` | Frames remaining for combo display |
| `en` | bossEnrageTimer | `useRef(0)` | `0` | Timer for boss enrage phase |
| `ei` | bossEnrageActive | `useRef(0)` | `0` | Whether boss is currently enraged |
| `ep` | introText | `useRef("")` | `""` | Level intro text overlay |
| `eg` | introColor | `useRef(n)` | cyan | Intro text color |
| `ey` | introTimer | `useRef(0)` | `0` | Frames remaining for intro text |

## Enemy System Variables

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `et` | enemySpawnTimer | `useRef(0)` | `0` | Cooldown between enemy spawns |
| `el` | playerPopupText | `useRef("")` | `""` | Text popup near player (e.g., "DASH!", "SHIELD!") |
| `er` | playerPopupColor | `useRef(n)` | cyan | Color of player popup text |
| `en` | popupTimer | `useRef(0)` | `0` | Frames remaining for popup display |

## UI / Display Variables

| Minified | Concept | Type | Default | Description |
|---|---|---|---|---|
| `eb` | lastFrameTime | `useRef(0)` | `0` | Timestamp of last rendered frame |
| `Y` | backgroundParticles | `useRef([])` | `[]` | Floating background particles (neon dots) |
| `Q` | menuParticles | `useRef([])` | `[]` | Menu screen particle effects |
| `e1` | runtimeSkillStates | `useRef([])` | `[]` | Runtime skill cooldown/active states |
| `eC` | coinsCollectedCount | `useRef(0)` | `0` | Number of coins collected in current level |
| `eN` | bossHealthBar | `useRef(0)` | `0` | Boss health display value |
| `eP` | bossActive | `useRef(false)` | `false` | Whether a boss is currently alive |
| `ej` | currentBossEntity | `useRef(null)` | `null` | Reference to the current boss entity |
| `eI` | bossKills | `useRef(0)` | `0` | Total boss kills |
| `e$` | bossDefeatTimer | `useRef(0)` | `0` | Timer after boss defeat |
| `eq` | versusKillsP1 | `useRef(0)` | `0` | Player 1 kills in versus mode |
| `eY` | versusKillsP2 | `useRef(0)` | `0` | Player 2 kills in versus mode |

## Config / Data Arrays

| Minified | Concept | Type | Description |
|---|---|---|---|
| `n` | COLOR_CYAN | `"#00ffff"` | Primary game color |
| `i` | COLOR_MAGENTA | `"#ff00ff"` | Accent color |
| `s` | COLOR_GREEN | `"#00ff66"` | Health/growth color |
| `c` | COLOR_ORANGE | `"#ff6600"` | Fire/damage color |
| `d` | COLOR_YELLOW | `"#ffff00"` | Warning/electric color |
| `h` | COLOR_PURPLE | `"#aa00ff"` | Shadow/void color |
| `f` | COLOR_RED | `"#ff3333"` | Danger/enemy color |
| `u` | COLOR_BG_DARK | `"#050510"` | Background color |
| `m` | COLOR_GOLD | `"#ffd700"` | Coin/reward color |
| `x` | COLOR_PINK | `"#ff69b4"` | Pet/cat color |
| `p` | COLOR_BLUE | `"#4488ff"` | Shield/ice color |
| `g` | COLOR_WHITE | `"#ffffff"` | Highlight color |
| `v` | PETS | `Array(10)` | Pet definitions (neonWolf, plasmaFalcon, etc.) |
| `w` | PET_SKINS | `Array(25)` | Pet skin definitions |
| `k` | ALLIES | `Array(4)` | Ally definitions (shadow, blaze, volt, ice) |
| `C` | PLAYER_SKINS | `Array(18)` | Player skin definitions |
| `P` | SKILLS | `Array(15)` | Skill definitions |
| `y` | WEAPON_UPGRADES | `Object(5)` | Weapon upgrade configs |
| `N` (config) | DAILY_REWARDS | `Array(7)` | 7-day daily reward config |
| `S` | SKILL_DAMAGE_MULT | `[1,1.2,1.5,1.8,2.2]` | Damage multiplier by skill level |
| `T` | SKILL_COOLDOWN_MULT | `[1,0.9,0.8,0.7,0.6]` | Cooldown multiplier by skill level |
| `M` | SKILL_UPGRADE_COSTS | `[0,1500,3000,5400,10500]` | Cumulative upgrade costs |
| `j` (config) | SKILL_REQUIRES_AD | `[F,F,T,T,T]` | Whether upgrade requires ad watch |
| `G` | STORY_LEVELS | `Array(~25)` | Hand-crafted story levels |
| `L` | VERSUS_ARENA | `Object` | Versus mode arena data |
| `U` | proceduralGenerator | `Function` | Generates levels beyond the hand-crafted ones |
| `_` | VOICE_LINES | `Object` | Voice line arrays by category |

## Function Mappings

| Minified | Concept | Description |
|---|---|---|
| `eB` | isMobileDevice() | Detects mobile platform |
| `eG` | IS_MOBILE | Cached mobile detection result |
| `e$` | MOBILE_TIME_SCALE | 0.4 on mobile, 1.0 on desktop |
| `eF` | MAX_PARTICLES | 20 on mobile, 100 on desktop |
| `eH` | FRAME_TIME | 33.3ms on mobile, 16.7ms on desktop |
| `eU` | spawnParticles() | Creates particle effects at position |
| `eV` | getPlatformPosition() | Gets actual platform position (accounts for movement) |
| `eO` | boxCollision() | AABB collision detection |
| `eD` | drawBackground() | Draws zone background with grid and particles |
| `eW` | drawCorruptedBackground() | Draws corrupted/void zone background |
| `eE` | drawStickman() | Draws a stickman entity (player/enemy) |
| `eK` | canWalkForward() | Checks if entity can walk without falling off platform |
| `ez` | getEnemyCollisionHeight() | Returns collision height for enemy type |
| `e_` | getVoiceLine() | Gets a random voice line for a category |
| `e9` | updatePlayer() | Per-frame player physics/controls update |
| `eZ` | initAudio() | Initialize Web Audio context |
| `e0` | createPlayerEntity() | Factory function for player entities |
| `e3` | initLevel() | Initialize a level (spawn platforms, enemies, coins, etc.) |
| `e5` | initChests() | Generate treasure chests for the level |
| `e4` | showPlayerPopup() | Show text popup near player |
| `e6` | showScreenPopup() | Show text popup center of screen |
| `e8` | executeSkill() | Activate a skill from player input |
| `eq` | GameCanvas | Main React component (forwardRef) |

## Store (Zustand) Mappings

| Minified | Concept | Description |
|---|---|---|
| `ea` | gameStore | Main Zustand store |
| `ea.getState()` | Read store | Get current state snapshot |
| `ea.setState()` | Update store | Merge new state into store |
| `ea.subscribe()` | Watch store | Subscribe to state changes |

## Key Store Actions

| Action | Description |
|---|---|
| `setGamePhase(phase)` | Change game phase (menu→playing→level-complete→victory) |
| `setCurrentLevel(level)` | Set the current level number |
| `addCoins(amount)` | Add coins to player's total |
| `updateCooldowns(d,s,sp)` | Update ability cooldown displays |
| `unlockSkin(id)` | Unlock a player skin |
| `unlockPet(id)` | Unlock a pet |
| `equipSkill(slot, id)` | Equip a skill to a slot |
| `purchaseUpgrade(type)` | Purchase a weapon upgrade level |

## How to Debug the Portal Bug

The portal bug is the most critical and most easily broken feature. Here's how to verify it's working:

1. **Play any level** and kill all enemies on all waves
2. **Watch for the portal** appearing on the right side of the level after the last enemy dies
3. **If the portal doesn't appear**, check these conditions:
   - `ee.current` must be `true` (allEnemiesSpawned)
   - `I.current` must be empty or all entities must have `active: false`
   - `eS.current.active` must be `true`

### Search for portal-related code in the minified file:

```bash
# Search for the allEnemiesSpawned flag
rg "ee.current" game-full.js

# Search for the portal activation
rg "eS.current.active" game-full.js

# Search for the portal rendering
rg "eS.current" game-full.js
```

### Key portal code patterns:

- **Flag set**: `ee.current=!0` (sets allEnemiesSpawned to true)
- **Flag reset**: `ee.current=!1` (sets allEnemiesSpawned to false — DANGER!)
- **Portal activate**: `eS.current.active=!0` (opens the portal)
- **Portal render**: Drawing code checks `eS.current.active`
- **Player enter**: `boxCollision(player, portal)` triggers level complete
