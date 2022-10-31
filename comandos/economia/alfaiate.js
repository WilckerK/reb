const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'alfaiate' ,
            desc: 'Te veste com as cores caras da Rebewllion.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        if(!interaction.member.roles.cache.get('967147397232853082') && !interaction.member.roles.cache.get('903602409396371506') && !interaction.member.roles.cache.get('816356944796975145')){
            interaction.reply({content: 'Para usar esse comando você pelo menos precisa ser ao menos Membro ou da Staff.', ephemeral: true});    
            return
        }

        const ficha = await checkUser(interaction.db, interaction.member.id);
        if(ficha.rewbs < 1000){
            interaction.reply({content: 'Você precisa pagar 1000 Rewbs para poder escolher uma das cores.', ephemeral: true});    
            return
        }
        
        const {MessageEmbed} = require('discord.js');
        const msg = new MessageEmbed()
            .setTitle('Alfaiate')
            .setColor('RANDOM')
            .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1010633173228584990/unknown.png')
            .setDescription(`O custo é de 1000 Rewbs, você pode escolher dentre três cores.
**Dourado, Esmeralda ou Escarlate**`);
        const enviada = await interaction.reply({ embeds: [msg], fetchReply: true });
        
		await enviada.react('✨');
		await enviada.react('🍀');
		await enviada.react('🔥');
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && (reaction.emoji.name === '✨' || reaction.emoji.name === '🍀' || reaction.emoji.name === '🔥');
        };

        const collector = enviada.createReactionCollector({ filter, time: ( 4 * 60000) });

        collector.on('collect', async(reaction, user) => {
            let role;
            switch(reaction.emoji.name){
                case'✨': role = await interaction.guild.roles.fetch("966174586267914240");
                    break;
                case'🍀': role = await interaction.guild.roles.fetch("809847498696818709");
                    break;
                case'🔥': role = await interaction.guild.roles.fetch("809845303515414552");
                    break;
            }

            interaction.member.roles.add(role);

            ficha.rewbs -= 1000;
            await updateUser(interaction.db, ficha);

            const confirmMsg = new MessageEmbed()
                .setTitle('Alfaiate')
                .setColor('RANDOM')
                .setDescription(`**Agora você está além dos limites da beleza.** \nEnquanto estiver com essa cor vai haver impostos de 5% dos seus Rewbs totais diáriamente.\nEssas cores foram feitas apenas para os extremamente ricos. `)
            const confirm = await enviada.channel.send({embeds: [confirmMsg]});
            confirm.react(reaction.emoji.name)
            
            collector.stop();
            setTimeout(() => enviada.delete().catch(() => {}), 4500);
        })
        collector.on('end', async(collected, reason) => {
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