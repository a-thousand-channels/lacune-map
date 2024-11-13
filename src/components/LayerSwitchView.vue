<template>
    <div id="map-navigation">
      <div id="layer-switch">
        <div class="label-wrapper">
          <div class="layer-switch-label" v-for="layer in sortedLayersList" :key="layer.id">
            <label :for="layer.id">{{ layer.title }} ({{ layer.places }})</label>
          </div>
        </div>
        <div class="items-wrapper">
          <div class="layer-switch-item" v-for="layer in sortedLayersList" :key="layer.id">
            <input type="checkbox" :id="layer.id" :checked="layer.checked" @change="layerSwitch(layer.id)">
              <IconMarker :iconData="layer" />
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
  import { ref, computed } from 'vue'
  import IconMarker from './icons/IconMarker.vue'
  
  export default {
    props: {
      layersList: {
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

      const sortedLayersListEntries = Object.entries(props.layersList).sort((a, b) => {
        console.log('LayerSwitchView - setup - sort', a.title, b);
        // If either entry is "background", handle specially
        if (a[0] === "Hintergrund Informationen") return 1;  // Move "background" to the end
        if (b[0] === "Hintergrund Informationen") return -1; // Keep other entry before "background"
        
        // Normal alphabetical sort by title for other entries
        return a[1].title.localeCompare(b[1].title);
      });      
      const sortedLayersList = Object.fromEntries(sortedLayersListEntries);
      console.log('LayerSwitchView - setup - sortedLayersList', sortedLayersList);

      const layerSwitch = (id) => {
        const layer = props.layersList[id];
        if (layer) {
          layer.checked = !layer.checked;
          console.log('Layer switched:', id, layer.checked);
        }
      };      
      const filterList = ref({
        autobiografisches: { id: 'autobiografisches', title: 'autobiografisch', color: '#bbb', colorChecked: '#999', checked: true },
        rechiert: { id: 'rechiert', title: 'recherchiert', color: '#bbb', colorChecked: '#999', checked: true },
        sonstiges: { id: 'sonstiges', title: 'sonstiges', color: '#bbb', colorChecked: '#999', checked: true }
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
        sortedLayersList,
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
      right: 0;
      margin-top: 40px;
      padding: 15px 0px 10px 10px;
      display: flex;
    }
    @media (max-width: 350px) {
      #layer-switch {
      }
    }



    .label-wrapper {
      flex: 3;
      padding: 10px 0 10px 10px;
      /* display to the right : */
      display: flex;
      flex-direction: column;
      justify-content: space-between;

    }
    .items-wrapper {
      flex: 1;
      padding: 10px 15px 10px 10px;
      background-color: white;
      max-width: 70px;
    }
    .items-wrapper svg {
      vertical-align: middle;
      margin-left: 9px;
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
    .layer-switch-label label,
    .type-filter-label label 
    {
      padding: 0 12px;
      display: inline-block;
      height: 25px;
      background-color: white;
      vertical-align: baseline;
      white-space: nowrap;
      font-size: 0.9rem;
      line-height: 2;
    }


    #type-filter {
      width: auto;
      background-color: transparent;
      right: 0;
      margin-top: 40px;
      padding: 15px 0px 10px 10px;
      display: flex;
    }
    @media (max-width: 350px) {
      #type-filter {
      }
    }



  </style>