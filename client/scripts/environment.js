$(document).ready(() => {

  let memeBeingDragged = null;

  //HAVE MEME BE DRAGGED WHEN HOLDING click
  $(document).on('mousedown', (e) => {
    if(e.target.classList[1] == 'meme'){
      memeBeingDragged = e.target.id;
    }
  });

  //RELEASE MEME BEING DRAGGED ON MOUSE UP
  $(document).on('mouseup', (e) => {
    if(memeBeingDragged){
      memeBeingDragged = null;
    }
  })

  //HAVE USER MOVE AT CURSOR
  $('#environment').on('mousemove', function(e){
    mousePosition.x = e.pageX - screenPos.left;
    mousePosition.y = e.pageY - screenPos.top;
    if(!thisUser.isVisible){
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.connectAtPos(newPos);
    }
    if(!scrolling && thisUser.isVisible){
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.updatePos(newPos);
    }
    if(memeBeingDragged){
      memes[memeBeingDragged].updatePos(mousePosition);
    }
  });

  //KEY PRESSES
  $(document).keyup(function(e) {
    switch(e.keyCode){
      //SPACE
      case 32:
        thisUser.dropMeme();
        break;
    }
  });

});

//Socket Listeners
socket.on('Load Online Users', (users) => {
  for(id in users){
    $('.users').append(`
      <div class='user' id=${id}>
        <img class='userAvatar' src=${users[id].avatar}>
        <img class='userScroll' src=${scrollSrc}>
      </div>
    `);
    $(`#${id}`).css({
      left : users[id].pos.x,
      top : users[id].pos.y
    })
    onlineUsers[id] = users[id];
  }
})

socket.on('New User', (newUser) => {
  $('.users').append(`
    <div class='user' id=${newUser.socket}>
      <img class='userAvatar' src=${newUser.avatar}>
      <img class='userScroll' src=${scrollSrc}>
    </div>
  `);
  onlineUsers[newUser.socket] = newUser;
});

socket.on('User has moved', (data) => {
  $(`#${data.socket}`).css({
    left:  data.newPos.x,
    top:   data.newPos.y
  });
  if(data.scrollDir){
    switch(data.scrollDir){
      case 'left':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          top : "-22px",
          left : "-7px",
        });
        break;
      case 'right':
        $(`#${data.socket}`).find('.userScroll').css({
          left : "-45px",
          top : "-20px",
          "-webkit-transform": "scaleX(-1)",
          transform: "scaleX(-1)",
          display : "block"
        });
        break;
      case 'up':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          left : "-25px",
          top : "-5px",
          "-webkit-transform": "rotate(90deg)",
          transform: "rotate(90deg)",
        })
        break;
      case 'down':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          left : "-30px",
          top : "-45px",
          "-webkit-transform" : "rotate(-90deg)",
          transform : "rotate(-90deg)"
        })
        break;
      case 'upleft':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          transform: "rotate(45deg)",
          "-webkit-transform" : "rotate(45deg)",
          left : "-15px",
          top : "-10px"
        })
        break;
      case 'upright':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          transform: "rotate(135deg) scaleY(-1)",
          "-webkit-transform" : "rotate(135deg) scaleY(-1)",
          left : "-40px",
          top : "-10px"
        })
        break;
      case 'downleft':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          transform: "rotate(-45deg)",
          "-webkit-transform" : "rotate(-45deg)",
          left : "-10px",
          top : "-40px"
        })
        break;
      case 'downright':
        $(`#${data.socket}`).find('.userScroll').css({
          display : "block",
          transform: "rotate(45deg) scaleX(-1)",
          "-webkit-transform" : "rotate(45deg) scaleX(-1)",
          left : "-45px",
          top : "-45px"
        })
        break;
    }
  }
});

socket.on('User stopped scrolling', (user) => {
  $(`#${user.socket}`).find('.userScroll').css({
    display : 'none',
    "-webkit-transform": "scaleX(1)",
    transform: "scaleX(1)",
    "-webkit-transform": "rotate(0deg)",
    transform: "rotate(0deg)"
  });
});

socket.on('User Left', (user) => {
  $(`#${user.socket}`).remove();
  delete onlineUsers[user.socket];
})

socket.on('New Meme', (data) => {
  memes[data.id] = new Meme();
  memes[data.id].id = data.id;
  memes[data.id].src = data.src;
  memes[data.id].socket = data.socket;
  memes[data.id].renderAtPos(data.pos);
})

socket.on('Meme has moved', (data) => {
  $(`#${data.memeId}`).css({
    left : data.newPos.x,
    top : data.newPos.y
  });
})
