const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')
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
const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

// Serve Static Files
app.use(express.static(publicPath))

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
    let users = getUsersInRoom(user.room)
    users.forEach((user) => {
      user.username = capitalizeFirstLetter(user.username)
    })
    console.log(users)
    io.to(user.room).emit('updateRoom', {
      room: user.room,
      users
    })
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
      let users = getUsersInRoom(user.room)
      users.forEach((user) => {
        user.username = capitalizeFirstLetter(user.username)
      })
      io.to(user.room).emit('updateRoom', {
        room: user.room,
        users
      })
      io.to(user.room).emit('sendMessage', generateMessage(`${capitalizeFirstLetter(user.username)} has left the room`), capitalizeFirstLetter(user.username))
    }
  })
})

server.listen(port, () => {
  console.log(`App is up on port ${port}`)
})