const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoorSchema = new Schema({
  thingId : String,
  dimension : String,
});

const Door = mongoose.model('Door', DoorSchema);

module.exports = Door;
