const socket = io()

socket.on('sendMessage', (msg) => {
  console.log(msg)
})

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault()
  text = e.target.elements.message.value
  socket.emit('sendMessage', text)
})