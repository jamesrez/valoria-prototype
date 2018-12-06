const TextElem = require('../../models/text');
const Thing = require('../../models/thing');
const Dimension = require('../../models/dimension')

module.exports = (io, socket, onlineUsers) => {

  socket.on('New text', (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){;
        let newText = new TextElem();
        newText.elemId = `text${dimension.thingCount}`;
        newText.pos = data.pos;
        newText.color = '#ffffff';
        newText.width = 150;
        newText.height = 25;
        newText.fontSize = 12;
        newText.align = 'center';
        newText.content = "Type Here"
        newText.save().then((text) => {
          dimension.texts.push(text._id);
          dimension.thingCount++;
          dimension.save().then(() => {
            io.to(data.dimensionName).emit('New text', text);
          })
        })
      }
    })
  })

  socket.on("Update text content", (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text content', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.content = data.content;
        text.save();
      }
    })
  })

  socket.on('Save new position of text', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text position', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.pos = data.newPos;
        text.save();
      }
    })
  });

  socket.on('Save new color of text', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text color', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.color = data.color;
        text.save();
      }
    })
  })

  socket.on('Save new size of text', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text size', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.pos.x = data.pos.left;
        text.pos.y = data.pos.top;
        text.width = data.size.width;
        text.height = data.size.height;
        text.save();
      }
    })
  })

  socket.on('Change text fontsize', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text fontsize', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.fontSize = data.fontSize;
        text.save();
      }
    })
  })

  socket.on('Change text align', (data) => {
    socket.broadcast.to(socket.dimension).emit('Update text align', data);
    TextElem.findById(data.textId).then((text) => {
      if(text){
        text.align = data.align;
        text.save();
      }
    })
  })

  socket.on('Text got deleted', data => {
    socket.broadcast.to(socket.dimension).emit("Text got deleted", data.elemId);
    TextElem.findByIdAndDelete(data.textId, (err, text) => {
      Dimension.findOne({name : socket.dimension}).then((dimension) => {
        if(dimension && text){
          let thisTextIndex = dimension.texts.indexOf(data.textId);
          dimension.texts.splice(thisTextIndex, 1);
          dimension.save().then(() => {
            if(data.thingId){
              Thing.findById(data.thingId).then((thing) => {
                thisTextIndex = thing.texts.indexOf(data.textId);
                thing.texts.splice(thisTextIndex, 1);
                thing.save();
              })
            }
          });
        }
      })
    })
  });

  socket.on('Text attached to thing', data => {
    socket.broadcast.to(socket.dimension).emit("Text attached to thing", {
      thingId : data.thing,
      elemId : data.elemId,
      newPos : data.newPos
    });
    Thing.findById(data.thingId).then((thing) => {
      TextElem.findById(data.textId).then((text) => {
        if(thing && text){
          thing.texts.push(text._id);
          text.thing = thing.elemId;
          text.pos = data.newPos;
          thing.save().then(() => {
            text.save();
          });
        }
      })
    })
  })

}
