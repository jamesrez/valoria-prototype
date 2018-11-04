let onlineUsers = {};
let objects = {};
let things = {};

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
    this.username = null;
    this.direction = 'c';
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
      ////////////MOVING ANIMATION//////////////
      // if(newPos.x < this.pos.x && this.direction != 'l'){
      //   this.direction = 'l';
      //   $('#thisUser').css('transform', 'scaleX(1)')
      //   $('#thisUserAvatar').attr('src', 'https://i.imgur.com/rQTqkRW.gif')
      // }else if(newPos.x > this.pos.x && this.direction != 'r'){
      //   this.direction = 'r';
      //   $('#thisUser').css('transform', 'scaleX(-1)')
      //   $('#thisUserAvatar').attr('src', 'https://i.imgur.com/rQTqkRW.gif')
      // }
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
    })
  }
};

class Thing {
  constructor(){
    this.docId = null;
    this.elemId = null;
    this.socket = socket;
    this.dimension = null;
    this.pos = {
      x : null,
      y : null
    };
  }
  renderAtPos(pos){
    let newThing = $('.livechat.prototype').clone(true, true);
    newThing.removeClass('prototype');
    newThing.attr('id', this.elemId);
    newThing.css('display', 'flex');
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    newThing.css({
      left : this.pos.x,
      top : this.pos.y
    })
    newThing.appendTo('.things');
  }
  updatePos(newPos){
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
    $(`#${this.elemId}`).css({
      left : this.pos.x,
      top : this.pos.y
    });
  }
}

function getRandomAvatar(){
  let numOfAvatars = $('.availableAvatars').children().length;
  let randAvatarIndex = Math.floor(Math.random() * numOfAvatars);
  let randAvatarSrc = $('.availableAvatars').children()[randAvatarIndex].firstElementChild.src;
  return randAvatarSrc;
}

function getRandomObject(){
  let numOfObjects= $('.availableObjects').children().length;
  let randObjectIndex = Math.floor(Math.random() * numOfObjects);
  let randObjectSrc = $('.availableObjects').children()[randObjectIndex].firstElementChild.src;
  return randObjectSrc;
}

const socket = io.connect();
$(document).ready(() => {
  thisUser = new User(socket.id);
  thisUser.dimension = $('#dimensionName').text();
  if($('#dimensionRender').text()){
    //Get Random Avatar
    thisUser.avatar = getRandomAvatar();
    //Get Random Object
    thisUser.object = getRandomObject();
  }
})
