import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IResultRepository } from './repositories/result.repository.interface';
import { RESULT_REPOSITORY } from './repositories/result.repository.interface';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultService {
  constructor(
    @Inject(RESULT_REPOSITORY)
    private readonly resultRepository: IResultRepository,
  ) {}

  async create(dto: CreateResultDto): Promise<Result> {
    return this.resultRepository.create(dto);
  }

  async findAll(): Promise<Result[]> {
    return this.resultRepository.findAll();
  }

  async findById(id: string): Promise<Result> {
    const result = await this.resultRepository.findById(id);
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return result;
  }

  async findByMatchId(matchId: string): Promise<Result[]> {
    return this.resultRepository.findByMatchId(matchId);
  }

  async findByPlayerId(playerId: string): Promise<Result[]> {
    return this.resultRepository.findByPlayerId(playerId);
  }

  async findLossesByPlayerId(playerId: string): Promise<Result[]> {
    return this.resultRepository.findLossesByPlayerId(playerId);
  }

  async update(id: string, dto: UpdateResultDto): Promise<Result> {
    const result = await this.resultRepository.update(id, dto);
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.resultRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Result not found');
    }
  }

  async deleteByMatchIds(matchIds: string[]): Promise<number> {
    return this.resultRepository.softDeleteByMatchIds(matchIds);
  }
}
