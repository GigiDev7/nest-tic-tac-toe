import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Game } from './schemas/game.schema';
import { GamePlayBodyDto } from './dto/game.dto';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async saveGame(board: string[], email: string) {
    const existingGame = await this.gameModel.findOne({
      user: email,
      winner: '',
    });
    if (!existingGame) {
      await this.gameModel.create({ board, user: email, winner: '' });
    } else {
      existingGame.board = board;
      await existingGame.save();
    }
  }

  async getGame(email: string) {
    const gameBoard = await this.gameModel.findOne({ user: email, winner: '' });
    return { board: gameBoard?.board };
  }

  async postGame(gameData: GamePlayBodyDto, difficulty: string, email: string) {
    if (gameData.winner) {
      const existingGame = await this.gameModel.findOne({
        user: email,
        winner: '',
      });
      if (existingGame) {
        existingGame.board = gameData.board;
        existingGame.winner = gameData.winner;
        await existingGame.save();
      } else {
        await this.gameModel.create({
          board: gameData.board,
          winner: gameData.winner,
          user: email,
        });
      }
      return {};
    }

    const boardAfterMove = this.makeMove(gameData.board, difficulty);

    if (this.checkWinner(boardAfterMove)) {
      const existingGame = await this.gameModel.findOne({
        user: email,
        winner: '',
      });
      if (existingGame) {
        existingGame.board = boardAfterMove;
        existingGame.winner = 'AI';
        await existingGame.save();
      } else {
        await this.gameModel.create({
          board: boardAfterMove,
          winner: 'AI',
          user: email,
        });
      }
      return { board: boardAfterMove, winner: 'AI' };
    }

    if (this.isBoardFull(boardAfterMove)) {
      const existingGame = await this.gameModel.findOne({
        user: email,
        winner: '',
      });
      if (existingGame) {
        existingGame.board = boardAfterMove;
        existingGame.winner = 'Draw';
        await existingGame.save();
      } else {
        await this.gameModel.create({
          board: boardAfterMove,
          winner: 'Draw',
          user: email,
        });
      }
      return { board: boardAfterMove, winner: 'Draw' };
    }

    return { board: boardAfterMove };
  }

  checkWinner(board: string[]) {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  isBoardFull(board: string[]) {
    return board.every((val) => val !== '');
  }

  makeMove(board: string[], difficulty: string) {
    if (difficulty === 'easy') {
      return this.makeRandomMove(board);
    } else if (difficulty === 'medium') {
      return this.makeMediumMove(board);
    } else if (difficulty === 'hard') {
      return this.makeHardMove(board);
    }
  }

  makeRandomMove(board: string[]) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) emptyCells.push(i);
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCellIndex = emptyCells[randomIndex];
      const newBoard = [...board];
      newBoard[randomCellIndex] = 'O';

      return newBoard;
    }
  }

  makeMediumMove(board: string[]) {
    //check if bot can win
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';

        if (this.checkWinner(newBoard)) {
          return newBoard;
        }
      }
    }

    //check if the player can win and block it
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';

        if (this.checkWinner(newBoard)) {
          newBoard[i] = 'O';
          return newBoard;
        }
      }
    }

    return this.makeRandomMove(board);
  }

  makeHardMove(board: string[]) {
    const bestMove = this.minimax(board, 'O');
    const newBoard = [...board];
    newBoard[bestMove.index] = 'O';

    return newBoard;
  }

  minimax(board: string[], player: string) {
    if (this.checkWinner(board) === 'O') {
      return { score: 10 };
    } else if (this.checkWinner(board) === 'X') {
      return { score: -10 };
    } else if (this.isBoardFull(board)) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const move: any = {};
        move.index = i;

        board[i] = player;

        if (player === 'O') {
          const result = this.minimax(board, 'X');
          move.score = result.score;
        } else {
          const result = this.minimax(board, 'O');
          move.score = result.score;
        }

        board[i] = '';

        moves.push(move);
      }
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }

    return bestMove;
  }
}
