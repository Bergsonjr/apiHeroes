const NotImplementedExcepetion = require('./../../../strategy')

class ICrud extends NotImplementedExcepetion {
    create(item) {
        throw new NotImplementedExcepetion()
    }

    read(query) {
        throw new NotImplementedExcepetion()
    }

    update(id, item) {
        throw new NotImplementedExcepetion()
    }

    delete(id) {
        throw new NotImplementedExcepetion()
    }

    isConnected() {
        throw new NotImplementedExcepetion()
    }

    connect() {
        throw new NotImplementedExcepetion()
    }
}

module.exports = ICrud