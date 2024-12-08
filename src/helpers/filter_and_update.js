import { LargeMarkerIcon } from '@/helpers/marker'

let backupLayers = [];

export function filter_and_update(map,visibleLayers,overlayLayers,selectedYear) {
  
  selectedYear == '' ? 9999 : selectedYear;
  console.log("Timeline: filterMarkers",selectedYear);
  console.log("Timeline: overlayLayers", overlayLayers);
  console.log("Timeline: visibleLayers", visibleLayers);

  // viz
  Object.keys(visibleLayers).forEach((layerName,index) => {

    console.log("---------------------");
    console.log("filterSummary markers:",layerName,visibleLayers[layerName].getLayers().length);

    if ( (layerName === 'Hintergrund Informationen') ) {
      // let this layer untouched 
      return;
    }
    // console.log("filterSummary Number of markers in overlaylayer:", overlayLayers[layerName].getLayers().length);

    let layer = visibleLayers[layerName];
    // console.log("Timeline: layer", layer);
     // Manuelles Klonen des Layers
    if ( backupLayers[index] === undefined ) {
      // console.log("init backup layer",layerName);
      backupLayers[index] = layer.getLayers();
    } else {
      // console.log("clear layers");
      layer.clearLayers();
      layer.addLayers(backupLayers[index]);
    }
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

          if ( layerName === 'Biografisches') {
            layer.removeLayer(marker);
          } else {
            // console.log("marker.data",marker.options.data.title,marker.options.data.startdate);
            filterSummary.sum += 1;
            let markercopy = marker;
            checkForDates(map, overlayLayers, layer, markercopy, filterSummary);

          }

          
          
        }
      });
      
    }
    // console.log("filterSummary",selectedYear,filterSummary);
  });

  function checkForDates(map, overlayLayers, layer, marker, filterSummary) {
      // console.log("checkForDates", marker.data.title, marker.data.fromYear, marker.data.endYear, selectedYear);
      if (!marker.data) {
        layer.removeLayer(marker);
        filterSummary.invalid += 1;
        return;
      }
      if ( marker.data.color !== '#fff' ) {
        marker.data.color2 = marker.data.color;
      }
      if (marker.data.fromYear <= selectedYear && marker.data.endYear >= selectedYear) {
        // console.log("Timeslider marker color",marker.data.color);
        if ( marker.data.color === '#fff') {
          marker.data.color = marker.data.color2;
        }
        let icon = LargeMarkerIcon.create({color: marker.data.color, opacity: 0.82, mtype: marker.data.mtype })
        marker.setIcon(icon);
        layer.addLayer(marker);
        // console.log("1 Now", selectedYear, marker.data.fromYear,marker.data.endYear,marker.data.color, marker.data.color2, marker.data.title, marker.data.layer_id);
          filterSummary.now += 1;
      } 
      // selecting past years
      else if ( marker.data.endYear <= selectedYear) {
          layer.removeLayer(marker);
          let icon = LargeMarkerIcon.create({color: '#fff', opacity: 0.82, mtype: marker.data.mtype, stroke_width: 1, stroke: '#888', stroke_opacity: 0.3 })
          marker.data.color = '#fff';
          marker.setIcon(icon);    
          layer.addLayer(marker);

          // console.log("X Past", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.color2, marker.data.title, marker.data.layer_id);       
          // TODO: remove relations and other elements!
          filterSummary.past += 1;
      // selecting future years
      } else {
        layer.removeLayer(marker);
        
        let color = marker.data.color;  
        if ( marker.data.color === '#fff') {
          color = marker.data.color2;
        }
        if ( selectedYear === 1 ) {
          // console.log('X Future', color);
          let icon = LargeMarkerIcon.create({color: color, opacity: 0.72, mtype: marker.data.mtype })
          marker.data.color = color;
          marker.setIcon(icon);    
          layer.addLayer(marker);

        }
        // console.log("X Future", marker.data.fromYear,selectedYear,marker.data.endYear,marker.data.color, marker.data.color2, marker.data.title, marker.data.layer_id, marker.data.mtype);        
        filterSummary.future += 1;
      }    
      layer.refreshClusters();
      Object.keys(visibleLayers).forEach((layerName) => {
        const layer = visibleLayers[layerName];
        if (layer instanceof L.MarkerClusterGroup) {
          // layer.refreshClusters();
        }        
      })
    }
} 
   

  