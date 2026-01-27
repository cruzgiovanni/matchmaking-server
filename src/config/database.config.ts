import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER || 'matchmaking',
  password: process.env.DATABASE_PASSWORD || 'matchmaking123',
  database: process.env.DATABASE_NAME || 'matchmaking',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});
