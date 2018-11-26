let mouseOnScreenPos = {
  x : null,
  y : null
};
let dimensionName = null;

$(document).ready(() => {
  dimensionName = $('#dimensionName').text();
  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  console.log(backgroundSrc);
  $('.dimension').css('background-image', `url(${backgroundSrc})`);

  //KEY PRESSES. *** SHOULD BE SPECIFIC TO EVERY DIMENSION. ***
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
    }
  });

});

socket.on('Background Change', (newBackground) => {
  $('.dimension').css('background-image', `url(${newBackground.src})`)
  $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', newBackground.src);
})
