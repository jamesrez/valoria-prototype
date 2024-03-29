const Dimension = require('../models/dimension');
const Livechat = require('../models/livechat');
const User = require('../models/user');
const Thing = require('../models/thing');
const TextElem = require('../models/text');


module.exports = (app) => {

  //Render a Dimension // SHOW LOGIN SCREEN STILL
  app.get('/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        User.findById(req.user.id).then((user) => {
          if(user){
            res.render('components/main', {currentUser : user, dimension : dimension});
          }else{
            res.render('components/main', {dimension : dimension})
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
          newDimension.owner = req.user.username,
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
      if(dimension  && req.user){
        Thing.find({'_id': { $in: dimension.things}, isPrivate : false}).then((publicThings) => {
          Thing.find({
            '_id' : { $in: dimension.things},
            isPrivate : true,
            creator : req.user.username
          }).then((privateThings) => {
            things = publicThings.concat(privateThings);
            if(things){
              res.send(things);
            }
          })
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

  //Get all texts currently in the dimension's environment
  app.get('/dimension/:name/environment/texts', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        TextElem.find({'_id': { $in: dimension.texts}}).then((texts) => {
          if(texts){
            res.send(texts);
          }
        })
      }
    })
  })

  /////////API SECTION. Returns JSON///////////
  //Send Dimension Data
  app.get('/api/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name.toLowerCase()}).then((dimension) => {
      if(dimension){
        res.send(dimension);
      }
    })
  });

}
