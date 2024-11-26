<template>
    <transition>
        <div v-if="iconData" v-html="renderIcon" :data-layer-id="layerId" :data-layer-title="layerTitle" :class="klass"></div>
    </transition>
</template>

<script>
import { Icon } from '@/helpers/icon';
    export default {
        props: {
            iconData: {
                type: Object,
                default: null
            },
            layerId: {
                type: Number,
                default: 0
            },
            layerTitle: {
                type: String,
                default: ''
            },
            klass: {
                type: String,
                default: ''
            }
        },
        computed: {
            renderIcon() {
                // console.log('iconData', this.iconData);
                return Icon(this.iconData,this.layerId,this.layerTitle);
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