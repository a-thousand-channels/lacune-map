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
        {{ layerData.places.length }} Orte
        <ul class="layer-places-list">
          <li v-for="place in layerData.places" :key="place.id">
            <a @click="openPlaceInfo1(place)">
              <IconMarker :iconData="placeIconData(place)" 
            class="layer-switch-item-icon"
            :id="'layer-switch-item-icon-'+layerData.id" :data-layer-id="layerData.id" :data-layer-title="layerData.title" />              
              {{ place.date_with_qualifier }} {{ place.title }} 
            </a>
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
  import { useMap } from '@/composables/useMap'
  import IconMarker from './icons/IconMarker.vue'
  import { Icon } from 'leaflet';

  
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
      const placeIconData = (place) => {
        let placeData = {
          id: place.id,
          subtitle: place.subtitle,
          color: place.color,
          colorChecked: place.color,
          strokeWidth: 0,
          checked: true
        };
        return placeData;
      }
      const closeAllPopups = () => {
        if (props.map) {
          props.map.closePopup()
        }
      }
      const openExistingPopup = (place) => {
        console.log('openExistingPopup', place.id);
        console.log('openExistingPopup map', props.map);

        if (!props.map) return;

        // Alle Layer durchsuchen
        props.map.eachLayer((layer) => {
          // Prüfen ob es ein Marker ist und die richtige ID hat
          if (layer instanceof L.Marker && layer.options.id === place.id) {
            console.log('openExistingPopup', place.id);
            
            const isVisible = layer?.visible ?? false;
            // Zur Position fliegen
            props.map.flyTo(layer.getLatLng(), 16);
            // Vorhandenes Popup öffnen
            if (layer.getPopup()) {
              if ( isVisible ) {
                layer.openPopup();
              } else {
                console.log('Layer nicht sichtbar:', place.id);
                layer.openPopup();
                const popup = layer.getPopup();
                if (popup){
                  popup.openOn(props.map) // you'll need a reference to the L.map instance for this
                }
              }
              layer.openPopup();
            } else {
              console.warn('Kein Popup für diesen Marker sichtbar:', place.id);
            }
          } else {
            console.warn('Kein Popup für diesen Marker gefunden:', place.id);
          }
        });
      };

  
      const closeOverlay = () => {
        props.layerData.value = null;
        sidebarStore.closeSidebar();
      };  
      const openPlaceInfo1 = (place) => {
        console.log('openPlaceInfo1', place);
        props.layerData.value = null;
        sidebarStore.closeSidebar();
        placeData.value = place.value;
        if (!props.map) {
          console.warn('props.map not available!!'); 
        }
        closeAllPopups();
        openExistingPopup(place);      
        router.push({ path: `/place/${place.id}` })
      };
      return { layerStore, closeOverlay, openPlaceInfo1, placeData, sidebarStore, placeIconData};
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
  .layer-places-list li a {
    color: #444;
    text-decoration: none;
    cursor: pointer;
  }
  .layer-places-list li a:hover {
    color: #111;
  }
  .layer-places-list li svg {
    vertical-align: middle;    
    margin-right: 0.5em;
  }
  
  
  </style>