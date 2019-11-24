const http = require('http');
const controller = require('./controller.js');
const express = require('express')
const app = express()
const port = 3000


var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
app.get('/', (req, res) => res.send('Hello World!'))

/* must call readrepo before calling other end point*/
app.get('/readrepo', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readRepo(repoPath).then((result)=> {
        res.send(result);
    })
});

app.get('/readjs', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readPkgJson(repoPath).then(result => {
        res.send(result);
    })
});

app.get('/readyarnlock', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readYL(repoPath).then(result => {

        res.send(result);
    })
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))