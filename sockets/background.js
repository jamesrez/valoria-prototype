const Dimension = require('../models/dimension');

module.exports = (io, socket, onlineUsers) => {

  socket.on('Background Change', (newBackground) => {
    Dimension.findOne({name : 'main'}).then(dimension => {
      dimension.background = newBackground;
      dimension.save().then(() => {
        socket.broadcast.emit('Background Change', newBackground);
      });
    })
  })

}
