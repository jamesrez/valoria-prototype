let selectedAvatar = null;

function addAvatar(avatar, i){
  let newAvatarElement;
  if(i==0){
    newAvatarElement = `
      <div class='avatarSelected'>
        <img class='avatarSrc' src=${avatar.src}>
        <p class='avatarKey' hidden>${avatar.key}</p>
      </div>
    `
    $('.avatarPreviewSrc').attr('src', avatar.src);
    $('.avatarPreviewKey').text(avatar.key);
    selectedAvatar = avatar.src;
  }else{
    newAvatarElement = `
      <div class='avatarSelection'>
        <img class='avatarSrc' src=${avatar.src}>
        <p class='avatarKey' hidden>${avatar.key}</p>
      </div>
    `
  }
  $('.availableAvatars').append(newAvatarElement)
}

$(document).ready(() => {

  selectedAvatar = $('.avatarSelected').find('.avatarSrc').attr('src');
  //SELECT AVATAR
  $(document).on('click', '.avatarSelection', function(){
    $('.avatarSelected').addClass('avatarSelection', true)
    $('.avatarSelected').removeClass('avatarSelected');
    $(this).addClass('avatarSelected');
    $(this).removeClass('avatarSelection');
    $('.avatarPreviewSrc').attr('src', $(this).find('.avatarSrc').attr('src'));
    $('.avatarPreviewKey').text($(this).find('.avatarKey').text());
    selectedAvatar = $('.avatarSelected').find('.avatarSrc').attr('src');
  });

  $(document).on('click', '.selectYourAvatarBtn', function(){
    thisUser.avatar = selectedAvatar;
    $('#thisUserAvatar').attr('src', selectedAvatar);
    $('.avatarContainer').css('display', 'none');
    $('#avatarScreenSelect').find('.menuSelectionImg').attr('src', selectedAvatar);
    if(!fromMenuSelection){
      $('.objectContainer').css('display', 'flex');
    }else{
      $('#menu').css('display', 'none');
      menuIsVisible = false;
      socket.emit('User has changed avatar', {
        newAvatar : thisUser.avatar,
        dimension : thisUser.dimension
      });
    }
  });

});

//Uploading Avatar to User
function uploadAvatarToUser(){
  let avatarSrc = $('.uploadAvatarInput').val();
  let avatarKey = $('.uploadAvatarKey').val();
  let userId = $('#currentUserId').text();

  if(avatarSrc.length > 0 && avatarKey.length > 0){
    let newAvatar = {
      src : avatarSrc,
      key : avatarKey
    }

    axios.post(`/user/${userId}/avatars/new`, {newAvatar}).then(response => {
      $('.uploadAvatarInput').val("");
      $('.uploadAvatarKey').val("");
      addAvatar(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
}

//Uploading Avatar to Dimension
function uploadAvatarToDimension(){
  let avatarSrc = $('.uploadAvatarInput').val();
  let avatarKey = $('.uploadAvatarKey').val();
  let dimensionName = $('#dimensionName').text()

  if(avatarSrc.length > 0 && avatarKey.length > 0){
    let newAvatar = {
      src : avatarSrc,
      key : avatarKey
    }

    axios.post(`/dimension/${dimensionName}/avatars/new`, {newAvatar}).then(response => {
      $('.uploadAvatarInput').val("");
      $('.uploadAvatarKey').val("");
      addAvatar(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }
}
