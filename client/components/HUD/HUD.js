menuIsVisible = true;
let fromMenuSelection = false;

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
            $('.dimension').css({
              left : screenPos.left,
            });
            $('#background').css({
              left : screenPos.left,
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   top : "-22px",
            //   left : "-7px",
            // })
          }
          break;
        case 'right':
          if(screenPos.left >= -100000){
            screenPos.left -= 3;
            thisUser.pos.x += 3;
            thisUser.updatePos(thisUser.pos, 'right')
            $('.dimension').css({
              left : screenPos.left
            })
            $('#background').css({
              left : screenPos.left,
            })
            // $('#thisUserScroll').css({
            //   left : "-45px",
            //   top : "-20px",
            //   "-webkit-transform": "scaleX(-1)",
            //   transform: "scaleX(-1)",
            //   display : "block"
            // })
          }
          break;
        case 'up':
          if(screenPos.top <= 0){
            screenPos.top += 3;
            thisUser.pos.y -= 3;
            thisUser.updatePos(thisUser.pos, 'up');
            $('.dimension').css({
              top : screenPos.top,
            });
            $('#background').css({
              top : screenPos.top,
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   left : "-25px",
            //   top : "-5px",
            //   "-webkit-transform": "rotate(90deg)",
            //   transform: "rotate(90deg)",
            // })
          }
          break;
        case 'down':
          if(screenPos.top >= -100000){
            screenPos.top -= 3;
            thisUser.pos.y += 3;
            thisUser.updatePos(thisUser.pos, 'down')
            $('.dimension').css({
              top : screenPos.top
            })
            $('#background').css({
              top : screenPos.top,
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   left : "-30px",
            //   top : "-45px",
            //   "-webkit-transform" : "rotate(-90deg)",
            //   transform : "rotate(-90deg)"
            // })
          }
          break;
        case 'upleft':
          if(screenPos.left <= 0 && screenPos.top <= 0){
            screenPos.left += 3;
            screenPos.top += 3;
            thisUser.pos.x -= 3;
            thisUser.pos.y -= 3;
            thisUser.updatePos(thisUser.pos, 'upleft');
            $('.dimension').css({
              left : screenPos.left,
              top : screenPos.top
            });
            $('#background').css({
              left : screenPos.left,
              top : screenPos.top
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   transform: "rotate(45deg)",
            //   "-webkit-transform" : "rotate(45deg)",
            //   left : "-15px",
            //   top : "-10px"
            // })
          }
          break
        case 'upright':
          if(screenPos.left >= -100000 && screenPos.top <= 0){
            screenPos.left -= 3;
            screenPos.top += 3;
            thisUser.pos.x += 3;
            thisUser.pos.y -= 3;
            thisUser.updatePos(thisUser.pos, 'upright');
            $('.dimension').css({
              left : screenPos.left,
              top : screenPos.top
            });
            $('#background').css({
              left : screenPos.left,
              top : screenPos.top
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   transform: "rotate(135deg) scaleY(-1)",
            //   "-webkit-transform" : "rotate(135deg) scaleY(-1)",
            //   left : "-40px",
            //   top : "-10px"
            // })
          }
          break
        case 'downleft':
          if(screenPos.left <= 0 && screenPos.top >= -100000){
            screenPos.left += 3;
            screenPos.top -= 3;
            thisUser.pos.x -= 3;
            thisUser.pos.y += 3;
            thisUser.updatePos(thisUser.pos, 'downleft');
            $('.dimension').css({
              left : screenPos.left,
              top : screenPos.top
            });
            $('#background').css({
              left : screenPos.left,
              top : screenPos.top
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   transform: "rotate(-45deg)",
            //   "-webkit-transform" : "rotate(-45deg)",
            //   left : "-10px",
            //   top : "-40px"
            // })
          }
          break
        case 'downright':
          if(screenPos.left >= -100000 && screenPos.top >= -100000){
            screenPos.left -= 3;
            screenPos.top -= 3;
            thisUser.pos.x += 3;
            thisUser.pos.y += 3;
            thisUser.updatePos(thisUser.pos, 'downright');
            $('.dimension').css({
              left : screenPos.left,
              top : screenPos.top
            });
            $('#background').css({
              left : screenPos.left,
              top : screenPos.top
            })
            // $('#thisUserScroll').css({
            //   display : "block",
            //   transform: "rotate(45deg) scaleX(-1)",
            //   "-webkit-transform" : "rotate(45deg) scaleX(-1)",
            //   left : "-45px",
            //   top : "-45px"
            // })
          }
          break
      }
  }
}

$(document).ready(() => {

  //ONLY LOAD THE MENU IF RENDERING FROM MAIN. Otherwise load a random avatar and object.
  if($('#doorRender').text()){
    $('#menu').css('display', 'none');
    menuIsVisible = false;
    fromMenuSelection = true;
  }

  //DECLARE SCROLL ZONES
  let scrollZones = {
    left : new ScrollZone('left'),
    right : new ScrollZone('right'),
    up : new ScrollZone('up'),
    down : new ScrollZone('down'),
    upleft : new ScrollZone('upleft'),
    upright : new ScrollZone('upright'),
    downleft : new ScrollZone('downleft'),
    downright : new ScrollZone('downright')
  }
  function toggleMenu(){
    if(menuIsVisible){
      $('#menu').css('display', 'none');
      menuIsVisible = false;
    }else{
      $('#menu').css('display', 'flex');
      $('.menuSelectContainer').css('display', 'flex');
      $('.objectContainer').css('display', 'none');
      $('.avatarContainer').css('display', 'none');
      $('.backgroundContainer').css('display', 'none');
      $('.newDimensionContainer').css('display', 'none');
      $('.thingSelectContainer').css('display', 'none');
      menuIsVisible = true
      fromMenuSelection = true;
    }
  }

  //KEY PRESSES
  $(document).keydown(function(e) {
    switch(e.keyCode){
      //ESC
      case 27:
        if(fromMenuSelection){
          toggleMenu();
        }
        break;
    }
  });

  //WHAT HAPPENS WHEN YOU HAVE THE MOUSE OVER ANY OF THE SCROLL ZONES
  let scrollInterval = null;
  $('.scrollZone').mouseover((e) => {
    if(thisUser.isVisible){
      scrolling = true;
      scrollInterval = setInterval(function () {
        scrollZones[e.target.attributes[2].nodeValue].startScrolling();
      }, 10);
    }
  });
  $('.scrollZone').mouseout((e) => {
    if(thisUser.isVisible){
      scrolling = false;
      // $('#thisUserScroll').css({
      //   display : 'none',
      //   "-webkit-transform": "scaleX(1)",
      //   transform: "scaleX(1)",
      //   "-webkit-transform": "rotate(0deg)",
      //   transform: "rotate(0deg)"
      // });
      socket.emit('User stopped scrolling', thisUser.dimension);
      clearInterval(scrollInterval);
    }
  })

})
