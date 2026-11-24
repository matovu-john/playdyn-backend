const gameSessions = [];
const validateKeys = require('./validate-object-keys.js');
const validatePlayers = require('./validate-players.js');
const Game = require('./matatu-game-constructor.js');
const {sendMessage} = require('../../helpers/send-message-thru-websocket.js');
const dynV1 = require('./bots/dyn-v1.js');

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

    makeAmove: function (gameRequest) {
        const isValidGame = gameSessions.some(game => game.id === gameRequest.gameId);
        const senderId = gameRequest.actionData.playerId;
        
        if (!isValidGame) {
            const message = {ok: false, message: 'invalid game session ID'}
            sendMessage(senderId, message);
            return;
        }

        const actionData = gameRequest.actionData;
        

        const game = gameSessions.find(game => game.id === gameRequest.gameId);
        const isGameActive = game.status !== 'finished' ? true : false;
        if (!isGameActive) {
            sendMessage(senderId, {ok: false, reason: 'This Game was discontinued', playerId: actionData.playerId});
            return;
        }

        let response = game.approveMove(gameRequest.actionData);
        const humanPlayers = game.players.filter(p =>  p.type === 'human');

        humanPlayers.forEach((player) => {
            console.log('playerId is', player.id, 'response is', response)
            sendMessage(player.id, response);
        });       

        if (response.nextPlayerId === 'dyn_v1') {
            const dynzMove = dynV1(game);
            
            this.makeAmove(dynzMove);
        }
    }
}

module.exports = {gameManager, gameSessions}