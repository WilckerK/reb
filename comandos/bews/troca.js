const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'troca' ,
            desc: 'Realiza trocas de bews com outro usuário.',
            requireDatabase: true,
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Com quem quer fazer a troca?',
                    required: true
                },
                
                {
                    name: 'oferta',
                    type:'STRING',
                    description: 'O que você vai oferecer?',
                    required: true
                },

                {
                    name: 'receber',
                    type:'STRING',
                    description: 'O que você vai receber?',
                    required: true
                },
            ]
        })
    }

    run = async(interaction) => {
        const userA = interaction.member.id;
        const userB = (interaction.options.getUser('user')).id
        const oferta = interaction.options.getString('oferta');
        const receber = interaction.options.getString('receber');

        if(userB == userA){
            interaction.reply({content: 'Você não pode realizar uma troca com você mesmo.', ephemeral: true});
            return
        }
            
        const fichaA = await checkUser(interaction.db, userA);
        const bewDoUserA = fichaA.bews.findIndex((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === oferta.toLowerCase()
        });

        if(!bewDoUserA){
            interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }

        const fichaB = await checkUser(interaction.db, userB);
        const bewDoUserB = fichaB.bews.findIndex((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === receber.toLowerCase()
        });

        if(!bewDoUserB){
            interaction.reply({content: 'A pessoa não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }
        const {MessageActionRow, MessageEmbed, MessageButton} = require('discord.js')

        const RowItem = new MessageActionRow().addComponents([
            new MessageButton().setStyle('SUCCESS').setLabel('APROVAR').setCustomId('A'),
            new MessageButton().setStyle('DANGER').setLabel('NEGAR').setCustomId('N')
        ]);

        const enviada = await interaction.reply({ content: `<@${userB}> confirme a troca. O <@${userA}> está tentando trocar o ${oferta} pelo ${receber}.`, components:[RowItem], fetchReply: true });
        const filter = (b) => b.user.id === userB;
        const collector = enviada.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: ( 5 * 60000) });

        collector.on('collect', async(i) => {
            switch(i.customId){
                case 'A':

                    [fichaA.bews[bewDoUserA], fichaB.bews[bewDoUserB]] = [fichaB.bews[bewDoUserB], fichaA.bews[bewDoUserA]];
                    
                    const bewDB = await interaction.db.collection('bews');

                    await bewDB.updateOne({_id: fichaA.bews[bewDoUserA].bewId}, {$set: {dono: [userB]}});
                    await bewDB.updateOne({_id: fichaB.bews[bewDoUserB].bewId}, {$set: {dono: [userA]}});

                    await updateUser(interaction.db, fichaA);
                    await updateUser(interaction.db, fichaB);

                    enviada.delete().catch(() => {})
                    const confirmMsg = new MessageEmbed()
                        .setTitle('Aprovada')
                        .setColor(0x700000)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nA troca entre <@${userB}> e <@${userA}> foi concluída com sucesso.\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
                    await enviada.channel.send({embeds: [confirmMsg]});

                break;

                case 'N':
                    const cancelMsg = new MessageEmbed()
                        .setTitle('Reprovado')
                        .setDescription(`A troca foi cancelada.`);
                    await enviada.edit({embeds: [cancelMsg]});
                break;
            }
            collector.stop();
        })
        collector.on('end', async(reason) => {
            if (reason === 'time'){
                const timeMsg = new MessageEmbed()
                    .setTitle('Seção Finalizada')
                    .setDescription(`Demora no tempo de resposta a ação foi cancelada.`);
                await enviada.edit({embeds: [timeMsg]});
            }
            setTimeout(() => enviada.delete().catch(() => {}), (10 * 60000));
        })
    

    }
}