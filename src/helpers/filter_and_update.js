import { LargeMarkerIcon } from '@/helpers/marker'

export function filter_and_update(map,visibleLayers,overlayLayers,selectedYear) {
  

  selectedYear == '' ? 9999 : selectedYear;
  // console.log("Timeline: filterMarkers",selectedYear);
  // console.log("Timeline: overlayLayers", overlayLayers);
  // console.log("Timeline: visibleLayers", visibleLayers);


  // viz
  Object.keys(visibleLayers).forEach((layerName) => {

    // refill the layer with the markers
    // visibleLayers[layerName] = overlayLayers[layerName];
    // console.log("filterSummary Number of markers in visiblelayer:", visibleLayers[layerName].getLayers().length);
    // console.log("filterSummary Number of markers in overlaylayer:", overlayLayers[layerName].getLayers().length);


    let layer = visibleLayers[layerName];
    // console.log("Timeline: layer", layer);
     // Manuelles Klonen des Layers
    let backupLayerMarkers = layer.getLayers();
    


    // console.log("filterSummary Number of markers in backuplayer:",backupLayerMarkers.length);    

    let filterSummary = {
      layer: layerName,
      sum: 0,
      invalid: 0,
      now: 0,
      future: 0,
      past: 0,
    };
    if (layer instanceof L.MarkerClusterGroup) {
     
      layer.eachLayer((marker) => {
        if (marker instanceof L.Marker) {
          // console.log("marker.data",marker.options.data.title,marker.options.data.startdate);
          filterSummary.sum += 1;
          checkForDates(map, overlayLayers, layer, marker, filterSummary);
          
        }
      });
    }
    // console.log("filterSummary",selectedYear,filterSummary);
  });
  function checkForDates(map, overlayLayers, layer, marker, filterSummary) {

      if (!marker.data) {
        map.removeLayer(marker);
        filterSummary.invalid += 1;
        return;
      }
      if (marker.data.fromYear <= selectedYear && marker.data.endYear >= selectedYear) {
          // console.log("1 Now", selectedYear, marker.data.fromYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);
          // console.log("Timeslider marker color",marker.data.color);
          let icon = LargeMarkerIcon.create({color: marker.data.color, opacity: 0.72, mtype: marker.data.mtype })
          marker.setIcon(icon);
          marker.addTo(map);
          filterSummary.now += 1;
      } 
      // selecting past years
      else if ( marker.data.endYear <= selectedYear) {
  
          // console.log("X Past", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
  
          map.removeLayer(marker);
          let icon = LargeMarkerIcon.create({color: '#fff', opacity: 0.72, mtype: marker.data.mtype })
          marker.setIcon(icon);    
          marker.addTo(map);    
          // TODO: remove relations and other elements!
          filterSummary.past += 1;
      // selecting future years
      } else {
        // console.log("X Future", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.title, marker.data.layer_id);        
        map.removeLayer(marker);
        filterSummary.future += 1;
      }    
      // Check which layers are currently visible
      Object.keys(visibleLayers).forEach((layerName) => {
        const layer = visibleLayers[layerName];
        if (layer instanceof L.MarkerClusterGroup) {
          layer.refreshClusters();
        }        
      })
    }
} 
   

  