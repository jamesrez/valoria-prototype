
function addNewLivechat(livechat){
  things[livechat.elemId] = new Thing()
  things[livechat.elemId].elemId = livechat.elemId;
  things[livechat.elemId].docId = livechat._id;
  things[livechat.elemId].renderAtPos(livechat.pos, 'livechat');
  livechat.messages.forEach((message) => {
    let newMessageElement = `
      <div class='livechatMessage'>
        <div class='livechatSender'>${message.sender}:</div>
        <div class='livechatText'>${message.text}</div>
      </div>
    `;
    $(`#${livechat.elemId}`).find('.livechatMessageContainer').append(newMessageElement);
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
  //Load All Livechats in Dimension
  $.get(`/dimension/${dimensionName}/environment/livechats`, (livechats) => {
    livechats.forEach((livechat) => {
      addNewLivechat(livechat);
    })
    $('.livechatMessageContainer').scrollTop($('.livechatMessageContainer')[0].scrollHeight);
  })


  $(document).on('click', '.livechatSubmitMessage', (e) => {
    sendMessage(e);
  })

  $(document).on('keypress', '.livechatTextArea', (e) => {
    if(e.keyCode == 13){
      sendMessage(e);
    }
  })
})


socket.on('New livechat', data => {
  things[data.elemId] = new Thing();
  things[data.elemId].elemId = data.elemId;
  things[data.elemId].docId = data.docId;
  things[data.elemId].renderAtPos(thisUser.pos);
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
