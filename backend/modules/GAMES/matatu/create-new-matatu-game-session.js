const ORIGINAL_DECK = require('../../data/cards.js');
const COMPUTER_PLAYERS = ['dyn_v1', 'dyn_v2'];
let error_message;

function createNewMatatuGameSession(req, res) {
    const deck = [...ORIGINAL_DECK];
    //console.log('ORIGINAL_DECK length is', deck.length)
    //console.log('deck length is', deck.length)
   // console.log('createNewMatatuGameSession in action')
    let body = '';
    req.on('data', (chunk => body += chunk));
    req.on('end', ()=> {
        body = JSON.parse(body);
        const mode = body.mode;
        const players = body.players;
        
        if (mode === 'computer') {
            const isPlayerAvailabe = COMPUTER_PLAYERS.find((opponent) => opponent === body.players[1].name);
            console.log(isPlayerAvailabe)
            if(!isPlayerAvailabe) {
                console.log('heeeee')
                error_message = `we're unable to find a computer player named ${players[1].name} `;
                notFound(req, res);
                return;
            }
            const gameSession = {
                sessionId: createId(),
                gameType: 'matatu',
                mode: 'computer',
                status: 'active',
                players: [],
                drawPile: [],
                discardPile: [],
                topCard: '',
                currentPlayer: ''
            }
        
        
        gameSession.players.push(createPlayer('player1'));
        gameSession.players.push(createPlayer('player2'));
        
        gameSession.drawPile = shuffleCards(deck);
            console.log('gameSession.drawPile length is', gameSession.drawPile.length);
        
        for (let i = 0; i < 7; i++) {
            gameSession.players.forEach((player) => {
               const card = gameSession.drawPile.pop();
                player.hand.push(card);
            });
        }

       // console.log(gameSession.players[0].hand)
       // console.log(gameSession.players[1].hand)

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(gameSession));
        }
    });
}

function createPlayer(playerName) {
    return {
        name: playerName,
        id: createId(),
        hand: []
    }
}

function createId() {
    let id = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    return Number(id).toString(36);
}


function shuffleCards(deck) {
    const pile = [];

    while (deck.length !== 0) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck.splice(randomIndex, 1)[0];
        card.id = `card${deck.length + 1}`;
        pile.push(card);
    }
    return pile;
}

function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end(error_message);
}


module.exports = createNewMatatuGameSession;