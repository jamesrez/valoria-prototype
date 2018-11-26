function registerUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();

  if(username.length > 0 && password.length > 0){
    axios.post('/register', {
      username, password
    }).then(() => {
      window.location = '/';
    })
  }

}

function loginUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();

  if(username.length > 0 && password.length > 0){
    axios.post('/login', {
      username, password
    }).then(() => {
      window.location = '/';
    })
  }
}

$(document).on('keyup', (e) => {
  if(e.keyCode == 13){
    e.preventDefault();
    loginUser();
  }
})
