module.exports = (io, socket, onlineUsers) => {
  socket.on('new user', (user) => {
    let newUser = {
      id : socket.id,
      loc : user
    }
    onlineUsers[socket.id] = newUser;
    io.emit('new user', newUser);
  });
  socket.on('load online users', () => {
    io.emit('load online users', onlineUsers);
  })
}
