/**
 * MATCHMAKING BRIDGE — Online 1v1 matchmaking client
 *
 * Connects to the Socket.io matchmaking server (mini-services/matchmaking-service/)
 * on port 3003 via the Caddy gateway (?XTransformPort=3003).
 *
 * Flow:
 *   1. Game sends neon-search-match → bridge connects to server, starts searching
 *   2. Server finds opponent (±200 ELO) → bridge receives match-found
 *   3. During game → bridge syncs player state at 20fps, relays bullets/skills/hits
 *   4. Game over → bridge receives result with ELO changes
 *   5. Rematch / resign / disconnect handling
 *
 * Team colors: Player 1 = neon green (#00ff66), Player 2 = luminous yellow (#ccff00)
 * Used by: page.tsx (shows matchmaking overlay)
 */

import { io, Socket } from 'socket.io-client';

export interface OnlinePlayer {
  id: string;
  username: string;
  elo: number;
  skinColor: string;
  skinGlowColor: string;
  skinTrailColor: string;
  skinEffect: string;
  equippedSkills: string[];
  petId: string;
}

export interface MatchData {
  roomId: string;
  player1: OnlinePlayer;
  player2: OnlinePlayer;
}

export type MatchmakingState = 
  | 'idle' 
  | 'searching' 
  | 'found' 
  | 'countdown' 
  | 'playing' 
  | 'gameover'
  | 'disconnected';

type StateListener = (state: MatchmakingState, data?: any) => void;

class MatchmakingBridge {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private opponent: OnlinePlayer | null = null;
  private isPlayer1: boolean = false;
  private state: MatchmakingState = 'idle';
  private listeners: Set<StateListener> = new Set();
  private stateSyncInterval: ReturnType<typeof setInterval> | null = null;
  private matchmakingPort = 3003;

  // Default team colors - neon green vs luminous yellow
  static readonly TEAM_A_COLOR = '#00ff66';  // Neon green (Player 1)
  static readonly TEAM_A_GLOW = '#00ff66';
  static readonly TEAM_B_COLOR = '#ccff00';  // Luminous yellow (Player 2) 
  static readonly TEAM_B_GLOW = '#ffff44';

