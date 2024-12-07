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
import { onMounted, watch, ref } from 'vue'
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
// import { defaultTo } from 'cypress/types/lodash'


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
    const { mapInstance, initMap, registerMarker, markersRegistry } = useMap()  // This contains the Leaflet map instance
    const router = useRouter();
    const route = useRoute()    
    const data = ref([]);
    const placeData = ref(null);
    const places = ref([]);
    const relations = ref([]);
    const layerData = ref(null);
    const layerStore = useLayerStore();    
    const sidebarStore = useSidebarStore();    
    const { focusMarkerById } = useMap()
    const minYear = ref(0);
    const maxYear = ref(2024);
    // Create Metalayer object
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

    L.Browser.retina = false

    let hamburg_dark_mode = L.tileLayer('https://tiles.3plusx.io/hamburg/darkmode/{z}/{x}/{y}{r}.png', {
        attribution: 'Karte: UT/3+x, Geodaten: <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap + Mitwirkende</a>',
        maxZoom: 17,
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
        } else if (savedBasemap === 'Hamburg 1950s') {
          wmsLayerHamburg1950s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1960s') {
          wmsLayerHamburg1960s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1970s') {
          wmsLayerHamburg1970s.addTo(mapInstance.value);
        } else if (savedBasemap === 'Hamburg 1980s') {
          wmsLayerHamburg1980s.addTo(mapInstance.value);
        } else {
          hamburg_dark_mode.addTo(mapInstance.value)
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        }
        // Load JSON data and add layers here
        loadJSONData(mapElement)
      }
    })

    const saveMapState = () => {
      console.log('saveMapState called')
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
          // console.log('overlayLayers', layerName);
          if (layer === overlayLayers.value[layerName]) {
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
      console.log('saveMapState visibleOverlayLayers', visibleOverlayLayers)
      localStorage.setItem('basemap', visibleBasemap)
      console.log('saveMapState mapZoom', newZoom);
    }
    var lastZoom;
    console.log('setTooltipDisplay')
    /*
    const setTooltipDisplay = () => {
      var tooltipThreshold = 17;
      var zoom =  mapInstance.value.getZoom();
      if (zoom < tooltipThreshold && (!lastZoom || lastZoom >= tooltipThreshold)) {
         mapInstance.value.eachLayer(function(l) {
            if (l.getTooltip()) {
                var tooltip = l.getTooltip();
                l.unbindTooltip().bindTooltip(tooltip, {
                    permanent: false
                })
            }
        })
      } else if (zoom >= tooltipThreshold && (!lastZoom || lastZoom < tooltipThreshold)) {
         mapInstance.value.eachLayer(function(l) {
            if (l.getTooltip()) {
                var tooltip = l.getTooltip();
                l.unbindTooltip().bindTooltip(tooltip, {
                    permanent: true
                })
            }
        });
      }
      lastZoom = zoom;
    }*/

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
      console.log('openLayerInfo', layerData.value.color)
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
      
        layer.places.forEach((place) => {
          let mtype = 'place'
          if (place.subtitle === 'autobiografisch') {
            mtype = 'biography';
          } else if (place.subtitle === 'selbstaussage') {
              mtype = 'selbstaussage';    
          } else if (layer.title === 'Hintergrund Informationen') {
            mtype = 'information';
          }
          let darkcolor = layer.color;
          if ( layer.color == '#b1f075') {
            darkcolor = '#92c460';

          } else if ( layer.color == '#f0d875' ) {
            darkcolor = '#d1b132';
          } else if ( layer.color == '#75b8f0' ) {
            darkcolor = '#5a8fc0';
          } else if ( layer.color == '#f07575' ) {
            darkcolor = '#c46060';
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
          mtypeIcon = Icon(iconData(place, PopupIsVisible(mapInstance.value,place) ? true : false), layer.id, layer.title);
          const popupContent = `
              <p class="place-layer" style="background-color: ${darkcolor}">
                <a href="#" class="layer-info" data-layer-id="${layer.id}" data-layer-darkcolor="${darkcolor}">
                  ${layer.title}
                </a>
              </p>
              
              <p class="place-dates">
                <strong>
                  ${place.date_with_qualifier ? place.date_with_qualifier : ''} 
                </strong>
                ${place.date_with_qualifier ? '|' : ''} 
                ${place.location} ${place.address}${place.city ? ', '+place.city : ''}
                
                ${mtypeIcon}&nbsp;${place.subtitle}
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
            console.log('on popupopen container found ', container);
            console.log('on popupopen container place info found ', container.querySelector('.place-info'));

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
              openLayerInfo(layer,layerDarkcolor);
            }); 
          });       
          layer_group.addLayer(marker);
          registerMarker(place.id, [place.lat, place.lon],popupContent)
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
      console.log('markersRegistry', markersRegistry.size)
      console.log('bounds per default')

      data.map.layer.forEach((layer) => {
        layer.places_with_relations.forEach((r) =>  {
          r.relations.forEach((relation) => {
            console.log('relation from/to',relation.from.id,relation.to.id);
            relations.value.push({
              from: relation.from.id,
              to: relation.to.id, 
            })
          });
        });
      });


      places.value.forEach((place) => {
        console.log('place',place.id);
        let find_relation_to_id = relations.value.find(r => r.from === place.id);
        if (find_relation_to_id) {
          console.log('find_relation_to_id',find_relation_to_id);
          let relation_to = places.value.find(m => m.id === parseInt(find_relation_to_id.to));

          if (relation_to) {
            console.log('relation_to',relation_to);
            place.relation = relation_to;
          }
        }
      });

            
  
      /*
      let bounds = [53.55, 9.95]
      bounds = L.latLngBounds(markers.getBounds())
      console.log('bounds', bounds)
      const padding = 0.1 // 10% padding
      const paddedBounds = bounds.pad(padding)
      // mapInstance.value.fitBounds(paddedBounds)
      // mapInstance.value.setView(centerCoordinates, zoomLevel)
      */ 


      basemaps.value = {
        'Historische Hamburg Karte 1930er': wmsLayerHamburg1930s,
        'Historische Hamburg Karte 1950er': wmsLayerHamburg1950s,
        'Historische Hamburg Karte 1960er': wmsLayerHamburg1960s,
        'Historische Hamburg Karte 1970er': wmsLayerHamburg1970s,
        'Historische Hamburg Karte 1980er': wmsLayerHamburg1980s,
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
        focusMarker(markerId);
      }         
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
      // mapInstance.value.on('overlayadd overlayremove moveend', saveMapState);
      mapInstance.value.on('overlayadd overlayremove moveend', saveMapState);

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
          mapInstance.value.flyTo([placeData.value.lat,placeData.value.lon], 16, { paddingTopLeft: [200, 0], paddingBottomRight: [0, 0] });

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
</style>
