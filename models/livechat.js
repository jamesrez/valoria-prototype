const mongoose = require('mongoose');
const { Schema } = mongoose;

const LivechatSchema = new Schema({
  thingId : String,
  messages : [{
    sender : String,
    text : String
  }],
});

const Livechat = mongoose.model('Livechat', LivechatSchema);

module.exports = Livechat;
