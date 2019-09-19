// npm install sequelize
// npm instal pg-hstore pg

const Sequelize = require('sequelize')
const driver = new Sequelize('heroes', 'bergsonjr', 'j34331959', { host: 'localhost', dialect: 'postgres', quoteIdentifiers: false, operatorsAliases: false })

async function main() {
    const Herois = driver.define('heroes', {
        id: {
            type: Sequelize.INTEGER,
            require: true,
            primaryKey: true, autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            require: true,
        },
        poder: {
            type: Sequelize.STRING,
            require: true
        }
    }, {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        })

    await Herois.sync()

    const result = await Herois.findAll({
        raw: true,
        attributes: ['nome']
    })
    console.log('resultado', result)
}
main()