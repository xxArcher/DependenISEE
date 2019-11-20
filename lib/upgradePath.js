/* 
 * This is the code to get the dependencies that need to be upgraded given a JavaScript repository
 */
'use strict'

const express = require('express');
const port = 8000;
const app = express();
const npmCheck = require('npm-check');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));

const jsonLocation = './input/';
const fs = require("fs");
const getPackage = require('get-repo-package-json');

let result;


async function retrieveJson(url) {
    return new Promise(function (resolve, reject) {
        try {
            getPackage(url).then((result) => {
                createFile(result).then(() => {
                    processPackage().then((result) => {
                        resolve(result);
                    })
                })
            })

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });




}

function processPackage() {
    return new Promise(function (resolve, reject) {

        let options = { "cwd": jsonLocation };
        npmCheck(options)
            .then(currentState => {
                // console.log(currentState.get('packages'));
                // console.log("Results successfully printed!");
                result = currentState.get('packages');
                resolve(result);
            })
            .catch(err => {
                console.log(err); 
                resolve(err)
            });
    });




}

function createFile(repoObject) {
    return new Promise(function (resolve, reject) {
        fs.writeFile("./input/package.json", JSON.stringify(repoObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("File has been created");
                resolve();
            }
        });
    });

}

app.get('/', (req, res) => {
    res.status = 200;
    res.send('Hello World!');

});

app.post('/upgrade', (req, res) => {
    res.status = 200;
    console.log(req.query);
    retrieveJson(req.query.repo).then(()=> {
        console.log(result);
        res.send(result);
    })
});

app.listen(port, () => {
    console.log('Example app listening on port 8000!')
});






