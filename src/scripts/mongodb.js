// docker ps
// docker exec - it 65fb6a5beada mongo -u bergsonjr -p j34331959 --authenticationDatabase heroes

//databases
show dbs

//mudando o contexto para uma database
use heroes

//mostrar tables(colleções)
show collections

//inserir no mongo (create)
db.heroes.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-09-14'
})

//buscar no mongo (read)
db.heroes.find()
db.heroes.find().pretty()

//retorna a quantidade de registros no db
db.heroes.count()
db.heroes.findOne()
db.heroes.find().limit(10).sort({ nome: -1 })

//update
db.heroes.update({ _id: ObjectId("5c52cae33b4c113bfae89969") },
    { nome: 'Batman' },
    { poder: 'Dinheiro' })

db.heroes.update({ _id: ObjectId("5c52cae33b4c113bfae89969") },
    { $set: { nome: 'Homem de Ferro' } })//alterar somente o nome

//delete
db.heroes.remove({}) //remove todos os registros
db.heroes.remove({ nome: 'Batman' }) //removendo um registro específico