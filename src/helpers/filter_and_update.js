
export function filter_and_update(map,data,minYear,maxYear,selectedYear) {
  
  selectedYear == '' ? 1900 : selectedYear;

  console.log("Timeline: filterMarkers",selectedYear);
  
  window.markers.forEach(function(marker) {
    if (!marker.data) {
      window.marker_layers.removeLayer(marker);
      return;
    }
    if (marker.data.fromYear <= selectedYear && marker.data.endYear >= selectedYear) {
        console.log("1", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);
        icon = LargeMarkerIcon.create({color: marker.data.color});
        marker.setIcon(icon);
        marker.addTo(window.marker_layers);
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
        window.marker_layers.removeLayer(marker);
        marker.setIcon(icon);    
        marker.addTo(window.marker_layers);    
        // TODO: remove relations and other elements!

    // selecting future years
    } else {
      console.log("X Future", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
      // window.map.removeLayer(marker);  
      window.marker_layers.removeLayer(marker);
    }    
  });
  window.marker_layers.refreshClusters();
}