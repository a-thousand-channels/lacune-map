export function iconData (place,isVisible) {
  let placeData = {
    id: place.id,
    subtitle: place.subtitle,
    color: place.color,
    colorChecked: place.color,
    strokeWidth: 0,
    checked: isVisible
  };
  return placeData;
}
