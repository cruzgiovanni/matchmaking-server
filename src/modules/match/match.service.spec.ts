import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MatchService } from './match.service';
import { MATCH_REPOSITORY } from './repositories/match.repository.interface';

describe('MatchService', () => {
  let service: MatchService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPlayerId: jest.fn(),
    delete: jest.fn(),
    softDeleteByPlayerId: jest.fn(),
  };

  const mockMatch = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    players: [],
    results: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: MATCH_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  describe('create', () => {
    it('should create a match', async () => {
      const playerIds = ['player-1', 'player-2'];
      mockRepository.create.mockResolvedValue(mockMatch);

      const result = await service.create({ playerIds });

      expect(mockRepository.create).toHaveBeenCalledWith(playerIds);
      expect(result).toEqual(mockMatch);
    });
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      mockRepository.findAll.mockResolvedValue([mockMatch]);

      const result = await service.findAll();

      expect(result).toEqual([mockMatch]);
    });
  });

  describe('findById', () => {
    it('should return a match', async () => {
      mockRepository.findById.mockResolvedValue(mockMatch);

      const result = await service.findById(mockMatch.id);

      expect(result).toEqual(mockMatch);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByPlayerId', () => {
    it('should return matches for a player', async () => {
      mockRepository.findByPlayerId.mockResolvedValue([mockMatch]);

      const result = await service.findByPlayerId('player-1');

      expect(result).toEqual([mockMatch]);
    });
  });

  describe('delete', () => {
    it('should delete a match', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await expect(service.delete(mockMatch.id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteByPlayerId', () => {
    it('should delete matches by player id', async () => {
      mockRepository.softDeleteByPlayerId.mockResolvedValue(3);

      const result = await service.deleteByPlayerId('player-1');

      expect(result).toBe(3);
    });
  });
});
