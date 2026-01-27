import { Result } from '../entities/result.entity';

export interface IResultRepository {
  create(data: Partial<Result>): Promise<Result>;
  findAll(): Promise<Result[]>;
  findById(id: string): Promise<Result | null>;
  findByMatchId(matchId: string): Promise<Result[]>;
  findByPlayerId(playerId: string): Promise<Result[]>;
  findLossesByPlayerId(playerId: string): Promise<Result[]>;
  update(id: string, data: Partial<Result>): Promise<Result | null>;
  delete(id: string): Promise<boolean>;
  softDeleteByMatchIds(matchIds: string[]): Promise<number>;
}

export const RESULT_REPOSITORY = Symbol('RESULT_REPOSITORY');
