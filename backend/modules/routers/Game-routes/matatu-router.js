const createNewMatatuGameSession = require('../../GAMES/matatu/create-new-matatu-game-session.js');

function matatuRouter(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
   // console.log(req.method)
    
    if (req.method === 'POST') {
        const action = url.searchParams.get('action');
       // console.log(action)

        switch(action) {
            case 'create-game':
                return createNewMatatuGameSession;
            case 'play-card':
                return playCard();
        }
    }


    return notFound;
}

function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Nothing here yet');
}

module.exports = matatuRouter;