const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb/mongodb')
const heroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = { nome: 'Spider Man', poder: 'Teias' }
const MOCK_HEROI_ATUALIZAR = { nome: 'Arqueiro Verde', poder: 'Flechas' }

let MOCK_HEROI_ID = ''
let context = {}

describe('MongoDB testes', function () {
    this.beforeAll(async () => {
        const connection = Mongodb.connect()
        context = new Context(new Mongodb(connection, heroiSchema))
    })
    it('Verificar conexão', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })
    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Atualizar', async () => {
        const res = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = res._id
        const result = await context.update(MOCK_HEROI_ID, { nome: 'Hulk', poder: 'Força' })
        assert.deepEqual(result.nModified, 1)
    })
    it('Deletar', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1)
    })
})