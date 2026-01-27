import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  create(data: Partial<Player>): Promise<Player>;
  findAll(): Promise<Player[]>;
  findById(id: string): Promise<Player | null>;
  findByNickname(nickname: string): Promise<Player | null>;
  update(id: string, data: Partial<Player>): Promise<Player | null>;
  delete(id: string): Promise<boolean>;
}

export const PLAYER_REPOSITORY = Symbol('PLAYER_REPOSITORY');
