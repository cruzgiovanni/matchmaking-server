import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Result } from '../entities/result.entity';
import { IResultRepository } from './result.repository.interface';

@Injectable()
export class ResultRepository implements IResultRepository {
  constructor(
    @InjectRepository(Result)
    private readonly repository: Repository<Result>,
  ) {}

  async create(data: Partial<Result>): Promise<Result> {
    const result = this.repository.create(data);
    return this.repository.save(result);
  }

  async findAll(): Promise<Result[]> {
    return this.repository.find({
      relations: ['match', 'winner'],
    });
  }

  async findById(id: string): Promise<Result | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['match', 'winner'],
    });
  }

  async findByMatchId(matchId: string): Promise<Result[]> {
    return this.repository.find({
      where: { matchId },
      relations: ['match', 'winner'],
    });
  }

  async findByPlayerId(playerId: string): Promise<Result[]> {
    return this.repository
      .createQueryBuilder('result')
      .innerJoin('result.match', 'match')
      .innerJoin('match.players', 'player', 'player.id = :playerId', {
        playerId,
      })
      .leftJoinAndSelect('result.match', 'm')
      .leftJoinAndSelect('result.winner', 'winner')
      .leftJoinAndSelect('m.players', 'allPlayers')
      .getMany();
  }

  async findLossesByPlayerId(playerId: string): Promise<Result[]> {
    return this.repository
      .createQueryBuilder('result')
      .innerJoin('result.match', 'match')
      .innerJoin('match.players', 'player', 'player.id = :playerId', {
        playerId,
      })
      .leftJoinAndSelect('result.match', 'm')
      .leftJoinAndSelect('result.winner', 'winner')
      .leftJoinAndSelect('m.players', 'allPlayers')
      .where('result.winnerId != :playerId', { playerId })
      .getMany();
  }

  async update(id: string, data: Partial<Result>): Promise<Result | null> {
    const result = await this.findById(id);
    if (!result) return null;

    Object.assign(result, data);
    return this.repository.save(result);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async softDeleteByMatchIds(matchIds: string[]): Promise<number> {
    if (matchIds.length === 0) return 0;

    const result = await this.repository.softDelete({ matchId: In(matchIds) });
    return result.affected ?? 0;
  }
}
