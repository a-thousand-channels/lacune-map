<template>
  <header id="header">
    <h1>
      <router-link to="/" custom v-slot="{ navigate }" >
        <span @click="() => { openSplash(); navigate(); }">
            Lacune
        </span>
      </router-link>
    </h1>
    <div class="nav">
      <router-link to="/place/968">Info</router-link>
    </div>
  </header>
  <div id="splash">
    <div id="splash-content">
      <button class="close" id="close-splash" @click="closeSplash">&times;</button>
      <header>
        <h2>Lacune</h2>
        <p><em>Ein Projekt für mehr Sichbarkeit und Erinnerung</em></p>
      </header>
      <p>Lacune zeigt die Vielzahl und die Unterschiedlichkeit lesbischen* Lebens in Hamburg seit 1900. Die digitale Karte füllt Lücken in vorhandenen Perspektiven und fügt Möglichkeiten eines Blicks auf die Vergangenheit hinzu. Mit Lacune werden Orte, Personen und Erfahrungen festgehalten, um sie so vor dem Vergessen zu bewahren.</p>
      <p><button  @click="closeSplash">Karte</button></p>
      <hr />
      <ul class="nav nav-splash">
        <li><router-link to="/place/968">
          <span>
          <svg height="27" width="21" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" data-layer-id="0" data-layer-title="Informationen"><title> </title>
            <path fill="#5a8fc0" fill-opacity="1" stroke="#5a8fc0" stroke-width="3" stroke-opacity="1" d="M23.3,24.2L12.6,3.7c-0.3-0.3-0.9-0.3-1.2,0L1.7,24.2c-0.3,0.3-0.4,1,0,1.2c0.6,0.2,21.3,0.4,21.6,0C23.5,25,23.6,24.5,23.3,24.2z"></path></svg>
          </span>
            <span> Über das Projekt</span>
          </router-link>
        </li>
        <li><router-link to="/place/1054">
          <span>
            <svg height="27" width="21" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" data-layer-id="0" data-layer-title="Informationen"><title> </title>
              <path fill="#5a8fc0" fill-opacity="1" stroke="#5a8fc0" stroke-width="3" stroke-opacity="1" d="M23.3,24.2L12.6,3.7c-0.3-0.3-0.9-0.3-1.2,0L1.7,24.2c-0.3,0.3-0.4,1,0,1.2c0.6,0.2,21.3,0.4,21.6,0C23.5,25,23.6,24.5,23.3,24.2z"></path></svg>
            </span>
              <span>Entstehungsgeschichte</span>
          </router-link>
        </li>
        <li><router-link to="/place/1081">
          <span>
            <svg height="27" width="21" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" data-layer-id="0" data-layer-title="Informationen"><title> </title>
              <path fill="#5a8fc0" fill-opacity="1" stroke="#5a8fc0" stroke-width="3" stroke-opacity="1" d="M23.3,24.2L12.6,3.7c-0.3-0.3-0.9-0.3-1.2,0L1.7,24.2c-0.3,0.3-0.4,1,0,1.2c0.6,0.2,21.3,0.4,21.6,0C23.5,25,23.6,24.5,23.3,24.2z"></path></svg>
            </span>
            <span>Vergangenheit ist konstruiert</span>
          </router-link>
        </li>
        <li><router-link to="/place/942">
          <span>
            <svg height="27" width="21" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" data-layer-id="0" data-layer-title="Informationen"><title> </title>
              <path fill="#5a8fc0" fill-opacity="1" stroke="#5a8fc0" stroke-width="3" stroke-opacity="1" d="M23.3,24.2L12.6,3.7c-0.3-0.3-0.9-0.3-1.2,0L1.7,24.2c-0.3,0.3-0.4,1,0,1.2c0.6,0.2,21.3,0.4,21.6,0C23.5,25,23.6,24.5,23.3,24.2z"></path></svg>
          </span>
          <span>Selbstbezeichnungen …</span>
          </router-link>
        </li>
      </ul>
    </div>  
  </div>
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
  
    const closeSplash = () => {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.style.display = 'none';
      } 
      localStorage.setItem('splashClosed', 'true');
      console.log('Splash closed and state saved to localStorage');
    }; 
    const openSplash = () => {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.style.display = 'block ';
      } 
      localStorage.setItem('splashClosed', 'false');
      console.log('Splash opened and state saved to localStorage');
    };     
    return { closeSplash, openSplash  };
  }
}
</script>

<style scoped>
header#header {
  line-height: 1;
  height: 40px;
  padding: 0.55rem 1rem 0;
  font-size: 16px;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}
@media (min-width: 768px) {
  header#header {
  }
}
header#header h1 {
  line-height: 1;
  font-size: 20px;
}
header#header h1 a {
  color: #444;
  text-decoration: none;
}
header#header div.nav {
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

ul.nav-splash {
  margin: 0;
  list-style: none;
  padding: 0 30px;
  li { 
    margin-bottom: 10px; font-size: 1.2em;
    a {
      display: flex;
      align-items: flex-start;
      padding: 0;
      span { display: block; padding-left: 0.5em; line-height: 1.3;
        svg {
          width: 30px;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  ul.nav-splash {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 10px;
    padding: 0 45px;
    li {
      width: auto;
      margin: 0 5px 0 0;
      font-size: 1.3em;
      a {
        border: 0px solid #5a8fc0;
        padding: 0.2em 0.5em 0.2em 0;
        border-radius: 2px;
      }
      a:hover {
        background-color: hsla(165, 9%, 82%, 0.35);
      }
    }

  }

}
@media (min-width: 1324px) {
  ul.nav-splash {
    gap: 15px;
    li {
      width: auto;
      margin: 0 10px 0 0;
      font-size: 1.4em;
    }    
  }

}
</style>
