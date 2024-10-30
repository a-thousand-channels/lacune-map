import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LayerInfoView from '@/components/LayerInfoView.vue';
import PlaceView from '@/components/PlaceView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    { path: '/layer/:id', 
      name: 'layer', 
      component: LayerInfoView 
    },
    { 
      path: '/layer/:layerId', 
      name: 'layerInfo', 
      component: LayerInfoView,
      props: true
    },
    { 
      path: '/layer/:layerId/place/:placeId', 
      name: 'placeInfo', 
      component: PlaceView,
      props: route => ({
        layerId: route.params.layerId,
        placeId: route.params.placeId,
        layerTitle: route.params.layerTitle,
        layerDarkcolor: route.params.layerDarkcolor
      })
    }
  ]
})

export default router
