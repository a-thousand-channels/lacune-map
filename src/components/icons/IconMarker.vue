<template>
    <transition>
        <svg v-if="layerData" height="25" width="25" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <path v-if="layerData.id == 82" :fill="layerData.color.toString() " fill-opacity="1" stroke="1" stroke-width="1" stroke-opacity="1" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>
            <path v-else-if="place.subtitle == 'autobiografisch'" :fill="layerData.color.toString()" fill-opacity="1" stroke="1" stroke-width="1" stroke-opacity="${params.stroke_opacity}" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>
            <circle v-else class="cls-1" cx="13" cy="13" r="13" :fill="layerData.color.toString() " fill-opacity="0.8" stroke="1" stroke-width="0" stroke-opacity="1" shape-rendering="geometricPrecision"></circle>
        </svg>
    </transition>
</template>

<script>
    export default {
        props: {
            layerData: {
                type: Object,
                default: null
            },
            place: {
                type: Object,
                default: null
            }
        }
    }
</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>