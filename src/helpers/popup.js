export function PopupIsVisible (map,place) {
  let isVisible = false;
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker && layer.options.id === place.id) {
      isVisible = true;
      return false;
    } 
  }); 
  return isVisible;    
}
