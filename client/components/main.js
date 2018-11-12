let onlineUsers = {};
let objects = {};
let things = {};

let mousePosition = {
  x : null,
  y : null
}

let screenPos = {
  left : -50000,
  top : -50000
};

let scrolling = false;
let objectTotal = 0;
let thisUser = null;

function getRandomAvatar(){
  let numOfAvatars = $('.availableAvatars').children().length;
  let randAvatarIndex = Math.floor(Math.random() * numOfAvatars);
  let randAvatarSrc = $('.availableAvatars').children()[randAvatarIndex].firstElementChild.src;
  return randAvatarSrc;
}

function getRandomObject(){
  let numOfObjects= $('.availableObjects').children().length;
  let randObjectIndex = Math.floor(Math.random() * numOfObjects);
  let randObjectSrc = $('.availableObjects').children()[randObjectIndex].firstElementChild.src;
  return randObjectSrc;
}

const socket = io.connect();
$(document).ready(() => {
  thisUser = new User(socket.id);
  thisUser.dimension = $('#dimensionName').text();
  if($('#doorRender').text()){
    //Get Random Avatar
    thisUser.avatar = getRandomAvatar();
    //Get Random Object
    thisUser.object = getRandomObject();
  }
})
