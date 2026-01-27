import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';

@ApiTags('Matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  create(@Body() dto: CreateMatchDto) {
    return this.matchService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a match' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchService.delete(id);
  }
}
