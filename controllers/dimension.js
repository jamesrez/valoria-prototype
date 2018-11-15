const Dimension = require('../models/dimension');
const Livechat = require('../models/livechat');
const User = require('../models/user');
const Thing = require('../models/thing');

module.exports = (app) => {

  //Render a Dimension // SHOW LOGIN SCREEN STILL
  app.get('/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        User.findById(req.user.id).then((user) => {
          if(user){
            res.render('components/main', {currentUser : user, dimension : dimension});
          }
        })
      }
    })
  });

  app.get('/dimension/:name/door', (req, res) => {
    if(req.user){
      Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
        if(dimension){
          User.findById(req.user.id).then((user) => {
            if(user){
              res.render('components/main', {currentUser : user, dimension : dimension, doorRender : true});
            }
          })
        }
      })
    }
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
  });

  //Get all things currently in the dimension's environment
  app.get('/dimension/:name/environment/things', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        Thing.find({'_id': { $in: dimension.things}}).then((things) => {
          if(things){
            res.send(things);
          }
        })
      }
    })
  })

  //Get all livechats currently in the dimension's environment
  app.get('/dimension/:name/environment/livechats', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        Livechat.find({'_id': { $in: dimension.livechats}}).then((livechats) => {
          if(livechats){
            res.send(livechats);
          }
        })
      }
    })
  })

  /////////API SECTION. Returns JSON///////////
  //Render a Dimension
  app.get('/api/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        res.send(dimension);
      }
    })
  });
}
