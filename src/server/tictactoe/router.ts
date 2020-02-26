import {Request, Response, Router} from 'express';
import * as path from 'path'
import GameService from '../tictactoe/game.service';
import {Events} from '../../common/tictactoe/constants/index';
import { Socket, Namespace, Server } from 'socket.io';
import { MoveDto, MoveResultDto, PlayerDto, GameStartDto } from '../../common/tictactoe/dtos';
import { GameState, PlayerType } from '../../common/tictactoe/enums';

const router = Router();
const gameService = new GameService();
const rooms = [];

router.post('/game/create', (req: Request, res: Response) => {
    let game = gameService.createGame();
    let io: Server = req.app.get('io');
    let nsp: Namespace = io.of('/tictactoe');

    const room = {
        users: 0
    };
    
    rooms[game.id] = room;

    nsp.on(Events.CONNECTION, (socket: Socket) => {
        let roomId = `lobby-${game.id}`;
        room.users++;
        socket.join(roomId);

        if(room.users === 1) {
          socket.emit(Events.CONNECTIONTOGAME, new PlayerDto(PlayerType.TIC, game.ticPlayer));
        }
    
        if(room.users === 2) {
          socket.emit(Events.CONNECTIONTOGAME, new PlayerDto(PlayerType.TAC, game.tacPlayer));
          nsp.in(roomId).emit(Events.GAMESTART, new GameStartDto(game.currentPlayer));
        }

        socket.on(Events.MOVE, (dto: MoveDto) => {
          let moveResult = gameService.move(dto);

          if(moveResult instanceof MoveResultDto) {
            if(moveResult.newGameState !== GameState.INPROGRESS) {
              nsp.in(roomId).emit(Events.GAMEOVER, moveResult);
              return;
            }
            nsp.in(roomId).emit(Events.MOVED, moveResult);
          }
        });
      });

    res.json({gameId: game.id});
});

router.get('/game/:id', (req: Request, res: Response) => {
  let gameId = req.params['id'];
  let room = rooms[gameId];

  if (room.users >= 2) {
    res.sendStatus(403);
    return;
  }

  res.sendFile(path.join(__dirname, '../../../public', '/html', '/game.html'));
});

export { router as TicTacRouter }; 