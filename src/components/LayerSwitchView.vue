<template>
    <div id="map-navigation">
      <div id="layer-switch">
        <div class="label-wrapper">
          <div class="layer-switch-label" :id="'layer-switch-label-'+layer.id" v-for="layer in layersList" :key="layer.id">
            <label :for="layer.id">{{ layer.title }} ({{ layer.places }})</label>
          </div>
        </div>
        <div class="items-wrapper">
          <div class="layer-switch-item" v-for="layer in layersList" :key="layer.id">
            <input type="checkbox" :id="layer.id" :checked="layer.checked" @change="layerSwitch(layer.title)">
            <IconMarker :iconData="layer" 
            class="layer-switch-item-icon"
            :id="'layer-switch-item-icon-'+layer.id" />
          </div>
        </div>
      </div>  
      <div id="type-filter">
        <div class="label-wrapper">
          <div class="type-filter-label" v-for="filter in filterList" :key="filter.id">
            <label :for="filter.id">{{ filter.title }}</label>
          </div>
        </div>
        <div class="items-wrapper">
          <div class="type-filter-item" v-for="filter in filterList" :key="filter.id">
            <input type="checkbox" :id="filter.id" :checked="filter.checked" @change="filterSwitch(filter.id)">
              <IconMarker :iconData="filter" />
          </div>
        </div>
      </div>
    </div>      
