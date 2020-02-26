import {Game} from './objects/game';
import {MoveDto, MoveResultDto} from '../../common/tictactoe/dtos';
import {GameState, CellState, PlayerType} from '../../common/tictactoe/enums'

const games: Game[] = [];

export default class GameService {
    
    private readonly _size = 3;

    public createGame(): Game {
        let game = new Game(this._size);
        games[game.id] = game;

        return game;
    }

    public move(dto: MoveDto): MoveResultDto | string {
        let game: Game = games[dto.gameId];

        if(game === undefined) {
            return 'game not found';
        }

        if(game.gameState !== GameState.INPROGRESS) {
            return 'game is over';
        }

        let currentPlayer = this.getCurrentPlayer(game);
        if(currentPlayer[0] !== dto.playerId) {
            return 'ny ti i haker'
        }

        let cell: CellState = game.cells[dto.x][dto.y];
        if(cell !== CellState.EMPTY) {
            return 'cell already used';
        }

        game.cells[dto.x][dto.y] = currentPlayer[1];
        game.gameState = this.checkGame(game);
        game.currentPlayer = game.currentPlayer === PlayerType.TIC ? PlayerType.TAC : PlayerType.TIC;

        return new MoveResultDto(dto.x, dto.y, cell, game.currentPlayer, game.gameState);
    }

    private getCurrentPlayer(game: Game) : [string, CellState] {
        switch(game.currentPlayer) {
            case PlayerType.TIC:
                return [game.ticPlayer, CellState.TIC];
            default:
                return [game.tacPlayer, CellState.TAC];
        }
    }

    private checkGame(game: Game) : GameState {
        let cellState: CellState = undefined;
        let newGameState: GameState = undefined;
        
        if (game.currentPlayer === PlayerType.TIC) {
            cellState = CellState.TIC;
            newGameState = GameState.TICWIN;
        } else {
            cellState = CellState.TAC;
            newGameState = GameState.TACWIN;
        }

        let condition = (val: CellState) => val === cellState;

        for(let x = 0; x < this._size; x++) {
            if(game.cells[x].every(condition)) {
                return newGameState;
            }
        }

        for(let y = 0; y < this._size; y++) {
            let column = [];
            for(var x = 0; x < this._size; x++) {
                column.push(game.cells[x][y]);
            }
            if(column.every(condition)) {
                return newGameState;
            }
        }

        let straightDiagonal = []
        for(let x = 0; x < this._size; x++) {
            straightDiagonal.push(game.cells[x][x]);
        }
        if(straightDiagonal.every(condition)) {
            return newGameState;
        }

        let reverseDiagonal = [];
        for(let x = 0; x < this._size; x++) {
            reverseDiagonal.push(game.cells[x][(this._size - 1) - x]);
        }
        if(reverseDiagonal.every(condition)) {
            return newGameState;
        }

        let hasEmptyCell = false;
        for(let x = 0; x < this._size; x++) {
            for(let y = 0; y < this._size; y++) {
                if(game.cells[x][y] === CellState.EMPTY) {
                    hasEmptyCell = true;
                    break;
                }
            }
            if(hasEmptyCell) {
                break;
            }
        }

        return hasEmptyCell ? GameState.INPROGRESS : GameState.DRAW;
    }
}