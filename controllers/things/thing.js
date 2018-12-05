const Thing = require('../../models/thing');

module.exports = (app) => {

  app.get('/things/:id', (req, res) => {
    Thing.findById(req.params.id).then((thing) => {
      if(thing){
        res.send(thing);
      }
    })
  })

}
