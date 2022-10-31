const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'libertar' ,
            desc: 'Liberta um dos seus bews.',
            options: [
                {
                    name: 'nome',
                    type:'STRING',
                    description: 'Qual o nome do bew?',
                    required: true
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);

        const bewDoUser = ficha.bews.find((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('nome').toLowerCase()
        });

        if(!bewDoUser){
            interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }
        const nome = bewDoUser.nome;
        const bewDB = await interaction.db.collection('bews');
        await bewDB.deleteOne({"_id": bewDoUser.bewId});
        const arrayBews = [].concat(ficha.bews)
        const index = arrayBews.findIndex((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('nome').toLowerCase()
        });
        arrayBews.splice(index, 1);
        ficha.bews = arrayBews;
        
        const valor = 20 + Math.floor(Math.random() * 31)
        ficha.rewbs += valor;
        await updateUser(interaction.db, ficha, interaction.channel);
        
        const {MessageEmbed} = require('discord.js');
        let msg = new MessageEmbed()
            .setTitle(nome)
            .setColor('RANDOM')
            .setDescription(`Você libertou ${nome}, e ganhou ${valor} de rewbs.`)
        await interaction.reply({embeds: [msg], fetchReply: true});
    }
}