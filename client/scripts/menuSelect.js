$(document).ready(() => {

  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', backgroundSrc);

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

  $(document).on('click', '#newDimensionScreenSelect', function(){
    $('.menuSelectContainer').css('display', 'none');
    $('.newDimensionContainer').css('display', 'flex');
  });

  $(document).on('click', '.logoutBtn', function() {
    $.get('/logout', () => {
      window.location = '/';
    })
  })

})
