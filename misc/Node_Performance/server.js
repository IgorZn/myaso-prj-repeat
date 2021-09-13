/*
https://pm2.keymetrics.io/docs/usage/process-management/

Delete
To stop and delete an application:

$ pm2 delete api
To delete them all:

$ pm2 delete all
* */

const express = require('express');

const app = express();

function delay(duration){
    const startTime = new Date();
    while (Date.now() - startTime < duration){
        // wait
    }
}

app.get('/', (req, res) => {
    res.send(`Root ${process.pid}`)
})

app.get('/timer', (req, res) => {
    delay(9000)
    res.send(`Timer ${process.pid}`)
})

console.log('Start server...')
console.log(`Worker started...${process.pid}`)
app.listen(3000);