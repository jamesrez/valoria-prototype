$(document).ready(() => {

  $(document).on('click', '#avatarScreenSelect', function(){
    $('.menuSelectContainer').css('display', 'none');
    $('.avatarContainer').css('display', 'flex');
  });

  $(document).on('click', '#objectScreenSelect', function(){
    $('.menuSelectContainer').css('display', 'none');
    $('.objectContainer').css('display', 'flex');
  });

  $(document).on('click', '#backgroundScreenSelect', function(){
    $('.menuSelectContainer').css('display', 'none');
    $('.backgroundContainer').css('display', 'flex');
  });


})
