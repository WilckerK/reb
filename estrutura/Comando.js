class Comando {
    constructor(client, options){
        this.client = client
        this.name = options.nome
        this.description = options.desc
        this.options = options.options
        this.requireDatabase = options.requireDatabase
    }
}

module.exports = Comando