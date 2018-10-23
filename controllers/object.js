const User = require('../models/user');
const Dimension = require('../models/dimension');
let imgTypes = ['.png', '.jpg', '.jpeg', '.gif'];


module.exports = (app) => {
  //Get objects of room
  app.get('/main/objects', (req, res) => {
    Dimension.findOne({name : 'main'}).then((dimension) => {
      res.send(dimension.images.objects);
    })
  });

  //Upload new Object
  // app.post('/object/upload', (req, res) => {
  //   let thisFileType = req.body.src.substring(req.body.src.lastIndexOf("."));
  //   if(imgTypes.indexOf(thisFileType) != -1){
  //     Dimension.findOne({name : 'main'}).then((dimension) => {
  //       dimension.images.objects.push(req.body);
  //       dimension.save(() => {
  //         res.send(req.body);
  //       });
  //     })
  //   }else{
  //     res.status(400).send("Not an acceptable image");
  //   }
  // })

  //Get a user's objects
  app.get('/user/:id/objects', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        res.send(user.objects);
      }
    })
  });

  //Add an object to a user
  app.post('/user/:id/objects', (req, res) => {
    User.findById(req.params.id).then((user) => {
      if(user){
        user.objects.push(req.body.newObject);
        user.save().then(() => {
          res.send(req.body.newObject);
        });
      }
    })
  });


}
