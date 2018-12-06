//Packages
const express = require('express');
const app = express();
const ExpressPeerServer = require('peer').ExpressPeerServer;
const server = require('http').Server(app);
const peerServer = ExpressPeerServer(server);
const io = require('socket.io')(server);
const jwtAuth = require('socketio-jwt-auth');
const mongoose = require('mongoose');
const Dimension = require('./models/dimension');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketCookieParser = require('socket.io-cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');



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
app.use('/peerjs', peerServer);

//Check that a user is logged in
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
  if(req.user){
    User.findOne({username : req.user.username}).then((user) => {
      if(!user){
        res.clearCookie('userToken');
      }
      Dimension.findOne({name : 'main'}).then((dimension) => {
        if(dimension && dimension.avatars[0]){
          res.render('components/main', {
            currentUser : user,
            dimension : dimension
          });
        }else{
          Dimension.findOne({name : 'main'}).then((dimension) => {
            if(!dimension){
              let main = new Dimension();
              main.name = 'main';
              main.desc = 'The main dimension';
              main.ownerChooseAvatars = false;
              main.ownerChooseObjects = true;
              main.ownerChooseBackground = true;
              main.owner = "james";
              main.save().then((dimension) => {
                res.render('components/main', {
                  currentUser : user,
                  dimension : dimension
                });
              });
            }
          })
        }
      })
    })
  }else{
    res.clearCookie('userToken');
    Dimension.findOne({name : 'main'}).then((dimension) => {
      if(dimension && dimension.avatars[0]){
        res.render('components/main', {
          dimension : dimension
        });
      }else{
        res.send("Server restarting, wait a quick second.");
      }
    })
  }
});


//Socket.io
function checkSocketAuth(socket, next){
  if (typeof socket.request.cookies.userToken === 'undefined' || socket.request.cookies.userToken === null) {
    socket["user"] = null;
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = socket.request.cookies.userToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    socket["user"] = decodedToken.payload;
    if(decodedToken.payload.username == 'james'){
      socket["admin"] = true;
    }
  }
  next();
}
io.use(socketCookieParser());
io.use(checkSocketAuth)
let onlineUsers = {};
let voices = {};
io.on('connection', (socket) => {
  require('./sockets/user.js')(io, socket, onlineUsers, voices);
  require('./sockets/image.js')(io, socket, onlineUsers);
  require('./sockets/object.js')(io, socket, onlineUsers);
  require('./sockets/background.js')(io, socket, onlineUsers);
  require('./sockets/things/thing.js')(io, socket, onlineUsers);
  require('./sockets/things/livechat.js')(io, socket, onlineUsers);
  require('./sockets/things/door.js')(io, socket, onlineUsers);
  require('./sockets/things/text.js')(io, socket, onlineUsers);
  require('./sockets/things/code.js')(io, socket, onlineUsers);
  require('./sockets/things/console.js')(io, socket, onlineUsers);
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
require('./controllers/things/thing')(app);
require('./controllers/things/livechat')(app);
require('./controllers/things/door')(app);
require('./controllers/things/code')(app);
require('./controllers/things/console')(app);

//Server Listen
server.listen(process.env.PORT || '3000', () => {
  console.log("Glory to Valoria!");
});
