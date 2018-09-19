let myMap;
let userMarkers = {};

L.mapbox.accessToken = 'pk.eyJ1IjoiamFtZXNyZXoiLCJhIjoiY2ptN2FndGl5MDkwbjNwcXg2dG92MXlicCJ9.DFEebRTgSCyUJT9fFfPilQ';
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      // Get current cordinates
      userLoc = [position.coords.latitude, position.coords.longitude];
      // Render Map at User Location
      renderMap(userLoc);
      // Emit a new user via socket.io
      socket.emit('load online users');
      socket.emit('new user', userLoc);
    },
    function(error) {
      console.log("Failed");
    },
    {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
  );
}else{
  console.log("Geolocation must be enabled");
}

renderMap = (position) => {
  myMap = L.map('map',{
    minZoom : 2
  }).setView(position, 18);
  //Purple Grid Map
  L.mapbox.styleLayer('mapbox://styles/jamesrez/cjm8bp9f4eo5o2rn6i94e9swj').addTo(myMap);
  // Render Earth Map
  // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //   id: 'mapbox.streets',
  //   accessToken: 'pk.eyJ1IjoiamFtZXNyZXoiLCJhIjoiY2ptN2FndGl5MDkwbjNwcXg2dG92MXlicCJ9.DFEebRTgSCyUJT9fFfPilQ'
  // }).addTo(myMap);
}

addUserToMap = (user) => {
  let userIcon = L.icon({
    iconUrl : '/client/assets/heart.svg'
  });
  userMarkers[user.id] = L.marker(user.loc, {icon : userIcon});
  userMarkers[user.id].addTo(myMap);
  console.log(userMarkers);
}

//Socket Handlers
socket.on('new user', (user) => {
  onlineUsers[user.id] = user;
  addUserToMap(user);
  console.log(onlineUsers);
})
socket.on('user left', (user) => {
  delete onlineUsers[user.id];
  myMap.removeLayer(userMarkers[user.id]);
  delete userMarkers[user.id];
})
socket.on('load online users', (users) => {
  for(id in users){
    onlineUsers[id] = users[id];
    addUserToMap(users[id]);
  }
})
