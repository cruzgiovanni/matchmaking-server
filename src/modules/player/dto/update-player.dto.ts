import {
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nickname?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;
}
