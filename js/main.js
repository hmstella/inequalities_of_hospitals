// 1. Create a map object.
var mymap = L.map('map', {
  center: [47.605598, -122.333361],
  zoom: 12,
  maxZoom: 20,
  minZoom: 3,
});

// 2. Add a base map.
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
maxZoom: 16,
attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ | Medical Facilities &copy; <a href="https://gis-kingcounty.opendata.arcgis.com/">King County GIS Open Data</a> | Made By Stella Joo'
}).addTo(mymap);

// 3. Add medical facilities to the map
// Null variable that will hold cell tower data
var med_fac = null;

var myIcon = L.divIcon({
  html: '<i class="fa fa-plus-square fa-lg" style="color:#3CB043"></i>',
  className: 'myDivIcon' // We don't want to use the default class
});

// Get GeoJSON and put on it on the map when it loads
med_fac= L.geoJson.ajax("assets/Medical_Facilities.geojson",{
    onEachFeature: function(feature, layer){
      layer.bindPopup("Name: "+feature.properties.NAME+"<br>"+"Address: "+feature.properties.ADDRESS+", "+feature.properties.ZIPCODE);
    },
    pointToLayer: function(feature, latlng){
      return L.marker(latlng, {icon: myIcon});
    }
}).addTo(mymap);

// 5. Set function for color ramp
var colors = chroma.scale('RdBu').colors(5);

function setColor(count){
  var id = 0;
  if (count>4){id=4;}
  else if (count>3 && count <=4){id=3;}
  else if (count>2 && count<=3){id=2;}
  else if (count>1 && count <=2){id=1;}
  else {id=0;}
  return colors[id];
}

// 6. Set style function that sets fill color.md property equal to hospital density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.MED_COUNT),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 4. create the neighboorhood layer
var neighborhood=null;
neighborhood= L.geoJson.ajax("assets/Metro_Neighborhoods_in_King_County.geojson",{
  style: style,
  onEachFeature: function(feature,layer){
    if (feature.properties.MED_COUNT > 0){
      layer.bindPopup(feature.properties.NEIGHBORHO + "<br> Number of Facilities: "+feature.properties.MED_COUNT, {closeButton: false});
    } else {
      layer.bindPopup(feature.properties.NEIGHBORHO + "<br> NO Facilities found", {closeButton: false});
    }
    layer.on('mouseover', function(){layer.openPopup();});
    layer.on('mouseout', function(){layer.closePopup();});
  }
}).addTo(mymap);


// 7. create leaflet control object for legend
var legend = L.control({position: 'topright'});

// 9. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Density of Medical Facilities in Kin County Neighborhoods</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>4+ Hospitals</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>3 Hospitals</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>2 Hospitals</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>1 Hospital</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>NO Hospital</p>';
    div.innerHTML += '<hr><b>Hospital/Medical Center<b><br/>';
    div.innerHTML += '<i class="fa fa-plus-square"></i><p> Hospital</p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);