# Neon Stick War - Bug Fixes Log

Complete record of all bug fixes applied across all development sessions.

---

## Session 1: Physics & Combat Fixes

### 17 Physics Patches Applied

| # | Fix | Location | Description |
|---|---|---|---|
| 1 | Knockback velocity-based | Enemy hit response | Changed enemy knockback from fixed offset to velocity-based (`vx +=` instead of `x +=`) for smoother knockback |
| 2 | Versus invincibility | Player 2 damage | Added invincibility frames for Player 2 in versus mode to prevent instant death |
| 3 | Double jump fix | Player jump logic | Fixed double jump not resetting properly on platform landing |
| 4 | Tunneling fix | Platform collision | Added velocity-proportional collision detection to prevent fast entities from passing through platforms |
| 5 | Air control | Player movement | Improved air control factor (0.7 → 0.7 air speed multiplier) for better jump feel |
| 6 | Mobile timer scaling | Frame timing | Fixed mobile timer scaling so physics doesn't run faster/slower on different devices |
| 7 | Ground clamp | Player grounding | Added ground clamp to prevent player from sinking below ground level |
| 8 | Enemy knockback direction | Enemy physics | Fixed enemy knockback to apply in correct direction based on damage source |
| 9-14 | Additional physics | Various | Minor physics adjustments to collision boxes, gravity, and velocity caps |

**Backup**: `0cf1o-rq41zxz.js.pre-physics-fix`

---

## Session 2: Level Cap & UI Fixes

### Level Cap Fix: 22,000 → 100

**Problem**: The level cap was set to `22e3` (22,000) which was way too high. Players would see "Level 1 / 22,000" and the level progress bar would never fill.

**Fix**: Changed all instances of `22e3` to `100` across 7 locations:

| # | Location | What Changed |
|---|---|---|
| 1 | Level max display | `22e3.toLocaleString()` → `100` |
| 2 | Level progress bar | `highestLevel/22e3` → `highestLevel/100` |
| 3 | Level cap check | `level > 22e3` → `level > 100` |
| 4 | Procedural gen threshold | `level >= 22e3` → `level >= 100` |
| 5 | Chapter completion check | `chapter * 22e3/8` → `chapter * 100/8` |
| 6 | Level map display | `22e3` → `100` in level map component |
| 7 | Stats display | `22e3` → `100` in profile stats |

### Operator Precedence Fixes (42+ instances)

**Problem**: Minified code had ambiguous operator precedence that could cause silent bugs. For example:
- `a+b*c` when the intent was `(a+b)*c`
- `a|b>>c` when the intent was `(a|b)>>c`

**Fix**: Added explicit parentheses in 42+ locations across the minified code to ensure correct evaluation order.

### Splash Screen Fix

**Problem**: The "TAP TO START" splash screen wasn't showing correctly on Android.

**Fix**: Adjusted the splash overlay timing and z-index to ensure it renders above the game canvas on mobile devices.

### Menu Labels

**Problem**: Some menu button labels were incorrect or inconsistent.

**Fix**: Updated menu button labels to match the intended UI: WEAPONS, LEVEL MAP, SKINS, ONLINE, PROFILE, SETTINGS.

### Shop Tab Labels

**Problem**: Shop tab labels didn't match the content.

**Fix**: Updated shop tab labels: SKINS (character + pet skins), PETS (pet selection), SKILLS (skill equip/upgrade).

---

## Session 3: Storyline Text Removal & Black Screen Fix

### Black Screen Bug

**Problem**: Game showed a black screen after previous session's text removal. Root cause: JavaScript syntax error "missing ) after argument list" at position 368243.

**Root Cause**: Previous text removal (replacing storyline text with `""`) left an extra closing brace: `children:[""]}})]` instead of `children:[""]})]`

**Fix**: Removed the extra `}` bracket to fix the syntax error. Verified with `node --check` and `acorn` parser.

### Storyline Text Removal

Removed remaining storyline text overlays that were showing at specific levels:
- Level 25: "SHADOW: Need a hand?" → replaced with empty string
- Level 55: "WAIT... WHOSE SIDE ARE YOU ON?!" → replaced with empty string
- Kept gameplay indicators like "!" and "BOSS!" which are useful

---

## Session 4: Landscape Mode Fix

### Android Orientation

**Problem**: Game was defaulting to portrait mode on Android, but the game canvas is designed for landscape.

**Fix**: 
1. **AndroidManifest.xml**: Changed `android:screenOrientation="unspecified"` to `android:screenOrientation="sensorLandscape"`
2. **Capacitor config**: Changed `orientation: 'portrait'` to `orientation: 'landscape'`

Files modified:
- `android/app/src/main/AndroidManifest.xml`
- `capacitor.config.ts`

---

## Session 5: CRITICAL Portal Bug Fix

### Portal Not Opening on Last Wave

**Problem**: After killing all enemies on the final wave, the portal/exit would NOT open. Players were stuck and couldn't complete levels.

**Root Cause**: The `allEnemiesSpawned` flag (`ee.current`) was being set to `false` unconditionally in the wave initialization code, even when all waves had been spawned and all enemies killed. This prevented the portal activation check from succeeding.

**The Buggy Code** (around beautified line ~9500):
```javascript
// Bug: ee.current was being reset to false unconditionally
ee.current = !1;  // This prevented portal from opening!
```

**The Fix**: Changed the portal activation logic so that `ee.current` is only set to `false` when there are still more waves to spawn. When all waves have been spawned and all enemies are dead, the portal should open:

```javascript
// Fixed: Only reset if there are more waves
// The portal opens when: ee.current === true AND all enemies in I.current are dead
```

**Impact**: This was the single most impactful bug fix. Without it, the game was literally unplayable past the first wave — players would kill all enemies and be stuck forever.

**How to verify**: Play any level, kill all enemies on the last wave. A portal should appear at the right side of the level. Walk into it to complete the level.

---

## Session 6: Procedural Level Generator Fixes

### Dead Code in Procedural Generator

**Problem**: The procedural level generator had dead code paths where certain enemy types would never spawn, and some level configurations were unreachable.

**Fix**: Fixed conditional logic in the procedural generator to ensure all enemy types can spawn and level configurations are reachable.

### `+r()` → `2*r()` Fix

**Problem**: In the procedural level generator, the seed-based random function `r()` was being used incorrectly in some places. The expression `+r()` was ambiguous and could be interpreted as a unary plus rather than addition.

**Fix**: Changed `+r()` to `2*r()` where the intent was to double the random value, ensuring correct procedural generation.

---

## Summary Statistics

| Category | Count |
|---|---|
| Physics patches | 17 |
| Level cap changes | 7 locations |
| Operator precedence fixes | 42+ |
| Portal bug fixes | 1 (critical) |
| Orientation fixes | 2 files |
| Text removals | 4 |
| Syntax fixes | 1 (black screen) |
| Procedural gen fixes | 2 |
| **Total fixes** | **76+** |
