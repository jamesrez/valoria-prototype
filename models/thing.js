const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThingSchema = new Schema({
  width : Number,
  height : Number,
  widthPercent : String,
  heightPercent : String,
  pos : {
    x : Number,
    y : Number,
    xPercent : String,
    yPercent : String,
  },
  color : String,
  elemId : String,
  kind : String,
  texts : [String],
  image : String,
  video : String,
  audio : String,
  creator : String,
  isPrivate : {type : Boolean, default : false},
  isFixed : {type : Boolean, default : false}
});

const Thing = mongoose.model('Thing', ThingSchema);

module.exports = Thing;
