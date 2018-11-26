const mongoose = require('mongoose');
const { Schema } = mongoose;

//Dimensions should only be as big as needed
const DimensionSchema = new Schema({
  size : {
    width : Number,
    height : Number
  },
  desc : String,
  owner : String,
  ownerChooseAvatars : Boolean,
  ownerChooseObjects : Boolean,
  ownerChooseBackground : Boolean,
  name : String,
  avatars : {type : Array, default : [{
    src : "https://i.imgur.com/MgPq7Fn.png",
    key : "Valorian"
  }]},
  objects : {type : Array, default : [{
    src : "https://i.imgur.com/U7WCZuu.png",
    key : "Love"
  }]},
  backgrounds : {type : Array, default : [{
    src : "https://i.imgur.com/a4ycklR.png",
    key : "Purple Grid"
  }]},
  environmentObjects : [{
    elemId : String,
    src : String,
    pos : {
      x : Number,
      y : Number
    },
    width : Number,
    height : Number
  }],
  background : {
    src : {type : String, default : "https://i.imgur.com/a4ycklR.png"},
    key : {type : String, default : "Purple Grid"}
  },
  things : [String],
  texts : [String],
  thingCount : {type : Number, default : 0}
});


const Dimension = mongoose.model('Dimension', DimensionSchema);

module.exports = Dimension;
