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
let userSpotId = null;

const updatePositionPeriodically = async () => {
  while (true) {
      await new Promise((resolve) => {
          setTimeout(() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                  userPosition = [position.coords.latitude, position.coords.longitude];
                  userSpotId=getSpotIdForCoordinates({lat:userPosition[0],lon:userPosition[1]});
                  //map.panTo(userLatLng);

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

function updatePositionEvent(susus)  {

  susus.forEach(susu => {
    if (!document.getElementById(susu.tokenId)) {
      const html = createSusuElementHtml(susu, susu.tokenId);
      const div = L.DomUtil.create('div', '', cachePane);
      div.id = susu.tokenId; // Set the unique ID to the div
    
      div.innerHTML = html;
      L.DomEvent.on(div, 'click', handleCacheClick.bind(this, susu));
      let cacheElement = document.getElementById(susu.tokenId + '-author');
      const BigIntAddress = BigInt(susu.ownerAddress);
      const uniqueIconSeed = xorExtendedBigInt( BigIntAddress , BigInt(susu.tokenId));
      let hexSeed = uniqueIconSeed.toString(16);
      const iconGenerator = new Icon(hexSeed, cacheElement);
      iconGenerator.generateIcon();
     
    }
  });
};

  
function handleCacheClick(cache, event) {
  const div = event.target.closest('.inmap-cache');
  
  if (div) {
    // Here, toggle the collapsed state and display/hide additional content
    // based on the cache's properties, e.g., unlocked status.
    // You can fetch and manipulate child elements within div.
    // For instance, if you want to expand/collapse:
    const cachesDiv = div.querySelector('.caches');
    if (cachesDiv) {
      cachesDiv.style.display = cachesDiv.style.display === 'none' ? 'block' : 'none';
    }
  }
};

function createSusuElementHtml(cache, cacheId) {
  let currentZoom = map.getZoom();
  let iconSize = getIconSizeBasedOnZoom(currentZoom);
  console.log('iconsize: ' + JSON.stringify(iconSize));
  console.log('zoom: ' + currentZoom);

   return `
    <div class="inmap-cache animate-fade-in" name="lat:${cache.lat},lon:${cache.lon}" id="${cacheId}" onclick="document.dispatchEvent(new CustomEvent('inmap-cache-click', { detail: { tokenId_BN: '${cache.tokenId}' } }));">
        <span class="wallet-icon">${getIconSvg(cacheId+'-author', iconSize.width, iconSize.height)}</span>
    
    
    </div>
  `;
}
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function getIconSizeBasedOnZoom(zoom) {
  const START_ZOOM = 15; // At this zoom, the size is 0x0
  const END_ZOOM = 19;   // At this zoom, the size is 40x40

  const MIN_SIZE = 0;
  const MAX_SIZE = 60;

  // Ensure zoom doesn't exceed boundaries
  if (zoom <= START_ZOOM) return { width: 0, height: 0 };
  if (zoom >= END_ZOOM) return { width: MAX_SIZE, height: MAX_SIZE };

  // Normalize zoom level to a value between 0 and 1
  let t = (zoom - START_ZOOM) / (END_ZOOM - START_ZOOM);

  let sizeValue = lerp(MIN_SIZE, MAX_SIZE, t);

  return { width: sizeValue, height: sizeValue };
}

function updateCachePositions(susus,callback) {
  let currentZoom = map.getZoom();
  let iconSize = getIconSizeBasedOnZoom(currentZoom);

  susus.forEach(susu => {

    const position = map.latLngToLayerPoint([susu.posCurrent.lat, susu.posCurrent.lon]);
    const div = document.getElementById(susu.tokenId);
    
    if (div) {
      L.DomUtil.setPosition(div, position);

      if (currentZoom <= 15) {
        // Hide the entire .inmap-cache element at zoom level 13 or below
        div.style.display = 'none';
      } else {
        // Show and adjust size for the SVG icon, title, and the entire .inmap-cache element 
        // at zoom levels greater than 13

        div.style.display = '';  // Reset to default display value

        let svgIcon = div.querySelector('.wallet-icon svg');
        if (svgIcon) {
          svgIcon.style.width = `${iconSize.width}px`;
          svgIcon.style.height = `${iconSize.height}px`;
        }

     
      }
    }
  });

  if (callback && typeof callback === 'function') {
    callback();
}
}

function getIconSvg(id, width, height)
{
  return `<svg id="${id}" width=${width} height=${height} viewBox="-57 -62 120 120"  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg">
  <defs>
   <filter id="drop-shadow-normal" x="-100%" y="-100%" width="400%" height="400%">
     <feOffset result="offOut" in="SourceAlpha" dx="4" dy="4" />
     <feColorMatrix result="matrixOut" in="offOut" type="matrix"
     values="0.2 0 0 0 0 
             0 0.2 0 0 0 
             0 0 0.2 0 0 
             0 0 0 0.7 0" />
     <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="5" />
     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
   </filter>
   <filter id="drop-shadow-bold" x="-100%" y="-100%" width="400%" height="400%">
     <feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" />
     <feColorMatrix result="matrixOut" in="offOut" type="matrix"
     values="0.2 0 0 0 0 
             0 0.2 0 0 0 
             0 0 0.2 0 0 
             0 0 0 0.7 0" />
     <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="7" />
     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
   </filter>
   <filter id="drop-shadow-short" x="-100%" y="-100%" width="400%" height="400%">
     <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" />
     <feColorMatrix result="matrixOut" in="offOut" type="matrix"
     values="0.2 0 0 0 0 
             0 0.2 0 0 0 
             0 0 0.2 0 0 
             0 0 0 0.7 0" />
     <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3" />
     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
   </filter>
   <filter id="drop-shadow-hard" x="-100%" y="-100%" width="400%" height="400%">
     <feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" />
     <feColorMatrix result="matrixOut" in="offOut" type="matrix"
     values="0.2 0 0 0 0 
             0 0.2 0 0 0 
             0 0 0.2 0 0 
             0 0 0 0.7 0" />
     <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="7" />
     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
   </filter>
   <filter id="line-shadow" x="-50%" y="-50%" width="200%" height="200%">
     <feDropShadow dx="4" dy="4" stdDeviation="4"/>
   </filter>
   <filter id="drop-shadow-small" x="-100%" y="-100%" width="400%" height="400%">
     <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" />
     <feColorMatrix result="matrixOut" in="offOut" type="matrix"
     values="0.2 0 0 0 0 
             0 0.2 0 0 0 
             0 0 0.2 0 0 
             0 0 0 1 0" />
     <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3" />
     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
   </filter>
   <filter id="inset-shadow-small" x="-50%" y="-50%" width="200%" height="200%">
   <feComponentTransfer in=SourceAlpha>
     <feFuncA type="table" tableValues="1 0" />
   </feComponentTransfer>
   <feGaussianBlur stdDeviation="3"/>
   <feOffset dx="3" dy="3" result="offsetblur"/>
   <feFlood flood-color="rgb(0, 0, 0)" result="color"/>
   <feComposite in2="offsetblur" operator="in"/>
   <feComposite in2="SourceAlpha" operator="in" />
   <feMerge>
     <feMergeNode in="SourceGraphic" />
     <feMergeNode />
   </feMerge>
 </filter>
 <filter id="inset-shadow-normal" x="-50%" y="-50%" width="200%" height="200%">
   <feComponentTransfer in=SourceAlpha>
     <feFuncA type="table" tableValues="1 0" />
   </feComponentTransfer>
   <feGaussianBlur stdDeviation="8"/>
   <feOffset dx="4" dy="4" result="offsetblur"/>
   <feFlood flood-color="rgb(0, 0, 0)" result="color"/>
   <feComposite in2="offsetblur" operator="in"/>
   <feComposite in2="SourceAlpha" operator="in" />
   <feMerge>
     <feMergeNode in="SourceGraphic" />
     <feMergeNode />
   </feMerge>
 </filter>
   
 </defs>

  <g
    id="layer1">
   <text
      xml:space="preserve"
      style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.1008px;font-family:Quicksand;fill:#ffffff;fill-opacity:1;stroke-width:0.0526088"
      x="135.128502"
      y="164.39116"
      text-anchor="end"
      id="text2679-4">dhsgfhksdg</text>
   </g>
</svg>`;
}

function xorExtendedBigInt(longBigInt, shortBigInt) {
  // Convert BigInts to binary strings
  let longBinStr = longBigInt.toString(2);
  let shortBinStr = shortBigInt.toString(2);

  // Extend the short binary string to match the length of the long binary string
  let extendedShortBinStr = '';
  while (extendedShortBinStr.length < longBinStr.length) {
      extendedShortBinStr += shortBinStr;
  }

  // Trim the extended short binary string to exactly match the length of the long binary string
  extendedShortBinStr = extendedShortBinStr.slice(0, longBinStr.length);

  // Perform the XOR operation
  let xorBinStr = '';
  for (let i = 0; i < longBinStr.length; i++) {
      xorBinStr += (longBinStr[i] === extendedShortBinStr[i]) ? '0' : '1';
  }

  // Convert the resulting binary string back to a BigInt
  return BigInt('0b' + xorBinStr);
}