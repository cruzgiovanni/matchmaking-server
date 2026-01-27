import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ResultService } from './result.service';
import { RESULT_REPOSITORY } from './repositories/result.repository.interface';

describe('ResultService', () => {
  let service: ResultService;
  let repository: any;

  const mockResult = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    matchId: 'match-1',
    winnerId: 'player-1',
    score: '3-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByMatchId: jest.fn(),
      findByPlayerId: jest.fn(),
      findLossesByPlayerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDeleteByMatchIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultService,
        { provide: RESULT_REPOSITORY, useValue: repository },
      ],
    }).compile();

    service = module.get<ResultService>(ResultService);
  });

  describe('create', () => {
    it('should create a result', async () => {
      const dto = { matchId: 'match-1', winnerId: 'player-1', score: '3-1' };
      repository.create.mockResolvedValue(mockResult);

      const result = await service.create(dto);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all results', async () => {
      repository.findAll.mockResolvedValue([mockResult]);

      const result = await service.findAll();

      expect(result).toEqual([mockResult]);
    });
  });

  describe('findById', () => {
    it('should return a result', async () => {
      repository.findById.mockResolvedValue(mockResult);

      const result = await service.findById(mockResult.id);

      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByMatchId', () => {
    it('should return results for a match', async () => {
      repository.findByMatchId.mockResolvedValue([mockResult]);

      const result = await service.findByMatchId('match-1');

      expect(result).toEqual([mockResult]);
    });
  });

  describe('findLossesByPlayerId', () => {
    it('should return losses for a player', async () => {
      repository.findLossesByPlayerId.mockResolvedValue([mockResult]);

      const result = await service.findLossesByPlayerId('player-2');

      expect(result).toEqual([mockResult]);
    });
  });

  describe('update', () => {
    it('should update a result', async () => {
      repository.update.mockResolvedValue({ ...mockResult, score: '3-2' });

      const result = await service.update(mockResult.id, { score: '3-2' });

      expect(result.score).toBe('3-2');
    });

    it('should throw NotFoundException if not found', async () => {
      repository.update.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { score: '3-2' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a result', async () => {
      repository.delete.mockResolvedValue(true);

      await expect(service.delete(mockResult.id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if not found', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteByMatchIds', () => {
    it('should delete results by match ids', async () => {
      repository.softDeleteByMatchIds.mockResolvedValue(2);

      const result = await service.deleteByMatchIds(['match-1', 'match-2']);

      expect(result).toBe(2);
    });
  });
});
