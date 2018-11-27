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

  $(document).on('click', '#thingScreenSelect', function() {
    $('.menuSelectContainer').css('display', 'none');
    $('.thingSelectContainer').css('display', 'flex');
  })

  $(document).on('click', '#textScreenSelect', function() {
    $('.menuSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New text', {
      dimensionName : dimensionName,
      pos : thisUser.pos,
    });
  })

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

  $(document).on('click', '.closeMenuBtn', function() {
    toggleMenu();
  })

})
