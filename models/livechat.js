const mongoose = require('mongoose');
const { Schema } = mongoose;

const LivechatSchema = new Schema({
  elemId : String,
  dimensionId : String,
  messages : [{
    sender : String,
    text : String
  }],
  pos : {
    x : Number,
    y : Number
  }
});

const Livechat = mongoose.model('Livechat', LivechatSchema);

module.exports = Livechat;
