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

const selectedPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
    });
}
};

const panToUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            map.panTo(userLatLng);
        });
    }
};