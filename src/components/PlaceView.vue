

<template>
  <div class="overlay" v-if="placeData">
    <h2>{{ placeData.name }}</h2>
    <p>Place ID: {{ placeData.id }}</p>
    <p>Layer ID: {{ layerId }}</p>
    <p>Subtitle: {{ place.subtitle }}</p>
    <p>Teaser: {{ place.teaser }}</p>
    <p>Description: {{ place.text }}</p>
    <p>Source: {{ place.source }}</p>
    <button @click="closeOverlay">Close</button>
  </div>
  <div v-else class="overlay"><p>... (Infos zu einem einzelnen Orte können derzeit noch nicht angezeigt werden.)</p><button @click="closeOverlay">Close</button></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
    const placeData = ref(null);

    const fetchPlaceData = async (layerId, placeId) => {
      try {
        // Replace with your actual API call
        const response = await fetch(`https://api.example.com/layer/${layerId}/place/${placeId}`);
        const data = await response.json();
        placeData.value = data;
      } catch (error) {
        console.error('Error fetching place data:', error);
      }
    };

    onMounted(() => {
      fetchPlaceData(props.layerId, props.placeId);
    });

    const closeOverlay = () => {
      router.push({ name: 'home' });
    };

    return { placeData, closeOverlay };
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
</style>