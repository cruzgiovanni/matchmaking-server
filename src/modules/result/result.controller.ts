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
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@ApiTags('Results')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new result' })
  create(@Body() dto: CreateResultDto) {
    return this.resultService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all results' })
  findAll() {
    return this.resultService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a result by ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a result' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateResultDto) {
    return this.resultService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a result' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultService.delete(id);
  }
}
