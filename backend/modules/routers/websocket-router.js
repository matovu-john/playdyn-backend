const {gameManager} = require('../GAMES/matatu/game-manager.js');
const sendMessage = require('../helpers/send-message-thru-websocket.js');

function websocketRouter(message, socket) {
    const path = message.path;
    let errMssg;

    if (path === '/api/game-sessions') {
        const gameType = message.gameType;
    
        if (gameType === 'matatu') {
            gameManager.makeAmove(message, socket);
        } else {
            errMssg = {
                status: 'failed',
                reason: `Theres no such game on Playdyn called ${gameType}`
            }

            sendMessage(errMssg, socket);
        }
    } else {
        errMssg = {
            status: 'failed',
            reason: `Playdyn does not recognize the path ${path}`
        }

        sendMessage(errMssg, socket);
    }

    
}

module.exports = websocketRouter;