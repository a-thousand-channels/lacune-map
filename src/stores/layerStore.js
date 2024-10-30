import { defineStore } from 'pinia';

export const useLayerStore = defineStore('layerStore', {
  state: () => ({
    layerId: '',
    layerTitle: '',
    layerDarkcolor: '',
    placeId: ''
  }),
  actions: {
    setLayerData(title, darkcolor, placeId) {
      this.layerTitle = title;
      this.layerDarkcolor = darkcolor;
      this.placeId = placeId;
    }
  }
});