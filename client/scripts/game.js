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
  this.load.crossOrigin = 'valoria';
  this.load.svg('user', 'client/assets/user.svg', {scale : 1});
}

function create(){
  //Load Users in Game on Start
  socket.emit('Load Online Users');
  // Add User to Game
  // console.log(Phaser.Math.Distance);
  let randX = Phaser.Math.Between(400, 1200);
  let randY = Phaser.Math.Between(0, 700);
  socket.emit('New User', {x: randX, y: randY});
  onlineUsers[socket.id] = {
    sprite : this.physics.add.sprite(randX, randY, 'user')
  }
  onlineUsers[socket.id].sprite.setScale(0.3, 0.3);

  //WHEN MOUSE DOWN OR SPACE DOWN MOVE USER TO CURSOR
  keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.input.on('pointerdown', (pointer) => {
    if(!drag){
      cursor = pointer;
      moveToCursor = true;
      socket.emit('User Move', cursor.position);
    }
  });
  this.input.keyboard.on('keydown_SPACE', () => {
    if(cursor){
      moveToCursor = true;
      socket.emit('User Move', cursor.position);
    }
  });
  this.input.keyboard.on('keyup_SPACE', () => {
    moveToCursor = false;
    socket.emit('User Stop');
  })
  this.input.on('pointerup', (pointer) => {
    if(!drag){
      cursor = pointer;
      moveToCursor = false;
      socket.emit('User Stop');
    }
  })
  this.input.on('pointermove', (pointer) => {
    if(moveToCursor){
      cursor = pointer;
      socket.emit('User Move', cursor.position);
    }
  })

  //Dragging Images
  this.input.on('dragstart', (pointer, obj) => {
    drag = true;
  });
  this.input.on('drag', (pointer, obj, dragX, dragY) => {
    obj.setPosition(dragX, dragY);
  });
  this.input.on('dragend', (pointer, obj) => {
    console.log(obj);
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

  let doggy = this.physics.add.image(800, 400, 'gif');

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
  });
  socket.on('User Move', (data) => {
    this.physics.moveToObject(onlineUsers[data.user.id].sprite, data.cursor, 240);
  })
  socket.on('User Stop', (user) => {
    onlineUsers[user.id].sprite.setVelocity(0,0);
  })
}

let userStopped = false;
function update(){
  if(moveToCursor){
    let curPos = cursor.position;
    let userPos = onlineUsers[socket.id].sprite.body.position;
    if(Phaser.Math.Distance.Between(curPos.x, curPos.y, userPos.x, userPos.y) < 20){
      socket.emit("User Stop");
    }
  }
}
