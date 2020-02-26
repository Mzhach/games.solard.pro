import { PlayerType } from "../enums";

export default class PlayerDto {
    constructor(public type: PlayerType, public id: string) {
        
    }
}