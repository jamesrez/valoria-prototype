let editMode = false;
let typeMode = false;

function addNewThing(thing){
  things[thing.elemId] = new Thing()
  things[thing.elemId].elemId = thing.elemId;
  //things[thing.elemId].docId = this._id;
  things[thing.elemId].renderAtPos(thing.pos, 'square');
}

class Thing {
  constructor(){
    this.docId = null;
    this.elemId = null;
    this.socket = socket;
    this.dimension = null;
    this.width = 100;
    this.height = 100;
    this.pos = {
      x : null,
      y : null
    };
  }
  renderAtPos(pos, typeOfThing){
    let newThing = $(`.thing.prototype.${typeOfThing}`).clone()
    newThing.removeClass('prototype');
    newThing.attr('id', this.elemId);
    newThing.css('display', 'flex');
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    newThing.css({
      left : this.pos.x,
      top : this.pos.y
    })
    newThing.appendTo('.things');
    newThing.resizable({
      handles: 'n, e, s, w, se, ne, sw, nw',
    });
    newThing.find('.thingColorInput').spectrum({
      color : '#557062',
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
  }
}

$(document).ready(() => {

  let thingBeingDragged = false;
  let thingBeingEdited = false;

  addNewThing({
    elemId : "thing",
     pos : {
       x : 50000,
       y : 50000
     }
   });

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
      socket.emit('Save new position of livechat', {
        docId : things[thingBeingDragged].docId,
        newPos : things[thingBeingDragged].pos
      });
      thingBeingDragged = false;
    }
  });
  //DRAG THING ON MOUSE MOVE
  $(document).on('mousemove', '.thing', (e) => {
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
    editMode = false;
    $('#thisUserAvatar').css('display', 'block');
    $(`#${thingBeingEdited}`).css('cursor', 'none');
    $(`#${thingBeingEdited}`).find('.sp-replacer').css('display','none')
  })

  //KEY PRESSES
  $(document).keydown(function(e) {
    //Type some text with T in EditMode
    if(e.keyCode == 84 && editMode && !typeMode){
      typeMode = true;
      $(`#${thingBeingEdited}`).css('cursor', 'text')
    }
    else if(e.keyCode == 13 && userIsTyping){
      userIsTyping = false;
      typeMode = false;
      $(`#${thingBeingEdited}`).css('cursor', 'grab')
    }
  });

})
