import { Match } from '../entities/match.entity';

export interface IMatchRepository {
  create(playerIds: string[]): Promise<Match>;
  findAll(): Promise<Match[]>;
  findById(id: string): Promise<Match | null>;
  findByPlayerId(playerId: string): Promise<Match[]>;
  delete(id: string): Promise<boolean>;
  softDeleteByPlayerId(playerId: string): Promise<number>;
}

export const MATCH_REPOSITORY = Symbol('MATCH_REPOSITORY');
