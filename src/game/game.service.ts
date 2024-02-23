import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Game } from './schemas/game.schema';
import { GamePlayBodyDto } from './dto/game.dto';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  getGame() {
    return 'Get game';
  }

  postGame(gameData: GamePlayBodyDto, difficulty: string) {
    return 'Post game';
  }
}
