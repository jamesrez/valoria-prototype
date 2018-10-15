module.exports = (io, socket, onlineUsers) => {

  socket.on('New Image', image => {
    io.emit('New Image', image);
  })

}
