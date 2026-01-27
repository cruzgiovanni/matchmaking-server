import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PLAYER_REPOSITORY } from './repositories/player.repository.interface';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: any;

  const mockPlayer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nickname: 'TestPlayer',
    level: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNickname: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: PLAYER_REPOSITORY, useValue: repository },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  describe('create', () => {
    it('should create a player', async () => {
      repository.findByNickname.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPlayer);

      const result = await service.create({ nickname: 'TestPlayer', level: 5 });

      expect(result).toEqual(mockPlayer);
    });

    it('should throw ConflictException if nickname exists', async () => {
      repository.findByNickname.mockResolvedValue(mockPlayer);

      await expect(
        service.create({ nickname: 'TestPlayer', level: 5 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      repository.findAll.mockResolvedValue([mockPlayer]);

      const result = await service.findAll();

      expect(result).toEqual([mockPlayer]);
    });
  });

  describe('findById', () => {
    it('should return a player', async () => {
      repository.findById.mockResolvedValue(mockPlayer);

      const result = await service.findById(mockPlayer.id);

      expect(result).toEqual(mockPlayer);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      repository.findByNickname.mockResolvedValue(null);
      repository.update.mockResolvedValue({ ...mockPlayer, level: 7 });

      const result = await service.update(mockPlayer.id, { level: 7 });

      expect(result.level).toBe(7);
    });
  });

  describe('delete', () => {
    it('should delete a player', async () => {
      repository.delete.mockResolvedValue(true);

      await expect(service.delete(mockPlayer.id)).resolves.toBeUndefined();
    });
  });
});
