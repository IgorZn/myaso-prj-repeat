const fs = require('fs')
const https = require('https');
const path = require("path");
const express = require('express');

const INDEX = path.join(__dirname, 'public', 'index.html');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const URL = 'https://'

app.get('/secret', (req, res) => {
    return res.send('<h1>Your personal secret is 43!</h1>')
})

app.get('/', (req, res) => {
    res.sendFile(INDEX)
})


https.createServer({
    key: fs.readFileSync('key.pm'),
    cert: fs.readFileSync('cert.pm'),
}, app).listen(PORT, () => {
    console.log(`Stated on port ${URL + HOST + ':' + PORT}...`)
})