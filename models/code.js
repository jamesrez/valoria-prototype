const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeSchema = new Schema({
  thingId : String,
  content : {type : String, default: ""}
});

const Code = mongoose.model('Code', CodeSchema);

module.exports = Code;
