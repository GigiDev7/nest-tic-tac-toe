import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { GamePlayBodyDto, GamePlayQueryDto } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getGame() {
    return this.gameService.getGame();
  }

  @Post()
  postGame(@Body() body: GamePlayBodyDto, @Query() query: GamePlayQueryDto) {
    return this.gameService.postGame(body, query.difficulty);
  }
}
