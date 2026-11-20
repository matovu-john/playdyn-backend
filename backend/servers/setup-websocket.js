const webSocketLibrary = require('ws');
const ServerConstructor = webSocketLibrary.WebSocketServer;

const router = require('../modules/routers/websocket-router.js');

function setupWebSocket(server) {
        
    const ws_server = new ServerConstructor({
        server
    });

    ws_server.on('connection', (socket) => {
        console.log('John successfully connected via websocket for the first time ever');

        socket.on('message', (message) => {
           // console.log(socket)
           // console.log('John sent:', JSON.parse(message));
            router(JSON.parse(message), socket);
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

module.exports = setupWebSocket;
