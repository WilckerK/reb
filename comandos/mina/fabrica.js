const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'fabrica' ,
            desc: 'Vende seus carvões para a fábrica.',
            requireDatabase: true,
            options: [
                {
                    name: 'quantidade',
                    type:'INTEGER',
                    description: 'Quantos carvões vai oferecer?',
                    required: false
                }
            ]
        })
    }

    run = async(interaction) => {
        const quantidade = interaction.options.getInteger('quantidade');
        if(quantidade){
            this.vender(interaction, quantidade)
            return
        }

        this.valor(interaction);
    }

    valor = async(interaction) => {
        
    }

    vender = async(interaction, quantidade) => {

    }
}