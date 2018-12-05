let codes = {};

function addNewCode(thing, code){
  addNewThing(thing);
  things[thing.elemId].docId = code._id;
  let newCode = $('.code').clone();
  newCode.removeClass('prototype');
  newCode.css('display', 'flex');
  $(`#${thing.elemId}`).append(newCode);
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
