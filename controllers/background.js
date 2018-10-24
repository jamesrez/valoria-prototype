const User = require('../models/user');
const Dimension = require('../models/dimension');
let imgTypes = ['.png', '.jpg', '.jpeg', '.gif'];


module.exports = (app) => {
  //Get Backgrounds of room
  app.get('/main/backgrounds', (req, res) => {
    Dimension.findOne({name : 'main'}).then((dimension) => {
      res.send(dimension.images.backgrounds);
    })
  });

  //Upload new Background
  // app.post('/background/upload', (req, res) => {
  //   let thisFileType = req.body.src.substring(req.body.src.lastIndexOf("."));
  //   if(imgTypes.indexOf(thisFileType) != -1){
  //     Dimension.findOne({name : 'main'}).then((dimension) => {
  //       dimension.images.backgrounds.push(req.body);
  //       dimension.save(() => {
  //         res.send(req.body);
  //       });
  //     })
  //   }else{
  //     res.status(400).send("Not an acceptable image");
  //   }
  // })


  //Get a user's backgrounds
  app.get('/user/:id/backgrounds', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        res.send(user.backgrounds);
      }
    })
  });

  //Add a background to a user
  app.post('/user/:id/backgrounds', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        user.backgrounds.push(req.body.newBackground);
        user.save().then(() => {
          res.send(req.body.newBackground);
        });
      }
    })
  });


}
