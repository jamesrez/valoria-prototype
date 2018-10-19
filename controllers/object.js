const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'valoria-219021'
});
let bucket = storage.bucket('valoria');

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
  app.post('/object/upload', (req, res) => {
    let thisFileType = req.body.src.substring(req.body.src.lastIndexOf("."));
    if(imgTypes.indexOf(thisFileType) != -1){
      Dimension.findOne({name : 'main'}).then((dimension) => {
        dimension.images.objects.push(req.body);
        dimension.save(() => {
          res.send(req.body);
        });
      })
    }else{
      res.status(400).send("Not an acceptable image");
    }
  })


}
