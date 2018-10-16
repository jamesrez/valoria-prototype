module.exports = (io, socket, onlineUsers) => {

  socket.on('New User', (data) => {
    onlineUsers[socket.id] = {
      socket : socket.id,
      avatar : data.avatar,
      pos : data.pos
    }
    socket.broadcast.emit('New User', onlineUsers[socket.id])
  })
  socket.on('Load Online Users', () => {
    socket.emit('Load Online Users', onlineUsers);
  })
  socket.on('User has moved', (data) => {
    if(onlineUsers[socket.id]){
      onlineUsers[socket.id].pos = data.newPos;
      socket.broadcast.emit('User has moved', {
        socket : socket.id,
        newPos : data.newPos,
        scrollDir : data.scrollDir
      })
    }
  });
  socket.on('User stopped scrolling', () => {
    socket.broadcast.emit('User stopped scrolling', onlineUsers[socket.id]);
  });

}
