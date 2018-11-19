const mongoose = require('mongoose');
const { Schema } = mongoose;

const TextSchema = new Schema({
  width : Number,
  height : Number,
  pos : {
    x : Number,
    y : Number
  },
  color : String,
  elemId : String,
  content : String,
  fontSize : Number,
  align : String,
  thing : String
});

const TextElem = mongoose.model('Text', TextSchema);

module.exports = TextElem;
