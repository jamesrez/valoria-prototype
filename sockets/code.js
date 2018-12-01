const Dimension = require('../models/dimension');
const Thing = require('../models/thing');
const Code = require('../models/code');
const { exec } = require('child_process');

let tempPath = './client/components/dimension/thing/code/test.js';

module.exports = (io, socket, onlineUsers) => {

  socket.on("New code", (data) => {
    Dimension.findOne({name : data.dimensionName}).then((dimension) => {
      if(dimension){
        let newCodeThing = new Thing();
        newCodeThing.elemId = `code${dimension.thingCount}`;
        newCodeThing.pos = data.pos;
        newCodeThing.width = 500;
        newCodeThing.height = 500;
        newCodeThing.kind = 'code';
        newCodeThing.color = '#557062';
        newCodeThing.save().then((codeThing) => {
          let newCode = new Code();
          newCode.thingId = codeThing._id;
          dimension.things.push(codeThing._id);
          dimension.thingCount++;
          dimension.save().then(() => {
            newCode.save().then((code) => {
              io.to(data.dimensionName).emit('New code', {
                thing : codeThing,
                code : code
              });
            })
          })
        })
      }
    })
  })

  socket.on('Send code', (data) => {
    if(socket.admin){
      Code.findById(data.codeId).then((code) => {
        if(code){
          code.content = data.content;
          code.save().then((code) =>{
            exec(`: > ${tempPath}`, (err, out) => {
              exec(`echo '${code.content}' >> ${tempPath}`, (err, out) => {
                return;
              })
            })
          })
        }
      })
    }
  });

  socket.on('Delete code', docId => {
    Code.findByIdAndDelete(docId).then(() => {

    })
  })

}
