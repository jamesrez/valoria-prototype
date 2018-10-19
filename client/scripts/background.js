$(document).ready(() => {
  $('#background').css('background-image', `url(${thisDimension.background.src})`);
  $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', thisDimension.background.src);
})

socket.on('Background Change', (newBackground) => {
  $('#background').css('background-image', `url(${newBackground.src})`)
  $('#backgroundScreenSelect').find('.menuSelectionImg').attr('src', newBackground.src);
})
