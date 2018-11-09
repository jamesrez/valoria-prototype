const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThingSchema = new Schema({
  width : Number,
  height : Number,
  pos : {
    x : Number,
    y : Number
  },
  color : String,
  elemId : String
});

const Thing = mongoose.model('Thing', ThingSchema);

module.exports = Thing;
