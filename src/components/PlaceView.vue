<template>
  <div class="sidebar" v-if="placeData">
    <button class="close" @click="closeOverlay()">&times;</button>
    <p class="place-layer" :style="{ backgroundColor: layerStore.layerDarkcolor }">
      <a @click="openLayerInfo(layerId)" class="layer-info" :data-layer-id="layerId">
        {{ placeData.layer_title }} 
      </a>
    </p>

    <p class="place-dates">
      {{ placeData.date_with_qualifier }}
      ⬤ <span v-if="placeData.location">{{ placeData.location }}, </span>{{ placeData.city }}</p>



    <header>
      <h2>{{ placeData.title }}</h2>
      <p class="place-subtitle" v-if="placeData.subtitle">{{ placeData.subtitle }}</p>
    </header>
    <p class="place-teaser" v-html="placeData.teaser"></p>
    <div class="place-text" v-html="placeData.text"></div>
    <hr />
    <div class="place-source">
      <p>Quelle(n): <span v-if="placeData.source">{{ placeData.source }}</span><span v-else title="Angaben fehlen noch">...</span></p>
      <p class="small">Zitiervorschlag: {{ placeData.layer_title }}: {{placeData.title}}. Heike Schader: Lacune, ein Projekt für mehr Sichbarkeit und Erinnerung. 2024</p>
    </div>
    <p><button @click="closeOverlay(placeId)">Zum Eintrag auf der Karte (TODO)</button></p>
  </div>
  <div v-else class="sidebar"><p>... Infos zu diesem Ort können gerade nicht angezeigt werden.</p>
  <p><button @click="closeOverlay()">Zur Karte</button></p></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLayerStore } from '@/stores/layerStore';
import { useSidebarStore } from '@/stores/sidebarToggle';
import { useMap } from '@/composables/useMap'
import { useRouter } from 'vue-router';


export default {
  props: {
    placeData: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const router = useRouter();
    const layerStore = useLayerStore();
    const sidebarStore = useSidebarStore();
   //  const placeData = ref(null);
    const { focusMarkerById } = useMap()
    const placeData = props.placeData;

    onMounted(() => {
      console.log('place.id', props.placeData.id);
      console.log('place.layer_id', props.placeData.layer_id);

    });

    const openLayerInfo = (layerId) => {
        console.log('openLayerInfo', layerId )
        // router.push({ name: 'layerInfo', params: { layerId: layerId.toString() } });
      };  
    const closeOverlay = (placeId) => {
      if (placeId)  {
        console.log('closeOverlay', placeId );
        focusMarkerById(placeId);
        placeData.value = null;
        sidebarStore.closeSidebar();         
      } else {
        console.log('closeOverlay' );
        placeData.value = null;
        sidebarStore.closeSidebar();
      }
    };

    return { layerStore, closeOverlay, sidebarStore };
  }
}
</script>

<style scoped>
  
  p.place-layer {
    display: inline-block;
    background-color: lightsalmon;
    padding: 2px 11px;
    margin: 0 0 0.75em -12px;
    border-radius: 2px;
    color: white;
    font-weight: bold;
  }  
  p.place-layer a {
    color: white;
    text-decoration: none;
  }

</style>