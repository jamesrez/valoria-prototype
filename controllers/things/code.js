const Thing = require('../../models/thing');
const Code = require('../../models/code');

module.exports = (app) => {

  app.get('/code/:thingId', (req,res) => {
    Code.findOne({thingId : req.params.thingId}).then((code) => {
      res.send(code);
    })
  })

}
