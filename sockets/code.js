const Dimension = require('../models/dimension');
const { exec } = require('child_process');

let tempPath = './client/components/dimension/thing/code/test.js';

module.exports = (io, socket, onlineUsers) => {

  socket.on('get code', (data) => {
    if(socket.admin){
      exec(`cat ${tempPath}`, (err, out) => {
        if(err){console.log(err)}
        socket.emit('get code', out);
      })
    }
  });

  socket.on('send code', (code) => {
    if(socket.admin){
      exec(`: > ${tempPath}`, (err, out) => {
        exec(`echo '${code}' >> ${tempPath}`, (err, out) => {
          return;
        })
      })
    }
  })

}
