import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateResultDto {
  @IsUUID()
  matchId: string;

  @IsUUID()
  winnerId: string;

  @IsString()
  @IsNotEmpty()
  score: string;
}
