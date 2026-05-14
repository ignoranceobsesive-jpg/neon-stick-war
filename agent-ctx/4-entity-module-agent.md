# Task 4 — Entity Module Agent

## Task
Create entity TypeScript modules under `src/game/entities/` with critical bug fixes.

## Work Completed

### Files Created
| File | Lines | Key Exports |
|------|-------|-------------|
| `src/game/entities/Player.ts` | 202 | `PlayerState`, `PlayerInput`, `PlatformRect`, `createPlayer`, `updatePlayer`, `damagePlayer`, `healPlayer` |
| `src/game/entities/Enemy.ts` | 179 | `EnemyType`, `EnemyState`, `createEnemy`, `updateEnemy`, `enemyCanAttack`, `damageEnemy`, `resetEnemyAttackCooldown` |
| `src/game/entities/Portal.ts` | 150 | `PortalState`, `createPortal`, `updatePortal`, `isPlayerAtPortal`, `activatePortal`, `deactivatePortal`, `checkPortalActivation`, `enterPortal` |
| `src/game/entities/Projectile.ts` | 196 | `ProjectileOwner`, `ProjectileType`, `ProjectileState`, `createBullet`, `createFireball`, `createIceShard`, `createShadowStep`, `updateProjectile`, `projectileHitsRect`, `destroyProjectile` |

### Bug Fixes

1. **Sticky Ground (Player.ts)**: Ground collision uses `prevBottom <= plat.y + 2` tolerance buffer. Only positive velocity zeroed. Prevents magnetic re-snapping after jump.

2. **Dash Always Goes Right (Player.ts)**: `dashDirection = player.facing` when dash activates, not hardcoded `1`.

3. **Portal Doesn't Open (Portal.ts)**: Simple `active` boolean flag. `checkPortalActivation(enemies)` helper encapsulates "all dead → open portal". `enterPortal()` returns `'nextWave'` or `'levelComplete'`.

### Verification
- TypeScript: `tsc --noEmit` — 0 errors
- ESLint: 0 errors, 0 warnings on all entity files
