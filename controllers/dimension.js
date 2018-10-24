const Dimension = require('../models/dimension');

module.exports = (app) => {

  //Render a Dimension
  app.get('/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        res.render('main', {currentUser : req.user, dimension : dimension});
      }
    })
  })


  //Create a new Dimension
  app.post('/dimension/new', (req, res) => {
    if(req.user){
      Dimension.findOne({name : req.body.name.toLowerCase()}).then((dimension) => {
        if(dimension){
          res.status(400).send("Dimension name already taken");
        }else{
          let newDimension = new Dimension;
          newDimension.name = req.body.name.toLowerCase();
          newDimension.desc = req.body.desc;
          newDimension.owner = req.user.id,
          newDimension.ownerChooseAvatars = req.body.ownerChooseAvatars;
          newDimension.ownerChooseObjects = req.body.ownerChooseObjects;
          newDimension.ownerChooseBackground = req.body.ownerChooseBackground;
          newDimension.save().then((dimension) => {
            res.send(dimension.name);
          })
        }
      })
    }
  });

  //Get all objects currently in the dimension's environment
  app.get('/dimension/:name/environment/objects', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        res.send(dimension.environmentObjects);
      }
    })
  })

}
