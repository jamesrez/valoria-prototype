menuIsVisible = true;
let fromMenuSelection = false;

class ScrollZone {
  constructor(direction) {
    this.direction = direction;
  }
  startScrolling(){
    bpx = parseInt($('.dimension').css('backgroundPosition').split(' ')[0]);
    bpy = parseInt($('.dimension').css('backgroundPosition').split(' ')[1]);
      switch(this.direction){
        case 'left':
          bpx += 3;
          thisUser.realPos.x -= 3;
          thisUser.updatePos(thisUser.realPos, 'left');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#background').css({
          //   left : screenPos.left,
          // })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   top : "-22px",
          //   left : "-7px",
          // })
        break;
        case 'right':
          bpx -= 3;
          thisUser.realPos.x += 3;
          thisUser.updatePos(thisUser.realPos, 'right')
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   left : "-45px",
          //   top : "-20px",
          //   "-webkit-transform": "scaleX(-1)",
          //   transform: "scaleX(-1)",
          //   display : "block"
          // })
          break;
        case 'up':
          bpy += 3;
          thisUser.realPos.y -= 3;
          thisUser.updatePos(thisUser.realPos, 'up');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   left : "-25px",
          //   top : "-5px",
          //   "-webkit-transform": "rotate(90deg)",
          //   transform: "rotate(90deg)",
          // })
          break;
        case 'down':
          bpy -= 3;
          thisUser.realPos.y += 3;
          thisUser.updatePos(thisUser.realPos, 'down')
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   left : "-30px",
          //   top : "-45px",
          //   "-webkit-transform" : "rotate(-90deg)",
          //   transform : "rotate(-90deg)"
          // })
          break;
        case 'upleft':
          bpx += 3;
          bpy += 3;
          thisUser.realPos.x -= 3;
          thisUser.realPos.y -= 3;
          thisUser.updatePos(thisUser.realPos, 'upleft');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   transform: "rotate(45deg)",
          //   "-webkit-transform" : "rotate(45deg)",
          //   left : "-15px",
          //   top : "-10px"
          // })
          break
        case 'upright':
          bpx -= 3;
          bpy += 3;
          thisUser.realPos.x += 3;
          thisUser.realPos.y -= 3;
          thisUser.updatePos(thisUser.realPos, 'upright');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   transform: "rotate(135deg) scaleY(-1)",
          //   "-webkit-transform" : "rotate(135deg) scaleY(-1)",
          //   left : "-40px",
          //   top : "-10px"
          // })
          break
        case 'downleft':
          bpx += 3;
          bpy -= 3;
          thisUser.realPos.x -= 3;
          thisUser.realPos.y += 3;
          thisUser.updatePos(thisUser.realPos, 'downleft');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   transform: "rotate(-45deg)",
          //   "-webkit-transform" : "rotate(-45deg)",
          //   left : "-10px",
          //   top : "-40px"
          // })
          break
        case 'downright':
          bpx -= 3;
          bpy -= 3;
          thisUser.realPos.x += 3;
          thisUser.realPos.y += 3;
          thisUser.updatePos(thisUser.realPos, 'downright');
          $('.dimension').css({
            backgroundPosition : `${bpx} ${bpy}`
          });
          $('.environment').css({
            left : bpx,
            top : bpy
          })
          // $('#thisUserScroll').css({
          //   display : "block",
          //   transform: "rotate(45deg) scaleX(-1)",
          //   "-webkit-transform" : "rotate(45deg) scaleX(-1)",
          //   left : "-45px",
          //   top : "-45px"
          // })
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
      $('.dimension').css('display', 'block');
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
