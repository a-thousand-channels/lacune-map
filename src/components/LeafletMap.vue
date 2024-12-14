<template>
  <div id="" class="">
    <button
      id="mapcontrol-center"
      title="Karte zentrieren"
      class="mapcontrol-button"
      @click="centerMap"
    >
      <CenterMapIcon />
    </button>
    <div id="about-link">
      Lacune, 2024
      <router-link to="/about">Impressum & Datenschutz</router-link>
    </div>
  </div>
  <TimeSlider 
      v-model="selectedYear"
      v-if="mapInstance && overlayLayers && selectedYear"
      :min="minYear"
      :max="maxYear"
      :step="1"
      :map="mapInstance"
      :data="data"
      :overlayLayers="overlayLayers"
      :visibleLayers="visibleLayers"
      :selectedYear=Number(selectedYear)
    />
  <PlaceView 
      v-if="placeData && sidebarStore && sidebarStore.isSidebarVisible == true"
      :placeData="placeData" 
      :layerData="layerData" 
      :relations="relations"
      :map="mapInstance"
      />
  <LayerInfoView
          v-if="mapInstance && !placeData && layerData && sidebarStore.isSidebarVisible == true"
          :layerData="layerData"
          :map="mapInstance" />
  <LayerSwitchView
            v-if="sortedLayersList && Object.keys(sortedLayersList).length > 7 && mapInstance && overlayLayers && visibleLayers" 
            :layersList="sortedLayersList"
            :map="mapInstance"
            :visibleLayers="visibleLayers"
            :overlayLayers="overlayLayers"          
            />     
  <div class="loader_wrapper">
    <span class="loader"></span>
  </div>
          
  <div id="map" ref="mapElement"></div>
</template>

<script>
import { onMounted, watch, ref, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLayerStore } from '@/stores/layerStore';
import { useSidebarStore } from '@/stores/sidebarToggle';
import TimeSlider from './TimeSlider.vue'
import PlaceView from './PlaceView.vue'
import LayerInfoView from './LayerInfoView.vue'
import LayerSwitchView from './LayerSwitchView.vue'
import { useMap } from '@/composables/useMap'

import { summarize } from '@/helpers/summarize'
import { iconData } from '@/helpers/icondata';
import { Icon } from '@/helpers/icon';
import { PopupIsVisible } from '@/helpers/popup';

import { cluster_small, cluster_medium, cluster_large, cluster_xlarge } from '@/helpers/cluster'
import { LargeMarkerIcon } from '@/helpers/marker'
import CenterMapIcon from '@/components/icons/IconCenterMap.vue'

import 'leaflet/dist/leaflet.css'
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css' // Import MarkerCluster CSS
import L from 'leaflet'
import 'leaflet.markercluster' // Import MarkerCluster script
import 'leaflet.markercluster.placementstrategies/dist/leaflet-markercluster.placementstrategies'


