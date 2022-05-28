<template>
    <div id="app">
        <web-header />

        <transition name="slide-fade" appear >
            <router-view
                :key="$route.path"
            />
        </transition>

        <web-footer />
    </div>
</template>

<script>
    import WebHeader from './parts/WebHeader'
    import WebFooter from './parts/WebFooter'

    export default {
        components: {
            WebHeader,
            WebFooter,
        }
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