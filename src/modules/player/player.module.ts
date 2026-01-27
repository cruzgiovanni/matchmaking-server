import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repositories/player.repository';
import { PLAYER_REPOSITORY } from './repositories/player.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
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
