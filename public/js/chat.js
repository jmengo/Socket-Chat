const socket = io()

// Elements
const $messageForm = document.getElementById("messageForm")
const $messageFormInput = $messageForm.elements.message
const $messageFormButton = $messageForm.querySelector("button")
const $messages = document.getElementById("messages")
const $shareLocationButton = document.getElementById("shareLocation")

// Templates
const $messageTemplate = document.getElementById("messageTemplate")
const $locationTemplate = document.getElementById("locationTemplate")

socket.on('sendMessage', (message) => {
  const html = Mustache.render($messageTemplate.innerHTML, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('sendLocationMessage', (message) => {
  const html = Mustache.render($locationTemplate.innerHTML, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

// Live Messaging
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  // disable form until previous message has been sent
  $messageFormButton.setAttribute('disabled', 'disabled')

  text = e.target.elements.message.value
  socket.emit('sendMessage', text, (error) => {
    // Enable form
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }
    console.log('Message delivered!')
  })
})

// Location Sharing
document.getElementById('shareLocation').addEventListener('click', () => {
  loc = navigator.geolocation
  if (!loc) {
    return alert('Browser does not support geolocation')
  }
  $shareLocationButton.setAttribute('disabled', 'disabled')
  loc.getCurrentPosition((position) => {
    const {
      coords
    } = position
    const {
      latitude,
      longitude
    } = coords
    socket.emit('shareLocation', latitude, longitude, () => {
      $shareLocationButton.removeAttribute('disabled')
      console.log('Location shared!')
    })
  })
})