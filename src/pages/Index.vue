<template>
  <Layout>
    <div class="flex content-between flex-wrap">
      <div
        v-for="{ product } in $page.products.edges" :key="product.name"
        class="xs:w-auto sm:w-1/2 md:w-1/3 py-2 sm:px-2"
      >
        <div class="rounded shadow-lg">
          <g-link :to="product.path">
            <g-image class="w-full" :src="product.images[0].src" alt="Sunset in the mountains" />
          </g-link>
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2" v-text="product.name" />
            <p class="text-gray-700 text-base h-24 ellipsis" v-html="product.description" />
          </div>
          <div class="px-6 py-4">
            <g-link
              v-for="tag in product.tags" :key="tag.id"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              :to="tag.path"
            >
              <span v-text="tag.name"/>
            </g-link>
          </div>
        </div>
      </div>
    </div>
    <Pager :info="$page.products.pageInfo"/>
  </Layout>
</template>

<page-query>
query Home ($page: Int) {
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
import { Pager } from 'gridsome'
import Post from '~/components/Post.vue'

export default {
  components: {
    Pager,
    Post
  },
  metaInfo: {
    title: 'Welcome to my blog :)'
  }
}
</script>

<style>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>