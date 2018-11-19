const Dimension = require('../models/dimension');

module.exports = (io, socket, onlineUsers) => {

  socket.on('Background Change', (data) => {
    Dimension.findOne({name : data.dimensionName}).then(dimension => {
      dimension.background = data.newBackground;
      dimension.save().then(() => {
        socket.broadcast.to(data.dimensionName).emit('Background Change', data.newBackground);
      });
    })
  })

}
