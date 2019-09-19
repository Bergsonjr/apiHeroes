const assert = require('assert')
const api = require('./../api')
const token = null
const MOCK_CREATE = { nome: 'Homem de Ferro', poder: 'Força' }
const MOCK_INICIAL = { nome: 'Gavião Negro', poder: 'Flechas' }
const MOCK_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro' }
const headers = {
    Authorization: token
}
let app = {}
let MOCK_ID = ''

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/herois',
        payload: MOCK_INICIAL
    })
}

describe('Testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar()

        MOCK_ID = JSON.parse(result.payload)._id
    })
    it('Listar', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=0'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('Listar com parametros', async () => {
        const limit = 3
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${limit}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === 3)
    })
    it('Cadastrar - POST', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_CREATE
        })

        const { message, _id } = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Cadastrado com sucesso!')
    })
    it('Atualizar - PATCH', async () => {
        const _id = MOCK_ID
        const expected = { poder: 'Super flechas' }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: expected
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Atualizado com sucesso!')
    })
    it('Atualizar - PATCH(sem ID)', async () => {
        const _id = `5c5989e2fd205e4e2c1bc4d1`
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: { poder: 'Super flechas' }
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        const expected = { statusCode: 412, error: 'Precondition Failed', message: 'ID não encontrado' }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
    it('Atualizar - PUT', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'PUT',
            url: `/herois/${_id}`,
            payload: MOCK_ATUALIZAR
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Atualizado com sucesso!')
    })
    it('Deletar - DELETE', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Deletado com sucesso!')
    })
    it('Deletar - DELETE(sem ID)', async () => {
        const _id = `5c5989e2fd205e4e2c1bc4d1`
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        const expected = { statusCode: 412, error: 'Precondition Failed', message: 'ID não encontrado' }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
})