export default {
  name: 'LeafletMap',
  components: {
    CenterMapIcon,
    TimeSlider,
    PlaceView,
    LayerInfoView,
    LayerSwitchView
  },
  setup() {
    const mapElement = ref(null)  // This is the DOM element reference
    const { mapInstance, initMap } = useMap()  // This contains the Leaflet map instance
    const router = useRouter();
    const route = useRoute()    
    const data = ref([]);
    const placeData = ref(null);
    const places = ref([]);
    const relations = ref([]);
    const layers = ref([]);
    const layerData = ref(null);
    const layerStore = useLayerStore();    
    const sidebarStore = useSidebarStore();    
    const { focusMarkerById } = useMap()
    const minYear = ref(0);
    const maxYear = ref(2024);
    const overlayLayers = ref({})
    const visibleLayers = ref({})
    const layersList = ref({})
    const sortedLayersList = ref({})
    let savedLayers = JSON.parse(localStorage.getItem('mapLayers')) || {}
    const basemaps = ref({})
    let savedBasemap = localStorage.getItem('basemap') || ''
    const defaultCenter = [53.56, 10.01]
    const savedCenter = localStorage.getItem('mapCenter')
    const defaultZoom = 12
    const savedZoom = localStorage.getItem('mapZoom')
    const centerCoordinates = savedCenter ? JSON.parse(savedCenter) : defaultCenter
    const zoomLevel = savedZoom ? parseInt(savedZoom) : defaultZoom
    const selectedYear = ref() // initial value
    const allMarkers = [];

    L.Browser.retina = false;

   
    L.Popup.prototype._animateZoom = function (e) {
      console.log('L.Popup.prototype._animateZoom')
      if (!this._map) {
            return;
      }      
      var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
          anchor = this._getAnchor();
      L.DomUtil.setPosition(this._container, pos.add(anchor));
    }
    
    L.Marker.prototype._animateZoom = function (opt) {
      try {
        if (!this._map) {
            return;
        }
        const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
        this._setPos(pos);
      } catch (error) {
        console.error('Error in L.Marker.prototype._animateZoom', error)
      }
      
    }      
    
    let hamburg_dark_mode = L.tileLayer('https://tiles.3plusx.io/hamburg/darkmode/{z}/{x}/{y}{r}.png', {
        attribution: 'Karte: UT/3+x, Geodaten: <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap + Mitwirkende</a>',
        maxZoom: 18,
        detectRetina: false,
        tileSize: 256
      })
    
    let wmsLayerHamburg1930s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1930s',
      layers: 'jahrgang_1930-1940',
      transparent: true,
      minZoom: 11,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0">dl-de/by-2-0</a>'
      })
      let wmsLayerHamburg1940s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1940s',
      layers: 'jahrgang_1940-1950',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })      
    let wmsLayerHamburg1950s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1950s',
      layers: 'jahrgang_1950-1960',
      transparent: true,
      minZoom: 11,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })    
    let wmsLayerHamburg1960s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1960s',
      layers: 'jahrgang_1960-1970',
      transparent: true,
      minZoom: 11,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })   
    let wmsLayerHamburg1970s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1970s',
      layers: 'jahrgang_1970-1980',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })              
    let wmsLayerHamburg1980s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1980s',
      layers: 'jahrgang_1980-1990',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })
      
      let wmsLayerHamburg1990s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1990s',
      layers: 'jahrgang_1990-2000',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })
    // Watcher für sortedLayersList
    watch(sortedLayersList, (newValue) => {
      if (newValue && Object.keys(newValue).length > 7) {
        console.log('LayerSwitchView kann jetzt gerendert werden');
      }
    });
      
    onMounted( () => {
      console.log('mapElement element:', mapElement.value) // Debug log
      console.log('onMounted', mapElement.value)  
      if (mapElement.value) {
        initMap(mapElement.value)
        console.log('mapInstance', mapInstance.value)  
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        console.log('savedBasemap', savedBasemap);
        if (savedBasemap === 'Hamburg 1930s') {
          wmsLayerHamburg1930s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1940s') {
          wmsLayerHamburg1940s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1950s') {
          wmsLayerHamburg1950s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1960s') {
          wmsLayerHamburg1960s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1970s') {
          wmsLayerHamburg1970s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1980s') {
          wmsLayerHamburg1980s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1990s') {
          wmsLayerHamburg1990s.addTo(mapInstance.value);
        } else {
          hamburg_dark_mode.addTo(mapInstance.value)
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        }
        // Load JSON data and add layers here
        loadJSONData(mapElement)
      }
    })
    let lastCallTime = Date.now();
    const saveMapState = () => {
      const now = Date.now();
      if ( ( now - lastCallTime ) < 1000) { // 1 Sekunde
        console.log('saveMapState skipped after delay',( now - lastCallTime ))
        return;
      }      
      console.log('saveMapState passed after delay',( now - lastCallTime ))
      lastCallTime = now;
      const newCenter = mapInstance.value.getCenter()
      const newZoom = mapInstance.value.getZoom()
      const visibleOverlayLayers = {}
      let visibleBasemap = ''

      Object.keys(overlayLayers.value).forEach((layerName) => {
        visibleOverlayLayers[layerName] = false
      })
    
      // Check which layers are currently visible
      mapInstance.value.eachLayer((layer) => {
        Object.keys(overlayLayers.value).forEach((layerName) => {
          if (layer === overlayLayers.value[layerName]) {
            // console.log('overlayLayers', layerName, true);
            visibleOverlayLayers[layerName] = true
          }
        })
        if (layer instanceof L.MarkerClusterGroup) {
          layer.refreshClusters();
        } 
        Object.keys(basemaps.value).forEach((layerName) => {
          if (layer === basemaps.value[layerName]) {
            visibleBasemap = basemaps.value[layerName].options.name
          }
        })               
      })

      localStorage.setItem('mapCenter', JSON.stringify([newCenter.lat, newCenter.lng]))
      localStorage.setItem('mapZoom', newZoom.toString())
      localStorage.setItem('mapLayers', JSON.stringify(visibleOverlayLayers))
      // console.log('saveMapState visibleOverlayLayers', visibleOverlayLayers)
      localStorage.setItem('basemap', visibleBasemap)
      console.log('saveMapState mapZoom', newZoom);
    } 

    const centerMap = () => {
      console.log('Call centerMap')
      if (mapInstance.value) {
        mapInstance.value.setView(defaultCenter, defaultZoom)
      }
    }
    const openLayerInfo = (layer,layerDarkcolor) => {
      console.log('openLayerInfo', layer.id )
      layer.color = layerDarkcolor
      placeData.value = null;
      layerData.value = layer
      // router.push({ name: 'layerInfo', params: { layerId: layerId.toString() } });
      sidebarStore.openSidebar();
    };

    const openPlaceInfo = (place) => {
      console.log('openPlaceInfo', place.id)
      placeData.value = place
      console.log('openPlaceInfo', placeData.value)
      console.log('sidebarStore.isSidebarVisible', sidebarStore.isSidebarVisible)
      sidebarStore.openSidebar();
      console.log('sidebarStore.isSidebarVisible', sidebarStore.isSidebarVisible)
      router.push({ path: `/place/${place.id}` })

    };
    const markerclusterSettings = {
      chunkedLoading: true,
      maxClusterRadius: 0,
      /*
      disableClusteringAtZoom: 20,
      spiderfyOnMaxZoom: true,
      */
      removeOutsideVisibleBounds: false,
      showCoverageOnHover: false,
      animate: true,

      iconCreateFunction: function (cluster) {
        // TDO
        let layer_color = ''
        let data_id = 1

        // TODO: add color from data
        let childmarker_colors = []
        cluster.getAllChildMarkers().forEach(function (marker) {
          // console.log('Cluster: Childmarker Data Color', marker.data.color)
          if (marker.data) {
            childmarker_colors.push(marker.data.color)
          }
        })
        // check if all values of childmarker_colors are the same
        let check_all_same = childmarker_colors.every((val, i, arr) => val === arr[0])
        // console.log('All colors are the same: ', check_all_same)

        // NOW: with white and layer color
        const checkChildMarkerColors = (childmarker_colors) => {
          const uniqueColors = [...new Set(childmarker_colors)];
          if (uniqueColors.length === 1 && uniqueColors[0] === '#fff') {
            return '#fff';
          } else if (uniqueColors.length === 2 && uniqueColors.includes('#fff')) {
            return uniqueColors.find(color => color !== '#fff');
          } else {
            // 'multiple colors'
            return '';
          }
        };
        let cluster_color = checkChildMarkerColors(childmarker_colors);
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
      console.log('loadJSONData')
      console.log('mapInstance', mapInstance.value)
      let dataUrl = 'https://orte-backend.a-thousand-channels.xyz/public/maps/histoprojekt-hamburg';
      let localDataUrl = 'histoprojekt-hamburg.json';
      /* try {
        const response = await fetch( dataUrl )
        const statusCode = response.status;
        console.log('Service up and running with ', statusCode)    
      } catch (error) {
        console.error('Error loading JSON data from Remote:', error)
        dataUrl = localDataUrl;
      } */
      try {
        const response = await fetch( dataUrl )
        const fetchedData = await response.json()
        data.value = fetchedData;        
        
        const timelineSummary = await summarize(data.value);
        console.log("timelineSummary",timelineSummary.value);
      
        const result = await addDataToMap(data.value);
        // mapInstance.value = result.map;
        overlayLayers.value = result.overlayLayers;
        selectedYear.value = result.selectedYear;        
        if ( timelineSummary.minYear ) {
          selectedYear.value = 1;
          minYear.value = parseInt(timelineSummary.minYear, 10);
          maxYear.value = parseInt(timelineSummary.maxYear, 10);
          if (minYear.value < 1920) {
            minYear.value = 1920;
          }
          if (maxYear.value > 1990) {
            maxYear.value = 1999;
          }
        }
        // const filteredData = 
        // await filter_and_update(map,overlayLayers,selectedYear)
        const placeId = route.params.placeId;
        if (placeId && places) {
          console.log('call place',placeId);
          console.log(' places', places.value)
          const searchId = typeof places.value[0]?.id === 'number' ? parseInt(placeId) : placeId.toString();

          if (!places.value || !Array.isArray(places.value)) {
              console.warn('call place. places ist nicht initialisiert oder kein Array')
          }        
          const place = places.value.find(p => p.id === searchId)
          if (place) {
            console.log('call place',place.id)
            placeData.value = place
            sidebarStore.openSidebar();
            focusMarkerById(placeId);
          }
        }      
        console.log('loadJSONData mapInstance', mapInstance.value)
        const loaderWrapper = document.querySelector('.loader_wrapper');
        loaderWrapper.style.transition = 'opacity 300ms ease';
        loaderWrapper.style.opacity = '0';
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
        }, 300);      
        if (Object.keys(layersList.value).length > 0) {
          sortLayersList();
        }            
      } catch (error) {
        console.error('Error loading JSON data:', error)
      }
    }

    const focusMarker = (markerId) => {
      const marker = allMarkers.find(m => m.options.id === parseInt(markerId));
      if (marker) {
        mapInstance.value.flyTo(marker.getLatLng(), 15);
        // Öffne das Popup
        marker.openPopup();
      }
    };
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
    const sortLayersList = () => {
      console.log('sortLayersList');
      const currentLayers = {...layersList.value}; // Kopie erstellen
    
      const entries = Object.entries(currentLayers);
      const sortedEntries = entries.sort((a, b) => {
            // Spezialfall: "Hintergrund Informationen" ans Ende
            if (a[1].title === "Hintergrund Informationen") return 1;
            if (b[1].title === "Hintergrund Informationen") return -1;        
          return a[1].title.localeCompare(b[1].title, 'de');
      });
      
      // Neues Objekt erstellen und zuweisen
      sortedLayersList.value = {};  // Reset
      sortedEntries.forEach(([key, value]) => {
          sortedLayersList.value[key] = value;
       });
      console.log('sortedLayersList with layers', Object.keys(sortedLayersList.value).length);
    };
      
    const addDataToMap = (data) => {
      // Create a MarkerClusterGroup
      // const markers = L.markerClusterGroup(markerclusterSettings)
      

      // Create layers and add data to the map
      data.map.layer.forEach((layer) => {
        let layer_group = L.markerClusterGroup(markerclusterSettings)
        
        layersList.value[layer.title] = { 
          id: layer.id, 
          title: layer.title, 
          color: layer.color, 
          colorChecked: layer.color, 
          places: layer.places.length, 
          checked: visibleLayers[layer.id] 
        };
        let darkcolor = layer.color;
        if ( layer.color == '#b1f075') {
          darkcolor = '#92c460';

        } else if ( layer.color == '#f0d875' ) {
          darkcolor = '#d1b132';
        } else if ( layer.color == '#75b8f0' ) {
          darkcolor = '#5a8fc0';
        } else if ( layer.color == '#f07575' ) {
          darkcolor = '#c46060';
        } else {
          darkcolor = layer.color;
        }       
        layer.color = darkcolor;
        layers.value.push(layer)
      
        layer.places.forEach((place) => {
          let mtype = 'place'
          if (place.subtitle === 'autobiografisch') {
            mtype = 'biography';
          } else if (place.subtitle === 'selbstaussage') {
              mtype = 'selbstaussage';    
          } else if (layer.title === 'Hintergrund Informationen') {
            mtype = 'information';
          }
         
          place.layer_title = layer.title;
          place.layer_color = darkcolor;
          places.value.push(place)
          const icon = LargeMarkerIcon.create({ color: darkcolor, mtype: mtype })
          const marker = L.marker([place.lat, place.lon], { icon: icon, id: place.id, data: place })
          // .bindTooltip(place.title,{permanent: false, direction: 'auto', opacity: 0.7});

          marker.data = [];
          if ( place.startdate && !place.enddate ) {
            place.enddate = parseInt(place.startdate.substring(0, 4))+"-12-31T00:00:00.000Z";
            console.log("Set enddate with startdate", place.startdate,place.enddate);
          }
          if ( place.startdate && place.enddate ) {
            marker.data = setFromToYears(place.startdate,place.enddate); 
          }          
          marker.data.title = place.title;
          marker.data.color = darkcolor;
          place.color = darkcolor;
          marker.data.mtype = mtype;
          marker.data.layer_id = layer.id;

          if ( place.date_with_qualifier ) {
            const regex = /ca. (\d{4})s/;

            
            if (regex.test(place.date_with_qualifier)) {
              // Replace english "s" with german "er" (like in 2000s)
              place.date_with_qualifier = place.date_with_qualifier.replace(regex, '$1er');
            }
          }
        
          function setFromToYears (startdate,enddate) {
            var startYear = parseInt(startdate.substring(0, 4));
            var endYear = parseInt(enddate.substring(0, 4));
            return {
                fromYear: startYear,
                endYear: endYear
            };

          }          
          
          let mtypeIcon = '';
          place.strokeWidth = 3;
          mtypeIcon = Icon(iconData(place, true),layer.id,layer.title);
          let audioIcon = '';
          if (place.audiolink.length > 0) {
            audioIcon= "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>headphone_2_line</title><g id='headphone_2_line' fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#09244BFF' d='M5 11a7 7 0 0 1 14 0v2.035c1.696.243 3 1.702 3 3.465v.25A3.25 3.25 0 0 1 18.75 20 1.75 1.75 0 0 1 17 18.25V11a5 5 0 0 0-10 0v7.25A1.75 1.75 0 0 1 5.25 20 3.25 3.25 0 0 1 2 16.75v-.25a3.5 3.5 0 0 1 3-3.465zm0 4.085A1.5 1.5 0 0 0 4 16.5v.25c0 .605.43 1.11 1 1.225zm14 0v2.89c.57-.116 1-.62 1-1.225v-.25a1.5 1.5 0 0 0-1-1.415'/></g></svg>";
          }
          let imageIcon = '';
          if (place.images.length > 0) {
            imageIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>pic_line</title><g id='pic_line' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#09244BFF' d='M20 3a2 2 0 0 1 1.995 1.85L22 5v14a2 2 0 0 1-1.85 1.995L20 21H4a2 2 0 0 1-1.995-1.85L2 19V5a2 2 0 0 1 1.85-1.995L4 3zM9.879 12.05l-5.657 5.657a1.002 1.002 0 0 1-.222.168V19h16v-1.125a1 1 0 0 1-.222-.168L16.95 14.88l-.707.707.207.207a1 1 0 0 1-1.415 1.414L9.88 12.05ZM20 5H4v10.1l4.995-4.994a1.25 1.25 0 0 1 1.666-.091l.101.09 4.066 4.067 1.238-1.238a1.25 1.25 0 0 1 1.666-.091l.102.091L20 15.101zm-4.5 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3'/></g></svg>";
          }

          const popupContent = `
              <p class="place-layer" style="background-color: ${darkcolor}">
                <a href="#" class="layer-info" data-layer-id="${layer.id}" data-layer-darkcolor="${darkcolor}">
                  ${layer.title}
                </a>
              </p>
              
              <p class="place-dates">
                <strong>
                  ${place.date_with_qualifier ? place.date_with_qualifier : 'Lacune Karte'} 
                </strong>
                ${place.date_with_qualifier ? '|' : ''} 
                ${place.location} ${place.address}${place.city ? ', '+place.city : ''}
                
                <span class="nobr">${mtypeIcon} ${place.subtitle}</span>${imageIcon}${audioIcon}
              </p>
              <h3 title="${place.title}">
                <a href="#" class="place-info" data-layer-id="${layer.id}" data-layer-title="${layer.title}" data-layer-darkcolor="${darkcolor}" data-place-id="${place.id}">
                  ${place.title}
                </a>
              </h3>
              
              <p class="popup-action">
                <a href="#" class="place-info1" data-layer-id="${layer.id}" data-layer-title="${layer.title}" data-layer-darkcolor="${darkcolor}" data-place-id="${place.id}">Weiter lesen</a>
              </p>
            `
          marker.bindPopup(popupContent)


         /*
          marker.on('popupclose', (e) => {
            const popup = e.popup;
            const container = popup.getElement();
            console.log('on popupclose removeEventListeners', place.id);
          });
          */
          marker.on('popupopen', (e) => {
            if (!e.target._map) {
              console.warn('Karte ist noch nicht bereit');
              return;
            }            
            const popup = e.popup;
            const container = popup.getElement();
            console.log('on popupopen addEventListeners', place.id);
            // console.log('on popupopen container found ', container);
            // console.log('on popupopen container place info found ', container.querySelector('.place-info'));

            const placeInfoHandler = (event) => {
              event.preventDefault();
              console.log('place-info clicked', event.target);
              const layerId = event.target.getAttribute('data-layer-id');
              const layerTitle = event.target.getAttribute('data-layer-title');
              const layerDarkcolor = event.target.getAttribute('data-layer-darkcolor');
              const placeId = event.target.getAttribute('data-place-id');
              layerStore.setLayerData(layerTitle, layerDarkcolor, placeId );
              place.layer_title = layerTitle;
              openPlaceInfo(place);
            };


            const placeInfo = container.querySelector('.place-info');
            if (placeInfo) {
              console.log('place-info found, removing addEventListener', place.id);
              placeInfo.removeEventListener('click', placeInfoHandler);
            }
            placeInfo.removeEventListener('click', placeInfoHandler);
            placeInfo.addEventListener('click', placeInfoHandler);
            console.log('addEventListeners place-info added', place.id);
            container.querySelector('.place-info1').addEventListener('click', (event) => {
              event.preventDefault();
              const layerTitle = event.target.getAttribute('data-layer-title');
              const layerDarkcolor = event.target.getAttribute('data-layer-darkcolor');
              const placeId = event.target.getAttribute('data-place-id');
              layerStore.setLayerData(layerTitle, layerDarkcolor, placeId);
              place.layer_title = layerTitle;
              openPlaceInfo(place);
            });            

            container.querySelector('.layer-info').addEventListener('click', (event) => {
              event.preventDefault();
              const layerTitle = event.target.getAttribute('data-layer-title');
              const layerDarkcolor = event.target.getAttribute('data-layer-darkcolor');
              const placeId = event.target.getAttribute('data-place-id');
              layerStore.setLayerData(layerTitle, layerDarkcolor, placeId);     
              mapInstance.value.closePopup()         
              openLayerInfo(layer,layerDarkcolor);
            }); 
          });       
          toRaw(layer_group).addLayer(toRaw(marker));
        })
        
        // Transfer markers from FeatureGroup to MarkerClusterGroup
        layer_group.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            // markers.addLayer(layer)
            allMarkers.push(layer);
          }
        })
        overlayLayers.value[layer.title] = layer_group
        // mapInstance.value.addLayer(layer_group)
      })
      console.log('bounds per default')

      data.map.layer.forEach((layer) => {
        layer.places_with_relations.forEach((r) =>  {
          r.relations.forEach((relation) => {
            // console.log('relation from/to',relation.from.id,relation.to.id);
            relations.value.push({
              from: relation.from.id,
              to: relation.to.id, 
            })
          });
        });
      });


      places.value.forEach((place) => {
        let find_relation_to_id = relations.value.find(r => r.from === place.id);
        if (find_relation_to_id) {
          let relation_to = places.value.find(m => m.id === parseInt(find_relation_to_id.to));
          if (relation_to) {
            // console.log('relation_to',relation_to);
            place.relation = relation_to;
          }
        }
      });

      basemaps.value = {
        'Historische Hamburg Karte 1930er': wmsLayerHamburg1930s,
        'Historische Hamburg Karte 1940er': wmsLayerHamburg1940s,
        'Historische Hamburg Karte 1950er': wmsLayerHamburg1950s,
        'Historische Hamburg Karte 1960er': wmsLayerHamburg1960s,
        'Historische Hamburg Karte 1970er': wmsLayerHamburg1970s,
        'Historische Hamburg Karte 1980er': wmsLayerHamburg1980s,
        'Historische Hamburg Karte 1990er': wmsLayerHamburg1990s,
        'Aktuelle Hamburg Karte (Dark)': hamburg_dark_mode
      }
      const layerControl = L.control.layers(basemaps.value, overlayLayers.value, { collapsed: true })
      console.log('map', mapInstance.value)      
      layerControl.addTo(mapInstance.value)
      // check for savedlayers and make them visible
      console.log('savedLayers', savedLayers, Object.keys(savedLayers).length)
      if (Object.keys(savedLayers).length > 0) {
        Object.keys(savedLayers).forEach((layerName) => {
          console.log('layer name check?', layerName, savedLayers[layerName])
          if (
            savedLayers[layerName] &&
            savedLayers[layerName] === true &&
            overlayLayers.value[layerName]
          ) {
            overlayLayers.value[layerName].addTo(mapInstance.value)
            visibleLayers.value[layerName] = overlayLayers.value[layerName]
            layersList.value[layerName].checked = true
          }
        })
      } else {
        console.log('add all layers to map')
        Object.keys(overlayLayers.value).forEach((layerName) => {
          overlayLayers.value[layerName].addTo(mapInstance.value)
          visibleLayers.value[layerName] = overlayLayers.value[layerName]
          layersList.value[layerName].checked = true
        })
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const markerId = urlParams.get('marker');
      console.log("markers",allMarkers);
      console.log("markerId",markerId);
      if (markerId) {
        console.log("focus marker", markerId);
        // focusMarker(markerId);
      }         
      /*
      mapInstance.value.on('zoomstart', () => {
        mapInstance.value.eachLayer((layer) => {
          if (layer.closePopup) {
            layer.closePopup();
          }
          if (layer instanceof L.MarkerClusterGroup) {
            layer.unspiderfy();
          }           
        });
      });
      */
      mapInstance.value.on('overlayadd overlayremove moveend', saveMapState);
      // mapInstance.value.on('overlayadd overlayremove', saveMapState);

      // mapInstance.value.on('zoomend', setTooltipDisplay);
      mapInstance.value.on('baselayerchange', function(e) {
        console.log('baselayerchange', e);     
        if (e.name === 'Aktuelle Hamburg Karte (Dark)') {
          document.body.classList.remove('light-mode');
          document.body.classList.add('dark-mode');
          mapInstance.value.eachLayer(layer => {
            if (layer instanceof L.TileLayer.WMS) {
                mapInstance.value.removeLayer(layer);
            }
          });          
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');

        }
        saveMapState();
        console.log('layersList.value', layersList.value)
         
      })

      console.log('addDataToMap map mapInstance', mapInstance.value)
     
      return {
        data: data,
        overlayLayers: overlayLayers.value,
        centerMap,
        mapInstance 
      }
    }
    // console.log('addDataToMap map', mapInstance.value)
    console.log('addDataToMap selectedYear', selectedYear)

    watch(
      () => route.params.placeId, (newId) => {
        console.log('route.params.placeId', newId)
        // openPlaceInfo(newId)
        console.log('places', places.value)
        let place = places.value.find(p => p.id === Number(newId))
        if (place) {
          console.log('place', place)
          placeData.value = place;
          console.log('placeData', placeData.value)
          console.log('placeData', placeData.value.lat)
          console.log('placeData', placeData.value.lon)
          sidebarStore.openSidebar();
          mapInstance.value.flyTo([placeData.value.lat,placeData.value.lon], 16, { paddingTopLeft: [800, 800], paddingBottomRight: [0, 0] });
        }
      }, { immediate: true }
    )
    watch(
      () => route.params.layerId, (newId) => {
        console.log('route.params.layerId', newId)
        console.log('layers', layers.value)
        let layer = layers.value.find(l => l.id === newId)
        if (layer) {
          console.log('layer', layer)
          openLayerInfo(layer,layer.color);
        } else {
          console.log('layer not found', newId)
        }
      }, { immediate: true }
    )
    return {
        mapElement,
        mapInstance,
        data,
        placeData,
        layerData,
        relations,
        overlayLayers,
        visibleLayers,
        layersList,
        sortedLayersList,
        selectedYear,
        centerMap,
        sidebarStore,
        minYear,
        maxYear     
      };
        
  }
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';

