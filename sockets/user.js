module.exports = (io, socket, onlineUsers) => {

  socket.on('New User', (data) => {
    if(!onlineUsers[data.dimension]){
      onlineUsers[data.dimension] = {};
    }
    onlineUsers[data.dimension][socket.id] = {
      socket : socket.id,
      avatar : data.avatar,
      pos : data.pos,
      voiceId : data.voiceId
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
  });

  socket.on("User changed dimension", d => {
    if(onlineUsers[socket.dimension]){
      let thisUser = onlineUsers[socket.dimension][socket.id];
      //First leave the dimension
      if(onlineUsers[socket.dimension]){
        socket.leave(socket.dimension);
        io.to(socket.dimension).emit('User Left', onlineUsers[socket.dimension][socket.id]);
        delete onlineUsers[socket.dimension][socket.id];
      }
      //Now join the new one
      if(!onlineUsers[d.newDimension]){
        onlineUsers[d.newDimension] = {};
      }
      onlineUsers[d.newDimension][socket.id] = {
        socket : socket.id,
        avatar : d.avatar,
        pos : d.pos
      }
      socket.dimension = d.newDimension;
      socket.join(d.newDimension);
      socket.broadcast.to(d.newDimension).emit('New User', onlineUsers[d.newDimension][socket.id])
    }
  })

  socket.on("User left dimension", d => {
    if(onlineUsers[socket.dimension]){
      io.to(socket.dimension).emit('User Left', onlineUsers[socket.dimension][socket.id]);
      delete onlineUsers[socket.dimension][socket.id];
    }
  })

}
