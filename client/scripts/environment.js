let mouseOnScreenPos = {
  x : null,
  y : null
};

function addNewLivechat(livechat){
  things[livechat.elemId] = new Thing()
  things[livechat.elemId].elemId = livechat.elemId;
  things[livechat.elemId].docId = livechat._id;
  things[livechat.elemId].renderAtPos(livechat.pos);
  livechat.messages.forEach((message) => {
    let newMessageElement = `
      <div class='livechatMessage'>
        <div class='livechatSender'>${message.sender}</div>
        <div class='livechatText'>${message.text}</div>
      </div>
    `;
    $(`#${livechat.elemId}`).find('.livechatMessageContainer').append(newMessageElement);
  })
}

function addNewObject(newObject){
  objects[newObject.elemId] = new anObject();
  objects[newObject.elemId].elemId = newObject.elemId;
  objects[newObject.elemId].src = newObject.src;
  objects[newObject.elemId].socket = newObject.socket;
  objects[newObject.elemId].dimension = newObject.dimension;
  objects[newObject.elemId].renderAtPos(newObject.pos);
}

function joinDimension(name){
  $.get(`/api/dimension/${name}`, dimension => {
    //FIRST WE MUST CLEAR THE CURRENT DIMENSION
    $('.things').empty()
    $('.user').remove();
    $('.objects').empty();
    objects = {};
    things = {};
    //SECOND WE MUST CLEAR THE MENU OPTIONS
    $('.availableAvatars').empty();
    $('.availableObjects').empty();
    //NOW WE LOAD THE DIMENSION
    dimension.environmentObjects.forEach((object) => {
      addNewObject(object);
    });
    // dimension.livechats.forEach((livechat) => {
    //   addNewLivechat(livechat);
    // });
    dimension.avatars.forEach((avatar) => {
      addAvatar(avatar);
    })
    dimension.objects.forEach((object) => {
      addObject(object);
    })
    $('#background').css('background-image', `url(${dimension.background.src})`)
    $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', dimension.background.src);
    let randAvatar = getRandomAvatar()
    console.log(randAvatar);
    $('#thisUserAvatar').attr('src', randAvatar);
    $('#thisUser').css('display', 'block');
    thisUser.avatar = randAvatar;
    let randObject = getRandomObject();
    thisUser.object = randObject;
  })
}

$(document).ready(() => {
  let dimensionName = $('#dimensionName').text();

  //Load All Livechats in Dimension
  $.get(`/dimension/${dimensionName}/environment/livechats`, (livechats) => {
    livechats.forEach((livechat) => {
      addNewLivechat(livechat);
    })
    $('.livechatMessageContainer').scrollTop($('.livechatMessageContainer')[0].scrollHeight);
  })

  //Load All Objects in Dimension
  $.get(`/dimension/${dimensionName}/environment/objects`, (objects) => {
    objects.forEach((anObject) => {
      addNewObject(anObject);
    })
  })

  let thingBeingDragged = null;
  let objectBeingDragged = null;

  //HAVE Object BE DRAGGED WHEN HOLDING click
  $(document).on('mousedown', (e) => {
    if(e.target.classList[1] == 'object'){
      objectBeingDragged = e.target.id;
    }
  });

  $(document).on('mousedown', '.thing', (e) => {
    thingBeingDragged = e.target.offsetParent.id;
  })

  //RELEASE MEME BEING DRAGGED ON MOUSE UP
  $(document).on('mouseup', (e) => {
    if(objectBeingDragged){
      socket.emit('Save new position of object', objects[objectBeingDragged]);
      objectBeingDragged = null;
    }else if(thingBeingDragged){
      socket.emit('Save new position of livechat', {
        docId : things[thingBeingDragged].docId,
        newPos : things[thingBeingDragged].pos
      });
      thingBeingDragged = null;
    }
  });

  //HAVE USER MOVE AT CURSOR
  //let mouseMoveTimer;
  $('#environment').on('mousemove', function(e){
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
    if(objectBeingDragged){
      objects[objectBeingDragged].updatePos(mousePosition);
    }else if(thingBeingDragged){
      things[thingBeingDragged].updatePos(mousePosition);
    }
  });

  //Dimensional Doors
  let insideDimensionalDoor = false;
  $(document).on('mouseover', '.dimensionalDoor', (e) => {
    insideDimensionalDoor = e.target.id;
    $('#thisUser').css('display', 'none');
  })
  $(document).on('mouseleave', '.dimensionalDoor', (e) => {
    insideDimensionalDoor = false;
    $('#thisUser').css('display', 'block');
  })
  $(document).on('mouseleave', (e) => {
    if($('#dimensionRender').text()){
      $('#thisUser').css('display', 'none');
    }
  })
  $(window).on('blur', (e) => {
    if(insideDimensionalDoor){
      joinDimension(insideDimensionalDoor);
    }
  })


  //KEY PRESSES
  $(document).keyup(function(e) {
    let mouseElem;
    switch(e.keyCode){
      //SPACE
      case 32:
        thisUser.dropObject();
        break;
      //F KEY and User Over Object
      case 70:
        mouseElem = document.elementFromPoint(mouseOnScreenPos.x, mouseOnScreenPos.y);
        if(mouseElem && mouseElem.classList[1] == 'object'){
          $(`#${mouseElem.id}`).remove();
          delete objects[mouseElem.id];
          socket.emit("Object got deleted", mouseElem.id);
        }
        break;
      //ENTER KEY and Inside Dimensional Door
      case 13:
        if(insideDimensionalDoor){
          joinDimension(insideDimensionalDoor)
        }
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
});

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

socket.on('New Object', (data) => {
  addNewObject(data);
});

socket.on('Object has moved', (data) => {
  $(`#${data.objectId}`).css({
    left : data.newPos.x,
    top : data.newPos.y
  });
});

socket.on('Object got deleted', objectElemId => {
  delete objects[objectElemId];
  $(`#${objectElemId}`).remove()
})

socket.on('New livechat', data => {
  things[data.elemId] = new Thing();
  things[data.elemId].elemId = data.elemId;
  things[data.elemId].docId = data.docId;
  things[data.elemId].renderAtPos(thisUser.pos);
})

socket.on('New message', message => {
  let newMessageElement = `
    <div class='livechatMessage'>
      <div class='livechatSender'>${message.sender}</div>
      <div class='livechatText'>${message.content}</div>
    </div>
  `;
  let thisMessageContainer = $(`#${message.elemId}`).find('.livechatMessageContainer');
  thisMessageContainer.append(newMessageElement);
  thisMessageContainer.scrollTop(thisMessageContainer[0].scrollHeight);
})
