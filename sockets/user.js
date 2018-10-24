module.exports = (io, socket, onlineUsers) => {

  socket.on('New User', (data) => {
    if(!onlineUsers[data.dimension]){
      onlineUsers[data.dimension] = {};
    }
    onlineUsers[data.dimension][socket.id] = {
      socket : socket.id,
      avatar : data.avatar,
      pos : data.pos
    }
    socket["dimension"] = data.dimension;
    socket.join(data.dimension);
    socket.broadcast.to(data.dimension).emit('New User', onlineUsers[data.dimension][socket.id])
  })
  socket.on('Load Online Users', (dimensionName) => {
    socket.emit('Load Online Users', onlineUsers[dimensionName]);
  })
  socket.on('User has moved', (data) => {
    if(onlineUsers[data.dimension]){
      if(onlineUsers[data.dimension][socket.id]){
        onlineUsers[data.dimension][socket.id].pos = data.newPos;
        socket.broadcast.to(data.dimension).emit('User has moved', {
          socket : socket.id,
          newPos : data.newPos,
          scrollDir : data.scrollDir
        })
      }
    }
  });
  socket.on('User stopped scrolling', (dimensionName) => {
    if(onlineUsers[dimensionName]){
      if(onlineUsers[dimensionName][socket.id]){
        socket.broadcast.to(dimensionName).emit('User stopped scrolling', onlineUsers[dimensionName][socket.id]);
      }
    }
  });
  socket.on('User has changed avatar', data => {
    if(onlineUsers[data.dimension]){
      if(onlineUsers[data.dimension][socket.id]){
        onlineUsers[data.dimension][socket.id].avatar = data.newAvatar;
        socket.broadcast.to(data.dimension).emit('User has changed avatar', {
          socket : socket.id,
          newAvatar : data.newAvatar
        })
      }
    }
  })

}
