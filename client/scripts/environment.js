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
      thisUser.connect();
    }
    if(!scrolling){
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
socket.on('New User', (newUser) => {
  console.log(newUser.avatar);
  $('.users').append(`
    <div class='user' id=${newUser.socket}>
      <img class='userAvatar' src=${newUser.avatar}>
      <img class='userScrollRight userScroll' src=${scrollSrc}>
      <img class='userScrollLeft userScroll' src=${scrollSrc}>
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
        $(`#${data.socket}`).find('.userScrollLeft').css('display', 'block');
        break;
      case 'right':
        $(`#${data.socket}`).find('.userScrollRight').css('display', 'block');
        break;
    }
  }
});

socket.on('User stopped scrolling', (user) => {
  $(`#${user.socket}`).find('.userScroll').css('display', 'none');
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
