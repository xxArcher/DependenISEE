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
let sizeTokens;

/*
 * Retrieve the information of dependencies when given an url to a repo
 */
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

/*
 * Iterates through input package.json and returns information about dependencies 
 */
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
/*
 * Create a new package.json file in input folder
 */
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

/*
 * runs bundle-phobia command on list of library names and write it into output.txt then return the tokenized 
 array of contents in output.txt
 */
const exec = require('child_process').exec;
function retrieveSizes(libraries) {

    return new Promise(function (resolve, reject) {
        let command = "bundle-phobia ";
        let outputLoc = " > output.txt";
        let child;
        // console.log(libraries);
        for (const lib of libraries) {
            console.log(lib);
            command += lib + " ";
        }

        command += outputLoc;
        // console.log(command);
        child = exec(command,
            function (error, stdout, stderr) {
                // console.log('stdout: ' + stdout);
                // console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                // let textByLine;
                let text = fs.readFileSync("output.txt").toString('utf-8');
                sizeTokens = text.split(" ");
                console.log(sizeTokens);
                resolve(sizeTokens);
            });

    });

}

// app.get('/', (req, res) => {
//     res.status = 200;
//     res.send('Hello World!');

// });

/*
 * Retrieve the information of all package.json libraries
 */
app.post('/upgrade', (req, res) => {
    res.status = 200;
    console.log(req.query);
    retrieveJson(req.query.repo).then(()=> {
        console.log(result);
        res.send(result);
    })
});

/*
 * Retrieve the size information of a list of libraries 
 */
app.post('/size', (req, res) => {
    res.status = 200;
    // console.log(req.query.dep);
    retrieveSizes(JSON.parse(req.query.dep)).then(() => {
        console.log(sizeTokens);
        res.send(sizeTokens);
    })
});

app.listen(port, () => {
    console.log('Example app listening on port 8000!')
});




