import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GamePlayBodyDto, GamePlayQueryDto } from './dto/game.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard)
  @Get()
  getGame() {
    return this.gameService.getGame();
  }

  @UseGuards(AuthGuard)
  @Post()
  postGame(@Body() body: GamePlayBodyDto, @Query() query: GamePlayQueryDto) {
    return this.gameService.postGame(body, query.difficulty);
  }
}
