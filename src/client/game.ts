import * as $ from 'jquery';
import * as io from 'socket.io-client'
import {Events} from '../common/tictactoe/constants';
import {PlayerDto, MoveDto, GameStartDto, MoveResultDto} from '../common/tictactoe/dtos';
import { PlayerType, GameState } from '../common/tictactoe/enums';

$(document).ready(() => {
    const gameId = window.location.href.split('/')[5];
    const socket = io('/tictactoe');

    var player: PlayerDto = null;
    socket.on(Events.CONNECTIONTOGAME, (playerDto: PlayerDto) => {
        player = playerDto;
        $('.game-cell')
            .prop('disabled', true)
            .click(function() {
                let x = $(this).data('x');
                let y = $(this).data('y');
                let moveDto = new MoveDto(gameId, x, y, player.id);
                socket.emit(Events.MOVE, moveDto);
            });
    });

    socket.on(Events.GAMESTART, (gameStartDto: GameStartDto) => {
        $('#current-player').text(gameStartDto.currentPlayer);
        $('#game-result').text('0');
        if(gameStartDto.currentPlayer === player.type) {
            $('.game-cell').prop('disabled', false);
        } else {
            $('.game-cell').prop('disabled', true);
        }
    });

    const updateGame = (moveResult: MoveResultDto) => {
        $('#current-player').text(moveResult.nextPlayer);
        $('#game-result').text(moveResult.newGameState);

        let selector = '.game-cell[data-x=' + moveResult.x + '][data-y=' + moveResult.y + ']';
        let sign = null;
        if(moveResult.nextPlayer === PlayerType.TIC) {
            sign = 'O';
        } else {
            sign = 'X';
        }
        $(selector).text(sign);
    };

    socket.on(Events.MOVED, (moveResult: MoveResultDto) => {
        updateGame(moveResult);
        if(moveResult.nextPlayer === player.type) {
            $('.game-cell:empty').prop('disabled', false);
        } else {
            $('.game-cell').prop('disabled', true);
        }
    });

    socket.on(Events.GAMEOVER, (moveResult: MoveResultDto) => {
        updateGame(moveResult);
        $('.game-cell').prop('disabled', true);

        if(moveResult.newGameState === GameState.TICWIN) {
            if(player.type === PlayerType.TIC) {
                alert('ПОБЕДА!!11!');
            } else {
                alert('ПРОИГРАЛ (999(((');
            }
        }
        if(moveResult.newGameState === GameState.TACWIN) {
            if(player.type === PlayerType.TIC) {
                alert('ПРОИГРАЛ (999(((');
            } else {
                alert('ПОБЕДА!!11!');
            }
        }
        if(moveResult.newGameState === GameState.DRAW) {
            alert('НИЧЬЯ!!1!1');
        }
    });
});