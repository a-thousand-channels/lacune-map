<template>
    <div class="overlay" v-if="layerData">
      <button class="close" @click="closeOverlay(placeId)">&times;</button>
      <figure class="layer-figure" v-if="layerData.layer.image_link">
        <img :src="layerData.layer.image_link" alt="layerData.layer.title">
      </figure>
      
      <h2 :style="{ 'color': layerStore.layerDarkcolor.toString() }">
        {{ layerData.layer.title }}
        {{ layerStore.layerType }}
      </h2>
      <div v-if="layerData.layer.text" v-html="layerData.layer.text"></div>
      <ul class="layer-places-list">
        <li v-for="place in layerData.layer.places" :key="place.id">
          <router-link :to="{ name: 'placeInfo', params: { layerId: layerId, placeId: place.id } }">
            <svg height="25" width="25" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <path v-if="layerData.layer.id == 82" :fill="layerStore.layerDarkcolor.toString()"fill-opacity="1" stroke="1" stroke-width="1" stroke-opacity="1" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>
              <circle v-else class="cls-1" cx="15" cy="15" r="15" :fill="layerStore.layerDarkcolor.toString()" fill-opacity="0.8" stroke="1" stroke-width="0" stroke-opacity="1" shape-rendering="geometricPrecision"></circle>
            </svg>
            {{ place.date_with_qualifier }} {{ place.title }} 
          </router-link>
        </li>
      </ul>
      <p class="action">
        <button @click="closeOverlay">Zur Karte</button>
      </p>
    </div>
    <div v-else class="overlay"><p>Loading...</p></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLayerStore } from '@/stores/layerStore';
  
  export default {
    props: {
      layerId: {
        type: String,
        required: true
      },
      placeId: {
        type: String,
        required: true
      }      
    },
    setup(props) {
      const router = useRouter();
      const layerStore = useLayerStore();      
      const layerData = ref(null);
  
      const fetchLayerData = async (id) => {
        try {
          // Replace with your actual API call
          const response = await fetch(`https://orte-backend.a-thousand-channels.xyz/public/maps/histoprojekt-hamburg/layers/${id}`);
          const data = await response.json();
          layerData.value = data;
          console.log('layerData', layerData.value);
          console.log('layerTitle', layerData.value.layer.title);
          console.log('layerDarkcolor', layerData.value.layer.color);
          layerStore.setLayerData(layerData.value.layer.title, layerData.value.layer.color, layerData.value.layer.id);
        } catch (error) {
          console.error('Error fetching layer data:', error);
        }
      };
  
      onMounted(() => {
        fetchLayerData(props.layerId);
      });
  
      const closeOverlay = () => {
        router.push({ name: 'home' });
      };
  
      return { layerData, layerStore, closeOverlay };
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
      font-size: 1.5em;
    }
  }
  .layer-places-list li a {
    color: white;
    text-decoration: none;
  }
  .layer-places-list li svg {
    vertical-align: middle;    
    margin-right: 0.5em;
  }
  
  
  </style>