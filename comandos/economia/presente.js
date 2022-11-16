const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'presente' ,
            desc: 'Da um presente para outro usuário.',
            requireDatabase: true,
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Quem deseja presentear?',
                    required: true
                },
                
                {
                    name: 'item',
                    type:'STRING',
                    description: 'Qual item vai oferecer?',
                    required: true
                },
                
                {
                    name: 'quantidade',
                    type:'INTEGER',
                    description: 'Quanto vai oferecer?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const userA = interaction.member.id;
        const userB = (interaction.options.getUser('user')).id;
        if(userA === userB){
            interaction.reply({content: 'Você não pode presenciar a si mesmo. Procure tratamento médico, isso pode ser TDI.', ephemeral: true})
            return
        }

        const item = interaction.options.getString('item').toLowerCase();
        const quantidade = interaction.options.getInteger('quantidade');
        const fichaA = await checkUser(interaction.db, userA);

        let indexDoItem = -1;
        for (let i = 0; i < fichaA.geladeira.length; i++) {
            const element = fichaA.geladeira[i];
            if(element[3].toLowerCase() == item){
                indexDoItem = i;
                break;       
            }
        }

        if(indexDoItem == -1){
            interaction.reply({content: 'Você não tem esse item para presentear ou escreveu errado.', ephemeral: true})
            return
        }
        if(fichaA.geladeira[indexDoItem][5] < quantidade){
            interaction.reply({content: 'Você não tem essa quantidade para doar.', ephemeral: true})
            return
        }
        const presente = [].concat(fichaA.geladeira[indexDoItem]);

        const fichaB = await checkUser(interaction.db, userB);
        let jaTem = -1;
        for (let i = 0; i < fichaB.geladeira.length; i++) {
            const element = fichaB.geladeira[i];
            if(element[3].toLowerCase() == item){
                jaTem = i;
                break;       
            }
        }
        if(jaTem != -1){fichaB.geladeira[jaTem][5] += quantidade;
        }else{presente[5] = quantidade;await fichaB.geladeira.push(presente);
        }

        fichaA.geladeira[indexDoItem][5] -= quantidade;
        if(fichaA.geladeira[indexDoItem][5] == 0){
            fichaA.geladeira.splice(indexDoItem, 1);
        }

        await updateUser(interaction.db,  fichaA);
        await updateUser(interaction.db,  fichaB);

        const {MessageEmbed} = require('discord.js');
        const msg = new MessageEmbed()
            .setTitle('Presente!')
            .setColor(0x700000)
            .setDescription(`**Presentinho:**\n<@${userA}> acaba de presentear <@${userB}>.`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` +
            `Foi doado **${quantidade}** ${presente[0]} **${presente[3]}**` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        await interaction.reply({embeds: [msg]});

        const felicidade = require('../../utils/bews/editar/felicidade');
        await felicidade(interaction.db, this.client)
    }
}