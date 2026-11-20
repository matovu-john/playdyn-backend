const http = require('http');
const mainRouter = require('../modules/routers/main-router.js');

function createServer() {
        const server = http.createServer( (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const handler = mainRouter(req);
        handler(req, res);
    }
    );
    return server;    
}

module.exports = createServer;

//server.listen(PORT, '0.0.0.0', () => console.log('server listening at port ', PORT));
