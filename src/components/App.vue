<template>
    <div id="app">
        <router-view
            :key="$route.path"
        />
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    @import "aos/src/sass/aos";
</style>