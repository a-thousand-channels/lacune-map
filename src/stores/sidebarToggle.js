import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebarToggle', () => {
  const isSidebarVisible = ref(false);

  function openSidebar() {
    isSidebarVisible.value = true;
    console.log('openSidebar',true);
  }

  function closeSidebar() {
    isSidebarVisible.value = false;
  }

  return { isSidebarVisible, openSidebar, closeSidebar };
});