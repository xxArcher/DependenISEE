/* 
 * This is the code to get the dependencies that need to be upgraded given a JavaScript repository
 */
'use strict'

const express = require('express')
const app = express();
const npmCheck = require('npm-check');

const jsonLocation = './input/';
const fs = require("fs");
const getPackage = require('get-repo-package-json')


async function retrieveJson(url) {
    try {
        let repoJson = await getPackage(url);
        await createFile(repoJson);
        await processPackage();
        
    } catch (error) {
        console.log(error);
    }

}

function processPackage(){
    let options = { "cwd": jsonLocation };
    npmCheck(options)
        .then(currentState => {
            console.log(currentState.get('packages'));
            console.log("Results successfully printed!");
            res.send(currentState.get('packages'));
        },
            error => console.log(error)
        );
}

function createFile(repoObject){
    fs.writeFile("./package.json", JSON.stringify(repoObject, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
}

// retrieveJson('https://github.com/cpsc410-shrug/visual-studio-code/branches');


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/upgrade', (req, res) => {
    retrieveJson('https://github.com/cpsc410-shrug/visual-studio-code/branches');
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});






