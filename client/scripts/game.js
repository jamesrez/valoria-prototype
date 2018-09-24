var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
       default: 'arcade'
    },
    parent : 'game',
    transparent : true
};

let game = new Phaser.Game(config);
let moveToCursor = false;
let drag = false;
let user;
let keySpace;
let cursor;
let images = {};

function preload ()
{
  this.load.svg('user', 'client/assets/user.svg', {scale : 1});
  this.load.image('heart', 'client/assets/uploads/heart.svg');
}

function create ()
{
  user = this.physics.add.sprite(400, 300, 'user');
  user.setScale(0.3, 0.3);

  images["heart"] = this.physics.add.image(600, 600, 'heart');
  this.input.setDraggable(images["heart"].setInteractive());

  this.input.on('dragstart', (pointer, obj) => {
      drag = true;
  });
  this.input.on('drag', (pointer, obj, dragX, dragY) => {
      obj.setPosition(dragX, dragY);
  });
  this.input.on('dragend', (pointer, obj) => {
      drag = false;
  });

  //WHEN MOUSE DOWN OR SPACE DOWN MOVE USER TO CURSOR
  this.input.on('pointerdown', (pointer) => {
    cursor = pointer;
    moveToCursor = true;
  });
  this.input.on('pointerup', (pointer) => {
    cursor = pointer;
    moveToCursor = false;
  })
  this.input.on('pointermove', (pointer) => {
    cursor = pointer;
  })
  keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


}

function update ()
{
  if(!drag && moveToCursor || keySpace.isDown){
    this.physics.moveToObject(user, cursor, 240);
  }else{
    user.setVelocity(0,0);
  }
}
