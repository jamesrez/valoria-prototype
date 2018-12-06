const Thing = require('../../models/thing');
const Console = require('../../models/console');

module.exports = (app) => {

  app.get('/console/:thingId', (req,res) => {
    Console.findOne({thingId : req.params.thingId}).then((thisConsole) => {
      res.send(thisConsole);
    })
  })

}
