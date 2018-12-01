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
    socket.broadcast.to(socket.dimension).emit('Object has moved', data);
  });

  socket.on('Save new position of object', (newObject) => {
    if(newObject){
      Dimension.findOne({"name" : socket.dimension.toLowerCase()}).then((dimension) => {
        dimension.environmentObjects.find( object => object.elemId === newObject.elemId).pos = newObject.pos;
        dimension.save();
      })
    }
  });

  socket.on("Object got deleted", objectElemId => {
    if(socket.dimension){
      socket.broadcast.to(socket.dimension).emit('Object got deleted', objectElemId);
      Dimension.findOne({name : socket.dimension.toLowerCase()}).then((dimension) => {
        thisObject = dimension.environmentObjects.find( object => objectElemId === objectElemId);
        thisObjectIndex = dimension.environmentObjects.indexOf(thisObject);
        dimension.environmentObjects.splice(thisObjectIndex, 1);
        dimension.save();
      })
    }
  })

}
