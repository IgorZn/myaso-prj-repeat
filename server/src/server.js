const http = require('http')
const app = require('./app')
const { loadPlanetsData } = require('../src/models/planets.model')

const server = http.createServer(app)
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const URL = 'http://'

async function startServer() {
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server running on ${PORT} port, URL: ${URL}${HOST}:${PORT}`)
    })
}

startServer();

console.log(PORT)