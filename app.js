//Packages
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//App Setting
app.set('views', './client')
app.set('view engine', 'pug');
app.use(express.static('client'))
app.use('/client/styles', express.static(__dirname + '/client/styles'));
app.use('/client/scripts', express.static(__dirname + '/client/scripts'));
app.use('/client/assets', express.static(__dirname + '/client/assets'));
//Root Route
app.get('/', (req, res) => {
  res.render('main');
});
//Socket.io
let onlineUsers = {};
io.on('connection', (socket) => {
  require('./sockets/user.js')(io, socket, onlineUsers);
  socket.on('disconnect', () => {
    io.emit('user left', (onlineUsers[socket.id]));
    delete onlineUsers[socket.id];
    console.log(onlineUsers);
  })
})
//Server Listen
server.listen(process.env.PORT || '3000', () => {
  console.log("On");
});
