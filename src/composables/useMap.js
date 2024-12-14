// composables/usemapElement.js
import { shallowRef, ref, provide, inject } from 'vue'


export const useMap = () => {
  const mapInstanceSymbol = Symbol('mapInstance')
  // const mapInstance = inject(mapInstanceSymbol, ref(null))
  const mapInstance = inject(mapInstanceSymbol, shallowRef(null))
  const isMapReady = ref(false)

  const defaultCenter = [53.56, 10.01]
  const savedCenter = localStorage.getItem('mapCenter')
  const defaultZoom = 12
  const savedZoom = localStorage.getItem('mapZoom')
  const centerCoordinates = savedCenter ? JSON.parse(savedCenter) : defaultCenter
  const zoomLevel = savedZoom ? parseInt(savedZoom) : defaultZoom  

  const initMap = (mapElement, options = {}) => {
    if (mapInstance.value) return mapInstance.value
    console.log('initMap')
    const defaultOptions = {
      maxZoom: 18, 
      minZoom: 12, 
      maxBounds: [[ 53.76414148051871, 9.408416748046877 ], [ 53.39070404547524, 10.681457519531252 ]],
      ...options
    }
    console.log("------------------------");
    console.log("mapElement called", mapElement);
    mapInstance.value = L.map(mapElement, defaultOptions)
    mapInstance.value.attributionControl.setPrefix("");
    mapInstance.value.setView(centerCoordinates, zoomLevel);
    isMapReady.value = true
    console.log('isMapReady??', isMapReady.value)

    // Provide the map instance and markers registry to child components
    provide(mapInstanceSymbol, mapInstance)

    return mapInstance.value
 
  }

  const focusMarkerById = (id, zoom = 18) => {
    console.log('focusMarkerById', id)
    console.log('isMapReady', isMapReady.value)
    console.log('mapInstance', mapInstance.value) 
    if (isMapReady.value && mapInstance.value) {   
      console.log('markersRegistry', markersRegistry.size)
      const marker = markersRegistry.get(id)
      if (!marker) {
        console.warn(`No marker found for ID: ${id}`)
        return
      }
      console.log('marker found', marker)

      marker.setStyle?.({ color: '#ff3333' })
      const latLng = marker.getLatLng()
      mapInstance.value.setView(latLng, zoom)
    }    
  }

   return {
    mapInstance,
    isMapReady,
    initMap,
    focusMarkerById
  }
};

