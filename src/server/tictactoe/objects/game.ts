import {GameState, CellState, PlayerType} from '../../../common/tictactoe/enums'
import {v1 as uuid} from 'uuid';

export class Game {
    public id: string;
    public ticPlayer: string;
    public tacPlayer: string;
    public currentPlayer: PlayerType;
    public gameState: GameState;
    public cells: CellState[][];

    constructor(private _size: number) {
        this.id = uuid();
        console.log(uuid());
        this.ticPlayer = uuid();
        this.tacPlayer = uuid();
        this.currentPlayer = PlayerType.TIC;
        this.gameState = GameState.INPROGRESS;

        this.cells = [];
        for(let i = 0; i < this._size; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this._size; j++) {
                this.cells[i][j] = CellState.EMPTY;
            }
        }
    }
}