let mouseOnScreenPos = {
  x : null,
  y : null
};
let dimensionName = null;

$(document).ready(() => {

  dimensionName = $('#dimensionName').text();
  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  $('.dimension').css('background-image', `url(${backgroundSrc})`);

  $('.dimension').on('mousemove', (e) => {
    mouseOnScreenPos.x = e.pageX;
    mouseOnScreenPos.y = e.pageY;
  })

  //If Mobile Make the dimension draggable
  let initialBpx = bpx;
  let initialBpy = bpy;
  $('.dimension').backgroundDraggable({
    bound : false,
    start: function() {
      initialBpx = parseInt($('.dimension').css('backgroundPosition').split(' ')[0]);
      initialBpy = parseInt($('.dimension').css('backgroundPosition').split(' ')[1]);
    },
    drag: function() {
      let newBpx = parseInt($('.dimension').css('backgroundPosition').split(' ')[0]);
      let newBpy = parseInt($('.dimension').css('backgroundPosition').split(' ')[1]);
      bpx = newBpx;
      bpy = newBpy;
      $('.environment').css({
        left : newBpx,
        top : newBpy
      })
    },
    done: function() {
      let newBpx = parseInt($('.dimension').css('backgroundPosition').split(' ')[0]);
      let newBpy = parseInt($('.dimension').css('backgroundPosition').split(' ')[1]);
      thisUser.realPos.x -= newBpx - initialBpx;
      thisUser.realPos.y -= newBpy - initialBpy;
      thisUser.updatePos(thisUser.realPos, "whatever");
    }
  });

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
