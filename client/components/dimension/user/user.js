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
    this.localPos = {
      x : null,
      y : null
    },
    this.realPos = {
      x : null,
      y : null
    },
    this.width = parseInt($('#thisUser').css('width'));
    this.height = parseInt($('#thisUser').css('height'));
    this.voiceId = null;
  }

  connectAtPos(pos){
    this.isVisible = true;
    $('#thisUser').css('display', 'block');
    $('#thisUserAvatar').attr('src', this.avatar);
    this.realPos.x = $('#thisUser').css('left');
    this.realPos.y = $('thisUser').css('top');
    this.voiceId = thisPeerId;
    socket.emit('Load Online Users', this.dimension);
    socket.emit('New User', {
      avatar : this.avatar,
      pos : pos,
      dimension : this.dimension,
      voiceId : this.voiceId
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
      this.localPos.x = newPos.x;
      this.localPos.y = newPos.y;
      if(!scrollDir){
        this.realPos.x = newPos.x - bpx;
        this.realPos.y = newPos.y - bpy;
        $('#thisUser').css({
          left : this.localPos.x,
          top : this.localPos.y
        });
      }
      socket.emit('User has moved', {
        socket : socket.id,
        newPos : this.realPos,
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
      newObject.localPos = this.localPos;
      newObject.pos = this.realPos;
      newObject.renderAtPos(this.realPos);
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
    if(!thisUser.isVisible && thisUser.avatar && thisUser.object){
      let newPos = {
        x : e.pageX - (thisUser.width / 2),
        y : e.pageY - (thisUser.height / 2),
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
        x : e.pageX - (thisUser.width / 2),
        y : e.pageY - (thisUser.height / 2),
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
    peerCall = peer.call(users[id].voiceId, thisAudioStream);
    peerCall.on('stream', (stream) => {
      console.log(stream)
      $('.voiceStream')[0].srcObject = stream;
    })
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

peer.on('call', (thisCall) => {
  thisCall.answer(thisAudioStream);
  thisCall.on('stream', (stream) => {
    $('.voiceStream')[0].srcObject = stream;
  })
})
