const connectedUsers = new Map();

function sendMessage(id, message) {
   // console.log('message', message)
    const socket = connectedUsers.get(id);
 console.log('recieved id is', id)
    socket.send(JSON.stringify(message));
}

module.exports = {sendMessage, connectedUsers};  