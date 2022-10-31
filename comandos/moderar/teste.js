const comando = require('../../estrutura/Comando');
const presenteDoBew = require('../../utils/economia/presenteDoBew');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'teste' ,
            desc: 'Testeeee.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        if(interaction.member.id == "367709212320464896"){
            await presenteDoBew(this.client)
        } 
    }
}