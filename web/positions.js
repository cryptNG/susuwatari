function calculateDistance(pos1,pos2){
    const R = 6371e3; // metres
    const φ1 = pos1.lat * Math.PI/180; // φ, λ in radians
    const φ2 = pos2.lat * Math.PI/180;
    const Δφ = (pos2.lat-pos1.lat) * Math.PI/180;
    const Δλ = (pos2.lon-pos1.lon) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const d = R * c; // in metres
  
    return d;
  }

  
  function calculateSpotIdDistance(spotId1,spotId2){
    const dist = spotId2-spotId1;
  
    return dist;
  }

  -5.567466734685

  84.4435463364



function encodeCoordinates(pos){
    
    const latBig = Math.round((pos.lat+90) * 100000) * 10000000000;
    const lon = Math.round((pos.lon+180) * 100000);

    return BigInt(latBig + lon);
}

function decodeCoordinates(encCoord){
    
    const latLon =Math.trunc( encCoord / 10000000000) ;

    const lonLon =encCoord - (latLon * 10000000000);

    return {lat:(latLon/100000)-90, lon:(lonLon/100000)-180};
}

function getSpotIdForCoordinates(pos,log = false)
  {
    if(log) console.log("pos.lat "+pos.lat);
    if(log) console.log("(pos.lat+90) "+(pos.lat+90));
    if(log) console.log("((pos.lat+90)*10000) "+((pos.lat+90)*100000));
    if(log) console.log("Math.round((pos.lat+90)*100000) "+Math.round((pos.lat+90)*100000));
    const latitude = Math.round((pos.lat+90) * 100000);
    if(log) console.log("latitude "+latitude);
    const longitude = Math.round((pos.lon+180) * 100000);
  
    const latAngle = Math.trunc(latitude / 100000);
  
    if(log) console.log("latAngel "+latAngle);
  
    const latDivisor = 14;
  
    const latDecimal100sqm = Math.trunc(Math.round(latitude - latAngle * 100000) / latDivisor); //size of a grid element
  
    if(log) console.log("latDecimal100sqm "+latDecimal100sqm);
  
    const _cosinLat = getCosineLatitude(latAngle); 
  
    if(log) console.log("_cosinLat "+_cosinLat);
  
    const longDivisor = Math.trunc(Math.round(14*10000000*_cosinLat)/10000000);
  
    if(log) console.log("longDivisor "+longDivisor);
  
    //app has to transmit the last 6 characters after decimal point of coordinate
    const longAngle = Math.trunc( longitude / 100000); //starting from a point on the poles, draw lines in this angle along the longitude of earth
    if(log) console.log("longAngle "+longAngle);
    const longDecimal100sqm = Math.trunc(Math.round((longitude - Math.round(longAngle * 100000))*10000000) / longDivisor);
  
    if(log) console.log("longDecimal100sqm "+longDecimal100sqm);
    //longDecimal100sqm needs a transformation --> 10/90 * angel * 100 === 100m for a millionth decimal digit //adapt to changing spot sizes when nearing the poles (imagine a grid on the planet)
  
    const longSpot = Math.trunc(longAngle  << 15) | longDecimal100sqm ;
  
    if(log) console.log("longSpot "+longSpot);
  
  
    const latSpot = Math.trunc(latAngle  << 15) | latDecimal100sqm;
  
    if(log) console.log("latSpot "+latSpot);
  
    const spotId = BigInt(longSpot.toString()) * BigInt(16777216) + BigInt(latSpot); //longSpot is shifted left and latSpot is added
    return spotId;
  }

  function getCosineLatitude(latAngle) {
    let angle =latAngle>90?latAngle-90:(latAngle-90)*-1;
    let angleStep =Math.trunc(angle / 3); // between 0 and 30
    let angleRem = angle % 3; // between 0 and 2
    let cosGroup = Math.trunc(angleStep / 10); // between 0 and 2
    let cosPos = angleStep % 10;
    //require(false,string.concat("la ",Strings.toString(latAngle)," a ",Strings.toString(angle)," as ",Strings.toString(angleStep)," ar ",Strings.toString(angleRem)," cg ",Strings.toString(cosGroup)," cp ",Strings.toString(cosPos)));
    if(angleRem==0){
        return cosines[angleStep];
    }else{
      
            let baseCos = cosines[angleStep];
            let nextCos = cosines[angleStep+1];
            let divCos = Math.trunc((baseCos - nextCos)/3*angleRem);
            return baseCos-divCos;
  
    }
  }

  const cosines = [
    10000000,
    9986295,
    9945219,
    9876883,
    9781476,
    9659258,
    9510565,
    9335804,
    9135455,
    8910065,
    8660254,
    8386706,
    8090170,
    7771460,
    7431448,
    7071068,
    6691306,
    6293204,
    5877852,
    5446390,
    5000000,
    4539905,
    4067366,
    3583679,
    3090170,
    2588190,
    2079117,
    1564345,
    1045284,
    523360
  ]