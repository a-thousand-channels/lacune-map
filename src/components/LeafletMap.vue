<template>
  <div>
    <button
      id="mapcontrol-center"
      title="Karte zentrieren"
      class="mapcontrol-button"
      @click="centerMap"
    >
      <CenterMapIcon />
    </button>
  </div>
  <div id="map"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { cluster_small, cluster_medium, cluster_large, cluster_xlarge } from '@/helpers/cluster'
import { LargeMarkerIcon } from '@/helpers/marker'
import CenterMapIcon from '@/components/icons/IconCenterMap.vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css' // Import MarkerCluster CSS
import L from 'leaflet'
import 'leaflet.markercluster' // Import MarkerCluster script
import 'leaflet.markercluster.placementstrategies/dist/leaflet-markercluster.placementstrategies'

export default {
  name: 'LeafletMap',
  components: {
    CenterMapIcon
  },
  setup() {
    const map = ref(null)
    // Create Metalayer object
    const overlayLayers = ref({})
    const defaultCenter = [53.56, 10.01]
    const defaultZoom = 12
    const savedCenter = localStorage.getItem('mapCenter')
    const savedZoom = localStorage.getItem('mapZoom')
    let savedLayers = JSON.parse(localStorage.getItem('mapLayers')) || {}
    const centerCoordinates = savedCenter ? JSON.parse(savedCenter) : defaultCenter
    const zoomLevel = savedZoom ? parseInt(savedZoom) : defaultZoom

    let alidade_smooth_dark = L.tileLayer('https://tiles-eu.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      })
      

    let wmsLayerHamburg1980s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1980-1990',
      transparent: true,
      minZoom: 9,
      maxZoom: 20,     
      attribution: 'Landesbetriebs Geoinformation und Vermessung (LGV) Hamburg, Datenlizenz Deutschland Namensnennung 2.0'
      })
      
      
    onMounted(() => {
      map.value = L.map('map').setView(centerCoordinates, zoomLevel)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
      // map.value.attributionControl.setPrefix("");
      wmsLayerHamburg1980s.addTo(map.value)    
      document.body.classList.remove('dark-mode');

    

      // Load JSON data and add layers here
      loadJSONData()
    })

    const saveMapState = () => {
      console.log('saveMapState called')
      const newCenter = map.value.getCenter()
      const newZoom = map.value.getZoom()
      const visibleLayers = {}

      Object.keys(overlayLayers.value).forEach((layerName) => {
        visibleLayers[layerName] = false
      })
      // Check which layers are currently visible
      map.value.eachLayer((layer) => {
        Object.keys(overlayLayers.value).forEach((layerName) => {
          if (layer === overlayLayers.value[layerName]) {
            visibleLayers[layerName] = true
          }
        })
      })

      localStorage.setItem('mapCenter', JSON.stringify([newCenter.lat, newCenter.lng]))
      localStorage.setItem('mapZoom', newZoom.toString())
      localStorage.setItem('mapLayers', JSON.stringify(visibleLayers))
    }

    const centerMap = () => {
      console.log('Call centerMap')
      if (map.value) {
        map.value.setView(defaultCenter, defaultZoom)
      }
    }
    const markerclusterSettings = {
      maxClusterRadius: 0,
      showCoverageOnHover: false,
      animate: true,

      iconCreateFunction: function (cluster) {
        // TDO
        let layer_color = ''
        let data_id = 1

        console.log('Cluster: Zigzgag', cluster.getChildCount())
        // console.log('Cluster: Childmarkers', cluster.getAllChildMarkers())
        if (cluster.getAllChildMarkers()[0].data) {
          // console.log('Cluster: Childmarker Data', cluster.getAllChildMarkers()[0].data.color)
        }
        // TODO: add color from data
        // TODO: build array of colors of all Childmarkers
        let childmarker_colors = []
        cluster.getAllChildMarkers().forEach(function (marker) {
          if (marker.data) {
            childmarker_colors.push(marker.data.color)
          }
        })
        // check if all values of childmarker_colors are the same
        let check_all_same = childmarker_colors.every((val, i, arr) => val === arr[0])
        // console.log('All colors are the same: ', check_all_same)
        let cluster_color
        if (childmarker_colors.length > 0 && check_all_same) {
          cluster_color = childmarker_colors[0]
        }
        let cluster_viz = cluster_small(cluster_color)
        if (cluster.getChildCount() >= 10) {
          cluster_viz = cluster_xlarge(cluster_color)
        } else if (cluster.getChildCount() >= 6) {
          cluster_viz = cluster_large(cluster_color)
        } else if (cluster.getChildCount() >= 3) {
          cluster_viz = cluster_medium(cluster_color)
        }
        if (layer_color && layer_color.length > 0) {
          cluster_viz = cluster_viz.replace(/rgba\(255, 0, 153, 0.8\)/g, layer_color)
        }

        let rnd_rotate = Math.floor(Math.random() * 25) * 15

        return L.divIcon({
          html:
            '<div class="marker-cluster marker-cluster-small marker-cluster-layer-' +
            data_id +
            '" style="transform: rotate(' +
            rnd_rotate +
            'deg);">' +
            cluster_viz +
            '</div>',
          className: 'leaflet-data-markercluster',
          iconAnchor: [15, 15],
          iconSize: [30, 30],
          popupAnchor: [0, -28]
        })
      },
      spiderLegPolylineOptions: { weight: 0, color: '#efefef', opacity: 0.5 },
      elementsPlacementStrategy: 'clock',
      helpingCircles: true,
      clockHelpingCircleOptions: {
        weight: 40,
        opacity: 0,
        color: '#000000',
        fill: '#333',
        fillOpacity: 0.2
      },

      spiderfyDistanceSurplus: 28,
      spiderfyDistanceMultiplier: 1,

      spiderfiedClassName: 'spiderfied-places',

      elementsMultiplier: 1.4,
      firstCircleElements: 10,
      spiderfyShapePositions: function (count, centerPt) {
        var distanceFromCenter = 50,
          markerDistance = 105,
          lineLength = markerDistance * (count - 1),
          lineStart = centerPt.y - lineLength / 4,
          res = [],
          i

        res.length = count

        for (i = count - 1; i >= 0; i--) {
          res[i] = new Point(centerPt.x + distanceFromCenter, lineStart + markerDistance * i)
        }

        return res
      }
    }

    const loadJSONData = async () => {
      try {
        const response = await fetch(
          'https://orte-backend.a-thousand-channels.xyz/public/maps/histoprojekt-hamburg'
        )
        const data = await response.json()

        addDataToMap(data)
      } catch (error) {
        console.error('Error loading JSON data:', error)
      }
    }

    const FormatDate = (DateString) => {
      let date = new Date(DateString)
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      let printed_date = day + '.' + month + '.' + year
      if (day == 1 && month == 1) {
        return year
      } else if (day == 31 && month == 12) {
        return year
      } else if (day == 1) {
        return month + '.' + year
      } else {
        return printed_date
      }
    }
    const FormatDateRange = (StartDateString, EndDateString) => {
      if (StartDateString == EndDateString) {
        return FormatDate(StartDateString)
      } else {
        if (FormatDate(StartDateString) == FormatDate(EndDateString)) {
          return FormatDate(StartDateString)
        } else {
          return FormatDate(StartDateString) + ' &mdash; ' + FormatDate(EndDateString)
        }
      }
    }

    const addDataToMap = (data) => {
      // Create a MarkerClusterGroup
      const markers = L.markerClusterGroup(markerclusterSettings)



      // Create layers and add data to the map
      console.log(data)
      data.map.layer.forEach((layer) => {
        let layer_group = L.markerClusterGroup(markerclusterSettings)

        layer.places.forEach((place) => {
          let mtype = 'place'
          if (layer.title === 'Biografisches') {
            mtype = 'biography'
          } else if (layer.title === 'Hintergrund Informationen') {
            mtype = 'information'
          }
          let darkcolor = layer.color;
          if ( layer.color == '#b1f075') {
            darkcolor = '#92c460';
          }

          const icon = LargeMarkerIcon.create({ color: layer.color, mtype: mtype })
          const marker = L.marker([place.lat, place.lon], { icon: icon })
          const popupContent = `
              <p class="place-layer" style="background-color: ${darkcolor}">${layer.title}</p>
              <p class="place-dates">${FormatDateRange(place.startdate, place.enddate)}</p>
              <p class="place-address">${place.location} ${place.address}, ${place.city}</p>
              <h3>${place.title}</h3>
              <p>${place.subtitle}</p>
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
        overlayLayers.value[layer.title] = layer_group
        // map.value.addLayer(layer_group)
      })

      console.log('bounds per default')
      let bounds = [53.55, 9.95]

      bounds = L.latLngBounds(markers.getBounds())

      console.log('bounds', bounds)
      const padding = 0.1 // 10% padding
      const paddedBounds = bounds.pad(padding)
      // map.value.fitBounds(paddedBounds)
      // map.value.setView(centerCoordinates, zoomLevel)
      let basemaps = {
        'Dunkle OSM Karte (Alidade Smooth Dark)': alidade_smooth_dark,
        'Historische Karte 1980er': wmsLayerHamburg1980s
      }
      const layerControl = L.control.layers(basemaps, overlayLayers.value, { collapsed: true })
      layerControl.addTo(map.value)

      // check for savedlayers and make them visible
      // savedLayers = JSON.parse(localStorage.getItem('mapLayers')) || {}
      console.log('savedLayers', savedLayers, Object.keys(savedLayers).length)
      if (Object.keys(savedLayers).length > 0) {
        Object.keys(savedLayers).forEach((layerName) => {
          console.log('layer name check?', layerName, savedLayers[layerName])
          if (
            savedLayers[layerName] &&
            savedLayers[layerName] === true &&
            overlayLayers.value[layerName]
          ) {
            overlayLayers.value[layerName].addTo(map.value)
          }
        })
      } else {
        Object.keys(overlayLayers.value).forEach((layerName) => {
          overlayLayers.value[layerName].addTo(map.value)
        })
      }
      map.value.on('overlayadd overlayremove moveend', saveMapState)
    }
    return { map, centerMap }
  }
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';

h3 {
  font-weight: bold;
  font-size: 25px;
  line-height: 1.1;
  color: #c6c600;
}

p.place-layer {
  display: inline-block;
  background-color: lightsalmon;
  padding: 2px 11px;
  margin: 0 0 6px -11px;
  border-radius: 2px;
  color: white;
  font-weight: bold;
}
p.place-dates {
  margin: 0;
  font-weight: bold;
}
p.place-address {
  margin: 3px 0;
}

#mapcontrol-center {
  left: 12px;
  position: absolute;
  bottom: 40px;
  z-index: 999999;
  background-color: white;
  padding: 3px 6px;
  border: none;
  border-radius: 6px;
  box-shadow: none;
}
body.dark-mode #mapcontrol-center {
  background-color: #333;
}

#mapcontrol-center svg path.path-content {
  fill: #666;
}
body.dark-mode #mapcontrol-center svg path.path-content {
  fill: silver;
}
</style>
