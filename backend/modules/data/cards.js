const ranks = [2, 3, 4,5,6,7,8,9,10,'K','J','Q','A'];
const suits = {
    hearts: '\u2665',
    diamonds: '\u2666',
    clubs: '\u2663',
    spades: '\u2660'
}

function getValue(rank) {
    let value;
    switch(rank) {
        case 2:
            value = 20;
            break;

        case 'K':
            value = 13;
            break;

        case 'J':
            value = 11;
            break;

        case 'Q':
            value = 12;
            break;

        case 'A':
            value = 14;
            break;

            default:
            value = rank;
            break;
    }

    return value;
}

const cards = [];

ranks.forEach((rank) => {
    let value = getValue(rank);
    
   for (let suit of Object.values(suits)) {
       const card = {
           rank: rank,
           suit: suit,
           value: value
       }
       cards.push(card);
   }
});

console.log('DECK LENGTH IS', cards.length)

module.exports = cards;