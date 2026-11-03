const notFound = require('../../helpers/not-found.js');
const sessionIds = [];
const gameSessions = [];

function sendGameSession(id) {
    const ids = new Set(sessionIds);
    const isValid = ids.has(id);
    if (isValid) {
        const game = gameSessions.find(game => game.id === id);
        if (!game)
            return notFound(`No game session found with id ${id} r\n\r\n #The sessionId was among the session ids but when it came to finding the game with that id, it returned nothing. ...THIS IS STRANGE... `);

        return function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(game));
        }
    } else {
        console.log(sessionIds, gameSessions)
        return notFound(` Your id "${id}" is not a valid id under matatu session ids. r\n\r\n #This happened probably because the id has expired or you were testing to see what it does if you request for n id that does not exist`);
    }
}

module.exports = {
    sessionIds,
    gameSessions,
    sendGameSession
};
