menuIsVisible = false;

class ScrollZone {
  constructor(direction) {
    this.direction = direction;
  }
  startScrolling(){
      switch(this.direction){
        case 'left':
          if(screenPos.left <= 0){
            screenPos.left += 3;
            thisUser.pos.x -= 3;
            thisUser.updatePos(thisUser.pos, 'left');
            $('#environment').css({
              left : screenPos.left,
            });
            $('#thisUserScrollLeft').css({
              display : "block"
            })
          }
          break;
        case 'right':
          if(screenPos.left >= -100000){
            screenPos.left -= 3;
            thisUser.pos.x += 3;
            thisUser.updatePos(thisUser.pos, 'right')
            $('#environment').css({
              left : screenPos.left
            })
            $('#thisUserScrollRight').css({
              display : "block"
            })
          }
          break;
        case 'up':
          if(screenPos.top <= 0){
            screenPos.top += 3;
            thisUser.pos.y -= 3;
            thisUser.updatePos(thisUser.pos, 'up');
            $('#environment').css({
              top : screenPos.top,
            });
            $('#thisUserScrollUp').css({
              display : "block"
            })
          }
          break;
        case 'down':
          if(screenPos.top >= -100000){
            screenPos.top -= 3;
            thisUser.pos.y += 3;
            thisUser.updatePos(thisUser.pos, 'down')
            $('#environment').css({
              top : screenPos.top
            })
            $('#thisUserScrollDown').css({
              display : "block"
            })
          }
          break;
      }
  }

}

$(document).ready(() => {

  //DECLARE SCROLL ZONES
  let scrollZones = {
    left : new ScrollZone('left'),
    right : new ScrollZone('right'),
    up : new ScrollZone('up'),
    down : new ScrollZone('down')
  }

  function toggleMenu(){
    if(menuIsVisible){
      $('#menu').css('display', 'none');
      menuIsVisible = false;
    }else{
      $('#menu').css('display', 'flex');
      menuIsVisible = true
    }
  }

  //KEY PRESSES
  $(document).keydown(function(e) {
    switch(e.keyCode){
      //ESC
      case 27:
        toggleMenu();
        break;
    }
  });

  //WHAT HAPPENS WHEN YOU HAVE THE MOUSE OVER ANY OF THE SCROLL ZONES
  let scrollInterval = null;
  $('.scrollZone').mouseover((e) => {
    scrolling = true;
    scrollInterval = setInterval(function () {
      scrollZones[e.target.attributes[2].nodeValue].startScrolling();
    }, 10);
  });
  $('.scrollZone').mouseout((e) => {
    scrolling = false;
    $('.thisUserScrollImg').css('display', 'none');
    socket.emit('User stopped scrolling');
    clearInterval(scrollInterval);
  })

})
