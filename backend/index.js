const PORT = process.env.PORT || 5000;
const createServer = require('./servers/server.js');
const setupWebSocket = require('./servers/setup-websocket.js');
const server = createServer();
setupWebSocket(server);

server.listen(PORT, '0.0.0.0', () => console.log('server listening at port ', PORT));