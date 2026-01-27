import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MatchmakingService } from './matchmaking.service';
import { PlayerService } from '../player/player.service';
import { ConnectPlayerDto } from './dto/connect-player.dto';

@ApiTags('Matchmaking')
@Controller('matchmaking')
export class MatchmakingController {
  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly playerService: PlayerService,
  ) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a player to the matchmaking queue' })
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
  @ApiOperation({ summary: 'Disconnect a player from the matchmaking queue' })
  async disconnect(@Body() dto: ConnectPlayerDto) {
    const player = await this.playerService.findById(dto.playerId);
    this.matchmakingService.disconnect(player);

    return {
      disconnected: true,
      player: { id: player.id, nickname: player.nickname },
    };
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get the current queue status' })
  getQueueStatus() {
    return this.matchmakingService.getQueueStatus();
  }

  @Get('queue/:level')
  @ApiOperation({ summary: 'Get players waiting in a specific level queue' })
  getPlayersInQueue(@Param('level', ParseIntPipe) level: number) {
    const players = this.matchmakingService.getPlayersInQueue(level);
    return players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      level: p.level,
    }));
  }
}