  constructor() {
    // Listen for messages from the game iframe
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleGameMessage.bind(this));
    }
  }

  // Connect to the matchmaking server
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(`/?XTransformPort=${this.matchmakingPort}`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Matchmaking] Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('[Matchmaking] Disconnected from server');
      if (this.state === 'playing') {
        this.setState('disconnected');
      }
    });

    this.socket.on('searching', (data: { queueSize: number }) => {
      this.setState('searching', data);
    });

    this.socket.on('match-found', (data: MatchData) => {
      console.log('[Matchmaking] Match found!', data);
      this.roomId = data.roomId;
      this.isPlayer1 = data.player1.id === this.socket!.id;
      this.opponent = this.isPlayer1 ? data.player2 : data.player1;
      this.setState('found', data);

      // Notify game iframe about the match
      this.sendToGame('match-found', {
        roomId: data.roomId,
        isPlayer1: this.isPlayer1,
        opponent: this.opponent,
        myColor: this.isPlayer1 ? MatchmakingBridge.TEAM_A_COLOR : MatchmakingBridge.TEAM_B_COLOR,
        myGlow: this.isPlayer1 ? MatchmakingBridge.TEAM_A_GLOW : MatchmakingBridge.TEAM_B_GLOW,
        opponentColor: this.isPlayer1 ? MatchmakingBridge.TEAM_B_COLOR : MatchmakingBridge.TEAM_A_COLOR,
        opponentGlow: this.isPlayer1 ? MatchmakingBridge.TEAM_B_GLOW : MatchmakingBridge.TEAM_A_GLOW,
      });
    });

    this.socket.on('game-start', (data: { roomId: string }) => {
      console.log('[Matchmaking] Game starting!');
      this.setState('playing');
      this.sendToGame('online-game-start', {
        roomId: data.roomId,
        isPlayer1: this.isPlayer1,
      });
      this.startStateSync();
    });

    this.socket.on('opponent-state', (state: any) => {
      // Forward opponent state to game iframe
      this.sendToGame('opponent-state', state);
    });

    this.socket.on('opponent-bullet', (bullet: any) => {
      this.sendToGame('opponent-bullet', bullet);
    });

    this.socket.on('opponent-hit', (data: any) => {
      this.sendToGame('opponent-hit', data);
    });

    this.socket.on('opponent-skill', (data: any) => {
      this.sendToGame('opponent-skill', data);
    });

    this.socket.on('game-over', (data: any) => {
      console.log('[Matchmaking] Game over!', data);
      this.setState('gameover', data);
      this.sendToGame('online-game-over', data);
      this.stopStateSync();
    });

    this.socket.on('rematch-requested', () => {
      this.sendToGame('rematch-requested', {});
    });

    this.socket.on('rematch-start', () => {
      this.sendToGame('rematch-start', {});
      this.setState('countdown');
    });
  }

  // Start searching for a match
  searchMatch(playerData: {
    username: string;
    elo: number;
    skinColor: string;
    skinGlowColor: string;
    skinTrailColor: string;
    skinEffect: string;
    equippedSkills: string[];
    petId: string;
  }): void {
    this.connect();
    // Override colors with team colors for online mode
    this.socket!.emit('search-match', {
      ...playerData,
      // Keep the player's chosen color for display, but in-game they'll use team colors
    });
    this.setState('searching');
  }

  // Cancel match search
  cancelSearch(): void {
    this.socket?.emit('cancel-search');
    this.setState('idle');
  }

  // Send rematch request
  requestRematch(): void {
    this.socket?.emit('rematch-request');
  }

  // Accept rematch
  acceptRematch(): void {
    this.socket?.emit('rematch-accept');
  }

  // Resign from current game
  resign(): void {
    this.socket?.emit('resign');
  }

  // Start syncing player state to opponent
  private startStateSync(): void {
    if (this.stateSyncInterval) clearInterval(this.stateSyncInterval);
    
    // Sync at ~20fps for smooth gameplay
    this.stateSyncInterval = setInterval(() => {
      // Request current state from game iframe
      this.sendToGame('request-player-state', {});
    }, 50);
  }

  private stopStateSync(): void {
    if (this.stateSyncInterval) {
      clearInterval(this.stateSyncInterval);
      this.stateSyncInterval = null;
    }
  }

  // Handle messages from the game iframe
  private handleGameMessage(event: MessageEvent): void {
    const { type, data } = event.data || {};
    if (!type || !type.startsWith('neon-')) return;

    switch (type) {
      case 'neon-player-state':
        // Forward player state to opponent via server
        if (this.socket?.connected && this.roomId) {
          this.socket.emit('player-state', data);
        }
        break;

      case 'neon-player-bullet':
        if (this.socket?.connected && this.roomId) {
          this.socket.emit('player-bullet', data);
        }
        break;

      case 'neon-player-hit':
        if (this.socket?.connected && this.roomId) {
          this.socket.emit('player-hit', data);
        }
        break;

      case 'neon-player-skill':
        if (this.socket?.connected && this.roomId) {
          this.socket.emit('player-skill', data);
        }
        break;

      case 'neon-player-died':
        if (this.socket?.connected && this.roomId) {
          this.socket.emit('player-died');
        }
        break;

      case 'neon-search-match':
        this.searchMatch(data);
        break;

      case 'neon-cancel-search':
        this.cancelSearch();
        break;

      case 'neon-rematch':
        this.requestRematch();
        break;

      case 'neon-accept-rematch':
        this.acceptRematch();
        break;

      case 'neon-resign':
        this.resign();
        break;
    }
  }

  // Send message to game iframe
  private sendToGame(type: string, data: any): void {
    const iframe = document.querySelector('iframe[title="Neon Stickman: Stick War"]');
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type, data }, '*');
    }
  }

  // State management
  private setState(state: MatchmakingState, data?: any): void {
    this.state = state;
    this.listeners.forEach(fn => fn(state, data));
  }

  getState(): MatchmakingState {
    return this.state;
  }

  getOpponent(): OnlinePlayer | null {
    return this.opponent;
  }

  getIsPlayer1(): boolean {
    return this.isPlayer1;
  }

  onStateChange(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  disconnect(): void {
    this.stopStateSync();
    this.socket?.disconnect();
    this.socket = null;
    this.roomId = null;
    this.opponent = null;
    this.setState('idle');
  }
}

// Singleton
export const matchmakingBridge = new MatchmakingBridge();
