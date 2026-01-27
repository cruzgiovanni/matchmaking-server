import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { PlayerModule } from './modules/player/player.module';
import { MatchModule } from './modules/match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    PlayerModule,
    MatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
