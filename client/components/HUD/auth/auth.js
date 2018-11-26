function showErr(error){
  $('.authErrorContainer').css('display', 'block');
  $('.authError').text(error);
}

function registerUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();

  if(username.length > 0 && password.length > 0){
    axios.post('/register', {
      username, password
    }).then((res) => {
      if(res.data.err){
        showErr(res.data.err);
      }else{
        window.location = '/';
      }
    })
  }

}

function loginUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();

  if(username.length > 0 && password.length > 0){
    axios.post('/login', {
      username, password
    }).then((res) => {
      if(res.data.err){
        showErr(res.data.err);
      }else{
        window.location = '/';
      }
    })
  }

}

$(document).on('keyup', (e) => {
  if(e.keyCode == 13){
    e.preventDefault();
    loginUser();
  }
})
