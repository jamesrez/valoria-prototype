let myMap;

L.mapbox.accessToken = 'pk.eyJ1IjoiamFtZXNyZXoiLCJhIjoiY2ptN2FndGl5MDkwbjNwcXg2dG92MXlicCJ9.DFEebRTgSCyUJT9fFfPilQ';
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      // Get current cordinates
      userLoc = [position.coords.latitude, position.coords.longitude];
      renderMap(userLoc);
      addUserToMap(userLoc);

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

addUserToMap = (position) => {
  let userIcon = L.icon({
    iconUrl : '/client/assets/heart.svg'
  });
  L.marker(position, {icon: userIcon}).addTo(myMap);
}
