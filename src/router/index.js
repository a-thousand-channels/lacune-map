import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: true
    },
    {
      path: '/place/:placeId',
      name: 'PlaceDetail',
      component: HomeView,
      props: true
    },    
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    { 
      path: '/layer/:layerId', 
      name: 'layerInfo', 
      component: HomeView,
      props: true
    }
  ]
})
export default router
