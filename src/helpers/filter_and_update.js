import { LargeMarkerIcon } from '@/helpers/marker'

export function filter_and_update(map,overlayLayers,selectedYear) {
  
  selectedYear == '' ? 1900 : selectedYear;
  console.log("Timeline: filterMarkers",selectedYear);
  console.log("Timeline: overlayLayers", overlayLayers.value);
  Object.keys(overlayLayers.value).forEach((layerName) => {
    const layer = overlayLayers.value[layerName];
    
    if (layer instanceof L.MarkerClusterGroup) {
      console.log("Timeline: layer name", layer); 
      console.log("Timeline: layer title", layer.options.title);
     
      layer.eachLayer((marker) => {
        if (marker instanceof L.Marker) {
          // console.log("marker.data",marker.options.data.title);
          // console.log("marker.data",marker.options.data.startdate);
          // checkForDates(layer, marker);
          
        }
      });
    }
  });
  function checkForDates(layer, marker) {
    
      if (!marker.data) {
        layer.removeLayer(marker);
        return;
      }
      if (marker.data.fromYear <= selectedYear && marker.data.endYear >= selectedYear) {
          console.log("1", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);
          console.log("Timeslider marker color",marker.data.color);
          // let icon = LargeMarkerIcon.create({color: marker.data.color, opacity: 0.72, mtype: marker.data.mtype })
          // marker.setIcon(icon);
          marker.addTo(layer);
      } 
      // selecting past years
      else if ( marker.data.endYear <= selectedYear) {
  
          console.log("X Past", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
  
          layer.removeLayer(marker);
          let icon = LargeMarkerIcon.create({color: '#fff', opacity: 0.72, mtype: marker.data.mtype })
          marker.setIcon(icon);    
          marker.addTo(layer);    
          // TODO: remove relations and other elements!
  
      // selecting future years
      } else {
        console.log("X Future", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
        layer.removeLayer(marker);
  
      }    
      // Check which layers are currently visible
      map.value.eachLayer((layer) => {
        if (layer instanceof L.MarkerClusterGroup) {
         // layer.refreshClusters();
        }        
      })
    }
} 
   

  