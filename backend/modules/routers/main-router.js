const gamesRouter = require('./Game-routes/games-router.js')

let api;

function mainRouter(req) {

    if (req.method === 'OPTIONS') {
        return function(req, res) {
            res.writeHead(204);
            res.end();
        }
    }
    
   const url = new URL(req.url, `http://${req.headers.host}`);
    api = url.pathname;
    console.log(api)
    
    switch(api) {
        case '/api/game-sessions':
            return gamesRouter(req);

        case '/':
            return notFound;

        default:
            return notFound;
    }
}


function notFound(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Our server does not recognize the route "${api}". Please check again to make sure it wasn't a typo.`);
}

module.exports = mainRouter;