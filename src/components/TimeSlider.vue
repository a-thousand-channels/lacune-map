<template>
    <div class="slider-container">
      <div id="yearDisplay">{{ formattedYear }}</div>
      <input 
        type="range" 
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue" 
        class="slider" 
        id="yearSlider"
        @input="updateSlider"
        :data-value="formattedYear"
      >
      
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  
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
  
      function updateSlider(event) {
        const value = Number(event.target.value)
        console.log('TimeSlider - Updating slider:', value)
        if (!isNaN(value)) {
          emit('update:modelValue', value)
        } else {
          console.warn('TimeSlider - Invalid slider value:', event.target.value)
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