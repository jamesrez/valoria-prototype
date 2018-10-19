const Dimension = require('../models/dimension');

module.exports = (app) => {

  app.get('/dimension/:name', (req, res) => {
    Dimension.findOne({name : req.params.name}).then((dimension) => {
      if(dimension){
        res.send(dimension);
      }
    })
  })

}
