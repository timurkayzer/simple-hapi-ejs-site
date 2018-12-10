const Hapi = require('hapi');
const Vision = require('vision')
const Page = require('./page-model')
const Ejs = require('ejs')

const server = Hapi.server({
    host: 'localhost',
    port: 8000
})

const provision = async () => {
    await server.register(Vision);

    server.views({
        engines: {ejs: Ejs},
        relativeTo: __dirname,
        path: 'templates/pages'
    })
}


// Add the route
server.route({
    method: 'GET',
    path: '/{slug}',
    handler: async (request, h) => {
        const slug = request.params.slug
        console.log(slug)
        const page = await Page.findOne({
            where: {slug: slug}
        })

        if (page)
            return h.view('page', {
                page: page
            });
        else return '404'

    }
})

server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        const pages = await Page.findAll()

        if (pages)
            return h.view('index', {
                pages: pages
            });
    }
})

server.route({
    method: 'GET',
    path: '/create-blog',
    handler: async (request, h) => {
        return h.view('create');
    }
})

server.route({
    method: 'POST',
    path: '/create-blog',
    handler: async (request,h)=>{

        const blog = Page.build({
            title: request.payload.title,
            slug: request.payload.slug,
            full_text: request.payload.full_text,
        })

        try {
            const res = await blog.save()
            console.log(res)
            return h.view('create')
        }
        catch (e) {
            return e
        }

    }
})

// Start the server
async function start() {

    try {
        await provision()
        await server.start()
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }

    console.log('Server running at:', server.info.uri)
}

process.on('unhandledRejection', (err) => {

    console.log(err);
})

start()