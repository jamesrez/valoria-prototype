function sendMessage(e) {
  let sender = $('#currentUserName').text();
  let elemId = e.target.offsetParent.id;
  let content = $(`#${elemId}`).find('.livechatTextArea').val();
  let dimensionName = $('#dimensionName').text();
  let docId = things[elemId].docId;
  if(content.length > 0){
    let message = {
      sender, content, elemId, dimensionName, docId
    }
    socket.emit("Send message", message);
    $('.livechatTextArea').val("");
    $('.livechatTextArea').blur();
  }
}

$(document).ready(() => {

  $('.livechatSubmitMessage').on('click', (e) => {
    sendMessage(e);
  })

  $('.livechatTextArea').on('keypress', (e) => {
    if(e.keyCode == 13){
      sendMessage(e);
    }
  })

})
