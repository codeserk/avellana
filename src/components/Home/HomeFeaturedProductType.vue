<template>
    <section class="py-12 md:py-48 relative flex overflow-hidden">
        <div
            class="image-container"
            :class="{
                'left-0': direction === 'left',
                'right-0': direction === 'right',
            }"
            :data-aos="direction === 'left' ? 'fade-right' : 'fade-left'"
        >
            <g-image
                :src="image.src"
                :alt="name"
                class="rounded-full"
            />
        </div>
        <div
            class="container m-auto flex"
            :class="{ 'flex-col-reverse': direction === 'right' }"
            :data-aos="`fade-${direction}`"
        >
            <div class="my-auto w-6/12"></div>
            <div
                class="my-auto w-6/12"
                :class="{
                    'md:pr-16': direction === 'left',
                    'md:pl-16': direction === 'right',
                }"
            >
                <h3 class="text-2xl mb-4" v-text="name" />
                <div class="content" v-html="description"/>

                <g-link
                    v-if="link"
                    :to="parseLink(link.url)"
                >
                    <button
                        class="mt-4 py-2 px-4 shadow-md no-underline rounded-full bg-blue-500 text-white font-sans font-semibold text-sm border-blue btn-primary hover:text-white hover:bg-blue-400 focus:outline-none active:shadow-none mr-2"
                        v-text="link.title"
                    />
                </g-link>
            </div>
        </div>
    </section>
</template>

<script>
import { parseLink } from '~/utils/link'
export default {
    props: {
        direction: {
            type: String,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: Object,
        },
        link: {
            type: Object,
        },
    },

    methods: {
        parseLink
    }
}
</script>

<style lang="scss" scoped>
.image-container {
    position: absolute;
    top: 50%;
    width: 40vw;
    max-width: 700px;

    img {
        transform: translate3d(0, -50%, 0) !important;
    }
}
</style>