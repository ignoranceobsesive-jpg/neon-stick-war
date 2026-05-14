/**
 * ============================================================================
 * MATCHMAKING SERVER — Real-time 1v1 online matchmaking via Socket.io
 * ============================================================================
 *
 * Port: 3003
 * Access: via Caddy gateway at /?XTransformPort=3003
 *
 * How it works:
 *   1. Player searches → added to queue
 *   2. Server matches players within ±200 ELO range
 *   3. Match found → room created → 3-second countdown → game starts
 *   4. During game → server relays state/bullets/skills/hits between players
 *   5. Player dies → ELO recalculated (K=32) → results sent to both
 *   6. Room cleaned up after 10 seconds
 *
 * Client: src/lib/matchmaking-bridge.ts (connects via Socket.io)
 * ============================================================================
 */

import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 3003;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// ====== Types ======
interface Player {
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

interface GameRoom {
  id: string;
  player1: Player;
  player2: Player;
  state: 'countdown' | 'playing' | 'finished';
  winner?: string;
  createdAt: number;
  countdownStart?: number;
}

// ====== State ======
const queue: Player[] = [];
const rooms: Map<string, GameRoom> = new Map();
const playerRooms: Map<string, string> = new Map(); // socketId -> roomId

// ====== Matchmaking Logic ======
function findMatch(player: Player): Player | null {
  const eloRange = 200; // Match within 200 ELO
  let bestMatch: Player | null = null;
  let bestDiff = Infinity;

  for (const queued of queue) {
    if (queued.id === player.id) continue;
    const diff = Math.abs(queued.elo - player.elo);
    if (diff <= eloRange && diff < bestDiff) {
      bestDiff = diff;
      bestMatch = queued;
    }
  }

  // If no close ELO match, find anyone after 10 seconds (handled client-side timeout)
  if (!bestMatch && queue.length > 0) {
    bestMatch = queue.reduce((closest, p) => {
      const d = Math.abs(p.elo - player.elo);
      const cd = Math.abs(closest.elo - player.elo);
      return d < cd ? p : closest;
    }, queue[0]);
  }

  return bestMatch;
}

function createRoom(p1: Player, p2: Player): GameRoom {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const room: GameRoom = {
    id: roomId,
    player1: p1,
    player2: p2,
    state: 'countdown',
    createdAt: Date.now(),
  };
  rooms.set(roomId, room);
  playerRooms.set(p1.id, roomId);
  playerRooms.set(p2.id, roomId);
  return room;
}

function removeFromQueue(socketId: string) {
  const idx = queue.findIndex(p => p.id === socketId);
  if (idx !== -1) queue.splice(idx, 1);
}

function cleanupRoom(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  playerRooms.delete(room.player1.id);
  playerRooms.delete(room.player2.id);
  rooms.delete(roomId);
}

// ====== ELO Calculation ======
function calculateElo(winnerElo: number, loserElo: number): { winnerNew: number; loserNew: number } {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 - expectedWinner;
  return {
    winnerNew: Math.round(winnerElo + K * (1 - expectedWinner)),
    loserNew: Math.round(loserElo + K * (0 - expectedLoser)),
  };
}

// ====== Socket Handlers ======
io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  // Player searches for a match
  socket.on('search-match', (playerData: Omit<Player, 'id'>) => {
    console.log(`[SEARCH] ${socket.id} (${playerData.username}, ELO: ${playerData.elo})`);

    const player: Player = {
      id: socket.id,
      username: playerData.username || 'NeonWarrior',
      elo: playerData.elo || 1000,
      skinColor: playerData.skinColor || '#00ff66',
      skinGlowColor: playerData.skinGlowColor || '#00ff66',
      skinTrailColor: playerData.skinTrailColor || '#00ff66',
      skinEffect: playerData.skinEffect || '',
      equippedSkills: playerData.equippedSkills || ['fireball', 'iceShard', 'shadowStep'],
      petId: playerData.petId || 'neonWolf',
    };

    // Check if already in a room
    const existingRoomId = playerRooms.get(socket.id);
    if (existingRoomId) {
      socket.emit('already-in-room', { roomId: existingRoomId });
      return;
    }

    // Try to find a match
    const opponent = findMatch(player);
    if (opponent) {
      // Found a match! Remove opponent from queue
      removeFromQueue(opponent.id);

      // Create room
      const room = createRoom(player, opponent);

      // Join both players to the room
      socket.join(room.id);
      io.sockets.sockets.get(opponent.id)?.join(room.id);

      // Notify both players
      io.to(room.id).emit('match-found', {
        roomId: room.id,
        player1: {
          id: room.player1.id,
          username: room.player1.username,
          elo: room.player1.elo,
          skinColor: room.player1.skinColor,
          skinGlowColor: room.player1.skinGlowColor,
          skinTrailColor: room.player1.skinTrailColor,
          skinEffect: room.player1.skinEffect,
          equippedSkills: room.player1.equippedSkills,
          petId: room.player1.petId,
        },
        player2: {
          id: room.player2.id,
          username: room.player2.username,
          elo: room.player2.elo,
          skinColor: room.player2.skinColor,
          skinGlowColor: room.player2.skinGlowColor,
          skinTrailColor: room.player2.skinTrailColor,
          skinEffect: room.player2.skinEffect,
          equippedSkills: room.player2.equippedSkills,
          petId: room.player2.petId,
        },
      });

      console.log(`[MATCH] ${room.player1.username} vs ${room.player2.username} in ${room.id}`);

      // Start countdown
      room.countdownStart = Date.now();
      setTimeout(() => {
        if (rooms.has(room.id)) {
          room.state = 'playing';
          io.to(room.id).emit('game-start', { roomId: room.id });
          console.log(`[START] ${room.id}`);
        }
      }, 3000);
    } else {
      // Add to queue
      queue.push(player);
      socket.emit('searching', { queueSize: queue.length });
      console.log(`[QUEUE] ${player.username} waiting (queue: ${queue.length})`);
    }
  });

