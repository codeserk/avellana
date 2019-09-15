const axios = require('axios')
const { isPlainObject, camelCase, trimEnd, upperFirst } = require('lodash')

const TYPE_ATTACHEMENT = 'WordPressAttachment'

class WordpressWooCommerceSource {
    static defaultOptions () {
        return {
            baseUrl: '',
            apiBase: 'wp-json',
            perPage: 100,
            concurrent: 10,
            typeName: 'WooCommerce',
            routes: {
                product: '/products/:slug',
                product_category: '/products/category/:slug',
                product_tag: '/products/tag/:slug',
            }
        }
    }

    constructor (api, options) {
        this.options = options
        this.routes = {
            ...WordpressWooCommerceSource.defaultOptions().routes,
            ...options.routes,
        }
        this.restBases = { posts: {}, taxonomies: {}}

        if (options.typeName === undefined) {
            throw new Error('Missing typeName option.')
        }
        if (options.perPage > 100 || options.perPage < 1) {
            throw new Error(`${options.typeName}: perPage cannot be more than 100 or less than 1.`)
        }
        if (!options.key) {
            throw new Error('Missing "key" option. Check WooCommerce settings to get your API key.')
        }
        if (!options.secret) {
            throw new Error('Missing "secret" option. Check WooCommerce settings to get your API secret.')
        }

        const baseUrl = trimEnd(options.baseUrl, '/')

        this.client = axios.create({
            baseURL: `${baseUrl}/${options.apiBase}`
        })
        this.client.interceptors.request.use(config => {
            if (!config.params) {
                config.params = {}
            }
            config.params.consumer_key = options.key
            config.params.consumer_secret = options.secret

            return config
        })

        api.loadSource(async store => {
            await this.getCategories(store)
            await this.getTags(store)

            const categories = store.getContentType(this.getTypeName('ProductCategory'))
                .findNodes()
                .reduce((result, category) => {
                    result[category.id] = category
                    return result
                }, {})

            await this.addCategoryBreadcrumbs(store, categories)

            await this.getProducts(store, categories)
        })
    }

    async getCategories (store) {
        const typeName = this.getTypeName('ProductCategory')
        // Add content type
        const categories = store.addContentType({
            typeName,
            route: this.routes.product_category,
        })
        const data = await this.fetchPaged('wc/v3/products/categories')
        for (const category of data) {
            const fields = this.normalizeFields(category)
            const parent = fields.parent
                ? store.createReference(typeName, fields.parent)
                : null

            categories.addNode({
                ...fields,
                parent
            })
        }
    }

    async getTags (store) {
        const typeName = this.getTypeName('ProductTag')
        // Add content type
        const tags = store.addContentType({
            typeName,
            route: this.routes.product_tag,
        })
        const data = await this.fetchPaged('wc/v3/products/tags')
        for (const tag of data) {
            const fields = this.normalizeFields(tag)
            const parent = fields.parent
                ? store.createReference(typeName, fields.parent)
                : null

            tags.addNode({
                ...fields,
                parent,
            })
        }
    }

    async getProducts (store, categories) {
        // Add content type
        const typeName = this.getTypeName('Product')
        const products = store.addContentType({
            typeName,
            route: this.routes.product,
        })

        const data = await this.fetchPaged('wc/v3/products')
        for (const product of data) {
            const fields = this.normalizeFields(product)
            const parent = fields.parentId
                ? store.createReference(typeName, fields.parentId)
                : null
            const related = (fields.relatedIds || [])
                .filter(id => !!id)
                .map(id => store.createReference(typeName, id))
            const images  = (fields.images || [])
                .filter(image => !!image && !!image.id)
                .map(image => store.createReference(TYPE_ATTACHEMENT, image.id))
            const featuredImage = images.length > 0
                ? images[0]
                : undefined
            const gallery = images.slice(1)
            const productCategories = (fields.categories || [])
                .filter(category => !!category && !!category.id)
                .map(category => store.createReference(this.getTypeName('ProductCategory'), category.id))
            const productAllCategories = this.getProductAllCategories(store, product, categories)
            const tags = (fields.tags || [])
                .filter(tag => !!tag && !!tag.id)
                .map(tag => store.createReference(this.getTypeName('ProductTag'), tag.id))

            products.addNode({
                ...fields,

                parent,
                related,

                images,
                featuredImage,
                gallery,

                categories: productCategories,
                mainCategory: productCategories.length > 0 ? productCategories[0] : null,
                allCategories: productAllCategories,

                tags,
                mainTag: tags.length > 0 ? tags[0] : null,
            })
        }
    }

