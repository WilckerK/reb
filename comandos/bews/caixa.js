const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'caixa' ,
            desc: 'Te faz comprar mais espaço para Bews. A cada compra aumenta dois slots.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        const valor = ficha.bews[0] * 500
        if(ficha.rewbs < valor){
            interaction.reply({content: `Você precisa pagar ${valor} Rewbs para poder aumentar a caixa de Bews.`, ephemeral: true});    
            return
        }

        const {MessageEmbed} = require('discord.js');
        const msg = new MessageEmbed()
            .setTitle('Caixa')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `Para aumentar a caixa em dois slots custa **${valor}** Rewbs. \nVocê tem certeza que quer completar essa compra?`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setTimestamp()
        const enviada = await interaction.reply({ embeds: [msg], fetchReply: true });
        
		await enviada.react('✅');
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '✅'
        };

        const collector = enviada.createReactionCollector({ filter, time: ( 4 * 60000) });

        collector.on('collect', async(reaction, user) => {
            ficha.bews[0] += 2;
            ficha.rewbs -= valor;
            await updateUser(interaction.db, ficha);

            const confirmMsg = new MessageEmbed()
                .setTitle('Caixa')
                .setColor(0x700000)
                .setDescription(`**Parabéns!!!**` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + 
                `Sua box foi aumentada com sucesso.\nAgora seus bews podem ter mais amiguinhos.` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
                .setTimestamp()
            enviada.edit({embeds: [confirmMsg]});
            
            collector.stop();
        })
        collector.on('end', async() => {
            enviada.reactions.removeAll().catch(() => {});
            setTimeout(() => enviada.delete().catch(() => {}), (5 * 60000));
        })
    }
}