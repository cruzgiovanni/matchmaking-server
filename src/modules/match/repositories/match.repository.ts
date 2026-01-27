import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { IMatchRepository } from './match.repository.interface';
import { Player } from '../../player/entities/player.entity';

@Injectable()
export class MatchRepository implements IMatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly repository: Repository<Match>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(playerIds: string[]): Promise<Match> {
    const players = await this.playerRepository.findByIds(playerIds);
    const match = this.repository.create({ players });
    return this.repository.save(match);
  }

  async findAll(): Promise<Match[]> {
    return this.repository.find({
      relations: ['players', 'results'],
    });
  }

  async findById(id: string): Promise<Match | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['players', 'results'],
    });
  }

  async findByPlayerId(playerId: string): Promise<Match[]> {
    return this.repository
      .createQueryBuilder('match')
      .innerJoin('match.players', 'player', 'player.id = :playerId', {
        playerId,
      })
      .leftJoinAndSelect('match.players', 'allPlayers')
      .leftJoinAndSelect('match.results', 'results')
      .getMany();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async softDeleteByPlayerId(playerId: string): Promise<number> {
    const matches = await this.findByPlayerId(playerId);
    if (matches.length === 0) return 0;

    const matchIds = matches.map((m) => m.id);
    const result = await this.repository.softDelete(matchIds);
    return result.affected ?? 0;
  }
}
