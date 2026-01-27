import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMatchRepository } from './repositories/match.repository.interface';
import { MATCH_REPOSITORY } from './repositories/match.repository.interface';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @Inject(MATCH_REPOSITORY)
    private readonly matchRepository: IMatchRepository,
  ) {}

  async create(dto: CreateMatchDto): Promise<Match> {
    return this.matchRepository.create(dto.playerIds);
  }

  async findAll(): Promise<Match[]> {
    return this.matchRepository.findAll();
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async findByPlayerId(playerId: string): Promise<Match[]> {
    return this.matchRepository.findByPlayerId(playerId);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.matchRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Match not found');
    }
  }

  async deleteByPlayerId(playerId: string): Promise<number> {
    return this.matchRepository.softDeleteByPlayerId(playerId);
  }
}