    getProductAllCategories (store, product, categories) {
        return (product.categories || [])
            .filter(category => !!category && !!category.id)
            .reduce((result, category) => {
                result.push(category.id)
                this.getCategoryHierarchy(category, categories)
                    .forEach(category => result.push(category))

                return result
            }, [])
            .map(id => store.createReference(this.getTypeName('ProductCategory'), id))
    }

    getCategoryHierarchy(category, categories) {
        const result = []

        let currentCategory = categories[category.id]
        while (currentCategory && currentCategory.parent && categories[currentCategory.parent.id]) {
            result.push(currentCategory.parent.id)

            currentCategory = categories[currentCategory.parent.id]
        }

        return result
    }

    async addCategoryBreadcrumbs(store, categories) {
        const categoryType = store.getContentType(this.getTypeName('ProductCategory'))
        for (const id in categories) {
            const category = categories[id]
            const hierarchy = this.getCategoryHierarchy(category, categories)
                .map(id => store.createReference(this.getTypeName('ProductCategory'), id))

            await categoryType.updateNode({
                ...category,
                hierarchy,
            })
        }
    }

    async fetch (url, params = {}) {
        try {
            return await this.client.request({ url, params })
        } catch ({ response, code, config }) {
            if (!response && code) {
                throw new Error(`${code} - ${config.url}`)
            }

            const { status } = response.data.data
            if ([401, 403].includes(status)) {
                throw new Error('Unauthorized request, please check your "key" and "secret".')
            }
        }
    }

    async fetchPaged (path) {
        const { perPage, concurrent } = this.options

        return new Promise(async (resolve, reject) => {
            let res
            try {
                res = await this.fetch(path, { per_page: perPage })
            } catch (err) {
                return reject(err)
            }

            const totalItems = parseInt(res.headers['x-wp-total'], 10)
            const totalPages = parseInt(res.headers['x-wp-totalpages'], 10)

            try {
                res.data = ensureArrayData(path, res.data)
            } catch (err) {
                return reject(err)
            }

            if (!totalItems || totalPages <= 1) {
                return resolve(res.data)
            }

            const queue = []
            for (let page = 2; page <= totalPages; page++) {
                queue.push({ per_page: perPage, page })
            }

            await pMap(queue, async params => {
                try {
                    const { data } = await this.fetch(path, params)
                    res.data.push(...ensureArrayData(path, data))
                } catch (err) {
                    console.log(err.message)
                }
            }, { concurrency: concurrent })

            resolve(res.data)
        })
    }

    normalizeFields (fields) {
        const res = {}

        for (const key in fields) {
            // skip links and embeds etc
            if (key.startsWith('_')) {
                continue
            }

            res[camelCase(key)] = this.normalizeFieldValue(fields[key])
        }

        return res
    }

    normalizeFieldValue (value) {
        if (value === null || value === undefined) {
            return null
        }

        if (Array.isArray(value)) {
            return value.map(item => this.normalizeFieldValue(item))
        }
        if (isPlainObject(value)) {
            return this.normalizeFields(value)
        }

        return value
    }

    getTypeName (name = '') {
        return upperFirst(camelCase(`${this.options.typeName} ${name}`))
    }
}

function ensureArrayData (url, data) {
    if (!Array.isArray(data)) {
        try {
            data = JSON.parse(data)
        } catch (err) {
            throw new Error(
                `Failed to fetch ${url}\n` +
                `Expected JSON response but received:\n` +
                `${data.trim().substring(0, 150)}...\n`
            )
        }
    }

    return data
}

module.exports = WordpressWooCommerceSource
