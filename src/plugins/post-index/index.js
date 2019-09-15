module.exports = function (api) {
    api.loadSource(store => {
        const posts = store.addContentType('WordPressPost')

        posts.addSchemaField('stringIndex', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve (node) {
                const title = node.title || ''
                const excerpt = node.excerpt || ''
                const index = `${title} ${excerpt}`

                return index.toLowerCase()
            }
        }))
    })
}
