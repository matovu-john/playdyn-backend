function notFound(message) {
   return function(req, res) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end(message);
   }
}

module.exports = notFound;