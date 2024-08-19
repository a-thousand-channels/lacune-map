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
      // Create a MarkerClusterGroup
      const markers = L.markerClusterGroup()
      // Create Metalayer object
      const featureGroups = {}
      // Create layers and add data to the map
      console.log(data)
      data.map.layer.forEach((layer) => {
        let layer_group = L.markerClusterGroup()

        layer.places.forEach((place) => {
          const marker = L.marker([place.lat, place.lon])

          const popupContent = `
              <p class="place-layer">${layer.title}</p>
              <p class="place-address">${place.location} ${place.address} ${place.city}</p>
              <h3>${place.title}</h3>
              <p>${place.teaser}</p>
            `

          marker.bindPopup(popupContent)

          layer_group.addLayer(marker)
        })

        // Transfer markers from FeatureGroup to MarkerClusterGroup
        layer_group.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            markers.addLayer(layer)
          }
        })
        // map.value.addLayer(markers)
        featureGroups[layer.title] = layer_group
        map.value.addLayer(layer_group)
      })

      console.log('bounds per default')
      let bounds = [53.55, 9.95]

      bounds = L.latLngBounds(markers.getBounds())

      // featureGroups['All layers'] = markers

      console.log(bounds)
      const padding = 0.1 // 10% padding
      const paddedBounds = bounds.pad(padding)
      map.value.fitBounds(paddedBounds)

      const layerControl = L.control.layers(null, featureGroups, { collapsed: true })
      layerControl.addTo(map.value)
    }

    return { map }
  }
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';

h3 {
  font-weight: bold;
}

p.place-layer {
  display: inline-block;
  background-color: lightsalmon;
  padding: 2px 5px;
  margin: 0;
  border-radius: 5px;
}
p.place-address {
  margin: 3px 0;
}
</style>
