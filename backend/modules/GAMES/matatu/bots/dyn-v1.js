
const myId = 'dyn_v1';

function dyn(game) {
    const myHand = game.players.find(player => player.id === myId).hand;
    const topCard = game.topCard;
    
    if (topCard === null) {
        return {
           path: '/api/game-sessions',
           gameType: 'matatu',
           gameId: game.id,
              actionData: {
               action: 'play-card',
               playerId: myId,
               cardId: myHand[0].id
              }
         }
    }
    const playableCards = myHand.filter(card => card.suit === topCard.suit || card.rank === topCard.rank || card.rank === 'A');
    
    const ace = playableCards.find(c => c.rank === 'A');
    
    console.log('i have run')
    if (ace) {
        return {
           path: '/api/game-sessions',
           gameType: 'matatu',
           gameId: game.id,
              actionData: {
               action: 'play-card',
               playerId: myId,
               cardId: ace.id
              }
         }
    }
    
    if (game.newSuit !== null) {
        console.log('newSuit is', game.newSuit)
       // playableCards.forEach(card => console.log(card))
        const card = myHand.find(c => c.suit === game.newSuit);
        console.log('card is', card)
        if (card) {
           return {
           path: '/api/game-sessions',
           gameType: 'matatu',
           gameId: game.id,
              actionData: {
               action: 'play-card',
               playerId: myId,
               cardId: card.id
              }
         } 
        } else {
            return {
           path: '/api/game-sessions',
           gameType: 'matatu',
           gameId: game.id,
              actionData: {
               action: 'draw-card',
               playerId: myId,
              }
         }
        }
    }
    if (game.awaitingSuitChange) {
        const suits = ["♠", "♣", "♥", "♦"];
        const newSuit = suits[Math.floor(Math.random() * suits.length)];
        console.log('My choosen suit is', newSuit);
        return {
           path: '/api/game-sessions',
           gameType: 'matatu',
           gameId: game.id,
              actionData: {
               action: 'change-suit',
               playerId: myId,
               newSuit: newSuit
              }
         }
    }
    if (topCard.rank === 2 && game.pendingPick2) {
        const myDog = playableCards.find(card => card.rank === 2);
        if (myDog) {
            return{
                path: '/api/game-sessions',
                gameType: 'matatu',
                gameId: game.id,
                actionData: {
                    action: 'play-card',
                    playerId: myId,
                    cardId: myDog.id
                }
            }
            
        }
        else {
            return{
                path: '/api/game-sessions',
                gameType: 'matatu',
                gameId: game.id,
                actionData: {
                    action: 'draw-card',
                    playerId: myId,
                }
            }
            
        }
    }

    if (playableCards.length === 0) {
        return{
                path: '/api/game-sessions',
                gameType: 'matatu',
                gameId: game.id,
                actionData: {
                    action: 'draw-card',
                    playerId: myId,
                }
            }
        
    }

    return{
            path: '/api/game-sessions',
            gameType: 'matatu',
            gameId: game.id,
            actionData: {
                action: 'play-card',
                playerId: myId,
                cardId: playableCards[0].id
            }
        }
}

module.exports = dyn;
