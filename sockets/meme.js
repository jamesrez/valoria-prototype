module.exports = (io, socket, onlineUsers) => {

  socket.on('New Meme', (newMeme) => {
    socket.broadcast.emit('New Meme', newMeme);
  })

  socket.on('Meme has moved', (data) => {
    socket.broadcast.emit('Meme has moved', data);
  })

}
