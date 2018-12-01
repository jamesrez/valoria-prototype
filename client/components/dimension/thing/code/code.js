let codes = {};

function addNewCode(thing, code){
  things[thing.elemId] = new Thing()
  things[thing.elemId].docId = code._id;
  things[thing.elemId].elemId = thing.elemId;
  things[thing.elemId].thingId = thing._id;
  things[thing.elemId].pos = thing.pos;
  things[thing.elemId].width = thing.width;
  things[thing.elemId].height = thing.height;
  things[thing.elemId].color = thing.color;
  things[thing.elemId].kind = thing.kind;
  things[thing.elemId].renderAtPos(thing.kind);
  codes[thing.elemId] = {
    mirror : CodeMirror($(`#${thing.elemId}`).find('.codeContainer')[0], {
      mode:  "javascript",
      lineNumbers: "true",
      theme : "hopscotch",
      lint : "true"
    })
  }
  codes[thing.elemId].mirror.setValue(code.content)
}

$(document).ready(() => {

});

$(document).on('mouseup', '.codeContainer', (e) => {
  userIsTyping = true;
  let thingId = e.currentTarget.offsetParent.id
  $(`#${thingId}`).draggable("disable");
});

$(document).on('blur', '.codeContainer', (e) => {
  let thingId = e.currentTarget.offsetParent.id
  let mirror = codes[thingId].mirror;
  $(`#${thingId}`).draggable("enable");
  socket.emit('Send code', {
    content : mirror.getValue(),
    codeId : things[thingId].docId
  });
  userIsTyping = false;
});

//Socket listeners
socket.on('New code', data => {
  addNewCode(data.thing, data.code)
})
