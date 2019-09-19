const Mongoose = require('mongoose')

Mongoose.connect('mongodb://bergsonjr:j34331959@localhost:27017/heroes', { useNewUrlParser: true },
    (err) => {
        if (!err) return;
        console.log('Falha na conexão', err)
    })

const connection = Mongoose.connection

connection.once('open', () => console.log("Database rodando..."))

const state = Mongoose.connection.readyState
console.log('Estado:', state)
/* Estados de conexão
    0: Desconectado
    1: Conectado
    2: Conectando
    3: Desconectando
*/

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

const model = Mongoose.model('heroes', heroiSchema)

async function main() {
    const resultCadastrar = await model.create({ nome: 'Super Homem', poder: 'Força' })
    console.log('Resultado cadastrar', resultCadastrar)

    const listItens = await model.find()
    console.log('Lista', listItens)
}
main()