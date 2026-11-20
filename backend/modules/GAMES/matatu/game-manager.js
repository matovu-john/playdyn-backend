const gameSessions = [];
const validateKeys = require('./validate-object-keys.js');
const validatePlayers = require('./validate-players.js');
const Game = require('./matatu-game-constructor.js');
const sendMessage = require('../../helpers/send-message-thru-websocket.js');

const gameManager = {
    getGameId: function (gameRequest) {
       const hasAllKeys = validateKeys.checkGameRequestKeys(gameRequest);
        if (!hasAllKeys) return {ok: false, reason: 'There are missing keys in the sent gameRequest Object'}

        const areValidPlayers = validatePlayers(gameRequest);
        if (!areValidPlayers.ok) return areValidPlayers;

        const playerObjects = areValidPlayers.players;
        const newGame = new Game(playerObjects);
        const gameId = newGame.id;
        gameSessions.push(newGame);

        return {ok: true, gameId: gameId}
    },

    makeAmove: function (gameRequest, socket) {
        const isValidGame = gameSessions.some(game => game.id === gameRequest.gameId);
        if (!isValidGame) {
            const message = {ok: false, message: 'invalid game session ID'}
            sendMessage(message, socket);
            return;
        }

        const actionData = gameRequest.actionData;
        //approve actionData.

        const game = gameSessions.find(game => game.id === gameRequest.gameId);
        const isGameActive = game.status !== 'finished' ? true : false;
        if (!isGameActive) {
            sendMessage('Game is not active', socket);
            return;
        }

        const response = game.approveMove(gameRequest.actionData);
        sendMessage(response, socket);        
    }
}

module.exports = {gameManager, gameSessions}