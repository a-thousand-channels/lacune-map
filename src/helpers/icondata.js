
export function iconData (place,isVisible) {
  let placeData = {
    id: place.id,
    subtitle: place.subtitle,
    color: place.color,
    colorChecked: place.color,
    strokeWidth: place.strokeWidth ? place.strokeWidth : 4,
    checked: isVisible,
    layerId: place.layer_id,
    layerTitle: place.layer_title,
    mtype: place.mtype,
    marker_size: 30,
    marker_width: 30,

  };
  return placeData;
}
