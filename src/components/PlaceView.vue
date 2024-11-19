<template>
  <Transition name="slide">
    <div class="sidebar" v-if="placeData" >
      <button class="close" @click="closeOverlay()">&times;</button>
      <p class="place-layer" :style="{ backgroundColor: layerStore.layerDarkcolor }">
        <a class="layer-info">
          {{ placeData.layer_title }} 
        </a>
      </p>
      <p class="place-dates">
        <strong>{{ placeData.date_with_qualifier }}</strong>
        <span v-if="placeData.date_with_qualifier"> | </span><span v-if="placeData.location.length > 0">{{ placeData.location }},</span> {{ placeData.address}} {{ placeData.city }}
        <span class="" v-html="getMtypeIcon(placeData)"></span>&nbsp;<span v-if="placeData.subtitle">{{ placeData.subtitle }}</span>
      </p>



      <header>
        <h2>{{ placeData.title }}</h2>
      </header>
      <div class="place-images" v-if="placeData.images">
        <img v-for="image in placeData.images" :src="image.image_url" :alt="image.alt" :title="image.title" />
      </div>
      
      <p class="place-teaser" v-html="placeData.teaser"></p>
      <div class="place-text" v-html="placeData.text"></div>
      <hr />
      <div class="place-source">
        <p>Quelle(n): <span v-if="placeData.source">{{ placeData.source }}</span><span v-else title="Angaben fehlen noch">...</span></p>
        <p class="small">Zitiervorschlag: {{ placeData.layer_title }}: {{placeData.title}}. Heike Schader: Lacune, ein Projekt für mehr Sichbarkeit und Erinnerung. 2024</p>
      </div>
      <p><button @click="closeOverlay(placeId)">Zur Karte</button></p>
    </div>
    <div v-else class="sidebar">
      <p>... Infos zu diesem Ort können gerade nicht angezeigt werden.</p>
      <p><button @click="closeOverlay()">Zur Karte</button></p>
    </div>
  </Transition>
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
    },
    layerData: {
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
      document.querySelector('.layer-info').addEventListener('click', (event) => {
          event.preventDefault();
          console.log('layer-info clicked', event.target);
          console.log('layer-info clicked', props.layerData.id);
           
          openLayerInfo(props.layerData,props.layerData.color);
      });       

    });
    
    const getMtypeIcon = (place) => {
      if ( place.layer_title === 'Hintergrund Informationen') {
        return '△&nbsp;informatives';
      } else if ( place.subtitle === 'autobiografisch' ) {
        return '<span class="mtypeIcon">◊</span>&nbsp;autobiografisch';
      } else if ( place.subtitle.length > 0 ) {
        return '◯';
      } else {
        return '';
      }
      
    };

    const openLayerInfo = (layer,layerDarkcolor) => {
      console.log('openLayerInfo', layer.id )
      placeData.value = null;
      console.log('openLayerInfo',layer.color)
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
      router.push({ path: '/' })
    };

    return { layerStore, closeOverlay, sidebarStore, getMtypeIcon, openLayerInfo};
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
    font-weight: normal;
  }  
  p.place-layer a {
    color: white;
    text-decoration: none;
  }

/* Transition animations */
.slide-enter-active .sidebar,
.slide-leave-active .sidebar {
  transition: all 2.3s ease;
}

.slide-enter-from .sidebar,
.slide-leave-to .sidebar {
  transform: translateX(-100%);
  transition: all 2.3s ease;
  opacity: 0;
}

.slide-enter-to .sidebar
.slide-leave-from  .sidebar {
  transform: translateX(0);
  transition: all 2.3s ease;
  opacity: 0.4;
}

.slide-enter {
  transform: translateX(-300px);
}

.slide-enter-active {
  transition: all .3s ease-in;
}

.slide-leave-active {
  transition: all .3s ease-in;
}
.slide-leave-to {
  transform: translateX(-300px);
}
</style>