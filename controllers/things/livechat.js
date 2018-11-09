const Thing = require('../../models/thing');
const Livechat = require('../../models/livechat');

module.exports = (app) => {

  app.get('/livechat/:thingId', (req,res) => {
    Livechat.findOne({thingId : req.params.thingId}).then((livechat) => {
      res.send(livechat);
    })
  })

}
