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
import { PlayerService } from './player.service';
import { MatchService } from '../match/match.service';
import { ResultService } from '../result/result.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService,
    private readonly resultService: ResultService,
  ) {}

  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.playerService.create(dto);
  }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerService.findById(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlayerDto) {
    return this.playerService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerService.delete(id);
  }

  @Get(':id/matches')
  async getPlayerMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    return this.matchService.findByPlayerId(id);
  }

  @Delete(':id/matches')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlayerMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    const matches = await this.matchService.findByPlayerId(id);
    const matchIds = matches.map((m) => m.id);

    await this.resultService.deleteByMatchIds(matchIds);
    await this.matchService.deleteByPlayerId(id);
  }

  @Get(':id/matches/lost')
  async getPlayerLostMatches(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.findById(id);
    return this.resultService.findLossesByPlayerId(id);
  }
}
