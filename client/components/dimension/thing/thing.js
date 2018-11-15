let editMode = false;
let userIsTyping = false;

function toggleUserIsTyping(){
  userIsTyping = userIsTyping ? false : true;
}

function addNewThing(thing){
  things[thing.elemId] = new Thing()
  things[thing.elemId].elemId = thing.elemId;
  things[thing.elemId].thingId = thing._id;
  things[thing.elemId].pos = thing.pos;
  things[thing.elemId].width = thing.width;
  things[thing.elemId].height = thing.height;
  things[thing.elemId].color = thing.color;
  things[thing.elemId].kind = thing.kind;
  things[thing.elemId].renderAtPos(thing.kind);
}

class Thing {
  constructor(){
    this.thingId = null;
    this.docId = null;
    this.elemId = null;
    this.socket = socket;
    this.dimension = null;
    this.width = 100;
    this.height = 100;
    this.color = '#557062';
    this.pos = {
      x : null,
      y : null
    };
    this.kind = null;
  }
  renderAtPos(typeOfThing){
    let newThing = $(`.thing.prototype.${typeOfThing}`).clone()
    newThing.removeClass('prototype');
    newThing.attr('id', this.elemId);
    newThing.css('display', 'flex');
    newThing.css({
      left : this.pos.x,
      top : this.pos.y,
      backgroundColor : this.color,
      width : this.width,
      height : this.height
    })
    newThing.appendTo('.things');
    newThing.resizable({
      handles: 'n, e, s, w, se, ne, sw, nw',
      stop : (e, ui) => this.updateSize(ui),
      resize :(e, ui) => $(`#${this.elemId}`).find('.thingText').css('font-size', ui.size.width / 3 + "px")
    });
    newThing.draggable({
      stop : (e, ui) => this.updatePos(ui.position)
    });
    newThing.find('.thingColorInput').spectrum({
      color : this.color,
      showInput : true,
      showAlpha : true,
      showPalette : true,
      move : (color) => this.changeColor(color)
    })
  }
  updatePos(newPos){
    this.pos.x = newPos.left;
    this.pos.y = newPos.top;
    socket.emit('Save new position of thing', {
      docId : this.thingId,
      elemId : this.elemId,
      newPos : this.pos
    });
  }
  changeColor(color){
    $(`#${this.elemId}`).css('background-color', color.toRgbString());
    socket.emit('Save new color of thing', {
      docId : this.thingId,
      elemId : this.elemId,
      color : color.toRgbString()
    })
  }
  updateSize(ui){
    socket.emit('Save new size of thing', {
      docId : this.thingId,
      elemId : this.elemId,
      size : ui.size,
      pos : ui.position
    })
  }
}

$(document).ready(() => {

  let thingBeingDragged = false;
  let thingBeingEdited = false;

  //Load All Things in Dimension
  $.get(`/dimension/${dimensionName}/environment/things`, (things) => {
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

////////////////////EVENT LISTENERS///////////////

  //DRAG THING ON MOUSE DOWN
  // $(document).on('mousedown', '.thing', (e) => {
  //   if(e.target.classList[0] != 'ui-resizable-handle'){
  //     thingBeingDragged = e.target.id ? e.target.id : e.target.offsetParent.id;
  //   }
  // })
  // //RELEASE OBJECT BEING DRAGGED ON MOUSE UP
  // $(document).on('mouseup', '.thing', (e) => {
  //   if(thingBeingDragged){
  //     socket.emit('Save new position of thing', {
  //       docId : things[thingBeingDragged].thingId,
  //       elemId : thingBeingDragged,
  //       newPos : things[thingBeingDragged].pos
  //     });
  //     thingBeingDragged = false;
  //   }
  // });
  //DRAG THING ON MOUSE MOVE
  // $('.dimension').on('mousemove', (e) => {
  //   if(thingBeingDragged){
  //     let newPos = {
  //       x : mousePosition.x + (mousePosition.x - e.pageX),
  //       y : mousePosition.y + (mousePosition.y - e.pageY),
  //     }
  //     things[thingBeingDragged].updatePos(mousePosition);
  //   }
  // })
  //ENTER EDIT MODE ON MOUSE ENTER
  $(document).on('mouseenter', '.thing', (e) => {
    thingBeingEdited = e.currentTarget.id;
    editMode = true;
    $('#thisUserAvatar').css('display', 'none');
    $(`#${thingBeingEdited}`).css('cursor', 'grab');
    $(`#${thingBeingEdited}`).find('.sp-replacer').css('display','block')
  })
  //EXIT EDIT MODE ON MOUSE LEAVE
  $(document).on('mouseleave', '.thing', (e) => {
    if(!thingBeingDragged){
      editMode = false;
      $('#thisUserAvatar').css('display', 'block');
      $(`#${thingBeingEdited}`).css('cursor', 'none');
      $(`#${thingBeingEdited}`).find('.sp-replacer').css('display','none')
    }else{
      things[thingBeingDragged].updatePos(mousePosition);
    }
  })

  //KEY PRESSES
  $(document).keydown(function(e) {
    //Type some text with T in EditMode
    // if(e.keyCode == 84 && editMode && !typeMode){
    //   typeMode = true;
    //   $(`#${thingBeingEdited}`).css('cursor', 'text')
    // }
    // //Pressing Enter
    // else if(e.keyCode == 13 && userIsTyping){
    //   userIsTyping = false;
    //   typeMode = false;
    //   $(`#${thingBeingEdited}`).css('cursor', 'grab')
    // }
    if(e.keyCode == 70 && editMode && !userIsTyping){
      $(`#${thingBeingEdited}`).remove();
      socket.emit('Thing got deleted', {
        docId : things[thingBeingEdited].thingId,
        elemId : things[thingBeingEdited].elemId
      });
      socket.emit(`Delete ${things[thingBeingEdited].kind}`, things[thingBeingEdited].docId);
      delete things[thingBeingEdited];
      editMode = false;
      $('#thisUserAvatar').css('display', 'block');
    }
  });

})

//Socket Listeners
socket.on('New thing', (thing) => {
  addNewThing(thing);
})

socket.on('Update thing position', (data) => {
  things[data.elemId].pos = data.newPos;
  $(`#${data.elemId}`).css({
    top : data.newPos.y,
    left : data.newPos.x
  })
})

socket.on('Update thing color', (data) => {
  things[data.elemId].color = data.color;
  $(`#${data.elemId}`).css('background-color', data.color);
  $(`#${data.elemId}`).find('.thingColorInput').spectrum({
    color : data.color,
  });
})

socket.on('Update thing size', (data) => {
  things[data.elemId].width = data.size.width;
  things[data.elemId].height = data.size.height;
  things[data.elemId].pos.x = data.pos.left;
  things[data.elemId].pos.y = data.pos.top;
  $(`#${data.elemId}`).css({
    top : data.pos.top,
    left : data.pos.left,
    width :data.size.width,
    height : data.size.height
  })
});

socket.on('Thing got deleted', (data) => {
  $(`#${data.elemId}`).remove();
  delete things[data.elemId];
})
