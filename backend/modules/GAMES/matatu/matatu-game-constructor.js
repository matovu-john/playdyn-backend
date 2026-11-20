const DECK = require('../../data/cards.js');

class Game{
    constructor(playersObjects) {
        this.players = playersObjects.map((player) => {
            player.hand = [];
            return player;
        });
        this.id = null;
        this.deck = [...DECK];
        this.drawPile = [];
        this.discardPile = [];
        this.cutter = null;
        this.topCard = null;
        this.newSuit = null;
        this.direction = 1;
        this.currentPlayerIndex = 0;
        this.currentPlayerId = this.players[0].id;
        this.pendingPick2 = false;
        this.canChangeSuit = false;
       // this.canDraw = false;
        this.winner = null;
        this.winReason = null;
        this.status = 'playing';
        this.start();
    } 

    start() {
       this.drawPile = this.shuffle(this.deck);
       this.id = `matatu-${Math.floor(Math.random() * 1000)}`;
        this.dealCards();
       this.cutter = this.drawPile.pop();
    }

    shuffle(deck) {
        const shuffledDeck = [];

        while (deck.length !== 0) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            const card = deck.splice(randomIndex, 1)[0];
            card.id = `card${deck.length + 1}`;
           // console.log(card)
            shuffledDeck.push(card);
        }
        return shuffledDeck;   
    }

    dealCards() {
        for (let i = 0; i < 7; i++) {
            this.players.forEach((player) => {
               const card = this.drawPile.pop();
                player.hand.push(card);
            });
        }  
    }

    approveMove(actionData) {
        const givenPlayerId = actionData.playerId;
        const cardId = actionData.cardId;
        
        if (!this.isValidPlayer(givenPlayerId)) return {ok: false, reason: `player with id-${givenPlayerId} does not exist in this game session`}
        if (!this.isTheirTurn(givenPlayerId)) return {ok: false, reason: 'it is not yet your turn'}
        
        if (actionData.action === 'play-card'){       
            const hand = this.players[this.players.findIndex(p => p.id === givenPlayerId)].hand;
            const card = hand.find(c => c.id === cardId);
           // console.log('recieved card', card)
        
            if (!this.isTheirCard(hand, cardId)) return {ok: false, reason: 'You dont own this card'}
            if (!this.isValidMove(card)) {
                this.newSuit = null;
                return {ok: false, reason: 'Invalid move'}
            }
        
            this.playCard(hand, cardId);

            //console.log('this.discardPile', this.discardPile)
            console.log('topCard', this.topCard)

            if (this.isHandEmpty(hand)) {
                this.endGame(this.currentPlayerId, 'Emptied first');
                return {
                    ok: true, 
                    gameOver: true,
                    winnerId: this.winner,
                    winReason: this.winReason
                }
            }
        
            if (this.isCutter(card)) {
                const handsTotal = this.calculateHandsTotal();
                const isDraw = handsTotal.some(p => p.total === handsTotal[0].total);
                if (isDraw) {
                    this.endGame(null, 'No body won. it is a draw');
                    return {
                        ok: true, 
                        isGameOver: true,
                        winnerId: this.winner,
                        reason: this.winReason
                    }
                } else {
                    const winner = handsTotal.reduce((lowestPlayer, currentPlayer) => {
                        if (lowestPlayer.total < currentPlayer.total) return lowestPlayer;
                        return currentPlayer;
                    });
                }
                
            }

            if (this.is2()) {
                this.pendingPick2 = true;
                return {ok: true, action: 'play-card', cardId: actionData.cardId}
            }

            if (this.isA()) {
                this.canChangeSuit = true;
                return {ok: true, action: 'play-card', action2: 'change-suit', playerId: givenPlayerId, cardId: actionData.cardId}
            }

            return {ok: true, playedBy: givenPlayerId, action: 'play-card', cardId: cardId}
        }
        else if (actionData.action === 'draw-card') {
            console.log(actionData)
            const isValidCard = this.drawPile.some(c => c.id == actionData.cardId);
            if (!isValidCard) return {ok: false, reason: 'Invalid card requested to be drawn'}
            
            const hand = this.players.find(p => p.id === actionData.playerId).hand;
           // console.log('hand is ', hand)
            hand.unshift(this.drawPile.pop());

            return {ok: true, playerId: actionData.playerId, action: 'draw-card', cardId: actionData.cardId}
        }
        else if (actionData.action === 'change-suit') {
            if (!this.canChangeSuit) return {ok: false, reason: 'Cant change suit before playing an ace'}
            
            const newSuit = actionData.newSuit;
            const isValidSuit = ["♠", "♣", "♥", "♦"].includes(newSuit);
            if (isValidSuit) {
                this.newSuit = newSuit;
                return {ok: true, action: 'approve-suit'}
            } else {
               return {ok: false, reason: 'Invalid suit'} 
            }
        }
    }

    isValidPlayer(givenPlayerId) {
        if (this.players.some(p => p.id === givenPlayerId)) return true;
    }

    isTheirTurn(givenPlayerId) {
        if (this.currentPlayerId === givenPlayerId) return true;
    }

    isTheirCard(hand, cardId) {
        if (hand.some(c => c.id === cardId)) return true;
    }
    
    isValidMove(card) {
        if (this.topCard === null) return true;
        if (this.newSuit !== null) {
            if (card.rank === 'A' || this.newSuit === card.suit || this.topCard.rank === card.rank) return true;
        }
        if (!this.pendingPick2 && card.rank === 2) return {ok: false, reason: `You must pick 2 cards or play a 2`}
        if (card.rank === 'A' || this.topCard.suit === card.suit || this.topCard.rank === card.rank) return true;
    }

    playCard(hand, cardId) {
        const card = hand.splice(hand.findIndex(c => c.id === cardId), 1)[0];
        this.topCard = card;
        this.discardPile.unshift(card);
    }

    isHandEmpty(hand) {
        if (hand.length === 0) return true;
    }

    isCutter(card) {
        if (card.suit === this.cutter.suit && card.rank === 7) return true;
    }

    is2() {
        if (this.topCard.rank === 2) return true;
    }

    isA() {
        if (this.topCard.rank === 'A') return true;
    }

    calculateHandsTotal() {
        const playersHandsTotal = this.players.map((player) => {
            const total = player.hand.reduce((runningTotal, card) => card.value + runningTotal, 0);
            return {playerId: player.id, total: total}
        });
        return playersHandsTotal;
    }

    endGame(winnerId, reason) {
        this.winner = winnerId;
        this.winReason = reason;
        this.gameOver = true;
        this.status = 'finished';
    }
}

module.exports = Game;