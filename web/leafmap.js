let map, initialPosition, initialZoom, cachePane;
let disableAutoCenter = false;

const initMap = () => {
    map = L.map('map', {
        zoom: 19,
        zoomControl: true,          // Remove zoom controls
        doubleClickZoom: false,     // Prevents zooming on double click
        scrollWheelZoom: false,     // Disables zooming with scroll wheel
        dragging: true,             // Allows dragging the map
        keyboard: false,            // Disables keyboard shortcuts
        boxZoom: false,             // Disables box zoom
        tap: true,                  // Enables map tap (for mobile)
        touchZoom: true,            // Enables touch zoom on touch devices
        maxZoom: 19,                // Maximum zoom-in level
        minZoom: 10                 // Maximum zoom-out level
    });
    map.zoomControl.remove();
    L.control.zoom({position:'topright'}).addTo(map);
    initialPosition = { lat: 0, lng: 0 };
    initialZoom = 15; 
    cachePane = map.createPane('cachePane');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
};

const panToUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            map.panTo(userLatLng);
        });
    }
};

let userPosition = null;

const updatePositionPeriodically = async () => {
  while (true) {
      await new Promise((resolve) => {
          setTimeout(() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                  userPosition = [position.coords.latitude, position.coords.longitude];
              });
          }
          resolve();
          }, 5000); // Update every 5 seconds
      });
  }
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const calculatePoints = (distance) => {
  const baseValue = 1;
  const points = Math.floor(Math.log(distance + 1) * baseValue * 100);
  
  return points;
};


const selectedPosition = () => {
  return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
          const center = map.getCenter(); // Get the current center of the map
          console.log("Current map center coordinate:", center); // Log the center coordinate to the console

          navigator.geolocation.getCurrentPosition((position) => {
              const userLatLng = [position.coords.latitude, position.coords.longitude];
              console.log("User's current location:", userLatLng);

              const distance = getDistance(center.lat, center.lng, userLatLng[0], userLatLng[1]);
              console.log("Distance between selected location and user's location:", distance.toFixed(2), "km");
              
              const points = calculatePoints(distance);

              resolve({ center, userLatLng, points }); // Resolve with the calculated distance
          }, (error) => {
              reject(error); // Reject if there is an error in getting the user's location
          });
      } else {
          reject("Geolocation is not supported by this browser.");
      }
  });
};
