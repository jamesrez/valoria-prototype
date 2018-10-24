//Packages
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const Dimension = require('./models/dimension');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
app.use(cookieParser());

// check that a user is logged in
let checkAuth = function (req, res, next) {
  if (typeof req.cookies.userToken === 'undefined' || req.cookies.userToken === null) {
    req.user = null;
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.userToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
}
app.use(checkAuth);

//Root Route
app.get('/', (req, res) => {
  Dimension.findOne({name : 'main'}).then((dimension) => {
    res.render('main', {
      currentUser : req.user,
      dimension : dimension
    });
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
    if(onlineUsers[socket.dimension]){
      io.to(socket.dimension).emit('User Left', onlineUsers[socket.dimension][socket.id]);
      delete onlineUsers[socket.dimension][socket.id];
    }
  })
});
//Controllers
require('./controllers/user')(app);
require('./controllers/dimension')(app);
require('./controllers/upload')(app);
require('./controllers/avatar')(app);
require('./controllers/object')(app);
require('./controllers/background')(app);
//Server Listen
server.listen(process.env.PORT || '3000', () => {
  console.log("Glory to Valoria!");
});
