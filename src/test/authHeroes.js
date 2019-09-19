const assert = require('assert')
const api = require('../api')
let app = {}

describe('Authentication testes', function () {
    this.enableTimeouts(false)
    this.beforeAll(async () => {
        app = await api
    })
    it.only('Obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'bergsonjr',
                password: 'j34331959'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
})