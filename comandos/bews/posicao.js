const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const invocacao = require('../../utils/bews/criar/invocacao');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'posicao' ,
            desc: 'Troca a posição dos bews.',
            requireDatabase: true, options: [
                {
                    name: 'bew',
                    type:'STRING',
                    description: 'Qual o nome do bew?',
                    required: true
                },
                {
                    name: 'posicao',
                    type:'INTEGER',
                    description: 'Em qual posição quer coloca-lo?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        const posicao = interaction.options.getInteger('posicao');

        if(posicao > ficha.bews.length - 1){
            interaction.reply({content: 'A sua caixa de bews não tem todo esse espaço.', ephemeral: true});
            return
        }
        if(posicao <= 0){
            interaction.reply({content: 'A posição tem que ser um numero válido.', ephemeral: true});
            return
        }

        const bewDoUser = ficha.bews.findIndex((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('bew').toLowerCase()
        });

        if(!bewDoUser){
            interaction.reply({content: 'Você errou ou não tem nenhum bew com o nome informado.', ephemeral: true});
            return
        }
        if(posicao === bewDoUser){
            interaction.reply({content: 'Esse bew já se encontra nessa posição.', ephemeral: true});
            return
        }

        [ficha.bews[bewDoUser], ficha.bews[posicao]] = [ficha.bews[posicao], ficha.bews[bewDoUser]];
        await updateUser(interaction.db, ficha);

        const {MessageEmbed} = require('discord.js');
        let msg = new MessageEmbed()
            .setTitle('Troca de Posição')
            .setColor('RANDOM')
            .setDescription(`Seus bews foram reorganizados, o Bew escolhido foi parar na posição ${posicao}.`)
        await interaction.reply({embeds: [msg], ephemeral: true});
                
    }
}