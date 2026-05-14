/**
 * GameEngine module for NeonStickWar game engine.
 *
 * The main orchestrator that ties the Camera, InputManager, Renderer,
 * WaveManager, and AudioManager together into a functioning game loop.
 *
 * BUG FIXES addressed:
 *   1. STICKY GROUND: 2px tolerance buffer + previous-position check
 *   2. DASH ALWAYS RIGHT: dashDirection = facingRight ? 1 : -1
 *   3. PORTAL DOESN'T OPEN: WaveManager with clean progression logic
 *   4. BLACK PREVIEW SCREEN: Canvas renders directly (no iframe)
 *   5. SCREEN AUTO-ROTATION: CSS + Capacitor orientation lock
 */

import { Camera } from './Camera';
import { InputManager } from './InputManager';
import { Renderer } from './Renderer';
import type {
  GamePhase,
  Platform,
  Player,
  Enemy,
  EnemyType,
  Portal,
  Projectile,
  PlayerSkin,
  WeatherType,
  WaveConfig,
} from './types';
import { LEVELS, generateProceduralLevel } from '../data/levels';
import { BIOMES, type Biome } from '../data/biomes';
import { audioManager } from '../systems/AudioManager';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FRAME_TIME = 16.667;
const MAX_DT = 3;
const GRAVITY = 0.5;
const PLAYER_SPEED = 4;
const PLAYER_JUMP_VEL = -10;
const DEFAULT_LEVEL_WIDTH = 2000;
const DEFAULT_LEVEL_HEIGHT = 600;

const DEFAULT_SKIN: PlayerSkin = {
  bodyColor: '#00ff66',
  glowColor: '#00ff88',
  accentColor: '#00cc55',
};

// ---------------------------------------------------------------------------
// GameEngine
// ---------------------------------------------------------------------------

