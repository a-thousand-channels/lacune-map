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
        <ul class="layer-places-list">
          <li v-for="place in layerData.places" :key="place.id">
            <a @click="openPlaceInfo(place)">
              <IconMarker :layerData="layerData" :isSidebarVisible ="sidebarStore.isSidebarVisible"  />
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
  import { useRouter } from 'vue-router';
  import { useRoute } from 'vue-router';
  import { useLayerStore } from '@/stores/layerStore';
  import { useSidebarStore } from '@/stores/sidebarToggle';
  import IconMarker from './icons/IconMarker.vue'
  import { Icon } from 'leaflet';

  
  export default {
    props: {
      layerData: {
        type: Object,
        default: null
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

      onMounted(() => {
        console.log('layerId', props.layerData.id);
      });
  
      const closeOverlay = () => {
        props.layerData.value = null;
        sidebarStore.closeSidebar();
      };  
      const openPlaceInfo = (place) => {
        props.layerData.value = null;
        sidebarStore.closeSidebar();
        placeData.value = place;
        // TODO: openpopup
      };
      return { layerStore, closeOverlay, openPlaceInfo, placeData, sidebarStore};
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
      font-size: 1.35em;
    }
  }
  .layer-places-list li a {
    color: #444;
    text-decoration: none;
  }
  .layer-places-list li svg {
    vertical-align: middle;    
    margin-right: 0.5em;
  }
  
  
  </style>