const Thing = require('../../models/thing');
const Door = require('../../models/door');

module.exports = (app) => {

  app.get('/door/:thingId', (req,res) => {
    Door.findOne({thingId : req.params.thingId}).then((door) => {
      res.send(door);
    })
  })

}
