

(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([42, -60], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


  var geoJsonLayer = L.geoJSON(null).addTo(map);

  function load(){
    fetch('https://prog2700.onrender.com/opensky')
    .then((response) => response.json())
    .then((json) => {
      let geoJson = stateVectorsCanada(json);
   
      let planeIcon = L.icon({
        iconUrl: 'plane.png',
        iconSize: [32, 37]
      });
   
      console.log(geoJson);
   
      // L.geoJSON().clearLayers();
   
      geoJsonLayer =L.geoJSON(geoJson, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
            icon: planeIcon,
            rotationAngle: feature.properties.true_track
          });
         
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.popups);
      },
    
      }).addTo(map);
  
    });
    geoJsonLayer.clearLayers();
    setTimeout(load, 7000);
  }

  load();

    //filter function for state vector origin country from canada
    const stateVectorsCanada = (data) =>{

        let geoJson = {
            type: "FeatureCollection"
          }

     let result =  data.states.filter((row)=> row[2] ==="Canada")
        .map((value)=>{
            return{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  value[5],
                  value[6]
                ]
              },
              properties: {
                true_track: value[10],
                popups: `callSign: ${value[1]} /  baroAltitude : ${value[7]} / onGround : ${value[8]} / velocity :  ${value[9]} / true_track : ${value[10]} / verticalRate : ${value[11]} / geoAltitude : ${value[13]}`,
            }

            }
        });
        geoJson.features = result;
        return geoJson;
    };
  
})();  


