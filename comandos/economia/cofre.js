const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'cofre' ,
            desc: 'Aumenta o espaço no seu cofre.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        const valor = ficha.cofre * 15000; const brasoesPrecisos = ficha.cofre + 1;
        if(!ficha.bras.brasoes.FO){
            ficha.bras.brasoes.FO = 0;
        }
        if(ficha.rewbs < valor || ficha.bras.brasoes.FO < brasoesPrecisos){
            interaction.reply({content: `Você precisa pagar ${valor} Rewbs e de ${brasoesPrecisos} brasões de Fortuna para poder aumentar o cofre.`, ephemeral: true});    
            return
        }

        const {MessageEmbed} = require('discord.js');
        const msg = new MessageEmbed()
            .setTitle('Cofre')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `Para aumentar o seu cofre o custo é de **${valor}** Rewbs \ne de **${brasoesPrecisos}** brasões de **Fortuna** (💰**[FO]**).\nVocê tem certeza que quer completar essa compra?`
                + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setTimestamp()
        const enviada = await interaction.reply({ embeds: [msg], fetchReply: true });
        
		await enviada.react('✅');
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '✅'
        };

        const collector = enviada.createReactionCollector({ filter, time: ( 3 * 60000) });

        collector.on('collect', async(reaction, user) => {
            ficha.cofre++;
            ficha.rewbs -= valor;
            ficha.bras.brasoes.FO -= brasoesPrecisos;
            await updateUser(interaction.db, ficha);

            const confirmMsg = new MessageEmbed()
                .setTitle('Cofre')
                .setColor(0x700000)
                .setDescription(`**Parabéns!!!**` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` +
                `Seu cofre foi aumentado com sucesso.\nAgora você pode ser bem mais rico.` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
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