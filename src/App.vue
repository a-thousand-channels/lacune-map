<template>
  <header>
    <h1>Lacune</h1>
    <div class="nav">
      <a href="?marker=968">Info</a>  
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
  height: 5vh;
  padding: 0.55rem 1rem 0;
  font-size: 16px;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}
@media (min-width: 768px) {
  header {
    height: 7vh;
  }
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
