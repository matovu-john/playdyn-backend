const matatuRouter = require('./matatu-router.js');

function gamesRouter(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const gameType = url.searchParams.get('game-type');
   // console.log(gameType)
    
    switch(gameType) {
        case 'matatu':
            return matatuRouter(req);

        default:
            return notFound;
    }
}

function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('We do not have such game');
}

module.exports = gamesRouter;