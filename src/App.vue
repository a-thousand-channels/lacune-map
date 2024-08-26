<template>
  <header>
    <h1>Lacune</h1>
    <div class="nav">
      <a href="#">Info</a>  
    </div>
  </header>
  <LeafletMap />
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
  line-height: 1;
  height: 7vh;
  padding: 0.45rem 1rem 0;
  font-size: 16px;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}
header h1 {
  line-height: 1;
  font-size: 20px;
}
header div.nav {
  line-height: 1;
  font-size: 20px;
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
