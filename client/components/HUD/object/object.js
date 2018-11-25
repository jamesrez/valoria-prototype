let selectedObject = null;

function addObject(object, i){
  let newObjectElement;
  if(i == 0){
    newObjectElement = `
      <div class='objectSelected'>
        <img class='objectSrc' src=${object.src}>
        <p class='objectKey' hidden>${object.key}</p>
      </div>
    `
    $('.objectPreviewSrc').attr('src', object.src);
    $('.objectPreviewKey').text(object.key);
    selectedObject = object.src;
  }else{
    newObjectElement = `
      <div class='objectSelection'>
        <img class='objectSrc' src=${object.src}>
        <p class='objectKey' hidden>${object.key}</p>
      </div>
    `
  }
  $('.availableObjects').append(newObjectElement)
}

$(document).ready(() => {

  selectedObject = $('.objectSelected').find('.objectSrc').attr('src');
  //SELECT object
  $(document).on('click', '.objectSelection', function(){
    $('.objectSelected').addClass('objectSelection', true)
    $('.objectSelected').removeClass('objectSelected');
    $(this).addClass('objectSelected');
    $(this).removeClass('objectSelection');
    $('.objectPreviewSrc').attr('src', $(this).find('.objectSrc').attr('src'));
    $('.objectPreviewKey').text($(this).find('.objectKey').text());
    selectedObject = $('.objectSelected').find('.objectSrc').attr('src');
  });

  $(document).on('click', '.selectYourObjectBtn', function(){
    thisUser.object = selectedObject;
    $('.objectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    $('.menuSelectContainer').css('display', 'flex');
    $('#objectScreenSelect').find('.menuSelectionImg').attr('src', selectedObject);
    menuIsVisible = false;
    $('.dimension').css('display', 'block');
    if(!fromMenuSelection){
      fromMenuSelection = true;
    }
  });

})

//Uploading Object to User
function uploadObjectToUser(){

  let objectSrc = $('.uploadObjectInput').val();
  // let objectKey = $('.uploadObjectKey').val();
  let userId = $('#currentUserId').text();


  if(objectSrc.length > 0){
    let newObject = {
      src : objectSrc,
    }

    axios.post(`/user/${userId}/objects/new`, {newObject}).then(response => {
      $('.uploadObjectInput').val("");
      $('.uploadObjectKey').val("");
      addObject(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
}

//Uploading Object to User
function uploadObjectToDimension(){

  let objectSrc = $('.uploadObjectInput').val();
  let objectKey = $('.uploadObjectKey').val();
  let dimensionName = $('#dimensionName').text()


  if(objectSrc.length > 0 && objectKey.length > 0){
    let newObject = {
      src : objectSrc,
      key : objectKey
    }

    axios.post(`/dimension/${dimensionName}/objects/new`, {newObject}).then(response => {
      $('.uploadObjectInput').val("");
      $('.uploadObjectKey').val("");
      addObject(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
}
