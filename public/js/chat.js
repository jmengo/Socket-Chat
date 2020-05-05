const socket = io()

socket.on('countUpdated', (count) => {
  console.log(`Count incremented to ${count}`)
})

document.getElementById('increment').addEventListener('click', () => {
  socket.emit('increment')
})