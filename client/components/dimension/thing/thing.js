let editMode = false;
let typeMode = false;

function addNewThing(thing){
  things[thing.elemId] = new Thing()
  things[thing.elemId].elemId = thing.elemId;
  things[thing.elemId].docId = thing._id;
  things[thing.elemId].pos = thing.pos;
  things[thing.elemId].width = thing.width;
  things[thing.elemId].height = thing.height;
  things[thing.elemId].color = thing.color;
  things[thing.elemId].renderAtPos('square');
}

class Thing {
  constructor(){
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
      stop : (e, ui) => this.updateSize(ui)
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
    this.pos.x = newPos.x - (this.width / 2);
    this.pos.y = newPos.y - (this.height / 2);
    $(`#${this.elemId}`).css({
      left : this.pos.x,
      top : this.pos.y
    });
  }
  changeColor(color){
    $(`#${this.elemId}`).css('background-color', color.toRgbString());
    socket.emit('Save new color of thing', {
      docId : this.docId,
      elemId : this.elemId,
      color : color.toRgbString()
    })
  }
  updateSize(ui){
    socket.emit('Save new size of thing', {
      docId : this.docId,
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
      addNewThing(thing);
    })
  })

////////////////////EVENT LISTENERS///////////////

  //DRAG THING ON MOUSE DOWN
  $(document).on('mousedown', '.thing', (e) => {
    if(userIsTyping && e.target.className != 'thingText'){
      userIsTyping = false;
      typeMode = false;
    }
    else if(typeMode && editMode && !userIsTyping){
      userIsTyping = true;
      let thingText = $(`<div class="thingText" contenteditable="true"></div>`);
      thingText.css({
        position : "absolute",
        top : e.pageY - $(`#${thingBeingEdited}`).offset().top,
        left : e.pageX - $(`#${thingBeingEdited}`).offset().left,
      })
      $(`#${thingBeingEdited}`).append(thingText);
    }else if(e.target.classList[0] != 'ui-resizable-handle'){
      thingBeingDragged = e.target.id ? e.target.id : e.target.offsetParent.id ;
    }
  })
  //RELEASE OBJECT BEING DRAGGED ON MOUSE UP
  $(document).on('mouseup', '.thing', (e) => {
    if(thingBeingDragged){
      socket.emit('Save new position of thing', {
        docId : things[thingBeingDragged].docId,
        elemId : thingBeingDragged,
        newPos : things[thingBeingDragged].pos
      });
      thingBeingDragged = false;
    }
  });
  //DRAG THING ON MOUSE MOVE
  $('.dimension').on('mousemove', (e) => {
    if(thingBeingDragged){
      things[thingBeingDragged].updatePos(mousePosition);
    }
  })
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
    if(e.keyCode == 84 && editMode && !typeMode){
      typeMode = true;
      $(`#${thingBeingEdited}`).css('cursor', 'text')
    }
    //Pressing Enter
    else if(e.keyCode == 13 && userIsTyping){
      userIsTyping = false;
      typeMode = false;
      $(`#${thingBeingEdited}`).css('cursor', 'grab')
    }
    else if(e.keyCode == 70 && editMode){
      $(`#${thingBeingEdited}`).remove();
      socket.emit('Thing got deleted', {
        docId : things[thingBeingEdited].docId,
        elemId : things[thingBeingEdited].elemId
      });
      delete things[thingBeingEdited];
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
