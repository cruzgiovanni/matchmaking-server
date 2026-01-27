import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateMatchDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  playerIds: string[];
}
