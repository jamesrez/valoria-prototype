$(document).ready(() => {

  $(document).on('click', '#squareThingSelect', function() {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New thing', {
      dimensionName : dimensionName,
      pos : thisUser.realPos,
      kind : 'square'
    });
  })

  $(document).on('click', '#livechatThingSelect', function() {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New livechat', {
      dimensionName : dimensionName,
      pos : thisUser.realPos,
      kind : 'livechat'
    });
  });

  $(document).on('click', '#dimensionalDoorThingSelect', () => {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New door', {
      dimensionName : dimensionName,
      pos : thisUser.realPos,
      kind : 'door'
    });
  })

  $(document).on('click', '#codeThingSelect', () => {
    $('.thingSelectContainer').css('display', 'none');
    $('#menu').css('display', 'none');
    let dimensionName = $('#dimensionName').text();
    socket.emit('New code', {
      dimensionName : dimensionName,
      pos : thisUser.realPos,
      kind : 'code'
    });
  })

})
