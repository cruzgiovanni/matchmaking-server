import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { PlayerService } from '../player/player.service';
import { ConnectPlayerDto } from './dto/connect-player.dto';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly playerService: PlayerService,
  ) {}

  @Post('connect')
  async connect(@Body() dto: ConnectPlayerDto) {
    const player = await this.playerService.findById(dto.playerId);
    const opponent = this.matchmakingService.connect(player);

    if (opponent) {
      return {
        matched: true,
        player: {
          id: player.id,
          nickname: player.nickname,
          level: player.level,
        },
        opponent: {
          id: opponent.id,
          nickname: opponent.nickname,
          level: opponent.level,
        },
      };
    }

    return {
      matched: false,
      player: { id: player.id, nickname: player.nickname, level: player.level },
      message: 'Waiting for opponent...',
    };
  }

  @Delete('disconnect')
  async disconnect(@Body() dto: ConnectPlayerDto) {
    const player = await this.playerService.findById(dto.playerId);
    this.matchmakingService.disconnect(player);

    return {
      disconnected: true,
      player: { id: player.id, nickname: player.nickname },
    };
  }

  @Get('queue')
  getQueueStatus() {
    return this.matchmakingService.getQueueStatus();
  }

  @Get('queue/:level')
  getPlayersInQueue(@Param('level', ParseIntPipe) level: number) {
    const players = this.matchmakingService.getPlayersInQueue(level);
    return players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      level: p.level,
    }));
  }
}
