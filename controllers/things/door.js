const Thing = require('../../models/thing');
const Door = require('../../models/Door');

module.exports = (app) => {

  app.get('/door/:thingId', (req,res) => {
    Door.findOne({thingId : req.params.thingId}).then((door) => {
      res.send(door);
    })
  })

}
