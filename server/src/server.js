const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')
const { loadPlanetsData } = require('../src/models/planets.model')

const server = http.createServer(app)
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const URL = 'http://'


const MONGO_URL = 'mongodb+srv://myaso_prj:QhdiCOhl6tFVHmBW@cluster0.xm9bg.mongodb.net/myaso_db?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready...')
});

mongoose.connection.on('error', err => {
    console.error(err)
});

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server running on ${PORT} port, URL: ${URL}${HOST}:${PORT}`)
    })
}

startServer();