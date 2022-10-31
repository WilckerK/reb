const Evento = require('../../estrutura/Evento');

module.exports = class extends Evento {
    constructor(client) {
        super(client, {
            nome: 'interactionCreate'
        })
    }

    run = async (interaction) => {
        if (interaction.isCommand()){
            if(!interaction.guild || !interaction.user ) return 
            const cmd = this.client.comandos.find(c => c.name === interaction.commandName)

            if(cmd){ 
                if(cmd.requireDatabase) {
                    interaction.db = this.client.db;
                }
                try{
                    cmd.run(interaction, this.client);
                }catch(err){
                    this.client.channels.fetch('972932688728174605').then(channel => {
                        channel.send({content: `${err} \n ${interaction.commandName} \n ${JSON.stringify(cmd)}`})
                    })
                }
            }
        }
    }
}