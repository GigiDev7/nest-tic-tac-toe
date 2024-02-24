import { IsNotEmpty, IsString } from 'class-validator';

export class GamePlayBodyDto {
  @IsNotEmpty()
  board: string[];

  @IsString()
  winner: string;
}

export class GamePlayQueryDto {
  @IsString()
  difficulty: string;
}
