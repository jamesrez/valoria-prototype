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

class User {
  constructor(socket) {
    this.socket = socket;
    this.avatar = null;
    this.object = null;
    this.objectCount = 0;
    this.isVisible = false;
    this.dimension = null;
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
    socket.emit('Load Online Users', this.dimension);
    socket.emit('New User', {
      avatar : this.avatar,
      pos : pos,
      dimension : this.dimension
    });
  }

  updatePos(newPos, scrollDir){
    if(this.isVisible){
      this.pos.x = newPos.x;
      this.pos.y = newPos.y;
      $('#thisUser').css({
        left : this.pos.x,
        top : this.pos.y
      });
      socket.emit('User has moved', {
        socket : socket.id,
        newPos : this.pos,
        scrollDir : scrollDir,
        dimension : this.dimension
      });
    }
  }

  dropObject(){
    if(this.isVisible){
      let newObject = new anObject();
      newObject.elemId = this.socket + "-" + this.objectCount;
      newObject.socket = this.socket;
      newObject.src = this.object;
      newObject.dimension = this.dimension;
      newObject.renderAtPos(this.pos);
      objects[newObject.elemId] = newObject;
      this.objectCount += 1;
      socket.emit('New Object', newObject);
    }
  }
}

class anObject {
  constructor(){
    this.elemId = null;
    this.socket = socket;
    this.src = null;
    this.dimension = null;
    this.pos = {
      x : null,
      y : null
    };
    this.width = 40;
    this.height = 40;
  }
  renderAtPos(pos){
    $('.objects').append(`
      <img id=${this.elemId} class="myObject object" src=${this.src} draggable="false"></img>
    `);
    $(`#${this.elemId}`).css({
      left : pos.x,
      top : pos.y
    });
    this.pos = pos;
  }
  updatePos(newPos){
    this.pos.x = newPos.x - (this.width / 2);
    this.pos.y = newPos.y - (this.height / 2);
    $(`#${this.elemId}`).css({
      left : this.pos.x,
      top : this.pos.y
    });
    socket.emit('Object has moved', {
      objectId : this.elemId,
      newPos : this.pos,
      dimension : this.dimension
    })
  }
}

const socket = io.connect();
$(document).ready(() => {
  thisUser = new User(socket.id);
  thisUser.dimension = $('#dimensionName').text();
})
