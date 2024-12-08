<template>
    <div class="slider-container">
      <div id="yearDisplay">{{ formattedYear }}</div>
      <div id="disableSlider" @click="disableSlider">&times;</div>
      <input 
        type="range" 
        :min="min"
        :max="max"
        :step="step"
        :value=Number(modelValue)
        :map="map"
        :data="data"
        :overlayLayers="overlayLayers"
        :visibleLayers="visibleLayers"
        :selectedYear=Number(selectedYear)
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
        default: 0
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
        var modelValueNumber = Number(props.modelValue)
        if (typeof modelValueNumber !== 'number' || isNaN(modelValueNumber)) {
          console.warn('TimeSlider - Model value is not a valid number:', modelValueNumber)
          return 'Invalid Year'
        }
        let year = Math.max(props.min, Math.min(modelValueNumber, props.max))
        if ( modelValueNumber < props.min ) {
          year = props.min + " — " + props.max;
        }         
        return year.toString()
      })

      let hamburg_dark_mode = L.tileLayer('https://tiles.3plusx.io/hamburg/darkmode/{z}/{x}/{y}{r}.png', {
        attribution: 'Karte: UT/3+x, Geodaten: <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap + Mitwirkende</a>',
        maxZoom: 17,
        detectRetina: false,
        tileSize: 256
      })
      let wmsLayerHamburg1930s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1930s',
      layers: 'jahrgang_1930-1940',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })
      let wmsLayerHamburg1940s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1940s',
      layers: 'jahrgang_1940-1950',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })
    let wmsLayerHamburg1950s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1950s',
      layers: 'jahrgang_1950-1960',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })    
    let wmsLayerHamburg1960s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1960s',
      layers: 'jahrgang_1960-1970',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })   
    let wmsLayerHamburg1970s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1970s',
      layers: 'jahrgang_1970-1980',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })              
    let wmsLayerHamburg1980s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1980s',
      layers: 'jahrgang_1980-1990',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })      
      let wmsLayerHamburg1990s = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Historische_Karte_1_5000?', {
      name: 'Hamburg 1990s',
      layers: 'jahrgang_1990-2000',
      transparent: true,
      minZoom: 10,
      maxZoom: 20,     
      attribution: 'Karte: LGV Hamburg, Lizenz <a href="https://www.govdata.de/dl-de/by-2-0"> dl-de/by-2-0</a>'
      })

      function disableSlider(event) {
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.classList.remove('active');
        const disableSlider = document.querySelector('#disableSlider');
        disableSlider.classList.remove('active');        
        const value = 1;
        emit('update:modelValue', Number(value));
        console.log('TimeSlider - Disable slider:', value);
        props.map.eachLayer(layer => {
          if (layer instanceof L.TileLayer.WMS) {
            props.map.removeLayer(layer);
          }
        });        
        hamburg_dark_mode.addTo(props.map);
        filter_and_update(props.map,props.visibleLayers,props.overlayLayers,value)
 
      }
  
      function updateSlider(event) {
        const value = Number(event.target.value)
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.classList.add('active');
        const disableSlider = document.querySelector('#disableSlider');
        disableSlider.classList.add('active');           
        console.log('TimeSlider - Updating slider:', value);
   
        if (!isNaN(value)) {
          emit('update:modelValue', Number(value))
          console.warn('TimeSlider - Emit value:', value)
        } else {
          console.warn('TimeSlider - Invalid slider value:', event.target.value)
        }
        // FIX: this value is always 1
        // console.log('TimeSlider -  selectedYear', props.selectedYear)
        // console.log('TimeSlider -  map', props.map)
        
        filter_and_update(props.map,props.visibleLayers,props.overlayLayers,value)
        

        const currentBaselayer = getActiveBaselayerName(props.map);
        console.log('Current baselayer:', currentBaselayer);        
        props.map.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            if (layer.options.name !== currentBaselayer) {
              props.map.removeLayer(layer);
            }
          }
        });
        if (value < 1940 ) {
          console.log('TimeSlider < 1940')
          if (currentBaselayer !== 'Hamburg 1930s') {
            wmsLayerHamburg1930s.addTo(props.map);
          }
        } else if (value < 1950 ) {
          console.log('TimeSlider < 1950')
          if (currentBaselayer !== 'Hamburg 1940s') {
            wmsLayerHamburg1940s.addTo(props.map);
          }
        } else if (value < 1960) {
          console.log('TimeSlider < 1960')
          if (currentBaselayer !== 'Hamburg 1950s') {
            wmsLayerHamburg1950s.addTo(props.map);
          }
        } else if (value < 1970) {
          console.log('TimeSlider < 1970')
          if (currentBaselayer !== 'Hamburg 1960s') {
            wmsLayerHamburg1960s.addTo(props.map);
          }
        } else if (value < 1980) {
          console.log('TimeSlider < 1980')
          if (currentBaselayer !== 'Hamburg 1970s') {
            wmsLayerHamburg1970s.addTo(props.map);
          }
        } else if (value < 1990) {
          console.log('TimeSlider < 1990')
          if (currentBaselayer !== 'Hamburg 1980s') {
            wmsLayerHamburg1980s.addTo(props.map);
          }
        } else {
          console.log('TimeSlider < 1999')
          if (currentBaselayer !== 'Hamburg 1990s') {
            wmsLayerHamburg1990s.addTo(props.map);
          }
        }
         // Layer Control aktualisieren
        if (props.map.layerControl) {
          console.log('LayerControl:', props.map.layerControl);
          Object.keys(props.map.layerControl._layers).forEach(key => {
            const controlLayer = props.map.layerControl._layers[key];
            if (controlLayer.layer.options.name === currentBaselayer) {
              props.map.layerControl._map.addLayer(controlLayer.layer);
              controlLayer.input.checked = true;
            }
          });
        }
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');

      }
      function getActiveBaselayerName(map) {
        let activeBaselayerName = '';
    
        map.eachLayer(layer => {
            // Prüfen ob es sich um einen TileLayer handelt und dieser sichtbar ist
            if (layer instanceof L.TileLayer && map.hasLayer(layer)) {
              activeBaselayerName = layer.options.name || 'Unnamed Layer';
            }
        });

        return activeBaselayerName;
      }

      return {
        formattedYear,
        updateSlider,
        disableSlider
      }
    }
  }
  </script>
    
  <style scoped>

  .slider-container {
    position: absolute;
    bottom: 60px;
    left: 52%;
    transform: translateX(-50%);
    width: 70%;
    max-width: 800px;
    text-align: center;
    z-index: 1000;
    pointer-events: none;
  }
  
  .slider {
    width: 100%;
    height: 3px;
    -webkit-appearance: none;
    background: #333;
    outline: none;
    opacity: 0.4;
    transition: opacity 0.2s;
    box-shadow: 0 0 0 #888;
    padding: 1px;
    cursor: pointer;
    border: 4px solid white;
    pointer-events: visible; 
  }  
  .dark-mode .slider {
    background: #aaa;
    box-shadow: 0 0 4px black;
    border: 4px solid #333;
  }
  div.slider-container.active .slider{
    opacity: 1;
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
  
  .slider::beforeXX {
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
    color: #333;
    font-weight: normal;
    text-shadow: 0 0 3px white;
    display: inline;
  }
  .dark-mode #yearDisplay {
    color: #aaa;
    text-shadow: 0 0 3px black;
  }
  div.slider-container.active #yearDisplay {
    font-weight: bold;
    transition: 0.5s all;
  }  
  #disableSlider {
    display: inline-block;
    border: 1px solid #444;
    color: #444;
    border-radius: 100px;
    line-height: 0;
    padding: 7px 2px;
    vertical-align: top;
    height: 10px;
    margin-left: 5px;
    transition: 0.5s all ease;
    opacity: 0;
    pointer-events: visible;
  }
  #disableSlider.active {
    opacity: 1;
    background: white;
  }
  #disableSlider.active:hover {
    cursor: pointer;
    background: white;
    border-color: #CC0000;
    color: #CC0000;
    transition: 0.5s all ease;
  }
  .dark-mode #disableSlider.active {
    opacity: 1;
    background: #222;
  }
  </style>