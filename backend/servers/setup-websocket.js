const webSocketLibrary = require('ws');
const ServerConstructor = webSocketLibrary.WebSocketServer;

const router = require('../modules/routers/websocket-router.js');
const {connectedUsers} = require('../modules/helpers/send-message-thru-websocket.js');

function setupWebSocket(server) {
        
    const ws_server = new ServerConstructor({
        server
    });

    ws_server.on('connection', (socket) => {
        console.log('John successfully connected via websocket for the first time ever');

        socket.on('message', (message) => {
            message = JSON.parse(message);
           // console.log(message)
            if (message.type === 'storeUser') {
                connectedUsers.set(message.userId, socket);
                return;
            }
           // console.log('John sent:', JSON.parse(message));
            router(message, socket);
            //console.log(response)
        }
        );

        socket.on('close', () => {
            console.log('John disconnected from the server');
        }
        );

    }
    );

    return ws_server;
}

module.exports = {setupWebSocket}
