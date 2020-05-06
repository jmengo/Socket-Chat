const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users')
const {
  capitalizeFirstLetter
} = require('./utils/misc')

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
  socket.on('join', (options, callback) => {
    const {
      error,
      user
    } = addUser({
      id: socket.id,
      ...options
    })
    if (error) return callback(error)
    socket.join(user.room)
    socket.emit('sendMessage', generateMessage('Welcome!'))
    socket.broadcast.to(user.room).emit('sendMessage', generateMessage(`${capitalizeFirstLetter(user.username)} has joined the room!`, capitalizeFirstLetter(user.username)))
    callback()
  })

  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id)
    if (user) {
      io.to(user.room).emit('sendMessage', generateMessage(msg), capitalizeFirstLetter(user.username))
      callback()
    }
  })

  socket.on('shareLocation', (lat, lon, callback) => {
    const user = getUser(socket.id)
    if (user) {
      io.to(user.room).emit('sendLocationMessage', generateLocationMessage(lat, lon), capitalizeFirstLetter(user.username))
      callback()
    }
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('sendMessage', generateMessage(`${capitalizeFirstLetter(user.username)} has left the room`), capitalizeFirstLetter(user.username))
    }
  })
})

server.listen(port, () => {
  console.log('App is up on port 3000')
})