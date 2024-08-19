<template>
  <header>A 10000 Channels Multilayer Map</header>
  <LeafletMap />
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import LeafletMap from './components/LeafletMap.vue'

export default {
  name: 'App',
  components: {
    LeafletMap
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  padding: 5px;
  height: 5vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
