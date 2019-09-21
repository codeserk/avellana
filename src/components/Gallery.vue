<template>
    <div class="gallery relative">
        <div
            class="slider relative"
            ref="slider"
            @mousedown="startScrolling('primary')"
            @mouseleave="stopScrolling('primary')"
            @mouseup="stopScrolling('primary')"
            @mousemove="event => scrollSlider('primary', event)"
            @scroll="onPrimaryScrolled"
        >
            <figure
                v-for="(item, index) in images" :key="index"
                @click="zoomImage(index)"
            >
                <g-image :src="item.thumbnail" :alt="item.alt"/>
            </figure>
        </div>

        <div
            class="secondary hidden sm:flex w:1/2 md:1/3"
            ref="secondary"
            @mousedown="startScrolling('secondary')"
            @mouseleave="stopScrolling('secondary')"
            @mouseup="stopScrolling('secondary')"
            @mousemove="event => scrollSlider('secondary', event)"
        >
            <div class="figure"
                v-for="(item, index) in slicedGallery" :key="index"
                @click="scrollPrimaryTo((index + 1) % images.length)"
            >
                <g-image class="object-center" :src="item.thumbnail" :alt="item.alt" with="200" />
            </div>
        </div>

        <div class="primary-dots absolute left-0 bottom-0 p-5 flex flex-horizontal sm:hidden">
            <div
                v-for="(item, index) in images" :key="item.id"
                class="dot mx-2 p-1 border rounded cursor-pointer"
                :class="{ 'bg-white': current === index }"
                @click="scrollPrimaryTo(index)"
            />
        </div>

        <div ref="photoSwipe" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="pswp__bg" />

            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <div class="pswp__ui pswp__ui--hidden">

                    <div class="pswp__top-bar">
                        <div class="pswp__counter" />
                        <button class="pswp__button pswp__button--close" title="Close (Esc)" />

                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out" />
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>

                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script scoped>
    import debounce from 'debounce'
    import PhotoSwipe from 'photoswipe/dist/photoswipe'
    import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

    export default {
        props: {
            images: {
                type: Array,
                default: () => []
            }
        },

        data: () => ({
            current: 0,

            scroll: {
                primary: {
                    scrolling: false,
                    el: 'slider',
                    scrolled: 0,
                    x: null,
                    left: null,
                },
                secondary: {
                    scrolling: false,
                    scrolled: 0,
                    el: 'secondary',
                    x: null,
                    left: null,
                }
            },

            photoSwipe: null,
        }),

        computed: {
            slicedGallery () {
                const result = [ ...this.images ]
                    .slice(1)
                result.push(this.images[0])

                return result
            },

            primaryImageWidth () {
                if (!this.$refs.slider || this.$refs.slider.children.length === 0) {
                    return 0
                }

                return this.$refs.slider.children[0].clientWidth
            },

            secondaryImageWidth () {
                if (!this.$refs.secondary || this.$refs.secondary.children.length === 0) {
                    return 0
                }

                return this.$refs.secondary.children[0].clientWidth
            }
        },

        mounted () {
            const self = this
            window.addEventListener('resize', debounce(() => {
                self.scrollPrimaryTo(self.current)
            }, 200))
        },

        methods: {
            init () {
            },

            onPrimaryScrolled: debounce(function () {
                this.current = Math.floor(this.$refs.slider.scrollLeft / this.$refs.slider.clientWidth)

                this.$nextTick(() => {
                    this.scrollSecondaryTo(
                        this.current === this.images.length - 1 ? 0 : this.current
                    )
                })
            }, 100),

            zoomImage (index) {
                if (Math.abs(this.scroll.primary.scrolled) > 100) {
                    return
                }

                const self = this
                this.photoSwipe = new PhotoSwipe(
                    this.$refs.photoSwipe,
                    PhotoSwipeUI_Default,
                    this.images.map(image => ({
                        src: image.src.src,
                        msrc: image.src.src,
                        w: image.src.size.width,
                        h: image.src.size.height,
                        title: 'Will be used for caption'
                    })), {
                        index,
                        history: false,
                        closeOnScroll: false,
                        getThumbBoundsFn: function () {
                            const image = self.$refs.slider
                            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                            const imageRect = image.getBoundingClientRect()

                            return {
                                x: imageRect.left, y: imageRect.top + pageYScroll,
                                w: imageRect.width
                            }
                        }
                    }
                )
                this.photoSwipe.init()
                this.photoSwipe.listen('beforeChange', () => {
                    self.scrollPrimaryTo(this.photoSwipe.getCurrentIndex())
                })
            },

            scrollPrimaryTo (index) {
                if (!this.$refs.slider) {
                    return
                }

                this.$refs.slider.scrollTo(index * this.primaryImageWidth, 0)
            },

            scrollSecondaryTo (index) {
                this.$refs.secondary.scrollTo(index * this.secondaryImageWidth, 0)
            },

            startScrolling (key) {
                this.scroll[key].scrolled = 0
                this.scroll[key].scrolling = true

                this.scroll[key].x = event.pageX - this.$refs[this.scroll[key].el].offsetLeft
                this.scroll[key].left = this.$refs[this.scroll[key].el].scrollLeft
            },

            stopScrolling (key) {
                this.scroll[key].scrolling = false
            },

            scrollSlider (key, event) {
                if (!this.scroll[key].scrolling) {
                    return
                }

                event.preventDefault()
                const x = event.pageX - this.$refs[this.scroll[key].el].offsetLeft
                const walk = (x - this.scroll[key].x) * 2
                this.scroll[key].scrolled += walk

                this.$refs[this.scroll[key].el].scrollLeft = this.scroll[key].left - walk
            }
        }
    }
</script>

<style lang="scss">
    $pswp__assets-path: "~photoswipe/src/css/default-skin/";

    @import "photoswipe/src/css/main.scss";
    @import "photoswipe/src/css/default-skin/default-skin.scss";

    .slider {
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;

        figure {
            width: 100%;
            flex-shrink: 0;
            height: 100%;
            scroll-snap-align: start;

            img {
                user-select: none;
                -webkit-user-drag: none;
            }
        }
    }

    .slider::-webkit-scrollbar, .secondary::-webkit-scrollbar {
        display: none;
    }

    .secondary {
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        justify-content: space-between;

        .figure {
            flex: 1;
            min-width: calc(50% - 1px);
            height: 100%;
            flex-shrink: 0;
            margin: 4px 2px;
            scroll-snap-align: start;

            img {
                // padding: 2px;
                user-select: none;
                -webkit-user-drag: none;
            }

            @media (min-width: 1024px) {
                min-width: calc(33.33333% - 1px);
            }
        }
    }

    .primary-dots .dot {
        transition: background 0.4s ease-in-out;
    }
</style>