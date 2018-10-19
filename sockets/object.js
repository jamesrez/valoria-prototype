module.exports = (io, socket, onlineUsers) => {

  socket.on('New Object', (newObject) => {
    socket.broadcast.emit('New Object', newObject);
  })

  socket.on('Object has moved', (data) => {
    socket.broadcast.emit('Object has moved', data);
  })

}
