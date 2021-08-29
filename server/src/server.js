const http = require('http')
const app = require('./app')

const server = http.createServer(app)
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const URL = 'http://'

server.listen(PORT, () => {
    console.log(`Server running on ${PORT} port, URL: ${URL}${HOST}:${PORT}`)
})

console.log(PORT)