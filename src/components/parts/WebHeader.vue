<template>
    <header class="">
        <div class="bg-white">
            <div class="flex justify-start container mx-auto">
                <g-link to="/">
                    <g-image src="~/assets/img/logo-temp.png" width="120" class="" />
                </g-link>
            </div>

        <ul class="mt-1 py-4 text-white flex container mx-auto justify-start uppercase">
            <li class="mr-10">
                <a class="text-gray-700 hover:text-gray-800" href="#">Productos</a>
            </li>
            <li class="mr-10">
                <a class="text-gray-700 hover:text-gray-800" href="#">Personalizado</a>
            </li>
            <li class="mr-10">
                <a class="text-gray-700 hover:text-gray-800" href="#">Sobre mi</a>
            </li>
            <li class="mr-10">
                <a class="text-gray-700 hover:text-gray-800" href="#">Contacto</a>
            </li>
            <!-- <li class="mr-10">
                <a class="text-gray-400 cursor-not-allowed" href="#">Disabled</a>
            </li> -->
        </ul>
        </div>
    </header>
</template>

<script>
export default {
    name: 'WebHeader'
}
</script>

<style scoped lang="scss">
    header {
        height: 180px;
    }
</style>
