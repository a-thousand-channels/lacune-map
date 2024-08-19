<template>
  <div id="map"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css' // Import MarkerCluster CSS
import L from 'leaflet'
import 'leaflet.markercluster' // Import MarkerCluster script

export default {
  name: 'LeafletMap',
  setup() {
    const map = ref(null)

    onMounted(() => {
      map.value = L.map('map')

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map.value)

      // Load JSON data and add layers here
      loadJSONData()
    })

    const loadJSONData = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:3000/public/maps/queer-places-in-hamburg/layers/15.geojson'
        )
        const data = await response.json()
        addDataToMap(data)
      } catch (error) {
        console.error('Error loading JSON data:', error)
      }
    }

    const addDataToMap = (data) => {
      // Create layers and add data to the map
      const layer1 = L.featureGroup()
      const layer2 = L.featureGroup()

      data.features.forEach((feature) => {
        const marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])

        const popupContent = `
            <h3>${feature.properties.name}</h3>
            <p>${feature.properties.description}</p>
            <img src="${feature.properties.image}" alt="${feature.properties.name}" style="max-width: 100px;">
          `

        marker.bindPopup(popupContent)

        if (feature.properties.layer === 'layer1') {
          layer1.addLayer(marker)
        } else {
          layer2.addLayer(marker)
        }
      })

      // plain FeatureGroups
      // layer1.addTo(map.value)
      // layer2.addTo(map.value)

      // Create a MarkerClusterGroup
      const markers = L.markerClusterGroup()

      // Transfer markers from FeatureGroup to MarkerClusterGroup
      layer2.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          markers.addLayer(layer)
        }
      })
      map.value.addLayer(markers)

      console.log('bounds per default')
      let bounds = [53.55, 9.95]

      // Combine the bounds of all LayerGroups
      if (layer1.getLayers().length && layer2.getLayers().length) {
        console.log('both layers')
        bounds = L.latLngBounds(layer1.getBounds()).extend(layer2.getBounds())
        // Fit the map to the combined bounds
        map.value.fitBounds(bounds)
      } else if (layer2.getLayers().length) {
        console.log('only layer 2')
        bounds = L.latLngBounds(layer2.getBounds())
      }
      console.log(bounds)
      const padding = 0.1 // 10% padding
      const paddedBounds = bounds.pad(padding)
      map.value.fitBounds(paddedBounds)

      const layerControl = L.control.layers(
        {
          'Layer 1': layer1,
          'Layer 2': layer2
        },
        null,
        { collapsed: false }
      )
      layerControl.addTo(map.value)
    }

    return { map }
  }
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';
</style>
