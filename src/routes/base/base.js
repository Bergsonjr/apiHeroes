class Base {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype) //pegar todos os metodos da classe
            .filter(method => method !== 'constructor' && !method.startsWith('_')) //exceto os contrutores e static
    }
}
module.exports = Base