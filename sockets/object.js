const Dimension = require('../models/dimension');

module.exports = (io, socket, onlineUsers) => {

  socket.on('New Object', (newObject) => {
    Dimension.findOne({name : newObject.dimension.toLowerCase()}).then((dimension) => {
      dimension.environmentObjects.push(newObject);
      dimension.save();
    })
    socket.broadcast.to(newObject.dimension).emit('New Object', newObject);
  })

  socket.on('Object has moved', (data) => {
    socket.broadcast.to(data.dimension).emit('Object has moved', data);
  });

  socket.on('Save new position of object', (newObject) => {
    Dimension.findOne({"name" : socket.dimension.toLowerCase()}).then((dimension) => {
      dimension.environmentObjects.find( object => object.elemId === newObject.elemId).pos = newObject.pos;
      dimension.save();
    })
  })

}
