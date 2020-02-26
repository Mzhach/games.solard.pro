import {PlayerType, GameState, CellState} from '../enums';

export default class MoveResultDto {
    constructor(public x: number,
        public y: number,
        public newCellState: CellState,
        public nextPlayer: PlayerType,
        public newGameState: GameState) {

    }
}