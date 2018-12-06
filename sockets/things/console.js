const Dimension = require('../../models/dimension');
const Thing = require('../../models/thing');
const Console = require('../../models/console');
const { exec } = require('child_process');

module.exports = (io, socket, onlineUsers) => {

  socket.on("New console", (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let newConsoleThing = new Thing();
        newConsoleThing.elemId = `console${dimension.thingCount}`;
        newConsoleThing.pos = data.pos;
        newConsoleThing.width = 500;
        newConsoleThing.height = 50;
        newConsoleThing.kind = 'console';
        newConsoleThing.color = 'rgba(0,0,0,0)';
        newConsoleThing.save().then((consoleThing) => {
          let newConsole = new Console();
          newConsole.thingId = consoleThing._id;
          dimension.things.push(consoleThing._id);
          dimension.thingCount++;
          dimension.save().then(() => {
            newConsole.save().then((thisConsole) => {
              io.to(data.dimensionName).emit('New console', {
                thing : consoleThing,
                console : thisConsole
              });
            })
          })
        })
      }
    })
  })

  socket.on('Delete console', docId => {
    Console.findByIdAndDelete(docId).then(() => {

    })
  })

}
