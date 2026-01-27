import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repositories/player.repository';
import { PLAYER_REPOSITORY } from './repositories/player.repository.interface';
import { MatchModule } from '../match/match.module';
import { ResultModule } from '../result/result.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    forwardRef(() => MatchModule),
    forwardRef(() => ResultModule),
  ],
  controllers: [PlayerController],
  providers: [
    PlayerService,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerRepository,
    },
  ],
  exports: [PlayerService, PLAYER_REPOSITORY],
})
export class PlayerModule {}
