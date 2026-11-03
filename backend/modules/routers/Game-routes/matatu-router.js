const notFound = require('../../helpers/not-found.js');
const createNewMatatuGameSession = require('../../GAMES/matatu/create-new-matatu-game-session.js');
const { sendGameSession } = require('../../GAMES/matatu/matatu-sessions-handler.js');

function matatuRouter(req) {
    const url = new URL(req.url,`http://${req.headers.host}`);
    const method = req.method;
    const action = url.searchParams.get('action');
    const id = url.searchParams.get('id');

    if (method === 'POST') {
        switch (action) {
        case 'create-game':
            return createNewMatatuGameSession;

        case 'play-card':
            return playCard();

        default:
            return notFound(`"${action}" is not a valid action Playdyn recognizes under the POST method`);
        }
    }

    if (method === 'GET') {
        switch (action) {
        case 'get-game':
            return sendGameSession(id);

        default:
            return notFound(`"${action}" is not a valid action Playdyn recognizes under the GET method`);
        }
    }

    return notFound(`Playdyn currently does not support the ${method} method.`);
}

module.exports = matatuRouter;
