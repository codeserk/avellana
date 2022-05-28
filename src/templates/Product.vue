<template>
  <div class="main overflow-hidden">
    <div class="flex flex-wrap sm:mt-6 container mx-auto">
      <div class="w-full sm:w-1/2 md:w-2/5 sm:px-6 mb-2 md:-ml-6">
        <gallery :images="swipeGalleryItems" with-secondary />
      </div>

      <div class="w-full sm:w-1/2 md:w-3/5 px-2 md:-mr-6">
        <h1 class="text-3xl font-serif mb-4" v-text="$page.product.name" />
        <p class="content mb-4 text-lg" data-aos="fade-left" v-html="$page.product.description" />
      </div>
    </div>
    <div class="font-serif leading-normal mx-auto py-12 px-4 max-w-lg">
      <p class="mb-4 text-lg">Quae commodi reiciendis dignissimos. Rerum molestiae hic dolores assumenda dolor! Corrupti reiciendis maxime fuga, recusandae obcaecati officia cum temporibus dicta quibusdam praesentium, magni, cumque aperiam iusto sequi illum molestiae non.</p>
      <p class="mb-4 text-lg">In excepturi repellendus eum, qui corrupti rerum perferendis harum adipisci voluptate? Nihil, quidem deleniti libero officia dicta vel asperiores velit molestiae blanditiis, dolore voluptatibus excepturi laudantium at veniam illo. Dolor!</p>
      <p class="mb-4 text-lg">Neque laudantium minus doloremque id quas quod sint velit corporis unde dolore accusantium delectus optio consequuntur voluptatem sapiente odit dolorum minima harum tenetur, dolor provident reprehenderit. Ex eum provident harum?</p>
      <p class="mb-4 text-lg">Mollitia temporibus maxime placeat culpa distinctio possimus, praesentium, assumenda quasi eum voluptate magni aspernatur aperiam. Eius voluptates rem eum, facilis inventore hic provident pariatur nam non! At odit iste cum.</p>
      <p class="mb-4 text-lg">Cumque voluptatibus laboriosam tempore architecto laudantium sint vitae cupiditate voluptate quod tempora saepe odio quasi dolores possimus non totam unde voluptates corrupti, ducimus ipsa enim officiis ipsum maxime eveniet. Aut!</p>
      <p class="mb-4 text-lg">Maxime facere ut natus libero incidunt alias quam consectetur, nisi delectus exercitationem ab qui perferendis dolorem sequi veritatis nobis eius quas dolore ducimus atque vel. Doloribus mollitia non pariatur modi?</p>
      <p class="mb-4 text-lg">Sed in amet a neque, delectus, cupiditate ab assumenda quidem facere molestias vitae itaque soluta reprehenderit dolorem. Deserunt quibusdam, consequatur veniam fugiat ipsam aliquam ea possimus quis officiis enim dolores.</p>
      <p class="mb-4 text-lg">Exercitationem aperiam veniam perspiciatis iure ad nobis necessitatibus cumque cupiditate obcaecati natus. Neque nostrum maxime id veritatis tempore, a voluptate voluptatem et! A ullam id aliquam? Recusandae deleniti odit fugit!</p>
      <p class="mb-4 text-lg">Beatae rerum obcaecati consectetur nostrum eos ipsam, accusamus delectus ex maxime neque sit quod repellendus voluptate sunt dolore hic explicabo ea dolorum vero vel quidem illo! Cupiditate sed voluptatibus ullam?</p>
      <p class="mb-4 text-lg">Modi aliquam facilis adipisci! Soluta eveniet eos omnis, inventore nesciunt, laborum deserunt blanditiis nihil accusamus debitis voluptatibus possimus dolores vero maiores, sed voluptate ut! Facilis possimus vitae consectetur praesentium veritatis.</p>
      <p class="mb-4 text-lg">Tempore, quaerat accusamus ad nostrum maiores numquam, ea nam sed reiciendis, eveniet perspiciatis. Eos nulla vel consectetur quo nesciunt aspernatur sint nemo cumque optio mollitia, veritatis, tenetur quibusdam eum natus.</p>
    </div>

    <div class="bg-quote container flex items-center justify-center h-screen mx-auto">
      <blockquote class="bg-black font-serif mx-4 p-4 text-center text-white md:p-8">
        <p class="font-bold italic text-3xl">
          &ldquo;Large, bold pull quote. Hats. Very good.&rdquo;
        </p>
      </blockquote>
    </div>

    <div class="font-serif leading-normal mx-auto py-12 px-4 max-w-lg">
      <p class="mb-4 text-lg">Quae commodi reiciendis dignissimos. Rerum molestiae hic dolores assumenda dolor! Corrupti reiciendis maxime fuga, recusandae obcaecati officia cum temporibus dicta quibusdam praesentium, magni, cumque aperiam iusto sequi illum molestiae non.</p>
      <p class="mb-4 text-lg">In excepturi repellendus eum, qui corrupti rerum perferendis harum adipisci voluptate? Nihil, quidem deleniti libero officia dicta vel asperiores velit molestiae blanditiis, dolore voluptatibus excepturi laudantium at veniam illo. Dolor!</p>
      <p class="mb-4 text-lg">Neque laudantium minus doloremque id quas quod sint velit corporis unde dolore accusantium delectus optio consequuntur voluptatem sapiente odit dolorum minima harum tenetur, dolor provident reprehenderit. Ex eum provident harum?</p>
      <p class="mb-4 text-lg">Mollitia temporibus maxime placeat culpa distinctio possimus, praesentium, assumenda quasi eum voluptate magni aspernatur aperiam. Eius voluptates rem eum, facilis inventore hic provident pariatur nam non! At odit iste cum.</p>
    </div>

  <div class="modal fixed top-0 right-0 bottom-0 left-0 flex align-center justify-center" v-if="currentImage">
    <div class="modal-overlay absolute w-full h-full bg-black opacity-gray-100 opacity-50 z-40"></div>

      <!-- <g-image
        :src="currentImage.src"
        class="lightbox-image object-cover object-center"
      /> -->

    <!-- <g-image
      :src="currentImage.src"
      class="h-full w-auto object-center object-contain z-50"
    /> -->
    <!-- <agile
      :options="{
        dots: true,
        fade: true,
        navButtons: true,
      }"
      class="lightbox-slides object-contain h-64 relative"
    >
      <div
        v-for="(image, index) in $page.product.gallery" :key="image.id"
        class="slide h-full" :class="`slide--${index}`"
      >
        <g-image
          :src="image.src"
          class="object-center h-full"
        />
      </div>
    </agile> -->

      <!-- <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50" @click="imageIndex = null">
        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
        <span class="text-sm">(Esc)</span>
      </div> -->

      <!-- Add margin if you want to see some of the overlay behind the modal-->

    </div>

  </div>
