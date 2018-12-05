let editMode = false;
let userIsTyping = false;
let thingBeingDragged = false;
let thingBeingEdited = false;
let textBeingAttached = false;

function toggleUserIsTyping(){
  userIsTyping = userIsTyping ? false : true;
}

function loadThing(thing){
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
    case "code":
      $.get(`/code/${thing._id}`, (code) => {
        addNewCode(thing, code);
      })
  }
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
  things[thing.elemId].image = thing.image;
  things[thing.elemId].video = thing.video;
  things[thing.elemId].audio = thing.audio;
  things[thing.elemId].creator = thing.creator;
  things[thing.elemId].isPrivate = thing.isPrivate;
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
    this.texts = null;
    this.image = null;
    this.video = null;
    this.audio = null;
  }
  renderAtPos(typeOfThing){
    let newThing = $(`.thing.prototype`).clone();
    newThing.removeClass('prototype');
    newThing.attr('id', this.elemId);
    newThing.css('display', 'flex');
    newThing.css({
      left : this.pos.x,
      top : this.pos.y,
      backgroundColor : this.color,
      width : this.width,
      height : this.height,
      backgroundImage : `url("${this.image}")`
    })
    if(this.video){
      newThing.find('.thingVideo').css('display', 'block');
      newThing.find('.thingVideo').attr('src', this.video);
    }
    if(this.audio){
      newThing.find('.thingAudio').css('display', 'block');
      newThing.find('.thingAudio').attr('src', this.audio);
    }
    newThing.find('.thingPrivateInput').attr('checked', this.isPrivate);
    newThing.appendTo('.things');
    newThing.resizable({
      handles: 'e, s, w, se, sw',
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
      move : (color) => this.changeColor(color),
      change : (color) => {
        socket.emit('Save new color of thing', {
          docId : this.thingId,
          elemId : this.elemId,
          color : color.toRgbString()
        })
      }
    });
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

  //Load All Things in Dimension
  $.get(`/dimension/${dimensionName}/environment/things`, (things) => {
    things.forEach((thing) => {
      loadThing(thing);
    })
  })

////////////////////EVENT LISTENERS///////////////
  //ENTER EDIT MODE ON MOUSE ENTER
  $(document).on('mouseenter', '.thing', (e) => {
    thingBeingEdited = e.currentTarget.id;
    editMode = true;
    $('#thisUserAvatar').css('display', 'none');
    $(`#${thingBeingEdited}`).css('cursor', 'grab');
    $(`#${thingBeingEdited}`).find('.thingToolbox').css('display','flex')
    if(textBeingDragged){
      $(`#${thingBeingEdited}`).css('border', '2px solid yellow');
    }
  })
  //EXIT EDIT MODE ON MOUSE LEAVE
  $(document).on('mouseleave', '.thing', (e) => {
    if(!thingBeingDragged){
      editMode = false;
      $('#thisUserAvatar').css('display', 'block');
      $(`#${thingBeingEdited}`).css('cursor', 'none');
      $(`#${thingBeingEdited}`).find('.thingToolbox').css('display','none')
      $(`#${thingBeingEdited}`).find('.thingMediaContainer').css('display','none')
      $(`#${thingBeingEdited}`).find('.thingSettingsContainer').css('display','none')
      if(textBeingDragged){
        $(`#${thingBeingEdited}`).css('border', '0px solid yellow');
      }
    }else{
      things[thingBeingDragged].updatePos(mousePosition);
    }
  });
  //Release Text on thing
  $(document).on('mouseup', '.thing', (e) => {
    if(textBeingDragged && !$(`#${thingBeingEdited}`).find(`#${textBeingDragged}`)[0]){
      textBeingAttached = true;
      $(`#${thingBeingEdited}`).append($(`#${textBeingDragged}`));
      $(`#${textBeingDragged}`).css({
        top : "auto",
        left : "auto"
      });
      texts[textBeingDragged].pos.x = $(`#${textBeingDragged}`).position().left;
      texts[textBeingDragged].pos.y = $(`#${textBeingDragged}`).position().top;
      socket.emit("Text attached to thing", {
        elemId : textBeingDragged,
        textId : texts[textBeingDragged].textId,
        newPos : texts[textBeingDragged].pos,
        thing : thingBeingEdited,
        thingId : things[thingBeingEdited].thingId
      });
    }
    $(`#${thingBeingEdited}`).css('border', '0px solid yellow');
  });

  //Thing Media Container Toggle
  $(document).on('click', '.thingMediaBtn', function(e) {
    if(editMode){
      let thisMedia = $(`#${thingBeingEdited}`).find('.thingMediaContainer');
      let thisSettings = $(`#${thingBeingEdited}`).find('.thingSettingsContainer');
      if(thisMedia.css('display') == "none"){
        thisMedia.css('display', 'flex');
        thisSettings.css('display', 'none');
      }else{
        thisMedia.css('display', 'none');
      }
    }
  });

  //Thing Settings Container Toggle
  $(document).on('click', '.thingSettingsBtn', function(e) {
    if(editMode){
      let thisSettings = $(`#${thingBeingEdited}`).find('.thingSettingsContainer');
      let thisMedia = $(`#${thingBeingEdited}`).find('.thingMediaContainer');
      if(thisSettings.css('display') == "none"){
        thisSettings.css('display', 'flex');
        thisMedia.css('display', 'none');
      }else{
        thisSettings.css('display', 'none');
      }
    }
  });

  //Set Thing Image
  $(document).on('click', '.thingImageInputBtn', function(e) {
    let imageValue = $(`#${thingBeingEdited}`).find('.thingImageInput').val();
    if(imageValue.length > 0){
      $(`#${thingBeingEdited}`).css('backgroundImage', `url("${imageValue}")`)
      things[thingBeingEdited].image = imageValue;
      $(`#${thingBeingEdited}`).find('.thingImageInput').val("");
      socket.emit("Set thing image", {
        elemId : thingBeingEdited,
        thingId : things[thingBeingEdited].thingId,
        image : imageValue
      });
    }
  });

  //Set Thing Video
  $(document).on('click', '.thingVideoInputBtn', function(e) {
    let videoValue = $(`#${thingBeingEdited}`).find('.thingVideoInput').val();
    let youtubeLink = 'https://www.youtube.com/watch?v=';
    let twitchLink = 'https://www.twitch.tv/';
    if(videoValue.length > 0){
      //Convert Youtube or Twitch to embed link
      if(videoValue.startsWith(youtubeLink)){
        videoValue = videoValue.replace("watch?v=", "embed/");
      }else if(videoValue.startsWith(twitchLink)){
        let channelName = videoValue.slice(videoValue.lastIndexOf("/") + 1, videoValue.length);
        videoValue = `https://player.twitch.tv/?channel=${channelName}`;
      }
      let thingVideoElem = $(`#${thingBeingEdited}`).find('.thingVideo');
      thingVideoElem.css('display', 'block');
      thingVideoElem.attr('src', videoValue);
      things[thingBeingEdited].video = videoValue;
      $(`#${thingBeingEdited}`).find('.thingVideoInput').val("");
      socket.emit("Set thing video", {
        elemId : thingBeingEdited,
        thingId : things[thingBeingEdited].thingId,
        video : videoValue
      });
    }
  });


  //Set Thing Audio
  $(document).on('click', '.thingAudioInputBtn', function(e) {
    let audioValue = $(`#${thingBeingEdited}`).find('.thingAudioInput').val();
    if(audioValue.length > 0){
      let thingAudioElem = $(`#${thingBeingEdited}`).find('.thingAudio');
      thingAudioElem.css('display', 'block')
      thingAudioElem.attr('src', audioValue);
      things[thingBeingEdited].audio = audioValue;
      $(`#${thingBeingEdited}`).find('.thingAudioInput').val("");
      socket.emit("Set thing audio", {
        elemId : thingBeingEdited,
        thingId : things[thingBeingEdited].thingId,
        audio : audioValue
      });
    }
  });

  // Toggle Thing Privacy
  $(document).on('click', '.thingPrivateInput', (e) => {
    let isThingPrivate = e.target.checked;
    things[thingBeingEdited].isPrivate = isThingPrivate;
    socket.emit("Toggle thing privacy", {
      elemId : thingBeingEdited,
      thingId : things[thingBeingEdited].thingId,
      isPrivate : isThingPrivate
    })
  })

  //Delete Thing
  $(document).on('click', '.thingDeleteBtn', function(e) {
    if(editMode && !userIsTyping && !insideDimensionalDoor){
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

socket.on("Set thing image", (data) => {
  things[data.elemId].image = data.image;
  $(`#${data.elemId}`).css("backgroundImage", `url("${data.image}")`);
})

socket.on("Set thing video", (data) => {
  things[data.elemId].video = data.video;
  $(`#${data.elemId}`).find('.thingVideo').css('display', 'block');
  $(`#${data.elemId}`).find('.thingVideo').attr('src', data.video);
})

socket.on("Set thing audio", (data) => {
  things[data.elemId].audio = data.audio;
  $(`#${data.elemId}`).find('.thingAudio').css('display', 'block');
  $(`#${data.elemId}`).find('.thingAudio').attr('src', data.audio);
})

socket.on('Toggle thing privacy', (data) => {
  if(data.isPrivate){
    $(`#${data.elemId}`).remove()
    delete things[data.elemId];
  }else{
    $.get(`/things/${data.thingId}`, (thing) => {
      loadThing(thing);
    })
  }
})

socket.on('Thing got deleted', (data) => {
  $(`#${data.elemId}`).remove();
  delete things[data.elemId];
})
