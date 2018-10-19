const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'valoria-219021'
});
let bucket = storage.bucket('valoria');

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
  app.post('/avatar/upload', (req, res) => {
    let thisFileType = req.body.src.substring(req.body.src.lastIndexOf("."));
    if(imgTypes.indexOf(thisFileType) != -1){
      Dimension.findOne({name : 'main'}).then((dimension) => {
        dimension.images.avatars.push(req.body);
        dimension.save(() => {
          res.send(req.body);
        });
      })
    }else{
      res.status(400).send("Not an acceptable image");
    }
  })

}
