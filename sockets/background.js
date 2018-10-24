const Dimension = require('../models/dimension');

module.exports = (io, socket, onlineUsers) => {

  socket.on('Background Change', (data) => {
    Dimension.findOne({name : data.dimensionName}).then(dimension => {
      dimension.background = data.newBackground;
      dimension.save().then(() => {
        socket.broadcast.emit('Background Change', data.newBackground);
      });
    })
  })

}
