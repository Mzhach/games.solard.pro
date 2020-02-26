import { PlayerType } from "../enums";

export default class GameStartDto {
    constructor(public currentPlayer: PlayerType) {
        
    }
}