//Packages
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const Dimension = require('./models/dimension');
const bodyParser = require('body-parser');
require('dotenv').config()

//Mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/valoria', () => {
  console.log("May the Heavens Bless Thee!");
})

//App Setting
app.set('views', './client')
app.set('view engine', 'pug');
app.use(express.static('client'))
app.use('/client/styles', express.static(__dirname + '/client/styles'));
app.use('/client/scripts', express.static(__dirname + '/client/scripts'));
app.use('/client/assets', express.static(__dirname + '/client/assets'));
app.use(bodyParser());

//Root Route
app.get('/', (req, res) => {
  Dimension.findOne({name : 'main'}).then((dimension) => {
    res.render('main');
  })
});
//Socket.io
let onlineUsers = {};
io.on('connection', (socket) => {
  require('./sockets/user.js')(io, socket, onlineUsers);
  require('./sockets/image.js')(io, socket, onlineUsers);
  require('./sockets/object.js')(io, socket, onlineUsers);
  require('./sockets/background.js')(io, socket, onlineUsers);
  socket.on('disconnect', () => {
    io.emit('User Left', onlineUsers[socket.id]);
    delete onlineUsers[socket.id];
  })
});
//Controllers
require('./controllers/dimension')(app);
require('./controllers/upload')(app);
require('./controllers/avatar')(app);
require('./controllers/object')(app);
require('./controllers/background')(app);
//Server Listen
server.listen(process.env.PORT || '3000', () => {
  console.log("Glory to Valoria!");
});
