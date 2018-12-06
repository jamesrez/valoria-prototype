const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConsoleSchema = new Schema({
  thingId : String,
  content : {type : String, default: ""}
});

const Console = mongoose.model('Console', ConsoleSchema);

module.exports = Console;