#map.leaflet-container .leaflet-popup-content  h3 {
  font-weight: normal;
  font-size: 23px;
  word-break: break-word;
  line-height: 1.1;
  color: #a8a803;
  margin: 0.25rem 0 0.25rem 0;
  font-weight: normal;
}
#map.leaflet-container .leaflet-popup-content  h3 a {
  color: #a8a803;
  color: #c6c600;  
  font-weight: normal;
}
#map.leaflet-container .leaflet-popup-content p {
  margin: 0 0 0.2em 0;
}
#map.leaflet-container .leaflet-popup-content p.place-layer {
  display: inline-block;
  background-color: lightsalmon;
  padding: 2px 9px;
  margin: 0 0 6px -9px;
  border-radius: 2px;
  color: white;
  font-weight: bold;
}
#map.leaflet-container .leaflet-popup-content p.place-layer a {
  color: white;
  text-decoration: none;
}
#map.leaflet-container .leaflet-popup-content p.place-dates {
  margin: 0;
  font-weight: normal;
}
#map.leaflet-container .leaflet-popup-content p.place-address {
  margin: 3px 0;
}
#map.leaflet-container .leaflet-popup-content p.popup-action a {
  font-weight: normal;
  color: #a8a803;
}
#mapcontrol-center {
  
  left: 12px;
  position: absolute;
  bottom: 50px;
  z-index: 9999;
  background-color: white;
  padding: 4px 4px 1px;
  border: none;
  border-radius: 5px;
  box-shadow: none;
  cursor: pointer;
}
body.dark-mode #mapcontrol-center {
  background-color: #444;
  border: 2px solid #111;
}

#mapcontrol-center svg path.path-content {
  fill: #666;
}
body.dark-mode #mapcontrol-center svg path.path-content {
  fill: #888;
}

#about-link {
  left: 12px;
  position: absolute;
  bottom: 10px;
  z-index: 9998;
  margin-left: 2px;
  margin-bottom: 9px;
  color: #333;
  text-shadow: 0 0 1px black;
}
body.dark-mode  #about-link {
  color: #aaa;
  text-shadow: 0 0 1px white;
}
@media (min-width: 768px) {
  #about-link {
    bottom: 0;
  }
}
</style>
