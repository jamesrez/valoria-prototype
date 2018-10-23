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

  //Load All Objects from User
  let userId = $('#currentUserId').text();
  $.get(`/user/${userId}/objects`, (objects) => {
    objects.forEach((object, i) => {
      addObject(object, i);
    })
  })

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

  $(document).on('click', '.selectObjectBtn', function(){
    thisUser.object = selectedObject;
    $('.objectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    $('.menuSelectContainer').css('display', 'flex');
    $('#objectScreenSelect').find('.menuSelectionImg').attr('src', selectedObject);
    menuIsVisible = false;
    if(!fromMenuSelection){
      fromMenuSelection = true;
    }
  });

})

//Uploading Object
function uploadObject(){

  let objectSrc = $('.uploadObjectInput').val();
  let objectKey = $('.uploadObjectKey').val();
  let userId = $('#currentUserId').text();


  if(objectSrc.length > 0 && objectKey.length > 0){
    let newObject = {
      src : objectSrc,
      key : objectKey
    }

    axios.post(`/user/${userId}/objects`, {newObject}).then(response => {
      $('.uploadObjectInput').val("");
      $('.uploadObjectKey').val("");
      addObject(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  // var upload = $('.uploadObjectInput')[0];
  // var image = upload.files[0];
  // var formData = new FormData();
  // formData.append("upload", image);
  // $.ajax({
  //   url:"/upload/object",
  //   type: "POST",
  //   data: formData,
  //   contentType:false,
  //   cache: false,
  //   processData:false,
  //   success: (object) => {
  //     addObject(object);
  //   }
  // });
}
