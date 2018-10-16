let onlineUsers = {};
let memes = {};
let mousePosition = {
  x : null,
  y : null
}
const socket = io.connect();
let screenPos = {
  left : -50000,
  top : -50000
};
let scrolling = false;
let memeSrc = 'https://storage.googleapis.com/valoria/heart.png';
let scrollSrc = 'https://storage.googleapis.com/valoria/rocket.gif'
let memeTotal = 0;
let thisUser = null;

class User {
  constructor(socket) {
    this.socket = socket;
    this.avatar = $('#thisUserAvatar').attr('src');
    this.meme = $('.myMeme').attr('src');
    this.memeCount = 0;
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

  dropMeme(meme){
    let newMeme = new Meme();
    newMeme.id = this.socket + "-" + this.memeCount;
    newMeme.socket = this.socket;
    newMeme.src = memeSrc;
    newMeme.renderAtPos(this.pos);
    memes[newMeme.id] = newMeme;
    this.memeCount += 1;
    socket.emit('New Meme', (newMeme));
  }
}

class Meme {
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
    $('.memes').append(`
      <img id=${this.id} class="myMeme meme" src=${memeSrc} draggable="false"></img>
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
    socket.emit('Meme has moved', {
      memeId : this.id,
      newPos : this.pos
    })
  }
}

$(document).ready(() => {
  thisUser = new User(socket.id);
  onlineUsers[socket.id] = thisUser;
})