</template>

<page-query>
query Product ($path: String) {
  product (path: $path) {
    name
    description

    featuredImage {
      src
    }
  	gallery {
      id
      src
    }
  }
}
</page-query>

<script>
import Post from '~/components/Post.vue'
import Gallery from '~/components/Gallery.vue'

export default {
  components: {
    Post,
    Gallery
  },

  data: () => ({
    slidesNav: [],
    thumbnailsNav: [],
    selectedIndex: null,

    currentSlide: 0,
  }),

  computed: {
    gallery () {
      return this.$page.product.gallery
    },

    swipeGalleryItems () {
      return this.gallery.map(item => ({
          id: item.id,
          src: item.src,
          msrc: item.src,
          thumbnail: item.src,
          w: item.src.size.width,
          h: item.src.size.height,
          title: 'Will be used for caption'
      }))
    },

    shiftedGallery () {
      const result = [...this.gallery]
      result.push(result.shift())

      return result
    },

    currentImage () {
      if (!this.gallery || this.selectedIndex === undefined) {
        return
      }

      return this.gallery[this.selectedIndex]
    },
  },

  mounted () {
    this.slidesNav.push(this.$refs.thumbnails)
    this.thumbnailsNav.push(this.$refs.slides)
  },

  metaInfo () {
    return {
      title: this.$page.product.name
    }
  },

  methods: {
    selectImage (index) {
      this.selectedIndex = index
    },

    // changed ({ currentSlide }) {
    //   this.currentSlide = currentSlide
    // }
  }
}
</script>

<style lang="scss">
.agile.thumbnails {
	margin: 0 -2px !important;
	width: calc(100% + 4px) !important;

  .slide {
    padding: 0 2px !important;
  }
}

.agile {
	&__nav-button {
		background: transparent;
		border: none;
		color: #fff;
		cursor: pointer;
		font-size: 24px;
		height: 100%;
		position: absolute;
		top: 0;
		transition-duration: .3s;
		width: 80px;

		&:hover {
			background-color: rgba(#000, .5);
			opacity: 1;
    }

		&--prev {
			left: 0
    }

		&--next {
			right: 0
    }
  }

	&__dots {
		top: 10px;
		flex-direction: row;
		right: 10px;
		position: absolute;
    z-index: 50;
  }

	&__dot {
		margin: 0 5px;

		button {
			background-color: transparent;
			border: 1px solid #fff;
			cursor: pointer;
			display: block;
			height: 10px;
			font-size: 0;
			line-height: 0;
			margin: 0;
			padding: 0;
			transition-duration: .3s;
			width: 10px;
    }

		&--current,
		&:hover {
			button {
				background-color: #fff;
      }
    }
  }
}

.my-gallery {
  width: 300px;
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  figure {
    width: 300px;
    flex-shrink: 0;
    height: 100%;
    scroll-snap-align: start;
  }
}
</style>