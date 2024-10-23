<template>
    <div class="overlay" v-if="layerData">
      <h2>{{ layerData.layer.title }}</h2>
      <p>ID: {{ layerData.layer.id }}</p>
      <div v-if="layerData.layer.text" v-html="layerData.layer.text"></div>
        
      <figure v-if="layerData.layer.image_link">
            <img :src="layerData.layer.image_link" alt="layerData.layer.title">
      </figure>
      
      <h4>Einträge zu {{ layerData.layer.title }}:</h4>
      <ul>
        <li v-for="place in layerData.layer.places" :key="place.id">
          <router-link :to="{ name: 'placeInfo', params: { layerId, placeId: place.id } }">
            {{ place.date_with_qualifier }}  {{ place.title }} 
          </router-link>
        </li>
      </ul>
      <button @click="closeOverlay">Zur Karte</button>
    </div>
    <div v-else class="overlay"><p>Loading...</p></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    props: {
      layerId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const router = useRouter();
      const layerData = ref(null);
  
      const fetchLayerData = async (id) => {
        try {
          // Replace with your actual API call
          const response = await fetch(`https://orte-backend.a-thousand-channels.xyz/public/maps/histoprojekt-hamburg/layers/${id}`);
          const data = await response.json();
          layerData.value = data;
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
  
      return { layerData, closeOverlay };
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