const assert = require('assert')

const SENHA = 'j34331959'

describe.only('Password testes', function () {
    it('Deve gerar um hash apartir de uma senha', async () => {
        const result = {}

        assert.ok(result.length > 10)
    })
})