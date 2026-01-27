import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Player } from '../player/entities/player.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchRepository } from './repositories/match.repository';
import { MATCH_REPOSITORY } from './repositories/match.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Player])],
  controllers: [MatchController],
  providers: [
    MatchService,
    {
      provide: MATCH_REPOSITORY,
      useClass: MatchRepository,
    },
  ],
  exports: [MatchService, MATCH_REPOSITORY],
})
export class MatchModule {}
