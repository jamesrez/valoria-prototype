function addNewDoor(thing, door){
  things[thing.elemId] = new Thing()
  things[thing.elemId].elemId = thing.elemId;
  things[thing.elemId].thingId = thing._id;
  things[thing.elemId].docId = door._id;
  things[thing.elemId].pos = thing.pos;
  things[thing.elemId].width = thing.width;
  things[thing.elemId].height = thing.height;
  things[thing.elemId].color = thing.color;
  things[thing.elemId].kind = thing.kind
  things[thing.elemId].renderAtPos(thing.kind);
  if(door.dimension){
    $(`#${thing.elemId}`).css('justify-content', 'center');
    $(`#${thing.elemId}`).find('.doorDimension').css('backgroundImage', `url("${door.dimensionBackground}")`);
    $(`#${thing.elemId}`).find('.doorDimensionName').val(door.dimension);
    $(`#${thing.elemId}`).find('.doorForm').css('display', 'none');
    $(`#${thing.elemId}`).find('.doorText').text(`Click to Join ${door.dimension}`);
  }else{
    $(`#${thing.elemId}`).css('justify-content', 'flex-start');
    $(`#${thing.elemId}`).find('.doorDimensionContainer').css('display', 'none');
    $(`#${thing.elemId}`).find('.doorForm').css('display', 'flex');
  }
}

function setDoorToDimension(e){
  let elemId = e.target.offsetParent.id;
  let doorDimension = $(`#${elemId}`).find('.doorInput').val();
  let dimensionName = $('#dimensionName').text();
  let docId = things[elemId].docId;
  if(doorDimension.length > 0){
    let data = {
      elemId, doorDimension, dimensionName, docId
    };
    socket.emit('Set door dimension', data);
    $(`#${elemId}`).find('.doorInput').val("");
  }
}

function joinDimension(name){
  $.get(`/api/dimension/${name}`, dimension => {
    //FIRST WE MUST CLEAR THE CURRENT DIMENSION
    $('.things').empty()
    $('.user').remove();
    $('.objects').empty();
    objects = {};
    things = {};
    texts = {};
    //SECOND WE MUST CLEAR THE MENU OPTIONS
    $('.availableAvatars').empty();
    $('.availableObjects').empty();
    //NOW WE LOAD THE DIMENSION
    dimension.environmentObjects.forEach((object) => {
      addNewObject(object);
    });
    dimension.avatars.forEach((avatar) => {
      addAvatar(avatar);
    })
    dimension.objects.forEach((object) => {
      addObject(object);
    })
    //Load All Things in Dimension
    $.get(`/dimension/${dimension.name}/environment/things`, (things) => {
      things.forEach((thing) => {
        switch(thing.kind){
          case "square":
            addNewThing(thing);
            break;
          case "livechat":
            $.get(`/livechat/${thing._id}`, (livechat) => {
              addNewLivechat(thing, livechat)
            })
            break;
          case "door":
            $.get(`/door/${thing._id}`, (door) => {
              addNewDoor(thing, door);
            })
            break;
        }
      })
    })
    //Load All Texts in Dimension
    $.get(`/dimension/${dimension.name}/environment/texts`, (texts) => {
      texts.forEach((text) => {
        addNewText(text);
      })
    });

    $('.dimension').css('background-image', `url(${dimension.background.src})`)
    $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', dimension.background.src);
    let randAvatar = getRandomAvatar(dimension)
    $('#thisUserAvatar').attr('src', randAvatar);
    $('#thisUser').css('display', 'block');
    $('#thisUserAvatar').css('display', 'block');
    thisUser.avatar = randAvatar;
    let randObject = getRandomObject(dimension);
    thisUser.object = randObject;
    thisUser.dimension = dimension.name;
    //LETS CONNECT
    let data = {
      oldDimension : dimensionName,
      newDimension : dimension.name,
      pos : {
        x : 50000,
        y : 50000
      },
      avatar : thisUser.avatar
    }
    socket.emit('Load Online Users', dimension.name);
    socket.emit("User changed dimension", data);
    dimensionName = dimension.name;
    $('#dimensionName').text(dimension.name);
    window.focus();
  })
}


$(document).ready(() => {

});


//Dimensional Doors
let insideDimensionalDoor = false;
$(document).on('mouseover', '.doorDimension', (e) => {
  if(!thingBeingDragged){
    insideDimensionalDoor = e.target.offsetParent.id;
    $('#thisUser').css('display', 'none');
    let doorDimension = $(`#${insideDimensionalDoor}`).find('.doorDimensionName').val();
    socket.emit("User left dimension");
  }
})
$(document).on('mouseleave', '.doorDimension', (e) => {
  insideDimensionalDoor = false;
  $('#thisUser').css('display', 'block');
  let data = {
    dimension : dimensionName,
    avatar : thisUser.avatar,
    pos : thisUser.pos
  }
  socket.emit("New User", data);
})

//WHEN INSIDE DIMENSIONAL DOOR
$(document).on('mouseleave', (e) => {
  if($('#doorRender').text()){
    $('#thisUserAvatar').css('display', 'none');
    socket.emit("User left dimension");
  }
})
$(document).on('mouseenter', (e) => {
  if($('#doorRender').text()){
    $('#thisUserAvatar').css('display', 'block');
  }
})

// Click Inside Dimensional Door
$(document).on('mouseup', '.doorDimension', (e) => {
  if(insideDimensionalDoor){
    let doorDimension = $(`#${insideDimensionalDoor}`).find('.doorDimensionName').val();
    joinDimension(doorDimension);
  }
})

//Click on Dimension Door Input Button
$(document).on('click', '.doorInputBtn', (e) => {
  setDoorToDimension(e);
})

//Socket Listeners
socket.on('New door', data => {
  addNewDoor(data.thing, data.door);
})

socket.on('Set door dimension', data => {
  if(data.doorDimension){
    $(`#${data.elemId}`).css('justify-content', 'center');
    $(`#${data.elemId}`).css('background-color', 'rgba(0,0,0,0)');
    $(`#${data.elemId}`).find('.doorForm').css('display', 'none');
    $(`#${data.elemId}`).find('.doorDimensionContainer').css('display', 'flex');
    $(`#${data.elemId}`).find('.doorDimension').css('backgroundImage', `url("${data.dimensionBackground}")`);
    $(`#${data.elemId}`).find('.doorDimensionName').val(data.doorDimension);
    $(`#${data.elemId}`).find('.doorText').text(`Click to Join ${data.doorDimension}`);
  }else{
    console.log("Dimension Not Found");
  }
})
