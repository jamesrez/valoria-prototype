let inTextEditor = false;
let originalTextElemPosTop;
let originalTextElemPosLeft;
let texts = {};
let textBeingDragged;

class TextElem{
  constructor(text){
    this.elemId = text.elemId;
    this.textId = text._id;
    this.pos = text.pos;
    this.width = text.width;
    this.height = text.height;
    this.color = text.color;
    this.fontSize = text.fontSize;
    this.align = text.align;
    this.thing = text.thing;
    this.content = text.content;
  }
  renderAtPos(){
    let newText = $(`.text.prototype`).clone()
    newText.removeClass('prototype');
    newText.attr('id', this.elemId);
    newText.css('display', 'flex');
    newText.css({
      left : this.pos.x,
      top : this.pos.y,
      color : this.color,
      width : this.width,
      height : this.height,
      fontSize : this.fontSize,
      textAlign : this.align
    })
    newText[0].childNodes[0].nodeValue = this.content;
    if(this.thing){
      newText.appendTo(`#${this.thing}`);
    }else{
      newText.appendTo('.things');
    }
    newText.resizable({
      handles: 'n, e, s, w, se, ne, sw, nw',
      stop : (e, ui) => this.updateSize(ui)
    });
    newText.draggable({
      start : (e, ui) => {
        $('#thisUserAvatar').css('display', 'none');
        $(`#${this.elemId}`).css('cursor', 'grab');
        $(`#${this.elemId}`).css('pointerEvents', 'none');
        textBeingDragged = this.elemId;
      },
      stop : (e, ui) => {
        this.updatePos(ui.position)
        $('#thisUserAvatar').css('display', 'block');
        $(`#${this.elemId}`).css('cursor', 'none');
        $(`#${this.elemId}`).css('pointerEvents', 'all');
        textBeingDragged = null;
      }
    });
    newText.find('.textColorInput').spectrum({
      color : this.color,
      showInput : true,
      showAlpha : true,
      showPalette : true,
      move : (color) => {
        texts[this.elemId].color = color.toRgbString();
        $(`#${this.elemId}`).css('color', color.toRgbString());
        $(`#${this.elemId}`).find('.textColorInput').css("backgroundColor", color.toRgbString());
      },
      change : (color) => {
        socket.emit('Save new color of text', {
          textId : this.textId,
          elemId : this.elemId,
          color : color.toRgbString()
        })
      }
    });
    newText.find('.textColorInput').css("backgroundColor", this.color);
  }
  updatePos(newPos){
    if(!textBeingAttached){
      this.pos.x = newPos.left;
      this.pos.y = newPos.top;
      socket.emit('Save new position of text', {
        textId : this.textId,
        elemId : this.elemId,
        newPos : this.pos
      });
    }else{
      textBeingAttached = false;
    }
  }
  updateSize(ui){
    socket.emit('Save new size of text', {
      textId : this.textId,
      elemId : this.elemId,
      size : ui.size,
      pos : ui.position
    })
  }
}

function addNewText(text){
  texts[text.elemId] = new TextElem(text);
  texts[text.elemId].renderAtPos();
  $(`#${text.elemId}`).css('flex-direction', 'column');
}

$(document).ready(() => {
  //Load All Texts in Dimension
  $.get(`/dimension/${dimensionName}/environment/texts`, (texts) => {
    texts.forEach((text) => {
      addNewText(text);
    })
  });
})

let inToolbar;
$(document).on('focus', '.text', (e) => {
  let thisTextElem = e.currentTarget.id;
  userIsTyping = true
  $('#thisUserAvatar').css('display', 'none');
  $(`#${thisTextElem}`).css('cursor', 'text');
  $(`#${thisTextElem}`).draggable("disable");
  $(`#${thisTextElem}`).find('.textToolbar').css('display', 'flex');
})

$(document).on('mousedown', '.textToolbar', (e) => {
  inToolbar = true;
  let textElem;
  if(e.target.className == "fontSize"){
    textElem = e.target.parentNode.parentNode.id;
  }else{
    textElem = e.delegateTarget.activeElement.id
  }
});

