const Evento = require('../../estrutura/Evento');

module.exports = class extends Evento {
    constructor(client) {
        super(client, {
            nome: 'ready'
        })
    }

    run = async () => {
        await this.client.registroComandos();
        await this.client.requerDatabase();
        await this.client.user.setPresence({
            status: 'idle',
            activities: [{
                name: 'a sua mãe pra ver se quica. 🔥',
                type: 'PLAYING'
            }]
        });
        console.log(`O bot ${this.client.user.username} foi logado. \\(0-0)/`);
    }
}