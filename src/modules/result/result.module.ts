import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { ResultRepository } from './repositories/result.repository';
import { RESULT_REPOSITORY } from './repositories/result.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  controllers: [ResultController],
  providers: [
    ResultService,
    {
      provide: RESULT_REPOSITORY,
      useClass: ResultRepository,
    },
  ],
  exports: [ResultService, RESULT_REPOSITORY],
})
export class ResultModule {}
