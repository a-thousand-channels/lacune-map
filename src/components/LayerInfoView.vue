<template>
    <transition name="slide">
      <div class="sidebar" v-if="sidebarStore.isSidebarVisible == true">
        <button class="close" @click="closeOverlay(placeId)">&times;</button>
        <figure class="layer-figure" v-if="layerData.image_link">
          <img :src="layerData.image_link" alt="layerData.title">
        </figure>
        
        <h2 class="layer-title" :style="{ 'background-colorY': layerData.color.toString() }">
          {{ layerData.title }}
          {{ layerStore.layerType }}
        </h2>
        <div v-if="layerData.text" v-html="layerData.text"></div>
        <p>{{ layerData.places.length }} Orte</p>
        <ul class="layer-places-list">
          <li v-for="place in layerData.places" :key="place.id">
            <p class="place-dates" style="font-size: 0.86em">
            
                <strong>{{ place.date_with_qualifier ? place.date_with_qualifier : 'Lacune Karte' }}</strong>
                <IconMarker :iconData="iconData(place, PopupIsVisible(map,place))"
                klass="layer-item-icon"
                :id="'layer-switch-item-icon-'+layerData.id" />              
                {{ place.subtitle !== 'recherchiert' ? place.subtitle : '' }}                
            </p>
            <h3>
              <a @click="openPlaceInfo2(place)">
              {{ place.title }}
              </a>
            </h3>
          </li>
        </ul>
        <p class="action">
          <button @click="closeOverlay">Zur Karte</button>
        </p>
      </div>
      <div v-else class="overlay"><p>Loading...</p></div>
    </transition>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router'
  import { useLayerStore } from '@/stores/layerStore';
  import { useSidebarStore } from '@/stores/sidebarToggle';
  import { useMap } from '@/composables/useMap';
  import { iconData } from '@/helpers/icondata';
  import { PopupIsVisible } from '@/helpers/popup';
  import IconMarker from './icons/IconMarker.vue';
  import { Icon } from 'leaflet';
  import L from 'leaflet'
  import 'leaflet.markercluster' // Import MarkerCluster script
  import 'leaflet.markercluster.placementstrategies/dist/leaflet-markercluster.placementstrategies'
  
  export default {
    props: {
      layerData: {
        type: Object,
        default: null
      },
      map: {
        type: Object,
        required: true
      },      
      layerDarkcolor: {
        type: String,
        default: '#333'
      }
    },
    components: {
      IconMarker
    },
    setup(props) {
      const layerStore = useLayerStore();      
      const sidebarStore = useSidebarStore();
      const placeData = ref(null);
      const router = useRouter();
      const route = useRoute()          

      onMounted(() => {
        console.log('layerId', props.layerData.id);
      });
     
      const closeAllPopups = () => {
        if (props.map) {
          props.map.closePopup()
        }
      }

      const openExistingPopup = (place) => {
        console.log('openExistingPopup called for', place.id);
        console.log('openExistingPopup map', props.map);

        if (!props.map) return;

       

        // Alle Layer durchsuchen
        props.map.eachLayer((layer) => {
          if (layer instanceof L.MarkerClusterGroup) {
           // layer.refreshClusters();
           console.log('XCheck Cluster gefunden:', layer);  
          } 
          // Prüfen ob es ein Marker ist und die richtige ID hat
          if (layer instanceof L.Marker && layer.options.id === place.id) {
            
            const isVisible = layer?.visible ?? false;
            // Zur Position fliegen
            
            props.map.flyTo(layer.getLatLng(), 16);
            // Vorhandenes Popup öffnen

            if (layer.getPopup()) {
              if ( isVisible ) {
                console.log('Layer ist sichtbar:', place.id);
                layer.openPopup();
              } else {
                console.log('Layer nicht sichtbar:', place.id);

                const cluster = findParentCluster(layer);
                console.log('Check Cluster gefunden:', cluster);

                if (cluster && cluster !== layer) {
                  console.log('Cluster gefunden:', cluster);
                  setTimeout(() => {
                    cluster.spiderfy();
                  }, 1000);                    
                } else {
                  console.log('Kein Cluster gefunden:', cluster);
                }
                layer.openPopup();
              }
            } else {
              console.warn('Kein Popup für diesen Marker sichtbar:', place.id);
            }
          }
        });
      };

      const findParentCluster = (layer) => {
        console.log('Suche Parent Cluster für:', layer);
        console.log('Suche Parent Cluster in:', props.map);
        if (!props.map) return null;
      
        try {
          // Alle Layer der Karte durchgehen
          let parentCluster = null;
          props.map.eachLayer((mapLayer) => {
            // Prüfen ob es sich um eine MarkerClusterGroup handelt
            if (mapLayer instanceof L.MarkerClusterGroup) {
              console.log('mapLayer:', mapLayer);
              // Alle Cluster dieser Gruppe durchgehen
              parentCluster = mapLayer.getVisibleParent(layer);
              /*
              mapLayer.eachLayer((cluster) => {
                if (cluster instanceof L.MarkerCluster) {
                  console.log('mapLayer cluster:', cluster);

                  // Prüfen ob unser Layer in diesem Cluster ist
                  const childMarkers = cluster.getAllChildMarkers();
                  if (childMarkers.includes(layer)) {
                    parentCluster = cluster;
                  }
                }
              });
              */
            }
          });
          
          console.log('Gefundener Parent Cluster:', parentCluster);
          return parentCluster;
        } catch (error) {
          console.error('Fehler beim Suchen des Parent Clusters:', error);
          return null;
        }
      };
      const closeOverlay = () => {
        props.layerData.value = null;
        sidebarStore.closeSidebar();
        router.push({ path: '/' })
      };  
      const openPlaceInfo2 = (place) => {
        console.log('openPlaceInfo2', place);
        if( PopupIsVisible(props.map,place) ) {
          props.layerData.value = null;
          sidebarStore.closeSidebar();
          placeData.value = place.value;
          if (!props.map) {
            console.warn('props.map not available!!'); 
          }
          // closeAllPopups();
          openExistingPopup(place);      
          router.push({ path: `/place/${place.id}` })
        }
      };
      return { layerStore, closeOverlay, openPlaceInfo2, PopupIsVisible, placeData, sidebarStore, iconData };
    }
  }
  </script>
  
  <style scoped>
  
  .overlay img {
    width: 100%;
    max-width: 300px;
    height: auto;
    background-color: rgba(255,2552,255,0.9);
    margin-bottom: 2em;
  }
  ul.layer-places-list {
    list-style-type: none;
    padding: 0;
  }
  .layer-places-list li {
    list-style-type: "— ";
    list-style-type: none;
    padding: 0.2em 0 0.5em 0;
    font-size: 1.25em;
  }
  @media (min-width: 768px) {
    .layer-places-list li {
      font-size: 1.15em;
    }
  }
  .layer-places-list li h3 {
    font-size: 23px;
    word-break: break-word;
    line-height: 1.1;
    color: #a8a803;
    margin: 0.25rem 0 0.25rem 0;
    font-weight: normal;  
  }
  .layer-places-list li a {
    color: #a8a803;
    font-weight: normal;;
    text-decoration: none;
    cursor: pointer;
  }
  .layer-places-list li a:hover {
    color: #111;
  }
  .layer-places-list li div.layer-item-icon {
    display: inline;
    margin-left: 5px;
  }

  .layer-places-list li svg {
    vertical-align: middle;    
    margin-right: 0.5em;

    vertical-align: bottom;
    margin: 0 0.2em;    

    transform: scale(0.8);
  }
  
  
  </style>