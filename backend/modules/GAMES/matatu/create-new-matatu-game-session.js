const ORIGINAL_DECK = require('../../data/cards.js');
const COMPUTER_PLAYERS = ['dyn_v1', 'dyn_v2'];
let error_message;
const { sessionIds, gameSessions } = require('./matatu-sessions-handler.js');

class Player {
    constructor(playerData) {
        this.name = playerData.name;
        this.id = playerData.id;
        this.hand = [];
    }
}

function createNewMatatuGameSession(req, res) {
    const deck = [...ORIGINAL_DECK];
    let body = '';
    req.on('data', (chunk => body += chunk));
    req.on('end', ()=> {
        body = JSON.parse(body);

        const mode = body.mode;
        const players = body.players;

        
        if (mode === 'computer') {
            const computerPlayer = players.find((player) => player.type === 'computer');
            const isBotAvailabe = COMPUTER_PLAYERS.find((bot) => bot === computerPlayer.id);
            
            if(!isBotAvailabe) {
                error_message = `we're unable to find a computer player named ${players[1].id} `;
                notFound(req, res);
                return;
            }
            
            const gameSession = {
                id: `matatu-${createId()}`,
                gameType: 'matatu',
                createdBy: body.guestId,
                mode: 'computer',
                status: 'active',
                players: [],
                drawPile: [],
                cutter: '',
                discardPile: [],
                topCard: '',
                currentPlayerId: body.guestId,
                direction: 1
            }
        
        
        gameSession.players.push({
            name: 'Guest',
            id: body.guestId,
            hand: []
        });
        gameSession.players.push({
            name: 'Dyn',
            id: 'dyn_v1',
            hand: []
        });
        
        gameSession.drawPile = shuffleCards(deck);
           // console.log('gameSession.drawPile length is', gameSession.drawPile.length);
        
        for (let i = 0; i < 7; i++) {
            gameSession.players.forEach((player) => {
               const card = gameSession.drawPile.pop();
                player.hand.push(card);
            });
        }

        gameSession.cutter = gameSession.drawPile.pop();

        sessionIds.push(gameSession.id);
        gameSessions.push(gameSession);

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(gameSession.id);
        }
    });
}

function createPlayer(playerName) {
    return {
        name: playerName,
        id: 'id-' + createId(),
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