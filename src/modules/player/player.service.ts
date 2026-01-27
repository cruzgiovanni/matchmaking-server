import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { IPlayerRepository } from './repositories/player.repository.interface';
import { PLAYER_REPOSITORY } from './repositories/player.repository.interface';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async create(dto: CreatePlayerDto): Promise<Player> {
    const existing = await this.playerRepository.findByNickname(dto.nickname);
    if (existing) {
      throw new ConflictException('Nickname is already in use');
    }

    return this.playerRepository.create(dto);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  async findById(id: string): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async update(id: string, dto: UpdatePlayerDto): Promise<Player> {
    if (dto.nickname) {
      const existing = await this.playerRepository.findByNickname(dto.nickname);
      if (existing && existing.id !== id) {
        throw new ConflictException('Nickname is already in use');
      }
    }

    const player = await this.playerRepository.update(id, dto);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.playerRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Player not found');
    }
  }
}
