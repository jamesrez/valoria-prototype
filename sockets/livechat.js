const Dimension = require('../models/dimension');
const Livechat = require('../models/livechat');
const Thing = require('../models/thing');

module.exports = (io, socket, onlineUsers) => {

  socket.on('New livechat', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let newLivechatThing = new Thing();
        newLivechatThing.elemId = `livechat${dimension.thingCount}`;
        newLivechatThing.pos = data.pos;
        newLivechatThing.width = 300;
        newLivechatThing.height = 300;
        newLivechatThing.kind = 'livechat';
        newLivechatThing.color = '#557062';
        newLivechatThing.save().then((livechatThing) => {
          let newLivechat = new Livechat();
          newLivechat.thingId = livechatThing._id;
          dimension.things.push(livechatThing._id);
          dimension.thingCount++;
          dimension.save().then(() => {
            newLivechat.save().then((livechat) => {
              io.to(data.dimensionName).emit('New livechat', {
                thing : livechatThing,
                livechat : livechat
              });
            })
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
  });

  socket.on('Save new color of livechat', (data) => {
    console.log(data);
  })

  socket.on('Delete livechat', docId => {
    Livechat.findByIdAndDelete(docId).then(() => {

    });
  })

}
