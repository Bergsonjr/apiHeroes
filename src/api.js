const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const heroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const AuthRoute = require('./routes/authRoutes')
const HeroesRoute = require('./routes/heroesRoutes')
const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')
const Inert = require('inert')
const Vision = require('vision')
const JWT_SECRET = 'MY_SECRET'
const swaggerConfig = {
    info: {
        title: 'API - Herois',
        version: 'v1.0'
    },
    lang: 'pt'
}

const app = new Hapi.Server({ port: 5000 })

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = Mongodb.connect()
    const context = new Context(new Mongodb(connection, heroiSchema))
    await app.register([HapiJwt, Inert, Vision, { plugin: HapiSwagger, options: swaggerConfig }])

    app.route([
        ...mapRoutes(new HeroesRoute(context), HeroesRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn:20
        // }
        validate: (dado, request) => {
            //verifica no bando se o usuário continua ativo
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    await app.start()
    console.log('Servidor rodando na porta', app.info.port)

    return app
}
module.exports = main()