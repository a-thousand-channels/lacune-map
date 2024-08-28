<template>
  <div id="about" class="content">
    <h1>About</h1>
    <p>Credits/Impressum?</p>
    <hr />
    <h2>TODO</h2>
    <p>Was noch gemacht werden muss:</p>
    <ul>
      <li>Kartenfehler fixen</li>
      <li>Relations einbauen</li>
      <li>Contentseiten (link aus den Popups)</li>
      <li>Bilder</li>
      <li><strike>Timeslider Design</strike></li>
      <li>Timeslider Funktionalität</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style>
.content {
  padding: 20px;  
}
p {
  margin: 0 0 1rem 0;
}
hr {
  margin: 2rem 0 1.5rem;
  height: 1px;
  border: none;
  border-bottom: 1px solid #666;
}

@media (min-width: 1024px) {
  .about {
    
  }
}
</style>
