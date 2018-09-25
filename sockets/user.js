module.exports = (io, socket, onlineUsers) => {
  socket.on('New User', (pos) => {
    let newUser = {
      id : socket.id,
      x : pos.x,
      y : pos.y
    }
    onlineUsers[socket.id] = newUser;
    socket.broadcast.emit('New User', newUser);
  });
  socket.on('Load Online Users', () => {
    socket.emit('Load Online Users', onlineUsers);
  })
}
