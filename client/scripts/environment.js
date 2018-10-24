
function addNewObject(newObject){
  objects[newObject.elemId] = new anObject();
  objects[newObject.elemId].elemId = newObject.elemId;
  objects[newObject.elemId].src = newObject.src;
  objects[newObject.elemId].socket = newObject.socket;
  objects[newObject.elemId].dimension = newObject.dimension;
  objects[newObject.elemId].renderAtPos(newObject.pos);
}


$(document).ready(() => {
  let dimensionName = $('#dimensionName').text();
  //Load All Objects in Dimension
  $.get(`/dimension/${dimensionName}/environment/objects`, (objects) => {
    objects.forEach((anObject) => {
      addNewObject(anObject);
    })
  })

  let objectBeingDragged = null;

  //HAVE MEME BE DRAGGED WHEN HOLDING click
  $(document).on('mousedown', (e) => {
    if(e.target.classList[1] == 'object'){
      objectBeingDragged = e.target.id;
    }
  });

  //RELEASE MEME BEING DRAGGED ON MOUSE UP
  $(document).on('mouseup', (e) => {
    if(objectBeingDragged){
      socket.emit('Save new position of object', objects[objectBeingDragged]);
      objectBeingDragged = null;
    }
  })

  //HAVE USER MOVE AT CURSOR
  $('#environment').on('mousemove', function(e){
    mousePosition.x = e.pageX - screenPos.left;
    mousePosition.y = e.pageY - screenPos.top;
    if(!thisUser.isVisible && thisUser.avatar && thisUser.object){
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.connectAtPos(newPos);
    }
    if(!scrolling && thisUser ){
      let newPos = {
        x : mousePosition.x - (thisUser.width / 2),
        y : mousePosition.y - (thisUser.height / 2),
      }
      thisUser.updatePos(newPos);
    }
    if(objectBeingDragged){
      objects[objectBeingDragged].updatePos(mousePosition);
    }
  });

  //KEY PRESSES
  $(document).keyup(function(e) {
    switch(e.keyCode){
      //SPACE
      case 32:
        thisUser.dropObject();
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
    </div>
  `);
  onlineUsers[newUser.socket] = newUser;
});

socket.on('User has moved', (data) => {
  $(`#${data.socket}`).css({
    left:  data.newPos.x,
    top:   data.newPos.y
  });
  // if(data.scrollDir){
  //   switch(data.scrollDir){
  //     case 'left':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         top : "-22px",
  //         left : "-7px",
  //       });
  //       break;
  //     case 'right':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         left : "-45px",
  //         top : "-20px",
  //         "-webkit-transform": "scaleX(-1)",
  //         transform: "scaleX(-1)",
  //         display : "block"
  //       });
  //       break;
  //     case 'up':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         left : "-25px",
  //         top : "-5px",
  //         "-webkit-transform": "rotate(90deg)",
  //         transform: "rotate(90deg)",
  //       })
  //       break;
  //     case 'down':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         left : "-30px",
  //         top : "-45px",
  //         "-webkit-transform" : "rotate(-90deg)",
  //         transform : "rotate(-90deg)"
  //       })
  //       break;
  //     case 'upleft':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         transform: "rotate(45deg)",
  //         "-webkit-transform" : "rotate(45deg)",
  //         left : "-15px",
  //         top : "-10px"
  //       })
  //       break;
  //     case 'upright':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         transform: "rotate(135deg) scaleY(-1)",
  //         "-webkit-transform" : "rotate(135deg) scaleY(-1)",
  //         left : "-40px",
  //         top : "-10px"
  //       })
  //       break;
  //     case 'downleft':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         transform: "rotate(-45deg)",
  //         "-webkit-transform" : "rotate(-45deg)",
  //         left : "-10px",
  //         top : "-40px"
  //       })
  //       break;
  //     case 'downright':
  //       $(`#${data.socket}`).find('.userScroll').css({
  //         display : "block",
  //         transform: "rotate(45deg) scaleX(-1)",
  //         "-webkit-transform" : "rotate(45deg) scaleX(-1)",
  //         left : "-45px",
  //         top : "-45px"
  //       })
  //       break;
  //   }
  //}
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
})

socket.on('User Left', (user) => {
  if(user){
    $(`#${user.socket}`).remove();
    delete onlineUsers[user.socket];
  }
});

socket.on('New Object', (data) => {
  addNewObject(data);
})

socket.on('Object has moved', (data) => {
  $(`#${data.objectId}`).css({
    left : data.newPos.x,
    top : data.newPos.y
  });
});
