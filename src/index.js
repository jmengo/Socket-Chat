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

io.on('connection', (socket) => {
  console.log('New Websocket connection')
  socket.emit('message', 'welcome!')
  socket.broadcast.emit('sendMessage', 'A new user has joined the chat')

  socket.on('sendMessage', (msg) => {
    io.emit('sendMessage', msg)
  })

  socket.on('shareLocation', (lat, lon) => {
    io.emit('sendMessage', `https://google.com/maps?q=${lat},${lon}`)
  })

  socket.on('disconnect', () => {
    io.emit('sendMessage', 'A user has disconnected')
  })
})

server.listen(port, () => {
  console.log('App is up on port 3000')
})