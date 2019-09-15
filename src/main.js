import DefaultLayout from '~/layouts/Default.vue'
require('~/assets/styles/tailwind.css')

// AOS
import AOS from 'aos'
import 'aos/dist/aos.css'

// Agile - carousel
import VueAgile from 'vue-agile'

// Font-awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import VuePictureSwipe from 'vue-picture-swipe'
import Vue2TouchEvents from 'vue2-touch-events'

config.autoAddCss = false;
library.add(faChevronLeft, faChevronRight)

export default function (Vue, { router, head, isClient }) {
    // Set default layout as a global component
    Vue.component('Layout', DefaultLayout)
    Vue.use(VueAgile)
    Vue.component('vue-picture-swipe', VuePictureSwipe)
    Vue.use(Vue2TouchEvents)

    Vue.component('fa', FontAwesomeIcon)

    AOS.init()
}
