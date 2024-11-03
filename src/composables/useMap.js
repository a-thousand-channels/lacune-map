// composables/useMap.js
import { ref, reactive } from 'vue'

export const useMap = () => {
  const map = ref(null)
  const activeMarker = ref(null)
  const markersRegistry = reactive(new Map()) // Store markers by ID

  const setMap = (mapInstance) => {
    map.value = mapInstance
  }

  const registerMarker = (id, marker) => {
    markersRegistry.set(id, marker)
  }

  const getMarkerById = (id) => {
    return markersRegistry.get(id)
  }

  const focusMarkerById = (id, zoom = 16) => {
    if (!map.value) return
    console.log('focusMarkerById', id)
    
    const marker = markersRegistry.get(id)
    if (!marker) {
      console.warn(`No marker found for ID: ${id}`)
      return
    } else {
      console.log('focusMarkerById', marker)
    }

    if (activeMarker.value) {
      // Reset previous marker styling if needed
      activeMarker.value.setStyle({ color: '#3388ff' })
    }

    // Set new active marker
    activeMarker.value = marker
    marker.setStyle({ color: '#ff3333' })

    // Pan to marker
    const latLng = marker.getLatLng()
    map.value.setView(latLng, zoom)
    console.log('focusMarkerById', latLng)
  }

  const removeMarker = (id) => {
    const marker = markersRegistry.get(id)
    if (marker) {
      marker.remove()
      markersRegistry.delete(id)
    }
  }

  return {
    map,
    activeMarker,
    setMap,
    registerMarker,
    getMarkerById,
    focusMarkerById,
    removeMarker
  }
}