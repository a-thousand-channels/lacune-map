// composables/usemapElement.js
import { ref, reactive, onMounted } from 'vue'
import L from 'leaflet'

export const useMap = () => {
  const mapInstance = ref(null)
  const isMapReady = ref(false)
  const markersRegistry = reactive(new Map())
  const pendingOperations = []


  const defaultCenter = [53.56, 10.01]
  const savedCenter = localStorage.getItem('mapCenter')
  const defaultZoom = 12
  const savedZoom = localStorage.getItem('mapZoom')
  const centerCoordinates = savedCenter ? JSON.parse(savedCenter) : defaultCenter
  const zoomLevel = savedZoom ? parseInt(savedZoom) : defaultZoom  

  const initMap = (mapElement, options = {}) => {
    console.log('initMap')
    const defaultOptions = {
      maxZoom: 18, 
      minZoom: 10, 
      maxBounds: [[ 53.76414148051871, 9.408416748046877 ], [ 53.39070404547524, 10.681457519531252 ]],
      ...options
    }

    if (typeof L !== 'undefined') {
      mapInstance.value = L.map(mapElement, defaultOptions)
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmapElement.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.value)

      mapInstance.value.attributionControl.setPrefix("");
      mapInstance.value.setView(centerCoordinates, zoomLevel);

      isMapReady.value = true
      
      // Process any pending operations
      while (pendingOperations.length) {
        const operation = pendingOperations.shift()
        operation()
      }
      return mapInstance.value
    }
  }

  const ensureMapReady = (operation) => {
    if (isMapReady.value && mapInstance.value) {
      operation()
    } else {
      pendingOperations.push(operation)
    }
  }

  const registerMarker = (id, coordinates, popupContent = '') => {
    if (isMapReady.value && mapInstance.value) {      
        // console.log('registerMarker', id)
        if (markersRegistry.has(id)) {
          console.warn(`Marker with ID ${id} already exists`)
          return
        }

        const marker = L.marker(coordinates)
         // .addTo(mapInstance.value)
        
        if (popupContent) {
          marker.bindPopup(popupContent)
        }

        markersRegistry.set(id, marker)
        // console.log('Marker registered:', id, marker)
        // console.log('markersRegistry', markersRegistry.size)
      }
  }

  const focusMarkerById = (id, zoom = 18) => {
    if (isMapReady.value && mapInstance.value) {   
      console.log('focusMarkerById', id)
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

  const removeMarker = (id) => {
    ensureMapReady(() => {
      const marker = markersRegistry.get(id)
      if (marker) {
        marker.remove()
        markersRegistry.delete(id)
      }
    })
  }

  return {
    mapInstance,
    isMapReady,
    initMap,
    registerMarker,
    focusMarkerById,
    removeMarker,
    markersRegistry
  }
};

