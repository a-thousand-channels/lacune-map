<template>
  <Transition name="slide">
    <div class="sidebar" v-if="placeData" >
      <button class="close" @click="closeOverlay()">&times;</button>
      <p class="place-layer" :style="{ backgroundColor: placeData.layer_color }">
        <a class="layer-info">
          {{ placeData.layer_title }} 
        </a>
      </p>

      <p class="place-dates">
        <strong>{{ placeData.date_with_qualifier ? placeData.date_with_qualifier : 'Lacune Karte' }}</strong>
        <span v-if="placeData.date_with_qualifier"> | </span><span v-if="placeData.location.length > 0">{{ placeData.location }},</span> {{ placeData.address}} {{ placeData.city }}
        <IconMarker :iconData="iconData(placeData, PopupIsVisible(map,placeData))"
                klass="layer-item-icon"
                :id="'layer-switch-item-icon-'+placeData.layer_id" />
        <span v-if="placeData.subtitle">{{ placeData.subtitle }}</span>
      </p>



      <header>
        <h2>{{ placeData.title }}</h2>
      </header>
      <div class="place-images" v-if="placeData.images">
        <img v-for="image in placeData.images" :key="image.id" :src="image.image_url" :alt="image.alt" :title="image.title" />
      </div>
      
      <p class="place-teaser" v-html="placeData.teaser"></p>
      <div class="place-text" v-html="placeData.text"></div>
      <hr />
      <div class="place-source">
        <div v-if="placeData.sources">Quelle(n): <span v-html="placeData.sources"></span></div>
        <p class="small">Zitiervorschlag: {{ placeData.layer_title }}: {{placeData.title}}. Heike Schader: Lacune, ein Projekt für mehr Sichbarkeit und Erinnerung. 2024</p>
      </div>
      <hr />
      <div v-if="placeData.relation">
        <p><button @click="goToPlace(placeData.relation)">Siehe auch: "{{ placeData.relation.title }}"</button></p>
      </div>  
      <p><button @click="goToPlace(placeData)">Zum Eintrag auf der Karte</button></p>
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
import { iconData } from '@/helpers/icondata';
import { PopupIsVisible } from '@/helpers/popup';
import IconMarker from './icons/IconMarker.vue';




export default {
  props: {
    placeData: {
      type: Object,
      default: null
    },
    layerData: {
        type: Object,
        default: null
    },
    map: {
      type: Object,
      required: true
    },
    relations: {
      type: Object,
      required: true
    }
  },
  components: {
      IconMarker
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
    
    const goToPlace = (place) => {
      console.log('goToPlace', place.title);

          sidebarStore.closeSidebar();
          placeData.value = null;
          if (!props.map) {
            console.warn('props.map not available!!'); 
          }
          setTimeout(() => {
            openExistingPopup(place);     
            router.push({ path: `/` })
          }, 200);

    };

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
              }
            } else {
              console.warn('Kein Popup für diesen Marker sichtbar:', place.id);
            }
          } else {
            console.warn('Kein Popup für diesen Marker gefunden:', place.id);
          }
        });
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

    return { layerStore, closeOverlay, sidebarStore, openLayerInfo, PopupIsVisible, iconData, goToPlace, openExistingPopup, closeAllPopups};
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
  .layer-item-icon {
    display: inline-block;
    margin: -1px 5px 0 2px;
    vertical-align: middle;
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