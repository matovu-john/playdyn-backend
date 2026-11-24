const bots = [
    {name: 'Dyn Rookie', id: 'dyn_v1', type: 'computer'},
    {name: 'Dyn Kali', id: 'dyn_v2', type: 'computer'}
];

function  validatePlayers(gameRequest) {
    const players = [];
    
    if (gameRequest.userType === 'guest') {
        if (!gameRequest.guestId || gameRequest.guestId.trim().length < 5)
            return {ok: false, reason: `"${gameRequest.guestId}" is not a valide guestId`}
        
        players.push({name: 'Guest', id: gameRequest.guestId, type: 'human'});
    } else {
        //the userType must only be either guest or returningUser. Anything else..
        //stop executing and return an error immidiately.
        console.log('Invalid userType')
        return {ok: false, reason: `${gameRequest.userType} is not a valide userType Playdyn recognise`}
    }

    for (let opponent of gameRequest.opponents) {
        if (opponent.type === 'computer') {
            const computerOpponent = bots.find(bot => bot.id === opponent.id);

            if (!computerOpponent) return {ok: false, reason: `No computer player found with id "${opponent.id}"`}
            players.push(computerOpponent);
        }
        else {
            return {ok: false, reason: `We don't support "${opponent.type}" playerType yet`}
        }
    }

    return {ok: true, players: players}
}
module.exports = validatePlayers;