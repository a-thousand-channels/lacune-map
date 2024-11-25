export function PopupIsVisible (map,place) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.id === place.id) {
        return true;
      } 
    }); 
    return false;      
}
