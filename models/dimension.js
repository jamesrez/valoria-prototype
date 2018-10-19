const mongoose = require('mongoose');
const { Schema } = mongoose;


//Dimensions should only be as big as needed
const DimensionSchema = new Schema({
  size : {
    width : Number,
    height : Number
  },
  name : String,
  images : {
    avatars : [{
      src : String,
      key : String
    }],
    objects : [{
      src : String,
      key : String
    }],
    backgrounds : [{
      src : String,
      key : String
    }]
  },
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
    src : String,
    key : String
  }
});


const Dimension = mongoose.model('Dimension', DimensionSchema);

Dimension.findOne({name : 'main'}).then((dimension) => {
  if(!dimension){
    let main = new Dimension();
    main.name = 'main';
    main.background = {
      src : 'https://i.imgur.com/a4ycklR.png',
      key : "Purple Grid"
    }
    main.save();
  }
})

module.exports = Dimension;