</template>
  
  <script>
  import { ref, nextTick, onMounted } from 'vue'
  import IconMarker from './icons/IconMarker.vue'
  
  export default {
    props: {
      layersList: {
        type: Object,
        required: true,
        default: () => ({})        
      },
      map: {
        type: Object,
        required: true
      },
      overlayLayers: {
        type: Object,
        required: true
      },
      visibleLayers: {
        type: Object,
        required: true
      }
    },
    components: {
      IconMarker
    },
    setup(props) {
      console.log('LayerSwitchView - setup', props.layersList);



      onMounted(async () => {
        console.log('LayerSwitchView - onMounted');
  
        // Warten auf DOM-Update
        await nextTick();
        await new Promise(resolve => setTimeout(resolve, 
        7000));        
        const iconElements = document.querySelectorAll('svg.layer-switch-item-icon');
        if (iconElements && iconElements.length > 0) {
          iconElements.forEach(icon => {
            icon.addEventListener('mouseover', (event) => {
              event.preventDefault();
              let layerId = icon.getAttribute('data-layer-id');
              document.querySelector("#layer-switch-label-"+layerId).classList.add('active');
              event.target.parentElement.classList.add('active');
              
            });
            icon.addEventListener('mouseout', (event) => {
              event.preventDefault();
              let layerId = icon.getAttribute('data-layer-id');
              document.querySelector("#layer-switch-label-"+layerId).classList.remove('active');
              event.target.parentElement.classList.remove('active');
            });
            icon.addEventListener('click', (event) => {
              event.preventDefault();
              let layerId = icon.getAttribute('data-layer-id');
              let layerName = icon.getAttribute('data-layer-title');
              document.querySelector("#layer-switch-label-"+layerId).classList.add('active');
              console.log('LayerSwitchView click event', event.target)
              let prevCheckbox = event.target.parentElement.previousElementSibling;
              console.log('LayerSwitchView click event', prevCheckbox);
              if( prevCheckbox ) {
                  // Access checkbox properties
                  // console.log(prevCheckbox.checked);
                  // console.log(prevCheckbox.value);
                  prevCheckbox.checked = false;
                  layerSwitch(layerName)
              }
            });                        
          });
        } else {
          console.warn('LayerSwitchView - Keine Layer-Icons gefunden');
        }
      });

      const layerSwitch = (layerName) => {
        try {
          if (!layerName || !props.layersList[layerName] || !props.overlayLayers[layerName]) {
            console.warn('layerSwitch Ungültige Layer-Parameter:', layerName);
            return;
          }

          const layer = props.layersList[layerName];
          layer.checked = !layer.checked;

          if (layer.checked) {
            props.overlayLayers[layerName].addTo(props.map); // props.map statt mapInstance
          } else {
            props.map.removeLayer(props.overlayLayers[layerName]);
          }

          console.log('layerSwitch Layer Status geändert:', layerName, layer.checked);
        } catch (error) {
          console.error('layerSwitch Fehler beim Layer-Switch:', error);
        }
      };    
      const filterList = ref({
        autobiografisches: { id: 'autobiografisches', subtitle: 'autobiografisch', color: '#bbb', colorChecked: '#999', checked: true },
        selbstaussage: { id: 'selbstaussage', subtitle: 'selbstaussage', color: '#bbb', colorChecked: '#999', checked: true },
        sonstiges: { id: 'sonstiges', subtitle: 'sonstiges', color: '#bbb', colorChecked: '#999', checked: true }
      });

      const filterSwitch = (id) => {
        const filter = filterList.value[id];
        console.log('Filter switched:', id, filter);
        if (filter) {
          filter.checked = !filter.checked;
          console.log('Filter switched:', id, filter.checked);
        }
      };      

      return {
        layerSwitch,
        filterList,
        filterSwitch
      };    
    }
  }
  </script>
  
  <style scoped>
    #map-navigation {
      width: auto;
      position: absolute;
      z-index: 999;
      background-color: transparent;
      right: 0;
      margin-top: 40px;
    }
    @media (max-width: 350px) {
      #map-navigation {
      }
    }


    #layer-switch {
      width: auto;
      position: relative;
      background-color: transparent;
      right: 8px;
      margin-top: 10px;
      padding: 15px 0 10px 3px;
      display: flex;
    }
    @media (max-width: 350px) {
      #layer-switch {
      }
    }



    .label-wrapper {
      flex: 3;
      padding: 10px 0 10px 3px;
      /* display to the right : */
      display: flex;
      flex-direction: column;
      justify-content: space-between;

    }
    .items-wrapper {
      flex: 1;
      padding: 15px 8px 5px 2px;
      background-color: white;
      max-width: 70px;
      border-radius: 5px;
    }
    .items-wrapper svg {
      vertical-align: middle;
      text-align: center;
      margin-left: 2px;
      cursor: pointer;
    }
    .dark-mode .items-wrapper {
      background-color: #333;
      border: 2px solid #222;
    }
    .layer-switch-item svg.active circle,
    .layer-switch-item-icon.active circle,
    .layer-switch-item:hover svg circle, 
    .layer-switch-item svg:hover circle, 
    .layer-switch-item svg circle:hover, 
    .layer-switch-item svg:hover path {
        fill: red !important;
    }    
    #layer-switch-item-icon-83 {
      transform: translateX(2px) scale(1.2);
    }    
    .layer-switch-label, .layer-switch-item,
    .type-filter-label, .type-filter-item 
    {
      padding: 0;
      height: 35px;
      white-space: nowrap;
      margin-bottom: 4px;
      text-align: right;
    }
    .layer-switch-item input,
    .type-filter-item input {
      display: none;
    }
    .layer-switch-label label,
    .type-filter-label label 
    {
      padding: 0 12px;
      margin-right: -2px;
      display: inline-block;
      height: 25px;
      background-color: white;
      vertical-align: baseline;
      white-space: nowrap;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .dark-mode .layer-switch-label label,
    .dark-mode .type-filter-label label  {
      background-color: #333;
      color: #aaa;
      border: 2px solid #222;
    }
    .layer-switch-label label {
      opacity: 0;
      width: 0;
      pointer-events: none;
      transition: 0.5s opacity 0s width;
    }
    .layer-switch-label.active label {
      opacity: 1;
      width: auto;
      transition: 0.5s opacity 0s width;

    }

    #type-filter {
      width: auto;
      background-color: transparent;
      right: 0;
      margin-top: 40px;
      padding: 15px 0px 10px 10px;
      display: flex;
      display: none;
    }
    @media (max-width: 350px) {
      #type-filter {
      }
    }



  </style>