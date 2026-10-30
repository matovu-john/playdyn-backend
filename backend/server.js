const http = require('http');
const PORT = process.env.PORT || 5000;
const mainRouter = require('./modules/routers/main-router.js');
const cards = require('./modules/data/cards.js');
//console.log(cards);

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

   // console.log(req.url, req.method);
    
    const handler = mainRouter(req);
    handler(req, res);
    //console.log(handler)
});

server.listen(PORT, '0.0.0.0', ()=> console.log('server listening at port ', PORT));