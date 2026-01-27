import { Injectable } from '@nestjs/common';
import { Player } from '../player/entities/player.entity';
import { IMatchmakingService } from './matchmaking.interface';

@Injectable()
export class MatchmakingService implements IMatchmakingService {
  private readonly queue: Map<number, Map<string, Player>> = new Map();

  constructor() {
    for (let level = 1; level <= 10; level++) {
      this.queue.set(level, new Map());
    }
  }

  connect(player: Player): Player | null {
    return this.findMatch(player);
  }

  disconnect(player: Player): void {
    const levelQueue = this.queue.get(player.level);
    if (levelQueue) {
      levelQueue.delete(player.id);
    }
  }

  findMatch(player: Player): Player | null {
    const levelQueue = this.queue.get(player.level);

    if (!levelQueue) {
      return null;
    }

    for (const [opponentId, opponent] of levelQueue) {
      if (opponentId !== player.id) {
        levelQueue.delete(opponentId);
        levelQueue.delete(player.id);
        return opponent;
      }
    }

    levelQueue.set(player.id, player);
    return null;
  }

  getQueueStatus(): Record<number, number> {
    const status: Record<number, number> = {};
    for (const [level, players] of this.queue) {
      status[level] = players.size;
    }
    return status;
  }

  getPlayersInQueue(level: number): Player[] {
    const levelQueue = this.queue.get(level);
    return levelQueue ? Array.from(levelQueue.values()) : [];
  }
}
