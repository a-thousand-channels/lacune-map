<template>
  <header>
    <h1> <router-link to="/">Lacune</router-link></h1>
    <div class="nav">
      <router-link to="/place/968">Info</router-link>

    </div>
  </header>
  <router-view></router-view>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue';



export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView    
  },
  setup() {
    console.log('App setup');
  

    return {  };
  }
}
</script>

<style scoped>
header {
  line-height: 1;
  height: 40px;
  padding: 0.55rem 1rem 0;
  font-size: 16px;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}
@media (min-width: 768px) {
  header {
  }
}


header h1 {
  line-height: 1;
  font-size: 20px;
}
header h1 a {
  color: #444;
  text-decoration: none;
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

.nav a {
  display: inline-block;
  padding: 0 0 0 1rem;
}

nav a:first-of-type {
  border: 0;
}
</style>