export class GameEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private camera: Camera;
  private input: InputManager;
  private renderer: Renderer;

  private animFrameId: number = 0;
  private lastTime: number = 0;
  private running: boolean = false;

  gamePhase: GamePhase = 'splash';
  currentLevel: number = 1;
  score: number = 0;
  highScore: number = 0;
  highestLevel: number = 1;
  currentWave: number = 1;
  totalWaves: number = 1;
  weather: WeatherType = 'none';
  skin: PlayerSkin = { ...DEFAULT_SKIN };
  levelName: string = '';
  biomeTheme: Biome | null = null;

  player: Player | null = null;
  enemies: Enemy[] = [];
  portal: Portal | null = null;
  projectiles: Projectile[] = [];
  platforms: Platform[] = [];
  
  // Wave management - replaces the broken autoSpawnTimer logic
  private waveConfigs: WaveConfig[] = [];
  private waveIndex: number = 0;
  private allWavesCleared: boolean = false;
  private waveSpawnDelay: number = 0; // brief delay between waves
  private bossWaveSpawned: boolean = false;

  onPhaseChange?: (phase: GamePhase) => void;
  onScoreChange?: (score: number) => void;

  private animTime: number = 0;
  private splashTimer: number = 0;
  private menuPulse: number = 0;
  
  // Attack cooldown for player shooting
  private playerAttackCooldown: number = 0;

  constructor() {
    this.camera = new Camera(800, 600, DEFAULT_LEVEL_WIDTH, DEFAULT_LEVEL_HEIGHT);
    this.input = new InputManager();
    this.renderer = new Renderer();
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input.bindCanvas(canvas);
    this.resize();
    this.start();
  }

  // -------------------------------------------------------------------------
  // Game loop
  // -------------------------------------------------------------------------

  private gameLoop = (time: number): void => {
    const dt = Math.min((time - this.lastTime) / FRAME_TIME, MAX_DT);
    this.lastTime = time;
    this.animTime = time;

    this.update(dt);
    this.render();

    if (this.running) {
      this.animFrameId = requestAnimationFrame(this.gameLoop);
    }
  };

  private update(dt: number): void {
    switch (this.gamePhase) {
      case 'splash':
        this.splashTimer += dt;
        if (this.splashTimer > 120 || this.input.isJump() || this.input.isAttack()) {
          audioManager.init();
          audioManager.playMenuClick();
          this.setPhase('menu');
        }
        break;

      case 'menu':
        this.menuPulse += dt * 0.05;
        if (this.input.isJump() || this.input.isAttack()) {
          audioManager.init();
          audioManager.playMenuClick();
          this.setPhase('playing');
          this.startLevel(1);
        }
        break;

      case 'playing':
        this.updatePlaying(dt);
        break;

      case 'paused':
        if (this.input.isJump()) {
          this.resume();
        }
        break;

      case 'levelComplete':
        if (this.input.isJump() || this.input.isAttack()) {
          this.currentLevel++;
          if (this.currentLevel > this.highestLevel) this.highestLevel = this.currentLevel;
          this.startLevel(this.currentLevel);
        }
        break;

      case 'gameOver':
        if (this.input.isJump() || this.input.isAttack()) {
          this.currentLevel = 1;
          this.score = 0;
          this.startLevel(1);
        }
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Main gameplay update
  // -------------------------------------------------------------------------

  private updatePlaying(dt: number): void {
    if (!this.player) return;

    // Pause
    if (this.input.isSkill() && this.input.isJump()) {
      this.pause();
      return;
    }

    // Player movement + dash
    this.updatePlayerMovement(dt);
    
    // Player physics
    this.updatePlayerPhysics(dt);
    
    // Enemy AI
    this.updateEnemies(dt);
    
    // Projectiles
    this.updateProjectiles(dt);
    
    // Collisions
    this.checkCollisions();
    
    // Wave progression + portal logic
    this.updateWaveAndPortal(dt);
    
    // Camera follow
    this.camera.follow(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2
    );

    // Check game over
    if (this.player.health <= 0) {
      audioManager.playGameOver();
      if (this.score > this.highScore) this.highScore = this.score;
      this.setPhase('gameOver');
      return;
    }
    
    // Cooldowns
    if (this.playerAttackCooldown > 0) this.playerAttackCooldown -= dt;
  }

  // -------------------------------------------------------------------------
  // Player movement + DASH FIX
  // -------------------------------------------------------------------------

  private updatePlayerMovement(dt: number): void {
    if (!this.player) return;
    const p = this.player;

    // ---- DASH (SKILL BUTTON) ----
    // BUG FIX: dashDirection uses facingRight, NOT hardcoded 1
    if (this.input.isSkill() && p.dashCooldown <= 0 && !p.isDashing) {
      p.isDashing = true;
      p.dashTimer = p.dashDuration;
      p.dashCooldown = p.dashCooldownMax;
      // KEY FIX: dash direction follows player facing
      p.dashDirection = p.facingRight ? 1 : -1;
      p.vx = 0;
      p.vy = 0;
      audioManager.playDash();
    }

    // Apply dash movement
    if (p.isDashing) {
      p.vx = p.dashSpeed * p.dashDirection;
      p.vy = 0;
      p.dashTimer -= dt;
      if (p.dashTimer <= 0) {
        p.isDashing = false;
      }
    } else {
      // Normal horizontal movement
      if (this.input.isLeft()) {
        p.vx = -PLAYER_SPEED * dt;
        p.facingRight = false;
      } else if (this.input.isRight()) {
        p.vx = PLAYER_SPEED * dt;
        p.facingRight = true;
      } else {
        p.vx *= 0.8;
      }

      // Jump
      if (this.input.isJump() && p.grounded) {
        p.vy = PLAYER_JUMP_VEL;
        p.grounded = false;
        audioManager.playJump();
      }
    }

    // Attack (shoot projectile)
    if (this.input.isAttack() && this.playerAttackCooldown <= 0 && !p.isDashing) {
      this.playerAttackCooldown = 12; // ~200ms cooldown
      const dir = p.facingRight ? 1 : -1;
      this.projectiles.push({
        x: p.x + (p.facingRight ? p.width : 0),
        y: p.y + p.height * 0.4,
        vx: 12 * dir,
        vy: 0,
        width: 8,
        height: 3,
        life: 80,
        color: '#00ff66',
        owner: 'player',
        damage: 10,
      });
      p.attacking = true;
      p.attackTimer = 8;
      audioManager.playAttack();
    }

    // Walk cycle
    if (Math.abs(p.vx) > 0.5 && p.grounded) {
      p.walkCycle += 0.15 * dt;
    }

    // Timers
    if (p.attackTimer > 0) {
      p.attackTimer -= dt;
      if (p.attackTimer <= 0) p.attacking = false;
    }
    if (p.dashCooldown > 0) p.dashCooldown -= dt * 16.667;
    if (p.invincible > 0) p.invincible -= dt;
    if (p.skillCooldown > 0) p.skillCooldown -= dt * 16.667;
  }

  // -------------------------------------------------------------------------
  // Player physics - STICKY GROUND FIX
  // -------------------------------------------------------------------------

  private updatePlayerPhysics(dt: number): void {
    if (!this.player) return;
    const p = this.player;

    // Gravity (skip during dash)
    if (!p.isDashing) {
      p.vy += GRAVITY * dt;
      if (p.vy > 12) p.vy = 12;
    }

    // Apply velocity
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Platform collision - STICKY GROUND FIX
    // Use previous position check with tolerance buffer
    p.grounded = false;
    for (const plat of this.platforms) {
      const platY = plat.type === 'moving' ? plat.y + (plat.moveOffset ?? 0) : plat.y;
      
      if (p.x + p.width > plat.x + 4 && p.x < plat.x + plat.width - 4) {
        const playerBottom = p.y + p.height;
        const prevBottom = playerBottom - p.vy * dt;
        
        // BUG FIX: Only land if was ABOVE the platform last frame (with 2px tolerance)
        // This prevents re-snapping when jumping upward
        if (prevBottom <= platY + 2 && playerBottom >= platY) {
          p.y = platY - p.height;
          if (p.vy > 0) p.vy = 0; // Only zero falling velocity
          p.grounded = true;
          break;
        }
      }
    }

    // World bounds
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > this.camera.levelWidth) {
      p.x = this.camera.levelWidth - p.width;
    }

    // Fall recovery
    if (p.y > this.camera.levelHeight + 50) {
      p.y = this.camera.levelHeight - p.height - 80;
      p.vy = 0;
      p.health -= 10;
    }
  }

  // -------------------------------------------------------------------------
  // Enemy AI
  // -------------------------------------------------------------------------

  private updateEnemies(dt: number): void {
    for (const e of this.enemies) {
      if (e.health <= 0) continue;

      // Gravity
      e.vy += GRAVITY * dt;
      if (e.vy > 12) e.vy = 12;

      // Chase AI toward player
      if (this.player) {
        const dx = this.player.x - e.x;
        const dist = Math.abs(dx);
        
        if (dist < (e.sightRange || 200)) {
          e.facingRight = dx > 0;
          if (dist > (e.attackRange || 40)) {
            e.vx = (e.facingRight ? 1 : -1) * (e.speed || 1.5);
          } else {
            e.vx *= 0.8;
            // Attack
            if (e.attackCooldown <= 0 && e.attackCooldownMax > 0) {
              e.attacking = true;
              e.attackTimer = 10;
              e.attackCooldown = e.attackCooldownMax;
            }
          }
        } else {
          e.vx *= 0.9;
        }
      }

      // Update timers
      if (e.attackTimer > 0) {
        e.attackTimer -= dt;
        if (e.attackTimer <= 0) e.attacking = false;
      }
      if (e.attackCooldown > 0) e.attackCooldown -= dt;

      // Walk cycle
      if (Math.abs(e.vx) > 0.3 && e.grounded) {
        e.walkCycle += 0.15 * dt;
      }

      // Apply velocity
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      // Platform collision (same sticky ground fix)
      e.grounded = false;
      for (const plat of this.platforms) {
        const platY = plat.type === 'moving' ? plat.y + (plat.moveOffset ?? 0) : plat.y;
        if (e.x + e.width > plat.x + 4 && e.x < plat.x + plat.width - 4) {
          const eBottom = e.y + e.height;
          const prevBottom = eBottom - e.vy * dt;
          if (prevBottom <= platY + 2 && eBottom >= platY) {
            e.y = platY - e.height;
            if (e.vy > 0) e.vy = 0;
            e.grounded = true;
            break;
          }
        }
      }

      // World bounds
      if (e.x < 0) e.x = 0;
      if (e.x + e.width > this.camera.levelWidth) {
        e.x = this.camera.levelWidth - e.width;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Projectiles
  // -------------------------------------------------------------------------

  private updateProjectiles(dt: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      // Check projectile-enemy collision
      if (p.owner === 'player') {
        for (const e of this.enemies) {
          if (e.health <= 0) continue;
          if (p.x + p.width > e.x && p.x < e.x + e.width &&
              p.y + p.height > e.y && p.y < e.y + e.height) {
            e.health -= p.damage;
            p.life = 0;
            audioManager.playHit();
            if (e.health <= 0) {
              this.score += e.reward || 10;
              audioManager.playEnemyDeath();
            }
            break;
          }
        }
      }

      // Check enemy projectile-player collision
      if (p.owner === 'enemy' && this.player && this.player.invincible <= 0) {
        if (p.x + p.width > this.player.x && p.x < this.player.x + this.player.width &&
            p.y + p.height > this.player.y && p.y < this.player.y + this.player.height) {
          this.player.health -= p.damage;
          this.player.invincible = 40;
          p.life = 0;
          audioManager.playHit();
        }
      }

      // Remove dead projectiles
      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Collisions (melee)
  // -------------------------------------------------------------------------

  private checkCollisions(): void {
    if (!this.player) return;

    // Enemy melee attack → player
    for (const e of this.enemies) {
      if (e.health <= 0) continue;
      if (e.attacking && e.attackTimer > 6 && this.player.invincible <= 0) {
        const dx = Math.abs((this.player.x + this.player.width / 2) - (e.x + e.width / 2));
        const dy = Math.abs((this.player.y + this.player.height / 2) - (e.y + e.height / 2));
        if (dx < (this.player.width + e.width) * 0.6 && dy < this.player.height * 0.8) {
          const dmg = e.damage || (e.type === 'boss' ? 20 : e.type === 'heavy' ? 15 : 10);
          this.player.health -= dmg;
          this.player.invincible = 40;
          audioManager.playHit();
        }
      }
    }

    // Remove dead enemies
    this.enemies = this.enemies.filter(e => e.health > 0);
  }

  // -------------------------------------------------------------------------
  // Wave progression + Portal - BUG FIX
  // -------------------------------------------------------------------------

  private updateWaveAndPortal(dt: number): void {
    if (!this.portal) return;

    // If all waves cleared, portal is permanently active
    if (this.allWavesCleared) {
      this.portal.active = true;
      // Check if player enters portal
      if (this.player) {
        const p = this.player;
        if (p.x + p.width > this.portal.x &&
            p.x < this.portal.x + this.portal.width &&
            p.y + p.height > this.portal.y &&
            p.y < this.portal.y + this.portal.height) {
          audioManager.playLevelComplete();
          this.score += 1000 * this.currentLevel;
          if (this.score > this.highScore) this.highScore = this.score;
          this.setPhase('levelComplete');
        }
      }
      return;
    }

    // If enemies still alive, portal is inactive
    if (this.enemies.length > 0) {
      this.portal.active = false;
      return;
    }

    // No enemies alive — check wave progression
    // Delay between waves
    if (this.waveSpawnDelay > 0) {
      this.waveSpawnDelay -= dt;
      return;
    }

    // Advance to next wave
    this.waveIndex++;
    if (this.waveIndex < this.waveConfigs.length) {
      // Spawn next wave
      this.spawnWave(this.waveIndex);
      this.currentWave = this.waveIndex + 1;
      this.waveSpawnDelay = 30; // brief delay before next wave
    } else if (!this.bossWaveSpawned) {
      // Check for boss wave
      const levelData = LEVELS.find(l => l.id === this.currentLevel);
      if (levelData?.bossWave && levelData.bossWave.enemies.length > 0) {
        this.bossWaveSpawned = true;
        this.waveConfigs.push(levelData.bossWave);
        this.spawnWave(this.waveIndex);
        this.currentWave = this.waveIndex + 1;
        this.totalWaves = this.waveConfigs.length;
      } else {
        // No boss wave — all waves cleared!
        this.allWavesCleared = true;
        this.portal.active = true;
        audioManager.playPortalOpen();
      }
    } else {
      // Boss wave already spawned and cleared — all done!
      this.allWavesCleared = true;
      this.portal.active = true;
      audioManager.playPortalOpen();
    }
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  private render(): void {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    switch (this.gamePhase) {
      case 'splash':
        this.renderSplash(ctx, w, h);
        break;

      case 'menu':
        this.renderMenu(ctx, w, h);
        break;

      case 'playing':
        this.renderPlaying(ctx, w, h);
        break;

      case 'paused':
        this.renderPlaying(ctx, w, h);
        this.renderer.drawOverlay(ctx, w, h, 0.5);
        this.renderer.drawCenteredText(ctx, 'PAUSED', h / 2, w, '#00ffcc', 36);
        this.renderer.drawCenteredText(ctx, 'Press JUMP to resume', h / 2 + 40, w, '#aaaacc', 14);
        break;

      case 'levelComplete':
        this.renderPlaying(ctx, w, h);
        this.renderer.drawOverlay(ctx, w, h, 0.5);
        this.renderer.drawCenteredText(ctx, 'LEVEL COMPLETE!', h / 2 - 20, w, '#ffd700', 36);
        this.renderer.drawCenteredText(ctx, `Score: ${this.score}`, h / 2 + 20, w, '#ffffff', 20);
        this.renderer.drawCenteredText(ctx, 'Tap or press JUMP to continue', h / 2 + 60, w, '#aaaacc', 14);
        break;

      case 'gameOver':
        this.renderPlaying(ctx, w, h);
        this.renderer.drawOverlay(ctx, w, h, 0.6);
        this.renderer.drawCenteredText(ctx, 'GAME OVER', h / 2 - 20, w, '#ff3344', 42);
        this.renderer.drawCenteredText(ctx, `Final Score: ${this.score}`, h / 2 + 20, w, '#ffffff', 20);
        this.renderer.drawCenteredText(ctx, 'Tap or press JUMP to retry', h / 2 + 60, w, '#aaaacc', 14);
        break;
    }
  }

  private renderSplash(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const skyColor = this.biomeTheme?.skyColor || '#050510';
    const skyGrad = this.biomeTheme?.skyGradient?.[2] || '#0a0a2e';
    this.renderer.clearCanvas(ctx, w, h, skyColor, skyGrad);

    // Animated background particles
    this.drawBackgroundParticles(ctx, w, h);

    this.renderer.drawCenteredText(ctx, 'NEON', h / 2 - 40, w, '#00ff66', 52);
    this.renderer.drawCenteredText(ctx, 'STICK WAR', h / 2 + 20, w, '#00ffcc', 40);

    const alpha = 0.4 + Math.sin(this.splashTimer * 0.05) * 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    this.renderer.drawCenteredText(ctx, 'Tap or press SPACE to start', h / 2 + 80, w, '#888899', 14, false);
    ctx.restore();
  }

  private renderMenu(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.renderer.clearCanvas(ctx, w, h, '#050510', '#0a0a2e');

    this.drawBackgroundParticles(ctx, w, h);

    this.renderer.drawCenteredText(ctx, 'NEON STICK WAR', h / 2 - 80, w, '#00ff66', 44);

    // Stats
    ctx.save();
    ctx.fillStyle = '#666688';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`High Score: ${this.highScore}`, w / 2, h / 2 - 30);
    ctx.fillText(`Highest Level: ${this.highestLevel}`, w / 2, h / 2 - 12);
    ctx.restore();

    const pulse = 0.6 + Math.sin(this.menuPulse) * 0.4;
    ctx.save();
    ctx.globalAlpha = pulse;
    this.renderer.drawCenteredText(ctx, '▶ TAP TO PLAY', h / 2 + 30, w, '#00ffcc', 20);
    ctx.restore();

    this.renderer.drawCenteredText(ctx, 'Move: ←→  Jump: ↑/Space  Attack: Z  Dash: X', h / 2 + 80, w, '#666688', 11, false);
    
    // Draw mobile controls hint
    this.renderer.drawCenteredText(ctx, 'Touch controls available on mobile', h / 2 + 100, w, '#444466', 10, false);
  }

  private renderPlaying(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Background
    const skyColor = this.biomeTheme?.skyColor || '#050510';
    const skyGrad = this.biomeTheme?.skyGradient?.[2] || '#0a0a2e';
    this.renderer.clearCanvas(ctx, w, h, skyColor, skyGrad);

    // Weather
    if (this.weather !== 'none') {
      this.renderer.drawWeather(ctx, w, h, this.weather, this.animTime);
    }

    // Platforms
    const platColor = this.biomeTheme?.platformColor || '#00cc66';
    const platGlow = this.biomeTheme?.platformGlow || '#00ff88';
    for (const plat of this.platforms) {
      this.renderer.drawPlatform(ctx, plat, this.camera, platColor, platGlow);
    }

    // Portal
    if (this.portal) {
      this.renderer.drawPortal(ctx, this.portal, this.camera, this.animTime);
    }

    // Enemies
    for (const e of this.enemies) {
      this.renderer.drawEnemy(ctx, e, this.camera);
    }

    // Player
    if (this.player) {
      this.renderer.drawPlayer(ctx, this.player, this.camera, this.skin);
    }

    // Projectiles
    for (const proj of this.projectiles) {
      this.renderer.drawProjectile(ctx, proj, this.camera);
    }

    // HUD
    if (this.player) {
      this.renderer.drawHUD(ctx, w, h, this.player.health, this.player.maxHealth, this.score, this.currentWave, this.currentLevel);
      
      // Dash cooldown indicator
      const dashReady = this.player.dashCooldown <= 0;
      ctx.save();
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = dashReady ? '#cc00ff' : '#444444';
      if (dashReady) {
        ctx.shadowColor = '#cc00ff';
        ctx.shadowBlur = 8;
      }
      ctx.fillText(dashReady ? '⚡ DASH READY' : `⚡ ${(this.player.dashCooldown / 1000).toFixed(1)}s`, 16, h - 80);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Mobile controls
    this.input.renderButtons(ctx, w, h);
  }

  private drawBackgroundParticles(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const time = this.animTime;
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
      const px = (Math.sin(time * 0.001 + i * 1.3) * 0.5 + 0.5) * w;
      const py = (Math.cos(time * 0.0008 + i * 0.7) * 0.5 + 0.5) * h;
      ctx.fillStyle = i % 2 === 0 ? '#00ffff' : '#00ff66';
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // Level loading
  // -------------------------------------------------------------------------

  startLevel(levelId: number): void {
    this.currentLevel = levelId;

    // Load level data (handcrafted or procedural)
    let levelData = LEVELS.find(l => l.id === levelId);
    if (!levelData) {
      levelData = generateProceduralLevel(levelId);
    }

    // Set camera bounds
    this.camera.setLevelBounds(levelData.width, levelData.height);

    // Set biome theme
    this.biomeTheme = BIOMES[levelData.background] || null;
    this.weather = (this.biomeTheme?.weatherType as WeatherType) || 'none';
    this.levelName = levelData.name;

    // Load platforms
    this.platforms = levelData.platforms.map(p => ({
      ...p,
      moveSpeed: p.type === 'moving' ? 0.5 : undefined,
      moveRange: p.type === 'moving' ? 80 : undefined,
      moveOffset: 0,
    }));

    // Create player
    const groundY = levelData.height - 40;
    this.player = {
      x: levelData.playerSpawn.x,
      y: levelData.playerSpawn.y,
      width: 24,
      height: 48,
      vx: 0,
      vy: 0,
      health: 100,
      maxHealth: 100,
      grounded: false,
      facingRight: true,
      walkCycle: 0,
      attacking: false,
      attackTimer: 0,
      // Dash fields
      isDashing: false,
      dashTimer: 0,
      dashCooldown: 0,
      dashCooldownMax: 500 / 16.667, // Convert ms to frames
      dashSpeed: 15,
      dashDuration: 150 / 16.667,
      dashDirection: 1,
      // Skill
      skillCooldown: 0,
      skillCooldownMax: 120,
      skillActive: false,
      skillTimer: 0,
      // Invincibility
      invincible: 0,
    };

    this.camera.snapTo(this.player.x, this.player.y);

    // Setup wave management
    this.waveConfigs = [...levelData.waves];
    this.waveIndex = 0;
    this.allWavesCleared = false;
    this.bossWaveSpawned = false;
    this.waveSpawnDelay = 0;
    this.totalWaves = this.waveConfigs.length + (levelData.bossWave ? 1 : 0);
    this.currentWave = 1;

    // Spawn first wave
    this.enemies = [];
    if (this.waveConfigs.length > 0) {
      this.spawnWave(0);
    }

    // Create portal at end of level
    this.portal = {
      x: levelData.width - 200,
      y: groundY - 100,
      width: 60,
      height: 80,
      active: false,
    };

    this.projectiles = [];
    this.playerAttackCooldown = 0;
    this.setPhase('playing');
  }

  private spawnWave(waveIdx: number): void {
    if (waveIdx >= this.waveConfigs.length) return;
    const wave = this.waveConfigs[waveIdx];
    
    for (const spawn of wave.enemies) {
      const sizeMult = spawn.type === 'drone' ? 0.7 :
                       spawn.type === 'heavy' ? 1.4 :
                       spawn.type === 'boss' ? 2.0 :
                       spawn.type === 'miniBoss' ? 1.7 :
                       spawn.type === 'elite' ? 1.2 : 1.0;
      
      const baseHP = spawn.type === 'boss' ? 200 :
                     spawn.type === 'miniBoss' ? 120 :
                     spawn.type === 'heavy' ? 80 :
                     spawn.type === 'elite' ? 60 :
                     spawn.type === 'fast' ? 30 :
                     spawn.type === 'drone' ? 25 : 40;
      
      const speed = spawn.type === 'fast' ? 3.5 :
                    spawn.type === 'drone' ? 2.5 :
                    spawn.type === 'heavy' ? 0.8 :
                    spawn.type === 'boss' ? 1.2 :
                    spawn.type === 'elite' ? 2.0 : 1.5;
      
      const dmg = spawn.type === 'boss' ? 20 :
                  spawn.type === 'miniBoss' ? 15 :
                  spawn.type === 'heavy' ? 15 :
                  spawn.type === 'elite' ? 10 :
                  spawn.type === 'fast' ? 6 : 8;
      
      const reward = spawn.type === 'boss' ? 100 :
                     spawn.type === 'miniBoss' ? 60 :
                     spawn.type === 'heavy' ? 40 :
                     spawn.type === 'elite' ? 35 :
                     spawn.type === 'fast' ? 25 :
                     spawn.type === 'drone' ? 10 : 20;

      // Map level data enemy types to engine EnemyType
      const engineType: EnemyType = 
        spawn.type === 'basic' ? 'soldier' :
        spawn.type === 'miniBoss' ? 'boss' :
        spawn.type as EnemyType;

      this.enemies.push({
        x: spawn.x,
        y: spawn.y,
        width: 24 * sizeMult,
        height: 48 * sizeMult,
        vx: 0,
        vy: 0,
        health: baseHP + this.currentLevel * 5,
        maxHealth: baseHP + this.currentLevel * 5,
        type: engineType,
        grounded: false,
        facingRight: false,
        walkCycle: Math.random() * Math.PI * 2,
        attacking: false,
        attackTimer: 0,
        attackCooldown: 0,
        attackCooldownMax: 50 + Math.floor(Math.random() * 30),
        attackRange: 40 * sizeMult,
        damage: dmg,
        speed: speed,
        sightRange: 250,
        reward: reward,
      });
    }
  }

  // -------------------------------------------------------------------------
  // State machine
  // -------------------------------------------------------------------------

  private setPhase(phase: GamePhase): void {
    this.gamePhase = phase;
    this.onPhaseChange?.(phase);
  }

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------

  resize(): void {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
    this.camera.resize(this.canvas.width, this.canvas.height);
  }

  pause(): void {
    this.running = false;
    this.input.reset();
    this.setPhase('paused');
  }

  resume(): void {
    this.running = true;
    this.lastTime = performance.now();
    this.setPhase('playing');
    this.start();
  }

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    this.animFrameId = requestAnimationFrame(this.gameLoop);
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
    this.input.destroy();
    audioManager.destroy();
    this.canvas = null;
    this.ctx = null;
  }

  // Handle visibility change (pause when hidden)
  handleVisibilityChange(): void {
    if (document.hidden && this.gamePhase === 'playing') {
      this.pause();
    }
  }
}
