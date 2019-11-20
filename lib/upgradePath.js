/* 
 * This is the code to get the dependencies that need to be upgraded given a JavaScript repository
 */
const express = require('express')
const app = express();
const npmCheck = require('npm-check');

const jsonLocation = './input/';

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/upgrade', (req, res) => {
    try {
        let options = { "cwd": jsonLocation };
        npmCheck(options)
            .then(currentState => {
                console.log(currentState.get('packages'));
            },
                error => console.log(error)
            );
        console.log("Results successfully printed!");
    } catch (error) {
        console.log(error);
    }
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});





