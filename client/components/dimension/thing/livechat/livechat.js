function addNewLivechat(thing, livechat){
  addNewThing(thing);
  things[thing.elemId].docId = livechat._id;
  let newLivechat = $('.livechat').clone();
  newLivechat.removeClass('prototype');
  newLivechat.css('display', 'flex');
  $(`#${thing.elemId}`).append(newLivechat);
  livechat.messages.forEach((message) => {
    let newMessageElement = `
      <div class='livechatMessage'>
        <div class='livechatSender'>${message.sender}:</div>
        <div class='livechatText'>${message.text}</div>
      </div>
    `;
    $(`#${thing.elemId}`).find('.livechatMessageContainer').append(newMessageElement);
  })
}

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

  $(document).on('click', '.livechatSubmitMessage', (e) => {
    sendMessage(e);
  })

  $(document).on('keypress', '.livechatTextArea', (e) => {
    if(e.keyCode == 13){
      sendMessage(e);
    }
  });

})

socket.on('New livechat', data => {
  addNewLivechat(data.thing, data.livechat);
})

socket.on('New message', message => {
  let newMessageElement = `
    <div class='livechatMessage'>
      <div class='livechatSender'>${message.sender}</div>
      <div class='livechatText'>${message.content}</div>
    </div>
  `;
  let thisMessageContainer = $(`#${message.elemId}`).find('.livechatMessageContainer');
  thisMessageContainer.append(newMessageElement);
  thisMessageContainer.scrollTop(thisMessageContainer[0].scrollHeight);
})
