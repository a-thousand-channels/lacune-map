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
              <svg v-if="place.audiolink.length > 0" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>headphone_2_line</title><g id="headphone_2_line" fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#09244BFF' d='M5 11a7 7 0 0 1 14 0v2.035c1.696.243 3 1.702 3 3.465v.25A3.25 3.25 0 0 1 18.75 20 1.75 1.75 0 0 1 17 18.25V11a5 5 0 0 0-10 0v7.25A1.75 1.75 0 0 1 5.25 20 3.25 3.25 0 0 1 2 16.75v-.25a3.5 3.5 0 0 1 3-3.465zm0 4.085A1.5 1.5 0 0 0 4 16.5v.25c0 .605.43 1.11 1 1.225zm14 0v2.89c.57-.116 1-.62 1-1.225v-.25a1.5 1.5 0 0 0-1-1.415'/></g></svg>
              <svg v-if="place.images.length > 0" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>pic_line</title><g id="pic_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#09244BFF' d='M20 3a2 2 0 0 1 1.995 1.85L22 5v14a2 2 0 0 1-1.85 1.995L20 21H4a2 2 0 0 1-1.995-1.85L2 19V5a2 2 0 0 1 1.85-1.995L4 3zM9.879 12.05l-5.657 5.657a1.002 1.002 0 0 1-.222.168V19h16v-1.125a1 1 0 0 1-.222-.168L16.95 14.88l-.707.707.207.207a1 1 0 0 1-1.415 1.414L9.88 12.05ZM20 5H4v10.1l4.995-4.994a1.25 1.25 0 0 1 1.666-.091l.101.09 4.066 4.067 1.238-1.238a1.25 1.25 0 0 1 1.666-.091l.102.091L20 15.101zm-4.5 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3'/></g></svg>
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