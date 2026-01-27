import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from './matchmaking.service';
import { Player } from '../player/entities/player.entity';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  const createPlayer = (id: string, level: number): Player => ({
    id,
    nickname: `Player${id}`,
    level,
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchmakingService],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  describe('connect', () => {
    it('should add player to queue if no match found', () => {
      const player = createPlayer('1', 5);

      const result = service.connect(player);

      expect(result).toBeNull();
      expect(service.getPlayersInQueue(5)).toContainEqual(player);
    });

    it('should match players of same level', () => {
      const player1 = createPlayer('1', 5);
      const player2 = createPlayer('2', 5);

      service.connect(player1);
      const result = service.connect(player2);

      expect(result).toEqual(player1);
      expect(service.getPlayersInQueue(5)).toHaveLength(0);
    });

    it('should not match players of different levels', () => {
      const player1 = createPlayer('1', 5);
      const player2 = createPlayer('2', 6);

      service.connect(player1);
      const result = service.connect(player2);

      expect(result).toBeNull();
      expect(service.getPlayersInQueue(5)).toHaveLength(1);
      expect(service.getPlayersInQueue(6)).toHaveLength(1);
    });
  });

  describe('disconnect', () => {
    it('should remove player from queue', () => {
      const player = createPlayer('1', 5);
      service.connect(player);

      service.disconnect(player);

      expect(service.getPlayersInQueue(5)).toHaveLength(0);
    });
  });

  describe('getQueueStatus', () => {
    it('should return players count per level', () => {
      service.connect(createPlayer('1', 3));
      service.connect(createPlayer('2', 7));

      const status = service.getQueueStatus();

      expect(status[3]).toBe(1);
      expect(status[7]).toBe(1);
    });
  });

  describe('getPlayersInQueue', () => {
    it('should return players in specific level queue', () => {
      const player = createPlayer('1', 5);
      service.connect(player);

      const result = service.getPlayersInQueue(5);

      expect(result).toContainEqual(player);
    });

    it('should return empty array for invalid level', () => {
      const result = service.getPlayersInQueue(99);

      expect(result).toEqual([]);
    });
  });
});
