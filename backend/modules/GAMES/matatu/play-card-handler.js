const {sessionIds, gameSessions} = require('./matatu-sessions-handler.js');
const failed = require('../../helpers/failed.js');

function playCardHandler(gameData) {
    const gameId = gameData.gameId;
    
    const isValidGame = sessionIds.find(id => id === gameId);
    if (!isValidGame) return failed(`${gameId} is not a valid game id under the current game sessions`);

    const game = gameSessions.find(game => game.id ===  gameId);
    if (!game) return failed(`No game found with id ${gameId} although the id was valid. This is strange`);

    const playerId = gameData.playerId;
    
    const isValidPlayer = game.players.find(player => player.id === playerId);
    if (!isValidPlayer) return failed(`No player with id ${playerId} is found in this game session`);

    const isCurrentPlayer = game.currentPlayerId === playerId ? true : false;
    if (!isCurrentPlayer) return failed('it is not yet your turn');

    const playerHand = game.players.find(player => player.id === playerId).hand;
    const cardId = gameData.cardId;
    
    const isValidCard = playerHand.find(card => card.id === cardId);
    if (!isValidCard) return failed(`You dont have a card is an id ${cardId} in your hand`);

    const topCard = game.topCard;

    if (topCard === '') {
       // const playedCard = playerHand.find(card => card.id === cardId);
        const cardIndex = playerHand.findIndex(card => card.id === cardId);
        if (cardIndex === -1) return failed(`You dont have a card is an id ${cardId} in your hand although the card passed the valid check. This is strange`);

        const playedCard = playerHand.splice(cardIndex, 1);
        game.topCard = playedCard[0];
        game.currentPlayerId = game.players.find(player => player.id !== playerId);

        return {
            status: 'success',
            gameData: {
                currentPlayerId: game.currentPlayerId.id,
                topCard: game.topCard
            }
        }
    }

    const playedCard = playerHand.find(card => card.id === cardId);

    if (playedCard.rank === topCard.rank || playedCard.suit === topCard.suit) {
        const cardIndex = playerHand.findIndex(card => card.id === cardId);
        if (cardIndex === -1) return failed(`You dont have a card is an id ${cardId} in your hand although the card passed the valid check. This is strange`);

        game.topCard = playedCard[0];
        game.currentPlayerId = game.players.find(player => player.id !== playerId);

        return {
            status: 'success',
            gameData: {
                currentPlayerId: game.currentPlayerId.id,
                topCard: game.topCard,
            }
    }
    
}
    }

module.exports = playCardHandler;
