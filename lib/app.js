const http = require('http');
const express = require('express');
var cors = require("cors");
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const repoRouter = require('./routes/repo');
const upgradeRouter = require('./routes/upgradePath')

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/repo', repoRouter);
app.use('/upgradePath', upgradeRouter);

app.use(cors());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;