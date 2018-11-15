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
    if(this.isVisible && !userIsTyping){
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


$(document).ready(() => {
  //HAVE USER MOVE AT CURSOR
  //let mouseMoveTimer;
  $('.dimension').on('mousemove', function(e){
    mousePosition.x = e.pageX - screenPos.left;
    mousePosition.y = e.pageY - screenPos.top;
    mouseOnScreenPos.x = e.pageX;
    mouseOnScreenPos.y = e.pageY;
    if(!thisUser.isVisible && thisUser.avatar && thisUser.object){
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.connectAtPos(newPos);
    }
    if(!scrolling && thisUser ){
      ////////MOVING ANIMATION///////////
      // clearTimeout(mouseMoveTimer);
      // mouseMoveTimer = setTimeout(() => {
      //   thisUser.direction = 'c';
      //   $('#thisUserAvatar').attr('src', 'https://i.imgur.com/VHwgE91.png');
      // }, 50);
      if($('#dimensionRender').text() && $('#thisUser').css('display') == 'none'){
        $('#thisUser').css('display', 'block');
      }
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.updatePos(newPos);
    }
  });
})

//Socket Listeners
socket.on('Load Online Users', (users) => {
  for(id in users){
    $('.users').append(`
      <div class='user' id=${id}>
        <img class='userAvatar' src=${users[id].avatar}>
      </div>
    `);
    $(`#${id}`).css({
      left : users[id].pos.x,
      top : users[id].pos.y
    })
    onlineUsers[id] = users[id];
  }
});

socket.on('New User', (newUser) => {
  $('.users').append(`
    <div class='user' id=${newUser.socket}>
      <img class='userAvatar' src=${newUser.avatar}>
    </div>
  `);
  $(`#${newUser.socket}`).css({
    left : newUser.pos.x,
    top : newUser.pos.y
  })
  onlineUsers[newUser.socket] = newUser;
});

socket.on('User has moved', (data) => {
  $(`#${data.socket}`).css({
    left:  data.newPos.x,
    top:   data.newPos.y
  });

});

socket.on('User stopped scrolling', (user) => {
  if(user){
    $(`#${user.socket}`).find('.userScroll').css({
      display : 'none',
      "-webkit-transform": "scaleX(1)",
      transform: "scaleX(1)",
      "-webkit-transform": "rotate(0deg)",
      transform: "rotate(0deg)"
    });
  }
});

socket.on('User has changed avatar', (data) => {
  if(data){
    onlineUsers[data.socket].avatar = data.newAvatar;
    console.log(data);
    $(`#${data.socket}`).find('.userAvatar').attr('src', data.newAvatar);
  }
});

socket.on('User Left', (user) => {
  if(user){
    $(`#${user.socket}`).remove();
    delete onlineUsers[user.socket];
  }
});
