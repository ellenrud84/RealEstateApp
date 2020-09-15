
// Adding tile layer
const dark= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });

const light= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });

const streets= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });

const baseMaps = {
  Light: light,
  Dark: dark,
  Streets: streets
  };


// Use this link to get the geojson data.
const highSchoolLink = "../static/data/HighAttendanceZones1920.geojson";
const midSchoolLink="../static/data/MiddleAttendanceZones1920.geojson";
const elemSchoolLink="../static/data/ElementaryAttendanceZones1920.geojson";
const link = "../static/data/ZIPCODE.geojson";
const risk3Link="../static/data/COH_100_YR_FLOOD_PLAIN_HARRIS_FEMA.geojson";
const risk2Link="../static/data/COH_500_YR_FLOOD_PLAIN_HARRIS_FEMA.geojson";

d3.json(risk2Link).then( function(data) {


  const risk2= L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: "DarkCyan",
        fillOpacity: 0.8,
        weight: 1.5
      };
    }, onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h4>High Risk Flood Zone</h4>");

    }
  });

d3.json(risk3Link).then( function(data) {
 

  const risk3= L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: "DarkTurquoise",
        fillOpacity: 0.8,
        weight: 1.5
      };
    }, onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h4>High Risk Flood Zone</h4>");

    }
  });

  d3.json(link).then( function(data) {
  

 const zipcodes= L.geoJson(data.features, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.ZIPCODE),
        fillOpacity: 0.8,
        weight: 1.5
      };
    }, onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h4>" + feature.properties.PO_NAME + "</h4> <hr> <h4>" + feature.properties.ZIPCODE + "</h4>");

    }
  });



d3.json(highSchoolLink).then(function(response){
  const highSchools = L.geoJSON(response,{  
      style: function(feature){
          return{
              color: 'white',
              fillColor: "red",
              fillOpacity: 0.5,
              weight: 1.5,
          }
      },      
      onEachFeature: function(feature,layer){
      layer.bindPopup("<h4>High School </h4><hr>" + feature.properties.High_Schoo , {maxWidth: 400});
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
      });
    }
  })


    d3.json(midSchoolLink).then(function(response){
      const middleSchools = L.geoJSON(response,{  
          style: function(feature){
              return{
                color: 'white',
                fillColor: "blue",
                fillOpacity: 0.5,
                weight: 1.5,
              }
          },      
          onEachFeature: function(feature,layer){
          layer.bindPopup("<h4>Middle School </h4><hr>" + feature.properties.Middle_Sch , {maxWidth: 400});
          layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
          });
        }
      })
  
      d3.json(elemSchoolLink).then(function(response){
        const elemSchools = L.geoJSON(response,{  
            style: function(feature){
                return{
                  color: 'white',
                  fillColor: "green",
                  fillOpacity: 0.5,
                  weight: 1.5,
                }
            },      
            onEachFeature: function(feature,layer){
            layer.bindPopup("<h4>Elementary School </h4><hr>" + feature.properties.Elementary , {maxWidth: 400});
            layer.on({
              // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
              mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.9
                });
              },
              // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
              mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
              },
            });
            }
        })


  const overlayMaps = {
    "Zip Codes": zipcodes,
    "High Schools" : highSchools,
    "Middle Schools": middleSchools,
    "Elementary Schools": elemSchools,
    "Flood Risk - High":risk3,
    "Flood Risk - Medium":risk2
    };
  
 
  // Creating map object for Houston School Map
  const myMap = L.map("map", {
    center: [29.74, -95.367497],
    zoom: 11,
    layers: [streets,zipcodes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
  

})
})
})
})
})
})

function chooseColor(zipcode) {
  switch (zipcode) {
  case 77002:
    return "yellow";
  case 77005:
    return "red";
  case 77006:
    return "orange";
  case 77019:
    return "green";
  case 77025:
    return "purple";
  case 77030:
    return "blue";
  case 77054:
    return "darkblue";
  case 77027:
    return "pink";
  case 77098:
    return "yellow";
  default:
    return "none";
  }
}

