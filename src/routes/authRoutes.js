const BaseRoutes = require('./base/base')
const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const failAction = (request, headers, erro) => {
    throw erro;
}
const USER = {
    username: 'bergsonjr',
    password: 'j34331959'
}

class AuthRoutes extends BaseRoutes {
    constructor(secret) {
        super()
        this.secret = secret
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com usuário e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { username, password } = request.payload
                    if (username.toLowerCase() !== USER.username || password !== USER.password) { return Boom.unauthorized() }
                    const token = Jwt.sign({
                        username: username,
                        id: 1
                    }, this.secret)
                    return { token }
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    }
}

module.exports = AuthRoutes