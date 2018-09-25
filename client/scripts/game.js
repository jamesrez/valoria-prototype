// Phaser Game Initiation
let gameConfig = {
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
let game = new Phaser.Game(gameConfig);

//Global Game Variables
let moveToCursor = false;
let drag = false;
let user;
let keySpace;
let cursor;
let images = {};

function preload(){
  this.load.svg('user', 'client/assets/user.svg', {scale : 1});
}

function create(){
  //Load Users in Game on Start
  socket.emit('Load Online Users');
  // Add User to Game
  let randX = Phaser.Math.Between(400, 1200);
  let randY = Phaser.Math.Between(0, 700);
  user = this.physics.add.sprite(randX, randY, 'user');
  user.setScale(0.3, 0.3);
  socket.emit('New User', {x: randX, y: randY});

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

  //Dragging Images
  this.input.on('dragstart', (pointer, obj) => {
      drag = true;
  });
  this.input.on('drag', (pointer, obj, dragX, dragY) => {
      obj.setPosition(dragX, dragY);
  });
  this.input.on('dragend', (pointer, obj) => {
      drag = false;
  });

  //SOCKET LISTENERS
  // Load New Image from other Client and Add to Game
  socket.on('New Image', (image) => {
    //Add image if image is new and must be loaded first
    function addImageAfterLoad(key, file){
      images[key] = this.physics.add.image(800, 400, key)
      this.input.setDraggable(images[key].setInteractive());
    }
    if(!images[image.key]){
      this.load.image(image.key, image.src).on('filecomplete', addImageAfterLoad, this);
      this.load.start();
    }else{
      images[image.key] = this.physics.add.image(800, 400, image.key);
      this.input.setDraggable(images[image.key].setInteractive());
    }
  });
  //Add Online Users
  socket.on('Load Online Users', (users) => {
    for(userId in users){
      onlineUsers[userId] = {
        sprite : this.physics.add.sprite(users[userId].x, users[userId].y, 'user')
      }
      onlineUsers[userId].sprite.setScale(0.3, 0.3);
    }
  })
  //Add New User from other client
  socket.on('New User', (user) => {
    onlineUsers[user.id] = {
      sprite : this.physics.add.sprite(user.x, user.y, 'user')
    };
    onlineUsers[user.id].sprite.setScale(0.3, 0.3);
  });
  //Remove User on Disconnect
  socket.on('User Left', (user) => {
    onlineUsers[user.id].sprite.destroy();
    delete onlineUsers[user.id];
  })
}

function update(){
  if(!drag && moveToCursor || keySpace.isDown){
    this.physics.moveToObject(user, cursor, 240);
  }else{
    user.setVelocity(0,0);
  }
}
