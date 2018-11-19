const Thing = require('../models/thing');
const Dimension = require('../models/dimension')
const TextElem = require('../models/text');


module.exports = (io, socket, onlineUsers) => {

  socket.on('New thing', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let newThing = new Thing();
        newThing.elemId = `${data.kind}${dimension.thingCount}`;
        newThing.pos = data.pos;
        newThing.color = '#557062';
        newThing.width = 100;
        newThing.height = 100;
        newThing.kind = data.kind;
        newThing.save().then((thing) => {
          dimension.things.push(thing._id);
          dimension.thingCount++;
          dimension.save().then(() => {
            io.to(data.dimensionName).emit('New thing', thing);
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
  });

  socket.on("Set thing image", (data) => {
    socket.broadcast.to(socket.dimension).emit('Set thing image', data);
    Thing.findById(data.thingId).then((thing) => {
      if(thing){
        thing.image = data.image;
        thing.save();
      }
    })
  });

  socket.on("Set thing video", (data) => {
    socket.broadcast.to(socket.dimension).emit('Set thing video', data);
    Thing.findById(data.thingId).then((thing) => {
      if(thing){
        thing.video = data.video;
        thing.save();
      }
    })
  })

  socket.on('Thing got deleted', data => {
    socket.broadcast.to(socket.dimension).emit("Thing got deleted", data);
    Thing.findByIdAndDelete(data.docId, (err, thing) => {
      Dimension.findOne({name : socket.dimension}).then((dimension) => {
        if(dimension){
          if(thing.texts){
            thing.texts.forEach((textId) => {
              TextElem.findByIdAndDelete(textId).then(() => {
                let thisTextIndex = dimension.texts.indexOf(textId);
                dimension.texts.splice(thisTextIndex, 1);
              })
            })
          }
          let thisThingIndex = dimension.things.indexOf(data.docId);
          dimension.things.splice(thisThingIndex, 1);
          dimension.save();
        }
      })
    })
  })

}
