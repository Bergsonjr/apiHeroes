const ICrud = require('../interfaces/ICrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}

class MongoDB extends ICrud {
    constructor(connection, Schema) {
        super()
        this._connection = connection
        this._schema = Schema
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;
        if (state !== 'Conectando') return state;

        await new Promise(resolve => setTimeout(resolve, 1000))
        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect('mongodb://bergsonjr:j34331959@localhost:27017/heroes', { useNewUrlParser: true },
            (err) => {
                if (!err) return;
                console.log('Falha na conexão', err)
            })

        const connection = Mongoose.connection
        connection.once('open', () => console.log("Database rodando..."))

        return connection
    }

    async create(item) {
        return await this._schema.create(item)
    }

    async read(item, skip = 0, limit = 10) {
        return await this._schema.find(item).skip(skip).limit(limit)
    }

    async update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    async delete(id) {
        return this._schema.deleteOne({ _id: id })
    }
}

module.exports = MongoDB