const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const heroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')
var pg = require('pg')
delete pg.native

const MOCK_HEROI_CADASTRAR = { nome: 'Gavião Negro', poder: 'Flexas' }
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro' }
const MOCK_HEROI_DELETAR = { nome: 'Homem de Ferro', poder: 'Força' }
let context = {}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, heroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_CADASTRAR)
    })
    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('Cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.dataValues.id
        assert.deepEqual(result.dataValues, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Atualizar', async () => {
        await context.create(MOCK_HEROI_ATUALIZAR)
        const [resultItem] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const newItem = { ...MOCK_HEROI_ATUALIZAR, nome: 'Mulher Maravilha' }
        const [result] = await context.update(resultItem.id, newItem)
        const [itemUpdated] = await context.read({ nome: newItem.nome })
        assert.deepEqual(result, 1) //confere se foi alterado com sucesso
        assert.deepEqual(itemUpdated.nome, newItem.nome) //confere se o nome é o mesmo
    })
    it('Deletar', async () => {
        await context.create(MOCK_HEROI_DELETAR)
        const [item] = await context.read(MOCK_HEROI_DELETAR)
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })
})