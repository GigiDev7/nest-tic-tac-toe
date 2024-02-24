import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GamePlayBodyDto, GamePlayQueryDto } from './dto/game.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

interface ExtendedRequest extends Request {
  user?: string;
}

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard)
  @Get()
  getGame(@Req() request: ExtendedRequest) {
    return this.gameService.getGame(request.user);
  }

  @UseGuards(AuthGuard)
  @Post()
  postGame(
    @Body() body: GamePlayBodyDto,
    @Query() query: GamePlayQueryDto,
    @Req() request: ExtendedRequest,
  ) {
    return this.gameService.postGame(body, query.difficulty, request.user);
  }

  @UseGuards(AuthGuard)
  @Post('save')
  saveGame(@Body() body: { board: string[] }, @Req() request: ExtendedRequest) {
    return this.gameService.saveGame(body.board, request.user);
  }
}
