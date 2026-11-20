const notFound = require('../../helpers/not-found.js');
const matatuRouter = require('./matatu-router.js');

function gamesRouter(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const gameType = url.searchParams.get('game-type');
   // console.log(gameType)
    
    switch(gameType) {
        case 'matatu':
            return matatuRouter(req);

        default:
            return notFound(`Playdyn does not have a game named "${gameType}". Check the value assigned to the "game-type" query parameter in the URL. That's where the problem is.r\n\r\n/games-router >> gamesRouter`);
    }
}


module.exports = gamesRouter;