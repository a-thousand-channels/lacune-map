

<template>
  <div class="overlay" v-if="placeData">
    <button @click="closeOverlay">&times;</button>
    <p class="place-layer" style="background-color: {{layerDarkcolor}}">
      <a href="#" class="layer-info" data-layer-id="{{ layerId }}">
        Layer {{ layerTitle }}
      </a>
    </p>

    <p class="place-dates">{{ placeData.date_with_qualifier }}</p>
    <header>
      <h2>{{ placeData.title }}</h2>
      <p v-if="placeData.subtitle">Subtitle: {{ placeData.subtitle }}</p>
    </header>
    
    <p><span v-if="placeData.location">{{ placeData.location }}, </span>{{ placeData.city }}</p>
  
    <p v-html="placeData.teaser"></p>
    <p v-html="placeData.text"></p>
    <hr />
    <p>Quellen: {{ placeData.source }}</p>
    <p><button @click="closeOverlay">Zur Karte</button></p>
    <p><small>Place ID: {{ placeData.id }}, Layer ID: {{ layerId }} {{ layerTitle }}</small></p>
  </div>
  <div v-else class="overlay"><p>... (Infos zu einem einzelnen Orte können derzeit noch nicht angezeigt werden.)</p>
  <p><a @click="closeOverlay">Zur Karte</a></p></div>
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
    layerTitle: {
      type: String,
      required: true
    },
    layerDarkcolor: {
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
        const response = await fetch(`https://orte-backend.a-thousand-channels.xyz/public/maps/histoprojekt-hamburg/layers/${layerId}/places/${placeId}`);
        const data = await response.json();
        placeData.value = data.place;
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