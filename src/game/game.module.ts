import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game, GameSchema } from './schemas/game.schema';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
})
export class GameModule {}
