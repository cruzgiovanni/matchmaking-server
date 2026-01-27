import { IsUUID } from 'class-validator';

export class ConnectPlayerDto {
  @IsUUID()
  playerId: string;
}
