const User = require('../models/user');
const Dimension = require('../models/dimension');
let imgTypes = ['.png', '.jpg', '.jpeg', '.gif'];


module.exports = (app) => {

  //Get Avatars of room
  app.get('/main/avatars', (req, res) => {
    Dimension.findOne({name : 'main'}).then((dimension) => {
      res.send(dimension.images.avatars);
    })
  });

  //Upload new Avatar
  // app.post('/avatar/upload', (req, res) => {
  //   let thisFileType = req.body.src.substring(req.body.src.lastIndexOf("."));
  //   if(imgTypes.indexOf(thisFileType) != -1){
  //     Dimension.findOne({name : 'main'}).then((dimension) => {
  //       dimension.images.avatars.push(req.body);
  //       dimension.save(() => {
  //         res.send(req.body);
  //       });
  //     })
  //   }else{
  //     res.status(400).send("Not an acceptable image");
  //   }
  // });

  //Get a user's avatars
  app.get('/user/:id/avatars', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        res.send(user.avatars);
      }
    })
  });

  //Add an avatar to a user
  app.post('/user/:id/avatars/new', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        user.avatars.push(req.body.newAvatar);
        user.save().then(() => {
          res.send(req.body.newAvatar);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  });

  app.post('/dimension/:name/avatars/new', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        dimension.avatars.push(req.body.newAvatar);
        dimension.save().then(() => {
          res.send(req.body.newAvatar);
        });
      }
    });
  });

}
