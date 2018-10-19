let selectedBackground = {};

function addBackground(background){
  let newBackgroundElement;

  if(background.src == thisDimension.background.src){
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

  //Load All Backgrounds
  $.get('/main/backgrounds', (backgrounds) => {
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
    $('.backgroundContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    $('.menuSelectContainer').css('display', 'flex');
    $('#background').css("background-image", `url(${selectedBackground.src})`)
    $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', selectedBackground.src);
    menuIsVisible = false;
    socket.emit('Background Change', selectedBackground);
  })

});

//Uploading Background
function uploadBackground(){

  let backgroundSrc = $('.uploadBackgroundInput').val();
  let backgroundKey = $('.uploadBackgroundKey').val();

  if(backgroundSrc.length > 0 && backgroundKey.length > 0){
    let newBackground = {
      src : backgroundSrc,
      key : backgroundKey
    }

    axios.post('/background/upload', newBackground).then(response => {
      $('.uploadBackgroundInput').val("");
      $('.uploadBackgroundKey').val("");
      addBackground(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  // var upload = $('.uploadBackgroundInput')[0];
  // var image = upload.files[0];
  // var formData = new FormData();
  // formData.append("upload", image);
  // $.ajax({
  //   url:"/upload/background",
  //   type: "POST",
  //   data: formData,
  //   contentType:false,
  //   cache: false,
  //   processData:false,
  //   success: (background) => {
  //     addBackground(background);
  //   }
  // });
}
