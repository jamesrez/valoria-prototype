let selectedBackground = {};

function addBackground(background){
  let newBackgroundElement;

  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  if(background.src == backgroundSrc){
    newBackgroundElement = `
      <div class='backgroundSelected'>
        <img class='backgroundSrc' src=${background.src}>
        <p hidden class='backgroundKey'>${background.key}</p>
      </div>
    `
    $('.backgroundPreviewSrc').attr('src', background.src);
    $('.backgroundPreviewKey').text(background.key);
  }else{
    newBackgroundElement = `
      <div class='backgroundSelection'>
        <img class='backgroundSrc' src=${background.src}>
        <p hidden class='backgroundKey'>${background.key}</p>
      </div>
    `
  }
  $('.availableBackgrounds').append(newBackgroundElement)
}


$(document).ready(() => {
  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  let dimensionName = $('#dimensionName').text()

  //Load All Backgrounds of User
  let userId = $('#currentUserId').text();
  $.get(`/user/${userId}/backgrounds`, (backgrounds) => {
    backgrounds.forEach((background) => {
      addBackground(background);
    })
  })

  selectedBackground = {
    src : $('.backgroundSelected').find('.backgroundSrc').attr('src'),
    key : $('.backgroundPreviewKey').text()
  }

  //SELECT background
  $(document).on('click', '.backgroundSelection', function(){
    $('.backgroundSelected').addClass('backgroundSelection', true)
    $('.backgroundSelected').removeClass('backgroundSelected');
    $(this).addClass('backgroundSelected');
    $(this).removeClass('backgroundSelection');
    $('.backgroundPreviewSrc').attr('src', $(this).find('.backgroundSrc').attr('src'));
    $('.backgroundPreviewKey').text($(this).find('.backgroundKey').text());
    selectedBackground = {
      src : $('.backgroundSelected').find('.backgroundSrc').attr('src'),
      key : $('.backgroundPreviewKey').text()
    }
  });

  $(document).on('click', '.selectBackgroundBtn', function(){
    if(selectedBackground.src != backgroundSrc && selectedBackground.src){
      $('.dimension').css("background-image", `url(${selectedBackground.src})`)
      $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', selectedBackground.src);
      socket.emit('Background Change', {
        dimensionName : dimensionName,
        newBackground : selectedBackground
      });
    }
    $('.backgroundContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    $('.menuSelectContainer').css('display', 'flex');
    menuIsVisible = false;
  })

});

//Uploading Background
function uploadBackground(){

  let backgroundSrc = $('.uploadBackgroundInput').val();
  let backgroundKey = $('.uploadBackgroundKey').val();
  let userId = $('#currentUserId').text();

  if(backgroundSrc.length > 0 && backgroundKey.length > 0){
    let newBackground = {
      src : backgroundSrc,
      key : backgroundKey
    }

    axios.post(`/user/${userId}/backgrounds`, {newBackground}).then(response => {
      $('.uploadBackgroundInput').val("");
      $('.uploadBackgroundKey').val("");
      addBackground(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
}
