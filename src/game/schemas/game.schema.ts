import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop({ type: [String], required: true })
  board: string[];

  @Prop({ required: true, type: String, default: '' })
  winner: string;

  @Prop({ required: true, type: String })
  user: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
