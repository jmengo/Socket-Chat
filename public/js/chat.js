const socket = io()

socket.on('sendMessage', (msg) => {
  console.log(msg)
})

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault()
  text = e.target.elements.message.value
  socket.emit('sendMessage', text)
})

document.getElementById('shareLocation').addEventListener('click', () => {
  loc = navigator.geolocation
  if (!loc) {
    return alert('Browser does not support geolocation')
  }
  loc.getCurrentPosition((position) => {
    const {
      coords
    } = position
    const {
      latitude,
      longitude
    } = coords
    socket.emit('shareLocation', latitude, longitude)
  })
})