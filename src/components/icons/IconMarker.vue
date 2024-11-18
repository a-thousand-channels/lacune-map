<template>
    <transition>
        <svg v-if="iconData" height="28" width="25" viewBox="-4 -4 34 34" xmlns="http://www.w3.org/2000/svg" title="autobiografisch">
            <path v-if="iconData.id == 99999982" :fill="iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()" :fill-opacity="iconData.checked === true ? 1 : 0.5" :stroke="iconData.color.toString()" stroke-width="4" stroke-opacity="1" vector-effect="non-scaling-stroke" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>
            <path v-else-if="iconData.id == 83" :fill="iconData.checked === 'true' ? iconData.colorChecked.toString() : iconData.color.toString()" :fill-opacity="iconData.checked === true ? 1 : 0" :stroke="iconData.color.toString()" stroke-width="4" stroke-opacity="1" d="M0.5,25.6c-0.3-0.3-0.3-0.9,0-1.2L11.4,3.5c0.3-0.3,0.9-0.3,1.2,0l10.9,20.9c0.3,0.3,0.3,0.9,0,1.2"></path>     
            <path v-else-if="iconData.subtitle == 'autobiografisch'" :fill="iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()" :fill-opacity="iconData.checked === true ? 1 : 0" :stroke="iconData.color.toString()" stroke-width="4" stroke-opacity="1" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>                   
            <path v-else-if="iconData.subtitle == 'recherchiert'" :fill="iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()" :fill-opacity="iconData.checked === true ? 1 : 0" :stroke="iconData.color.toString()" stroke-width="4" stroke-opacity="1" d="M0,23.5L3.9,4.9c0-.6.6-1.1,1.2-1h18.6c.6.1,1,.7,1,1.3l-3.9,18.6c0,.6-.6,1.1-1.2,1H1c-.6,0-1-.6-1-1.2Z"></path>
            <circle v-else class="cls-1" cx="15" cy="15" r="13" :fill="iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()" :fill-opacity="iconData.checked === true ? 1 : 0" :stroke="iconData.color.toString()" stroke-width="4" stroke-opacity="1" shape-rendering="geometricPrecision"></circle>
        </svg>
    </transition>
</template>

<script>
    export default {
        props: {
            iconData: {
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