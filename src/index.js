const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages')

// Server Config
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = 3000


// Serve Static Files
app.use(express.json())
app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('New Websocket connection')
  socket.on('join', ({
    username,
    room
  }) => {
    socket.join(room)
    socket.emit('sendMessage', generateMessage('Welcome!'))
    socket.broadcast.to(room).emit('sendMessage', generateMessage(`${username} has joined the room!`))
  })

  socket.on('sendMessage', (msg, callback) => {
    io.to('Test').emit('sendMessage', generateMessage(msg))
    callback()
  })

  socket.on('shareLocation', (lat, lon, callback) => {
    io.emit('sendLocationMessage', generateLocationMessage(lat, lon))
    callback()
  })

  socket.on('disconnect', () => {
    io.emit('sendMessage', generateMessage('A user has disconnected'))
  })
})

server.listen(port, () => {
  console.log('App is up on port 3000')
})