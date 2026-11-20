function sendMessage(message, socket) {
   // console.log('message', message)
    socket.send(JSON.stringify(message));
}

module.exports = sendMessage;  