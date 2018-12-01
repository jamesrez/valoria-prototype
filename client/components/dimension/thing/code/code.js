let myCodeMirror;

$(document).ready(() => {
  myCodeMirror = CodeMirror($('.codeContainer')[0], {
    mode:  "javascript",
    lineNumbers: "true",
    theme : "hopscotch",
    lint : "true"
  });

  socket.emit('get code');

});

$(document).on('mouseup', '.codeContainer', (e) => {
  userIsTyping = true;
});

$(document).on('blur', '.codeContainer', (e) => {
  userIsTyping = false;
  let codeValue = myCodeMirror.getValue();
  socket.emit('send code', myCodeMirror.getValue());
});

//Socket listeners
socket.on('get code', code => {
  myCodeMirror.setValue(code);
})
