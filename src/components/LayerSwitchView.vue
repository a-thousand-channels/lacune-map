<template>
    <div id="layer-switch">
      <div id="layer-switch-label-wrapper">
        <div class="layer-switch-label" v-for="layer in layersList" :key="layer.id">
          <label :for="layer.id">{{ layer.title }} ({{ layer.places }})</label>
        </div>
      </div>
      <div id="layer-switch-items-wrapper">
        <div class="layer-switch-item" v-for="layer in layersList" :key="layer.id">
          <input type="checkbox" :id="layer.id" :checked="visibleLayers[layer.id]" @change="layerSwitch(layer.id)">
            <IconMarker :layerData="layer" :place="place" />
        
        </div>
      </div>
    </div>  
</template>
  
  <script>
  import { ref, computed } from 'vue'
  import IconMarker from './icons/IconMarker.vue'
  const place = ref([]);
  
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
      return {
        place
      };    
    }
  }
  </script>
  
  <style scoped>
  #layer-switch {
    width: auto;
    position: absolute;
    z-index: 99999;
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


  #layer-switch svg {
    vertical-align: middle;
    margin-left: 9px;
  }


  #layer-switch-label-wrapper {
    flex: 3;
    padding: 10px 0 10px 10px;
    /* display to the right : */
    display: flex;
    flex-direction: column;
    justify-content: space-between;

  }
  #layer-switch-items-wrapper{
    flex: 1;
    padding: 10px 15px 10px 10px;
    background-color: white;
  }
  .layer-switch-label, .layer-switch-item {
    padding: 0;
    height: 35px;
    white-space: nowrap;
    margin-bottom: 4px;
    text-align: right;
  }
  .layer-switch-label label {
    padding: 0 12px;
    display: inline-block;
    height: 25px;
    background-color: white;
    vertical-align: baseline;
    white-space: nowrap;
    font-size: 0.9rem;
    line-height: 2;
  }


  </style>