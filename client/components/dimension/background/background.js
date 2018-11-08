$(document).ready(() => {
  let backgroundSrc = $('#dimensionBackgroundSrc').text();
  $('#background').css('background-image', `url(${backgroundSrc})`);
})

socket.on('Background Change', (newBackground) => {
  $('#background').css('background-image', `url(${newBackground.src})`)
  $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', newBackground.src);
})
