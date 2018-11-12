$(document).ready(() => {

  $(document).on('click', '#squareThingSelect', function() {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New thing', {
      dimensionName : dimensionName,
      pos : thisUser.pos,
      kind : 'square'
    });
  })

  $(document).on('click', '#livechatThingSelect', function() {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New livechat', {
      dimensionName : dimensionName,
      pos : thisUser.pos,
      kind : 'livechat'
    });
  });

  $(document).on('click', '#dimensionalDoorThingSelect', () => {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New door', {
      dimensionName : dimensionName,
      pos : thisUser.pos,
      kind : 'door'
    });
  })

})
