import { Player } from '../player/entities/player.entity';

export interface IMatchmakingService {
  /** Adiciona o jogador à lista de espera e tenta encontrar uma partida */
  connect(player: Player): Player | null;

  /** Remove o jogador da lista de espera (ex: desconexão ou fechamento do app) */
  disconnect(player: Player): void;

  /**
   * Busca um oponente do mesmo nível.
   * - Se encontrar, retorna o oponente e remove ambos da espera.
   * - Se não encontrar, o jogador atual entra na fila.
   */
  findMatch(player: Player): Player | null;
}

export const MATCHMAKING_SERVICE = Symbol('MATCHMAKING_SERVICE');
