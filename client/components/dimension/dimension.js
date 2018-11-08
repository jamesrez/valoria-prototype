let mouseOnScreenPos = {
  x : null,
  y : null
};
let userIsTyping = false;
let dimensionName = null;

function joinDimension(name){
  $.get(`/api/dimension/${name}`, dimension => {
    //FIRST WE MUST CLEAR THE CURRENT DIMENSION
    $('.things').empty()
    $('.user').remove();
    $('.objects').empty();
    objects = {};
    things = {};
    //SECOND WE MUST CLEAR THE MENU OPTIONS
    $('.availableAvatars').empty();
    $('.availableObjects').empty();
    //NOW WE LOAD THE DIMENSION
    dimension.environmentObjects.forEach((object) => {
      addNewObject(object);
    });
    // dimension.livechats.forEach((livechat) => {
    //   addNewLivechat(livechat);
    // });
    dimension.avatars.forEach((avatar) => {
      addAvatar(avatar);
    })
    dimension.objects.forEach((object) => {
      addObject(object);
    })
    $('#background').css('background-image', `url(${dimension.background.src})`)
    $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', dimension.background.src);
    let randAvatar = getRandomAvatar()
    console.log(randAvatar);
    $('#thisUserAvatar').attr('src', randAvatar);
    $('#thisUser').css('display', 'block');
    thisUser.avatar = randAvatar;
    let randObject = getRandomObject();
    thisUser.object = randObject;
  })
}

$(document).ready(() => {
  dimensionName = $('#dimensionName').text();

  //Dimensional Doors
  let insideDimensionalDoor = false;
  $(document).on('mouseover', '.dimensionalDoor', (e) => {
    insideDimensionalDoor = e.target.id;
    $('#thisUser').css('display', 'none');
  })
  $(document).on('mouseleave', '.dimensionalDoor', (e) => {
    insideDimensionalDoor = false;
    $('#thisUser').css('display', 'block');
  })
  $(document).on('mouseleave', (e) => {
    if($('#dimensionRender').text()){
      $('#thisUser').css('display', 'none');
    }
  })
  $(window).on('blur', (e) => {
    if(insideDimensionalDoor){
      joinDimension(insideDimensionalDoor);
    }
  })


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
      //ENTER KEY and Inside Dimensional Door
      case 13:
        if(insideDimensionalDoor){
          joinDimension(insideDimensionalDoor)
        }
        break;
    }
  });

});
