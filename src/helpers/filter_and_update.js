
export function filter_and_update(map,data,allMarkers, overlayLayers,minYear,maxYear,selectedYear) {
  
  let AllMarkerLayers = new L.LayerGroup();
  selectedYear == '' ? 1900 : selectedYear;

  console.log("Timeline: filterMarkers",selectedYear);
  console.log("Timeline: allMarkers", allMarkers.length);  
  console.log("Timeline: overlayLayers", overlayLayers.value);
  Object.keys(overlayLayers.value).forEach((layerName) => {
    const layer = overlayLayers.value[layerName];
    
    if (layer instanceof L.MarkerClusterGroup) {
      console.log("Timeline: layer name", layer); 
      console.log("Timeline: layer title", layer.options.title);

      
      layer.eachLayer((marker) => {
        if (marker instanceof L.Marker) {
          console.log("marker.data",marker.options.data.title);
          console.log("marker.data",marker.options.data.startdate);
        }
      });
    }
  });
  return;
  allMarkers.forEach(function(marker) {
    if (!marker.data) {
      AllMarkerLayers.removeLayer(marker);
      return;
    }
    if (marker.data.fromYear <= selectedYear && marker.data.endYear >= selectedYear) {
        console.log("1", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);
        icon = LargeMarkerIcon.create({color: marker.data.color});
        marker.setIcon(icon);
        marker.addTo(allMarkers);
    } 
    // selecting past years
    else if ( marker.data.endYear <= selectedYear) {

        console.log("X Past", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        

        if ( $('#map').hasClass('darken-icons2') ) {
          icon = LargeMarkerIcon.create({color: '#333', opacity: 0.2});
        } else if ( $('#map').hasClass('darken-icons') ) {
          icon = LargeMarkerIcon.create({color: '#555', opacity: 0.2});
        } else {
          icon = LargeMarkerIcon.create({color: '#fff', opacity: 0.42});
        }
        // window.map.removeLayer(marker);  
        allMarkers.removeLayer(marker);
        marker.setIcon(icon);    
        marker.addTo(allMarkers);    
        // TODO: remove relations and other elements!

    // selecting future years
    } else {
      console.log("X Future", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
      // window.map.removeLayer(marker);  
      allMarkers.removeLayer(marker);
    }    
  });
  allMarkers.refreshClusters();
}