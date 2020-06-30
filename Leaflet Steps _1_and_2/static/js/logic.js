// Create map object


var myMap = L.map("map", {
    center: [
        0, 0
    ],
    zoom: 3,
});

// Create Tile Layers

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
}).addTo(myMap);


//Earthquakes variable

var earthquakes = new L.LayerGroup();

//Tectonic Plates variable

var tectonicPlates = new L.LayerGroup();

//Base Layers for Map

var baseLayers = {
    Satellite: satellitemap,
    Grayscale: grayscalemap,
    Outdoors: outdoorsmap
};

//Overlays for Map

var overlayMaps = {
    "Fault Lines": tectonicPlates,
    "Earthquakes": earthquakes
};

//Layer Control

L.control.layers(baseLayers, overlayMaps).addTo(myMap);

//Get Earthquake Data

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function (data) {
    console.log(data)

    function magnitudeStyle(feature) {
        return {
            fillOpacity: 0.75,
            opacity: 1,
            color: colorMag(feature.properties.mag),
            fillColor: colorMag(feature.properties.mag),
            radius: radiusSize(feature.properties.mag),
            stroke: true
        };
    }

    //Create function to determine marker color

    function colorMag(mag) {
        switch (true) {
            case mag > 5:
                return "#ea2c2c"; //red
            case mag > 4:
                return "#ea852c"; //orange-red
            case mag > 3:
                return "#eaa42c"; // orange
            case mag > 2:
                return "#eaea2c"; //yellow-orange
            case mag > 1:
                return "#beea2c"; //green-yellow
            default:
                return "#2cea42"; //green
        }
    }

    function radiusSize(mag) {

        if (mag <= 1) {
            return 2;
        }

        else
            return mag * 4
    }

    L.geoJson(data, {
        pointToLayer: function (feature, location) {
            return L.circleMarker(location);
        },
        style: magnitudeStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + "</h4><hr><h4>Magnitude: " + feature.properties.mag + "</h4>");

        }
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);


     //Tectonic Plate info pull

     var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

     d3.json(tectonicURL, function (data) {
 
         console.log(data)
 
         L.geoJson(data, {
             color: "orange",
             weight: 2
         })
             .addTo(tectonicPlates);
 
         tectonicPlates.addTo(myMap);
 
     });
 

    // Create Legend

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create("div", "info legend"),
            // insert the magnitudes below
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
                

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorMag(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

});

