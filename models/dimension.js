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
  memes : [{
    id : String,
    pos : {
      x : Number,
      y : Number
    },
    src : String
  }],
  memeLimit : {type : Number, default : 1000},
  background : {
    src : {type : String, default : "https://i.imgur.com/a4ycklR.png"},
    key : {type : String, default : "Purple Grid"}
  }
});


const Dimension = mongoose.model('Dimension', DimensionSchema);

Dimension.findOne({name : 'main'}).then((dimension) => {
  if(!dimension){
    let main = new Dimension();
    main.name = 'main';
    main.desc = 'The main dimension';
    main.ownerChooseAvatars = false;
    main.ownerChooseObjects = false;
    main.ownerChooseBackground = false;
    main.save();
  }
})

module.exports = Dimension;
