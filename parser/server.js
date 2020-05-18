const http = require('http');
const fs = require('fs');
const port = 8080;
const host = '127.0.0.1';
http.createServer(function (req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        if(err){
          console.error(err);
        }
        return res.end();
    });
}).listen(port, host, function () {
  console.log(`Server started listening on http://${host}:${port}`);
});