  // Cancel match search
  socket.on('cancel-search', () => {
    removeFromQueue(socket.id);
    console.log(`[CANCEL] ${socket.id} left queue`);
  });

  // Game state sync - relay player state to opponent
  socket.on('player-state', (state: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    health: number;
    facing: number;
    isMoving: boolean;
    isShooting: boolean;
    isDashing: boolean;
    isShielding: boolean;
    isUsingSpecial: boolean;
    grounded: boolean;
    animFrame: number;
    expression: string;
    skinColor: string;
    skinGlowColor: string;
    invincible: number;
    jumpCount: number;
  }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    // Relay to opponent only
    socket.to(roomId).emit('opponent-state', {
      ...state,
      timestamp: Date.now(),
    });
  });

  // Bullet/projectile sync
  socket.on('player-bullet', (bullet: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    color: string;
    radius: number;
    isSpecial: boolean;
  }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    socket.to(roomId).emit('opponent-bullet', bullet);
  });

  // Hit confirmation (player tells server they hit opponent)
  socket.on('player-hit', (data: { damage: number; bulletIndex?: number }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    // Relay to opponent - they verify and apply damage
    socket.to(roomId).emit('opponent-hit', data);
  });

  // Skill usage sync
  socket.on('player-skill', (data: { skillId: string; x: number; y: number; facing: number }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    socket.to(roomId).emit('opponent-skill', data);
  });

  // Player died
  socket.on('player-died', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || room.state !== 'playing') return;

    room.state = 'finished';
    const winnerId = socket.id === room.player1.id ? room.player2.id : room.player1.id;
    const winner = socket.id === room.player1.id ? room.player2 : room.player1;
    const loser = socket.id === room.player1.id ? room.player1 : room.player2;

    const eloResult = calculateElo(winner.elo, loser.elo);

    io.to(roomId).emit('game-over', {
      winnerId,
      winnerUsername: winner.username,
      loserUsername: loser.username,
      eloChange: {
        winner: eloResult.winnerNew - winner.elo,
        loser: eloResult.loserNew - loser.elo,
      },
      newElo: {
        winner: eloResult.winnerNew,
        loser: eloResult.loserNew,
      },
    });

    console.log(`[GAMEOVER] ${winner.username} beat ${loser.username} in ${roomId}`);

    // Cleanup room after 10 seconds
    setTimeout(() => cleanupRoom(roomId), 10000);
  });

  // Rematch request
  socket.on('rematch-request', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    socket.to(roomId).emit('rematch-requested');
  });

  // Rematch accept
  socket.on('rematch-accept', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    // Reset room state
    room.state = 'countdown';
    room.winner = undefined;
    room.countdownStart = Date.now();

    io.to(roomId).emit('rematch-start');

    setTimeout(() => {
      if (rooms.has(roomId)) {
        room.state = 'playing';
        io.to(roomId).emit('game-start', { roomId: roomId });
      }
    }, 3000);
  });

  // Resign
  socket.on('resign', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || room.state !== 'playing') return;

    room.state = 'finished';
    const winnerId = socket.id === room.player1.id ? room.player2.id : room.player1.id;
    const winner = socket.id === room.player1.id ? room.player2 : room.player1;
    const loser = socket.id === room.player1.id ? room.player1 : room.player2;

    const eloResult = calculateElo(winner.elo, loser.elo);

    io.to(roomId).emit('game-over', {
      winnerId,
      winnerUsername: winner.username,
      loserUsername: loser.username,
      eloChange: {
        winner: eloResult.winnerNew - winner.elo,
        loser: eloResult.loserNew - loser.elo,
      },
      newElo: {
        winner: eloResult.winnerNew,
        loser: eloResult.loserNew,
      },
      resigned: true,
    });

    setTimeout(() => cleanupRoom(roomId), 10000);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] ${socket.id}`);
    removeFromQueue(socket.id);

    const roomId = playerRooms.get(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room && room.state === 'playing') {
        // Opponent wins by disconnect
        const winnerId = socket.id === room.player1.id ? room.player2.id : room.player1.id;
        const winner = socket.id === room.player1.id ? room.player2 : room.player1;

        room.state = 'finished';
        io.to(roomId).emit('game-over', {
          winnerId,
          winnerUsername: winner.username,
          loserUsername: 'DISCONNECTED',
          eloChange: { winner: 16, loser: -16 },
          newElo: { winner: winner.elo + 16, loser: Math.max(0, (socket.id === room.player1.id ? room.player1 : room.player2).elo - 16) },
          disconnected: true,
        });

        setTimeout(() => cleanupRoom(roomId), 5000);
      } else {
        cleanupRoom(roomId);
      }
    }
  });
});

// ====== Start Server ======
httpServer.listen(PORT, () => {
  console.log(`[NEON STICKMAN] Matchmaking server running on port ${PORT}`);
  console.log(`[NEON STICKMAN] Waiting for players...`);
});
