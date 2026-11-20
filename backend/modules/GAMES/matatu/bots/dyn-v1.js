const myId = 'dyn_v1';

function dynV1(game) {
    const myHand = game.players.find(player => player.id === myId).hand;
    const topCard = game.topCard;

    const playableCards = myHand.filter(card => card.suit === topCard.suit || card.rank === topCard.rank);

    if (playableCards.length === 0) {
        
    }
}