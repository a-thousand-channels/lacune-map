

<template>
  <div class="overlay" v-if="placeData">
    <button class="close" @click="closeOverlay">&times;</button>
    <p class="place-layer" :style="{ backgroundColor: layerStore.layerDarkcolor }">
      <a @click="openLayerInfo(layerId)" class="layer-info" :data-layer-id="layerId">
        {{ placeData.layer_title }} 
      </a>
    </p>

    <p class="place-dates">{{ placeData.date_with_qualifier }}</p>
    <header>
      <h2>{{ placeData.title }}</h2>
      <p v-if="placeData.subtitle">{{ placeData.subtitle }}</p>
    </header>
    
    <p class="place-location">■ <span v-if="placeData.location">{{ placeData.location }}, </span>{{ placeData.city }}</p>
  
    <p v-html="placeData.teaser"></p>
    <p v-html="placeData.text"></p>
    <hr />
    <div class="source">
      <p>Quelle(n): <span v-if="placeData.source">{{ placeData.source }}</span><span v-else>...</span></p>
      <p class="small">Zitiervorschlag: {{ placeData.layer_title }}: {{placeData.title}}. Heike Schader: Lakune, ein Projekt für mehr Sichbarkeit und Erinnerung. 2024</p>
    </div>
    <p><button @click="closeOverlay">Zum Eintrag auf der Karte (TODO)</button></p>
  </div>
  <div v-else class="overlay"><p>... (Infos zu einem einzelnen Orte können derzeit noch nicht angezeigt werden.)</p>
  <p><button @click="closeOverlay">Zur Karte</button></p></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLayerStore } from '@/stores/layerStore';
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
    const layerStore = useLayerStore();
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

    const openLayerInfo = (layerId) => {
        console.log('openLayerInfo', layerId )
        router.push({ name: 'layerInfo', params: { layerId: layerId.toString() } });
      };  
    const closeOverlay = () => {
      router.push({ name: 'home' });
    };

    return { placeData, layerStore, closeOverlay, openLayerInfo };
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
  p.place-location {
    font-family: 'Courier New', Courier, monospace;
    font-size: 3vw;
  }
  p.place-layer {
    display: inline-block;
    background-color: lightsalmon;
    padding: 2px 11px;
    margin: 0 0 6px -11px;
    border-radius: 2px;
    color: white;
    font-weight: bold;
  }  
  p.place-layer a {
    color: white;
    text-decoration: none;
  }

</style>