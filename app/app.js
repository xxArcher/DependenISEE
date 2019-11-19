const http = require('http');
const controller = require('./controller.js');

const hostname = '127.0.0.1';
const port = 3000;
var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    var result = controller.readYL(repoPath);
    res.end(result+'Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



