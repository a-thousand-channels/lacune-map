<template>
    <div class="slider-container">
      <div id="yearDisplay">{{ formattedYear }}</div>
      <input 
        type="range" 
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue" 
        :map="map"
        :data="data"
        :overlayLayers="overlayLayers"
        :visibleLayers="visibleLayers"
        :selectedYear="selectedYear"           
        class="slider" 
        id="yearSlider"
        @input="updateSlider"
        :data-value="formattedYear"
      >
      
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { filter_and_update } from '@/helpers/filter_and_update'
  
  export default {
    props: {
      modelValue: {
        type: Number,
        required: true
      },
      min: {
        type: Number,
        default: 1900
      },
      max: {
        type: Number,
        default: 2024
      },
      step: {
        type: Number,
        default: 1
      },
      map: {
        type: Object,
        required: true
      },
      data: {
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
      },
      selectedYear: {
        type: Number,
        required: true
      }      
    },
    setup(props, { emit }) {
      const formattedYear = computed(() => {
        console.log('TimeSlider - Computing formatted year:', props.modelValue)
        if (typeof props.modelValue !== 'number' || isNaN(props.modelValue)) {
          console.warn('TimeSlider - Model value is not a valid number:', props.modelValue)
          return 'Invalid Year'
        }
        const year = Math.max(props.min, Math.min(props.modelValue, props.max))
        return year.toString()
      })

      let wmsLayerHamburg1930s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1930-1940',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })
    let wmsLayerHamburg1950s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1950-1960',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })    
    let wmsLayerHamburg1960s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1960-1970',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })   
    let wmsLayerHamburg1970s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1970-1980',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })              
    let wmsLayerHamburg1980s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      layers: 'jahrgang_1980-1990',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })      
  
      function updateSlider(event) {
        const value = Number(event.target.value)
        console.log('TimeSlider - Updating slider:', value);
        if (!isNaN(value)) {
          emit('update:modelValue', value)
        } else {
          console.warn('TimeSlider - Invalid slider value:', event.target.value)
        }
        console.log('TimeSlider -  selectedYear', props.selectedYear)
        
        filter_and_update(props.map,props.visibleLayers,props.overlayLayers,props.selectedYear)
        props.map.eachLayer(layer => {
          if (layer instanceof L.TileLayer.WMS) {
            props.map.removeLayer(layer);
          }
        });
        if (value < 1950 ) {
          console.log('TimeSlider < 1950')
          wmsLayerHamburg1930s.addTo(props.map);
        } else if (value < 1960) {
          console.log('TimeSlider < 1960')
          wmsLayerHamburg1950s.addTo(props.map);
        } else if (value < 1970) {
          console.log('TimeSlider < 1970')
          wmsLayerHamburg1960s.addTo(props.map);
        } else if (value < 1980) {
          console.log('TimeSlider < 1980')
          wmsLayerHamburg1970s.addTo(props.map);
        } else {
          console.log('TimeSlider > 1980')
          wmsLayerHamburg1980s.addTo(props.map);
        }

      }
  
      return {
        formattedYear,
        updateSlider
      }
    }
  }
  </script>
    
  <style scoped>

  .slider-container {
    position: fixed;
    bottom: 60px;
    left: 52%;
    transform: translateX(-50%);
    width: 70%;
    max-width: 800px;
    text-align: center;
    z-index: 1000;
  }
  
  .slider {
    width: 100%;
    height: 2px;
    -webkit-appearance: none;
    background: #666;
    outline: none;
    opacity: 0.85;
    transition: opacity 0.2s;
    box-shadow: 0 0 0 #888;

   
    
  }
  
  .slider:hover {
    opacity: 1;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 17px;
    height: 17px;
    background: transparent;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: 0 0 0 0 #888;
    background-color: white;
  }
  
  .slider::-moz-range-thumb {
    width: 17px;
    height: 17px;
    background: transparent;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: 0 0 0 0 #888;
    background-color: white;
  }
  
  .slider::before {
    content: attr(data-value);
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  
  #yearDisplay {
    margin-top: 10px;
    font-size: 18px;
    color: #555;
    font-weight: normal;
  }
  </style>