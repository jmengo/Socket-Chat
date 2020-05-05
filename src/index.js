const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// Server Config
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = 3000

// Serve Static Files
app.use(express.json())
app.use(express.static('public'))

let count = 0

io.on('connection', (socket) => {
  console.log('new socket connection')
  socket.emit('countUpdated', count)
  socket.on('increment', () => {
    count++
    socket.emit('countUpdated', count)
  })
})

server.listen(port, () => {
  console.log('App is up on port 3000')
})