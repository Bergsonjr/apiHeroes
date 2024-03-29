const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

const contextMongoDB = new ContextStrategy(new MongoDB())
contextMongoDB.create()

const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create()