const Thing = require('../models/thing');
const Dimension = require('../models/dimension')

module.exports = (io, socket, onlineUsers) => {

  socket.on('New thing', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let thingCount = dimension.things.length;
        let newThing = new Thing();
        newThing.elemId = `thing${thingCount}`;
        newThing.pos = data.pos;
        newThing.color = '#557062';
        newThing.save().then((thing) => {
          dimension.things.push(thing._id);
          dimension.save().then(() => {
            io.to(data.dimensionName).emit('New thing', {
              elemId : thing.elemId,
              _id : thing._id,
              pos : thing.pos,
              color : thing.color,
              width : thing.width,
              height : thing.height
            });
          })
        })
      }
    })
  })

  socket.on('Save new position of thing', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update thing position', data);
    Thing.findById(data.docId).then((thing) => {
      if(thing){
        thing.pos = data.newPos;
        thing.save();
      }
    })
  });

  socket.on('Save new color of thing', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update thing color', data);
    Thing.findById(data.docId).then((thing) => {
      if(thing){
        thing.color = data.color;
        thing.save();
      }
    })
  })

  socket.on('Save new size of thing', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update thing size', data);
    Thing.findById(data.docId).then((thing) => {
      if(thing){
        thing.pos.x = data.pos.left;
        thing.pos.y = data.pos.top;
        thing.width = data.size.width;
        thing.height = data.size.height;
        thing.save();
      }
    })
  })

  socket.on('Thing got deleted', data => {
    socket.broadcast.to(socket.dimension).emit("Thing got deleted", data);
    Thing.findByIdAndDelete(data.docId, () => {
      Dimension.findOne({name : socket.dimension}).then((dimension) => {
        let thisThingIndex = dimension.things.indexOf(data.docId);
        dimension.things.splice(thisThingIndex, 1);
        dimension.save();
      })
    })
  })



}
