import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { MatchService } from '../match/match.service';
import { ResultService } from '../result/result.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@ApiTags('Players')
@Controller('players')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService,
    private readonly resultService: ResultService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new player' })
  create(@Body() dto: CreatePlayerDto) {
    return this.playerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all players' })
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a player' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlayerDto) {
    return this.playerService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a player' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerService.delete(id);
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get all matches for a player' })
  async getPlayerMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    return this.matchService.findByPlayerId(id);
  }

  @Delete(':id/matches')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all matches for a player' })
  async deletePlayerMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    const matches = await this.matchService.findByPlayerId(id);
    const matchIds = matches.map((m) => m.id);

    await this.resultService.deleteByMatchIds(matchIds);
    await this.matchService.deleteByPlayerId(id);
  }

  @Get(':id/matches/lost')
  @ApiOperation({ summary: 'Get all lost matches for a player' })
  async getPlayerLostMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    return this.resultService.findLossesByPlayerId(id);
  }
}
