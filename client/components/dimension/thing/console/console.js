let consoles = {};

function addNewConsole(thing, console){
  addNewThing(thing);
  things[thing.elemId].docId = console._id;
  let newConsole = $('.console').clone();
  newConsole.removeClass('prototype');
  newConsole.css('display', 'flex');
  $(`#${thing.elemId}`).append(newConsole);
}

$(document).ready(() => {
});

$(document).on('mouseup', '.consoleContainer', (e) => {
  userIsTyping = true;
  let thingId = e.currentTarget.offsetParent.id
  $(`#${thingId}`).draggable("disable");
  $(`#${thingId}`).find('.consoleContent').focus();
});

//Socket listeners
socket.on('New console', data => {
  addNewConsole(data.thing, data.console)
})
