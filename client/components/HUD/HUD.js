menuIsVisible = true;
let fromMenuSelection = false;
let keysBeingPressed = {};
let movementSpeed = 3;

//MOVING WITH WASD
let scrollInterval = {};
function moveScreen(direction){
  if(thisUser.isVisible && !userIsTyping){
    // scrolling = true;
    scrollInterval[direction] = setInterval(function () {
      //Move the Screen
      bpx = parseInt($('.dimension').css('backgroundPosition').split(' ')[0]);
      bpy = parseInt($('.dimension').css('backgroundPosition').split(' ')[1]);
      if(direction == 'left'){
        bpx += movementSpeed;
        thisUser.realPos.x -= movementSpeed;
      }
      if(direction == 'right'){
        bpx -= movementSpeed;
        thisUser.realPos.x += movementSpeed;
      }
      if(direction == 'up'){
        bpy += movementSpeed;
        thisUser.realPos.y -= movementSpeed;
      }
      if(direction == 'down'){
        bpy -= movementSpeed;
        thisUser.realPos.y += movementSpeed;
      }
      thisUser.updatePos(thisUser.realPos, 'left');
      $('.dimension').css({
        backgroundPosition : `${bpx} ${bpy}`
      });
      $('.environment').css({
        left : bpx,
        top : bpy
      })
    }, 10);
  }
};

function stopScreen(direction){
  if(thisUser.isVisible){
    scrolling = false;
    socket.emit('User stopped scrolling', thisUser.dimension);
    clearInterval(scrollInterval[direction]);
  }
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

  //KEY PRESSES
  $(document).keydown(function(e) {
    if(e.keyCode == 27){
      toggleMenu();
    }else{
      switch(e.keyCode){
        //W
        case 87:
          if(!keysBeingPressed["w"]){
            keysBeingPressed["w"] = true;
            moveScreen("up");
          }
          break;
        //A
        case 65:
          if(!keysBeingPressed["a"]){
            keysBeingPressed["a"] = true;
            moveScreen("left")
          }
          break;
        //S
        case 83:
          if(!keysBeingPressed["s"]){
            keysBeingPressed["s"] = true;
            moveScreen("down")
          }
          break;
        //D
        case 68:
          if(!keysBeingPressed["d"]){
            keysBeingPressed["d"] = true;
            moveScreen("right")
          }
          break;
        //Shift
        case 16:
          if(!keysBeingPressed["shift"]){
            keysBeingPressed["shift"] = true;
            movementSpeed += 5;
          }
          break;
      }
    }
  });

  $(document).keyup(function(e) {
    switch(e.keyCode){
      //W
      case 87:
        delete keysBeingPressed["w"];
        stopScreen("up");
        break;
      //A
      case 65:
        delete keysBeingPressed["a"];
        stopScreen("left");
        break;
      //S
      case 83:
        delete keysBeingPressed["s"];
        stopScreen("down");
        break;
      //D
      case 68:
        delete keysBeingPressed["d"];
        stopScreen("right");
        break;
      //Shift
      case 16:
        delete keysBeingPressed["shift"];
        movementSpeed -= 5;
        stopScreen("shift");
        break;
    }
  });



  $('.scrollZone').mouseout((e) => {
    if(thisUser.isVisible){
      // scrolling = false;
      socket.emit('User stopped scrolling', thisUser.dimension);
      clearInterval(scrollInterval);
    }
  })

})
