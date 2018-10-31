const Dimension = require('../models/dimension');
const Livechat = require('../models/livechat');

module.exports = (io, socket, onlineUsers) => {

  socket.on('New livechat', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let livechatCount = dimension.livechats.length;
        let newLivechat = new Livechat();
        newLivechat.elemId = `livechat${livechatCount}`;
        newLivechat.pos = data.pos;
        newLivechat.save().then((livechat) => {
          dimension.livechats.push(livechat._id);
          dimension.save().then(() => {
            io.to(data.dimensionName).emit('New livechat', {
              elemId : livechat.elemId,
              docId : livechat._id
            });
          })
        })
      }
    })
  })

  socket.on('Send message', (message) => {
    io.to(message.dimensionName).emit('New message', message);
    Livechat.findById(message.docId).then((livechat) => {
      if(livechat){
        livechat.messages.push({
          sender : message.sender,
          text : message.content
        })
        livechat.save();
      }
    })
  });

  socket.on('Save new position of livechat', (data) => {
    Livechat.findById(data.docId).then((livechat) => {
      if(livechat){
        livechat.pos = data.newPos;
        livechat.save();
      }
    })
  })

}
