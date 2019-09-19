const Base = require('./base/base')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroesRoutes extends Base {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Listar',
                notes: 'Paginar e filtrar resultados por nome',
                validate: {
                    //payload -> body / headers -> header / params ->  URL / query-> skip=10&limit=10
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers,
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    const query = nome ? { nome: { $regex: `.*${nome}*.` } } : {}

                    return this.db.read(query, skip, limit)
                }
                catch (err) {
                    console.error(err)
                    return Boom.internal()
                }

            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar',
                notes: 'Cadastrar um herói por nome e poder',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        message: 'Cadastrado com sucesso!',
                        _id: result._id
                    }
                }
                catch (err) {
                    console.error(err)
                    return Boom.internal()
                }
            }
        }
    }

    patch() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualizar',
                notes: 'Atualizar algum atributo do herói',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('ID não encontrado')

                    return {
                        message: "Atualizado com sucesso!"
                    }
                }
                catch (err) {
                    console.error(err)
                    return Boom.internal()
                }
            }
        }
    }

    put() {
        return {
            path: '/herois/{id}',
            method: 'PUT',
            config: {
                tags: ['api'],
                description: 'Atualizar',
                notes: 'Atualizar todos os atributos do herói',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(2).max(100).required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('ID não encontrado')

                    return { message: "Atualizado com sucesso!" }
                }
                catch (err) {
                    console.error(err)
                    Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deletar',
                notes: 'Deletar um herói por ID',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const result = await this.db.delete(id)

                    if (result.deletedCount === 0) return Boom.preconditionFailed('ID não encontrado')

                    return { message: 'Deletado com sucesso!' }
                }
                catch (err) {
                    console.error(err)
                    Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroesRoutes