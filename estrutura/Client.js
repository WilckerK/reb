const connectToDatabase  = require('./Mongodb')

require('dotenv').config()
const { Client } = require('discord.js');

const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = class extends Client {
    constructor (options) {
        super(options)
        this.comandos = []
        this.loadComandos()
        this.loadEventos()
    }

    registroComandos() {
        this.guilds.cache.get(process.env.SERVIDOR_FECHADO).commands.set(this.comandos);
        try {this.guilds.cache.get(process.env.SERVIDOR_RBW).commands.set(this.comandos);}
        catch(err){console.log('Não foi possivel conectar na Rebewllion.')}
    }
    
    loadComandos(path = './comandos'){
        const categorias = readdirSync(path)
        let cmds = '';
        for (const category of categorias){
            const comandos = readdirSync(`${path}/${category}`)

            for (const comando of comandos){
                const comandoClass = require(join(process.cwd(), `${path}/${category}/${comando}`))
                const cmd = new (comandoClass)(this)

                this.comandos.push(cmd)

                cmds = `${cmds}${cmd.name}, ` 
            }
        }
        console.log(`Comandos ${cmds} carregados. (+_+)`)
    }
    
    loadEventos(path = './eventos'){
        const categorias = readdirSync(path)
        let evts = '';
        for (const category of categorias){
            const eventos = readdirSync(`${path}/${category}`)

            for (const evento of eventos){
                const eventoClass = require(join(process.cwd(), `${path}/${category}/${evento}`))
                const evt = new (eventoClass)(this)

                try {this.on(evt.name, evt.run)}
                catch(err){console.log('Evento '+ evt.name + ' deu pau. \n Erro: ' + err);}

                evts = `${evts}${evt.name}, `
            }
        }
        console.log(`Eventos ${evts} carregados. (+_+)`)
    }

    async requerDatabase(){
        const data = connectToDatabase ;
        async function executarDatabase(){
            const dataExe = await data();
            return dataExe
        }
        
        const { db } = await executarDatabase();
        this.db = db;
        console.log('Database conectada. (⌐■_■)');
        
    }
}