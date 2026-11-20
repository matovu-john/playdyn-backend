const {gameManager} = require('./game-manager.js');

function createNewMatatuGameSession(req, res) {
    let body = '';
    req.on('data', (chunk => body += chunk));
    req.on('end', ()=> {
        const gameReq = JSON.parse(body);
        const response = gameManager.getGameId(gameReq);

        if (response.ok) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(response.gameId);
            console.log('sent', response.gameId)
        } else {
            
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(response.reason);
        }

    });
}

module.exports = createNewMatatuGameSession;