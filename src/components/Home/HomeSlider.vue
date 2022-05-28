<template>
    <div class="home-slider mb-4 mx-auto py-4 px-2 hidden md:flex sm:px-6 lg:px-24 bg-gray-100 align-center justify-center ">
        <div
            class="relative rounded-lg block md:flex items-center bg-gray-100 shadow-xl align-center m-auto container"
            style="height: 25rem; min-height: 20rem;"
        >
            <div
                class="relative w-full md:w-6/12 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg"
                style="min-height: 20rem;"
            >
                <transition name="blur">
                    <img
                        class="absolute inset-0 w-full h-full object-cover object-center"
                        :src="slide.image.src.src"
                        :key="slide.image.src.src"
                        :alt="slide.description"
                    />
                </transition>
                <div class="primary-dots absolute left-0 bottom-0 p-5 flex flex-horizontal">
                    <div
                        v-for="(slide, idx) in slides" :key="idx + 1"
                        class="dot mx-2 p-1 border rounded cursor-pointer z-10"
                        :class="{ 'bg-white': idx === index }"
                        @click="scrollPrimaryTo(index)"
                    />
                </div>

                <div class="absolute inset-0 w-full h-full bg-indigo-900 opacity-25"></div>
            </div>
            <div class="w-full md:w-6/12 h-full flex items-center bg-white rounded-lg">
                <div class="p-12 md:pr-16 text-justify md:pl-16 md:py-12">
                    <transition name="slide-fade" mode="out-in">
                        <p class="description text-gray-600 overflow-hidden" v-html="slide.description" :key="index + 1" />
                    </transition>
                    <transition name="slide-fade-up" mode="out-in">
                        <g-link
                            v-if="linkUrl"
                            class="flex items-baseline mt-3 text-indigo-600 hover:text-indigo-900 focus:text-indigo-900"
                            :to="linkUrl"
                        >
                            <span v-text="slide.link.title" />
                            <span class="text-xs ml-1">&#x279c;</span>
                        </g-link>
                    </transition>
                </div>
                <svg
                    class="hidden md:block absolute inset-y-0 h-full w-24 fill-current text-white -ml-12"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <polygon points="50,0 100,0 50,100 0,100" />
                </svg>
            </div>

            <template v-if="slides.length > 1">
                <button
                    class="absolute top-0 mt-48 left-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -ml-6 focus:outline-none focus:shadow-outline"
                    @click="prevSlide"
                >
                    <span class="block" style="transform: scale(1);">&#x3c;</span>
                </button>
                <button
                    class="absolute top-0 mt-48 right-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -mr-6 focus:outline-none focus:shadow-outline"
                    @click="nextSlide"
                >
                    <span class="block" style="transform: scale(1);">&#x3e;</span>
                </button>
            </template>
        </div>
    </div>
</template>

<script>
import { parseLink } from '~/utils/link'

export default {
    props: {
        slides: {
            type: Array,
        }
    },

    data: () => ({
        index: 0
    }),

    computed: {
        slide() {
            return this.slides[this.index]
        },

        isInternalLink() {
            if (!this.slide || !this.slide.link) {
                return false
            }

            return this.slide.link.url.includes('https://ana.sm1.codeserk.es/')
        },

        linkUrl() {
            if (!this.slide || !this.slide.link) {
                return
            }

            return parseLink(this.slide.link.url)
        }
    },

    methods: {
        prevSlide() {
            if (this.index === 0) {
                this.index = this.slides.length
            }

            this.index--
        },

        nextSlide() {
            this.index = (this.index + 1) % this.slides.length
        }
    }
}
</script>

<style lang="scss" scoped>
@media (min-width: 640px) {
    .home-slider {
        height: calc(100vh - 180px);
        min-height: 500px;
    }
}

.description {
    max-height: 15rem;
}

.blur-enter-active, .blur-leave-active {
  transition: all .6s ease-in-out;
}
.blur-enter, .blur-leave-to {
  filter: blur(15px) saturate(2);
//   opacity: 0;
}

.slide-fade-enter-active {
    transition: all .2s .2s ease-in-out;
}
.slide-fade-leave-active {
    transition: all .2s  ease-in-out;
}
.slide-fade-enter, .slide-fade-leave-to {
    transform: translate3d(10px, 0, 0);
    opacity: 0;
}

.slide-fade-up-enter-active {
    transition: all .2s .2s ease-in-out;
}
.slide-fade-up-leave-active {
    transition: all .2s  ease-in-out;
}
.slide-fade-up-enter, .slide-fade-up-leave-to {
    transform: translate3d(0, 10px, 0);
    opacity: 0;
}
</style>