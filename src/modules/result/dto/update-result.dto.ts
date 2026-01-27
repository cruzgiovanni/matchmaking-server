import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateResultDto {
  @IsUUID()
  @IsOptional()
  winnerId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  score?: string;
}
