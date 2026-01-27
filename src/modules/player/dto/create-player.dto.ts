import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(3)
  nickname: string;

  @IsInt()
  @Min(1)
  @Max(10)
  level: number;
}
