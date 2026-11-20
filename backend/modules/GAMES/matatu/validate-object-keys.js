const validateKeys = {
    checkGameRequestKeys: function (gameRequest) {
        const requiredKeys = ['mode', 'userType', 'guestId', 'opponents'];
        const recievedKeys = Object.keys(gameRequest);
        const recievedKeysSet = new Set(recievedKeys);

        const hasAllKeys = requiredKeys.every(key => recievedKeysSet.has(key));

        if (hasAllKeys) return true;
        else return false;
    },

    checkPlayCardObjectKeys: function (gameRequest) {
       const requiredKeys = ['path', 'gameType', 'gameId', 'actionData']; 
        const recievedKeys = Object.keys(gameRequest);
        const recievedKeysSet = new Set(recievedKeys);

        const hasAllKeys = requiredKeys.every(key => recievedKeysSet.has(key));

        if (hasAllKeys) return true;
        else return false;
    }
}

module.exports = validateKeys;