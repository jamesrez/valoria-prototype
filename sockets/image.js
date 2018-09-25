module.exports = (io, socket, onlineUsers) => {

  socket.on('New Image', image => {
    socket.emit('New Image', image);
  })

}
