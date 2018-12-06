let onlineUsers = {};
let objects = {};
let things = {};

let mousePosition = {
  x : null,
  y : null
}

let bpx = 0;
let bpy = 0;

let scrolling = false;
let objectTotal = 0;
let thisUser = null;

function getRandomAvatar(dimension){
  let numOfAvatars = dimension.avatars.length;
  let randAvatarIndex = Math.floor(Math.random() * numOfAvatars);
  let randAvatarSrc = dimension.avatars[randAvatarIndex].src;
  return randAvatarSrc;
}

function getRandomObject(dimension){
  let numOfObjects= dimension.objects.length;
  let randObjectIndex = Math.floor(Math.random() * numOfObjects);
  let randObjectSrc = dimension.objects[randObjectIndex].src;
  return randObjectSrc;
}

const socket = io.connect();
const peer = new Peer({secure: true,
                host: 'valoria.us',
                port: 443,
                path:'/peerjs'});
let peerCall = null;
let thisPeerId = null;
let thisAudioStream = null;
navigator.mediaDevices.getUserMedia({audio : true, video : false}).then((stream) => {
  thisAudioStream = stream;
})

$(document).ready(() => {
  //console.log(`Are Cookies enabled? ${navigator.cookieEnabled}`)
  thisUser = new User(socket.id);
  thisUser.dimension = $('#dimensionName').text();
  if($('#doorRender').text()){
    $.get(`/api/dimension/${thisUser.dimension}`).then((dimension) => {
      //Get Random Avatar
      thisUser.avatar = getRandomAvatar(dimension);
      //Get Random Object
      thisUser.object = getRandomObject(dimension);
    })
  }
})

$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

peer.on('open', (id) => {
  thisPeerId = id;
})
