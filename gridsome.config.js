const path = require('path')

function addStyleResource (rule) {
    rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
        patterns: [
            path.resolve(__dirname, './src/assets/styles/global.scss'),
        ],
    })
}

module.exports = {
    siteName: 'Gridsome',
    siteDescription: 'A WordPress starter for Gridsome',
    plugins: [
        {
            use: '@gridsome/source-wordpress',
            options: {
                baseUrl: 'http://ana.sm1.codeserk.es/', // required
                typeName: 'WordPress', // GraphQL schema name (Optional)
                perPage: 100, // How many posts to load from server per request (Optional)
                concurrent: 10, // How many requests to run simultaneously (Optional)
                routes: {
                    page: '/:slug',
                    post: '/novedades/:slug', //adds route for "post" post type (Optional)
                    post_tag: '/tag/:slug', // adds route for "post_tag" post type (Optional)
                    product: false,
                }
            }
        },
        {
            use: '~/src/plugins/post-index',
        },
        {
            use: '~/src/plugins/source-wordpress-woo-commerce',
            options: {
                baseUrl: 'https://ana.sm1.codeserk.es/', // required
                typeName: '', // GraphQL schema name (Optional)
                perPage: 100, // How many posts to load from server per request (Optional)
                concurrent: 10, // How many requests to run simultaneously (Optional)
                key: 'ck_7614a3eed13534b0e07689a05c73558bb10d5c30',
                secret: 'cs_b78aeb2f1a80832a93a38906a7e5b2d30b966c71',

                routes: {
                    product: '/productos/:slug',
                    product_category: '/categorias/:slug',
                    product_tag: '/etiquetas/:slug',
                }
            }
        },
        {
            use: '~/src/plugins/source-wordpress-download-media',
        },
        {
            use: 'gridsome-plugin-tailwindcss',
            options: {
				tailwindConfig: 'tailwind.config.js',
				purgeConfig: {},
				presetEnvConfig: {},
				shouldPurge: true,
				shouldImport: true,
				shouldTimeTravel: true,
            }
        },
    ],

    chainWebpack (config) {
        // Load variables for all vue-files
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

        types.forEach(type => {
            addStyleResource(config.module.rule('sass').oneOf(type))
        })

        // or if you use scss
        types.forEach(type => {
            addStyleResource(config.module.rule('scss').oneOf(type))
        })
    }
}
