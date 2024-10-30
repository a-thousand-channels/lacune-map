<template>
    <div class="overlay" v-if="layerData">
      
      <figure v-if="layerData.layer.image_link">
        <img :src="layerData.layer.image_link" alt="layerData.layer.title">
      </figure>
      
      <h2 :style="{ 'color': layerStore.layerDarkcolor.toString() }">
        {{ layerData.layer.title }}
      </h2>
      <div v-if="layerData.layer.text" v-html="layerData.layer.text"></div>
      <ul>
        <li v-for="place in layerData.layer.places" :key="place.id">
          <router-link :to="{ name: 'placeInfo', params: { layerId: layerId, placeId: place.id } }">
            {{ place.date_with_qualifier }} {{ place.title }} 
          </router-link>
        </li>
      </ul>
      <p>
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
  .overlay {
    position: fixed;
    overflow: scroll;
    top: 5vh;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 48px 18px;
  }
  .overlay img {
    width: 100%;
    max-width: 300px;
    height: auto;
  }
  </style>