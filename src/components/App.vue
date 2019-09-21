<template>
    <div id="app">
        <transition name="slide-fade" appear >
            <router-view
                :key="$route.path"
            />
        </transition>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    @import "aos/src/sass/aos";

    .slide-fade-enter-active {
        transition: all .3s .3s ease-in-out;
    }
    .slide-fade-leave-active {
        transition: all .3s ease-in-out;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>