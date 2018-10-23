let onlineUsers = {};
let objects = {};
let mousePosition = {
  x : null,
  y : null
}
let screenPos = {
  left : -50000,
  top : -50000
};
let scrolling = false;
let objectTotal = 0;
let thisUser = null;
let thisDimension = null;

class User {
  constructor(socket) {
    this.socket = socket;
    this.avatar = null;
    this.object = null;
    this.objectCount = 0;
    this.isVisible = false;
    this.pos = {
      x : parseInt($('#thisUser').css('left')),
      y : parseInt($('#thisUser').css('top'))
    };
    this.width = parseInt($('#thisUser').css('width'));
    this.height = parseInt($('#thisUser').css('height'));
  }

  connectAtPos(pos){
    this.isVisible = true;
    $('#thisUser').css('display', 'block');
    $('#thisUserAvatar').attr('src', this.avatar);
    socket.emit('Load Online Users');
    socket.emit('New User', {
      avatar : this.avatar,
      pos : pos
    });
  }

  updatePos(newPos, scrollDir){
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
    $('#thisUser').css({
      left : this.pos.x,
      top : this.pos.y
    });
    socket.emit('User has moved', {
      socket : socket.id,
      newPos : this.pos,
      scrollDir : scrollDir
    });
  }

  dropObject(){
    if(this.isVisible){
      let newObject = new anObject();
      newObject.id = this.socket + "-" + this.objectCount;
      newObject.socket = this.socket;
      newObject.src = this.object;
      newObject.renderAtPos(this.pos);
      objects[newObject.id] = newObject;
      this.objectCount += 1;
      socket.emit('New Object', (newObject));
    }
  }
}

class anObject {
  constructor(){
    this.id = null;
    this.socket = socket;
    this.src = null;
    this.pos = {
      x : null,
      y : null
    };
    this.width = 40;
    this.height = 40;
  }
  renderAtPos(pos){
    $('.objects').append(`
      <img id=${this.id} class="myObject object" src=${this.src} draggable="false"></img>
    `);
    $(`#${this.id}`).css({
      left : pos.x,
      top : pos.y
    });
    this.pos = pos;
  }
  updatePos(newPos){
    this.pos.x = newPos.x - (this.width / 2);
    this.pos.y = newPos.y - (this.height / 2);
    $(`#${this.id}`).css({
      left : this.pos.x,
      top : this.pos.y
    });
    socket.emit('Object has moved', {
      objectId : this.id,
      newPos : this.pos
    })
  }
}

const socket = io.connect();
$(document).ready(() => {
  thisUser = new User(socket.id);
})
