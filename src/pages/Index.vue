<template>
    <main class="home">
        <home-slider :slides="$page.home.acf.slides" />

        <home-sections :sections="$page.home.acf.sections" />

        <component
            v-for="(featured, index) in $page.home.acf.featured" :key="index"
            :is="getFeaturedTemplate(featured.acfFcLayout)" v-bind="featured"
        />
    </main>
</template>

<page-query>
query Home ($page: Int) {
    home: wordPressPage(path:"/home") {
        acf {
            slides {
                image {
                   src(width: 600, fit: inside)
                }
                description
                link {
                    title
                    url
                }
            }

            sections {
                title
                image {
                    src(width: 640, height: 640, fit: contain, background: "#F7FAFC")
                }
                link {
                    title
                    url
                }
            }

            featured {
                acfFcLayout
                direction
                name
                image {
                    src(width: 640, height: 640, fit: contain, background: "#F7FAFC")
                }
                description
                link {
                    title
                    url
                }
            }
        }
    }
    products: allProduct (page: $page, perPage: 10) @paginate {
        pageInfo {
            totalPages
            currentPage
        }
        edges {
            product: node {
                name
                path
                description
                images {
                    id
                    src
                }
                gallery {
                    src
                }
                tags {
                    id
                    name
                    path
                }
            }
        }
    }
}
</page-query>

<script>
import Post from "~/components/Post.vue";
import Layout from "~/layouts/Default.vue";
import Gallery from "~/components/Gallery.vue";

import HomeSlider from '~/components/Home/HomeSlider.vue'
import HomeSections from '~/components/Home/HomeSections.vue'
import HomeFeaturedProductType from '~/components/Home/HomeFeaturedProductType'

const featuredMap = {
    product_type: HomeFeaturedProductType
}

export default {
    components: {
        Layout,
        HomeSlider,
        HomeSections,

        // Featured
        HomeFeaturedProductType,

        Gallery,
        Post
    },
    metaInfo: {
        title: "Welcome to my blog :)"
    },

    methods: {
        getFeaturedTemplate(name) {
            return featuredMap[name]
        }
    }
};
</script>