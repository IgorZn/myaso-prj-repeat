const express = require('express');
const app = express();
const cors = require('cors')

const planetsRouter = require('./routes/planets/planets.router')
const path = require("path");

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.static(path.join(__dirname, '..', 'public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
app.use(express.json());
app.use(planetsRouter);


module.exports = app;