$(document).on('blur', '.text', (e) => {
  let thisTextElem = e.currentTarget.id;
  if(!inToolbar){
    userIsTyping = false;
    $('#thisUserAvatar').css('display', 'block');
    $(`#${thisTextElem}`).css('cursor', 'none');
    $(`#${thisTextElem}`).draggable("enable");
    $(`#${thisTextElem}`).find('.textToolbar').css('display', 'none');
    let textContent = $(`#${thisTextElem}`)[0].innerText;
    texts[thisTextElem].content = textContent;
    socket.emit("Update text content", {
      elemId : thisTextElem,
      textId : texts[thisTextElem].textId,
      content : textContent
    })
  }else{
    $(`#${thisTextElem}`)[0].focus();
  }
  inToolbar = false;
})

//KEY PRESSES
$(document).keydown((e) => {
  if(e.keyCode == 70 && !userIsTyping){
    let mouseElem = document.elementFromPoint(mouseOnScreenPos.x, mouseOnScreenPos.y);
    if(mouseElem && mouseElem.classList[0] == 'text'){
      $(`#${mouseElem.id}`).remove();
      let thingId = texts[mouseElem.id].thing ? things[texts[mouseElem.id].thing].thingId : false;
      socket.emit("Text got deleted", {
        textId : texts[mouseElem.id].textId,
        elemId : mouseElem.id,
        thingId : thingId
      });
      delete texts[mouseElem.id];
    }
  }
});

function setFontSize(e){
  $(e).parents('.text').css('fontSize', $(e).val());
  texts[$(e).parents('.text')[0].id].fontSize = $(e).val();
  socket.emit("Change text fontsize", {
    textId : texts[$(e).parents('.text')[0].id].textId,
    elemId : $(e).parents('.text')[0].id,
    fontSize : $(e).val()
  })
}

function leftAlign(e){
  $(e).parents('.text').css('textAlign', 'left');
  texts[$(e).parents('.text')[0].id].align = 'left';
  socket.emit("Change text align", {
    textId : texts[$(e).parents('.text')[0].id].textId,
    elemId : $(e).parents('.text')[0].id,
    align : "left"
  })
}

function centerAlign(e){
  $(e).parents('.text').css('textAlign', 'center');
  texts[$(e).parents('.text')[0].id].align = 'center';
  socket.emit("Change text align", {
    textId : texts[$(e).parents('.text')[0].id].textId,
    elemId : $(e).parents('.text')[0].id,
    align : "center"
  })
}

function rightAlign(e){
  $(e).parents('.text').css('textAlign', 'right');
  texts[$(e).parents('.text')[0].id].align = 'right';
  socket.emit("Change text align", {
    textId : texts[$(e).parents('.text')[0].id].textId,
    elemId : $(e).parents('.text')[0].id,
    align : "right"
  })
}

//Socket Listeners
socket.on("New text", (newText) => {
  addNewText(newText);
})

socket.on("Text got deleted", textId => {
  $(`#${textId}`).remove();
  delete texts[textId];
});

socket.on("Update text content", data => {
  texts[data.elemId].content = data.content;
  $(`#${data.elemId}`)[0].childNodes[0].nodeValue = data.content;
})

socket.on("Update text position", data => {
  texts[data.elemId].pos = data.newPos;
  $(`#${data.elemId}`).css({
    top : data.newPos.y,
    left : data.newPos.x
  })
})

socket.on('Update text size', (data) => {
  texts[data.elemId].width = data.size.width;
  texts[data.elemId].height = data.size.height;
  texts[data.elemId].pos.x = data.pos.left;
  texts[data.elemId].pos.y = data.pos.top;
  $(`#${data.elemId}`).css({
    top : data.pos.top,
    left : data.pos.left,
    width :data.size.width,
    height : data.size.height
  })
});

socket.on('Update text color', (data) => {
  texts[data.elemId].color = data.color;
  $(`#${data.elemId}`).css('color', data.color);
  $(`#${data.elemId}`).find('.thingColorInput').spectrum({
    color : data.color,
  });
})

socket.on('Update text fontsize', (data) => {
  texts[data.elemId].fontSize = data.fontSize;
  $(`#${data.elemId}`).css('fontSize', data.fontSize);
})

socket.on('Update text align', (data) => {
  texts[data.elemId].align = data.align;
  $(`#${data.elemId}`).css('textAlign', data.align);
})

socket.on("Text attached to thing", (data) => {
  texts[data.elemId].pos = data.newPos;
  $(`#${data.thingId}`).append($(`#${data.elemId}`));
  $(`#${data.elemId}`).css({
    top : texts[data.elemId].pos.y,
    left : texts[data.elemId].pos.x
  })

})
