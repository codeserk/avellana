<template>
    <section class="home-sections container mx-auto flex align-center py-32">
        <div class="flex content-between flex-wrap sm:-mx-2 my-auto ">
            <div
                v-for="(section, index) in sections"
                :key="index + 1"
                class="section xs:w-auto sm:w-1/2 lg:w-1/4 py-2 sm:px-2"
                data-aos="fade-up"
                :data-aos-delay="index * 50"
            >
                <g-link :to="parseLink(section.link.url)" class="block">
                    <g-image
                        class="image w-full object-contain object-center"
                        :src="section.image.src"
                        :alt="section.title"
                    />
                    <div class="px-6 py-4 text-center">
                        <h2
                            class="uppercase text-center text-x text-gray-600"
                            v-text="section.title"
                        />
                    </div>
                </g-link>
            </div>
        </div>
    </section>
</template>

<script>
import { parseLink } from '~/utils/link'

export default {
    props: {
        sections: {
            type: Array,
            default: () => []
        }
    },

    methods: {
        parseLink,
    }
}
</script>

<style lang="scss" scoped>
.section {
    .image {
        transition: filter 0.4s ease-in-out;
    }
    h2 {
        transition: color 0.4s ease-in-out
    }

    &:hover {
        img {
            filter: saturate(2);
        }

        h2 {
            color: #555 !important;
        }
    }
}
</style>