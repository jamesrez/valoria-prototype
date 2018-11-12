const Dimension = require('../models/dimension');
const Door = require('../models/Door');
const Thing = require('../models/thing');

module.exports = (io, socket, onlineUsers) => {

  socket.on('New door', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let doorCount = dimension.things.length;
        let newDoorThing = new Thing();
        newDoorThing.elemId = `door${doorCount}`;
        newDoorThing.pos = data.pos;
        newDoorThing.width = 300;
        newDoorThing.height = 300;
        newDoorThing.kind = 'door';
        newDoorThing.color = '#557062';
        newDoorThing.save().then((doorThing) => {
          let newDoor = new Door();
          newDoor.thingId = doorThing._id;
          dimension.things.push(doorThing._id);
          dimension.save().then(() => {
            newDoor.save().then((door) => {
              io.to(data.dimensionName).emit('New door', {
                thing : doorThing,
                door : door
              });
            })
          })
        })
      }
    })
  })


  socket.on('Set door dimension', data => {
    Door.findById(data.docId).then((door) => {
      Dimension.findOne({name : data.doorDimension}).then((dimension)=>{
        door.dimension = `/dimension/${data.doorDimension}/door`
        door.save().then((door) => {
          let doorData = {
            elemId : data.elemId,
            doorDimension : dimension ? `/dimension/${data.doorDimension}/door` : false
          }
          io.to(data.dimensionName).emit('Set door dimension', doorData);
        })
      })
    })
  })

  socket.on('Delete door', docId => {
    Door.findByIdAndDelete(docId).then(() => {

    });
  })

}
