import * as $ from 'jquery';

$(document).ready(() => {
    $('#create-channel-btn').click(() => {
        $.ajax({
            type: 'POST',
            url: `http://localhost:3000/tictactoe/game/create`,
            data: null
        })
        .done((data) => {
            window.location.href = `http://localhost:3000/tictactoe/game/${data.gameId}`;
        })
        .fail(($xhr) => {
            debugger;
        });
    });
});