import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { IPlayerRepository } from './player.repository.interface';

@Injectable()
export class PlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly repository: Repository<Player>,
  ) {}

  async create(data: Partial<Player>): Promise<Player> {
    const player = this.repository.create(data);
    return this.repository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Player | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByNickname(nickname: string): Promise<Player | null> {
    return this.repository.findOne({ where: { nickname } });
  }

  async update(id: string, data: Partial<Player>): Promise<Player | null> {
    const player = await this.findById(id);
    if (!player) return null;

    Object.assign(player, data);
    return this.repository.save(player);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
