<template>
    <transition>
        <div v-if="iconData" v-html="renderIcon"></div>
    </transition>
</template>

<script>
import { Icon } from '@/helpers/icon';
    export default {
        props: {
            iconData: {
                type: Object,
                default: null
            }
        },
        computed: {
            renderIcon() {
                console.log('iconData', this.iconData);
                return Icon(this.iconData);
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