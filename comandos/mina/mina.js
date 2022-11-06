const comando = require('../../estrutura/Comando')
const checkUser = require('../../utils/checkUser')
const updateUser = require('../../utils/updateUser')
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')
const listaMinasPicaretas = require('../../utils/mina/listaMinasPicaretas')

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'mina' ,
            desc: 'Mostra sobre a sua mina.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        let user = interaction.member.user;
        const ficha = await checkUser(interaction.db, user.id);
        if(ficha.mina.local == 0){await this.contruir(interaction, ficha);return}

        const local = listaMinasPicaretas('local', ficha.mina.local);
        const picareta = listaMinasPicaretas('picareta', ficha.mina.picareta)
        const precisaDeBrasas = (ficha.mina.picareta == 3)?'\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nPara melhorar a Picareta de Diamante para uma Picareta de Brasas, é preciso que você ofereça todas as brasas existentes e torne suas brasas acendidas em cinzas.':'';
        let bewFrase = '';
        if(ficha.mina.bewMinerador !== null){
            const bewDB = await interaction.db.collection('bews');
            const bew = await bewDB.findOne({"_id": element.bewId});
            bewFrase = `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nSeu bew ${bew.nome} ainda está mineirando. ~[${bew.felicidade}]`;
        }

        const txtFrase = (Math.ceil(Math.random() * 3) == 3)?'O local faz a mineração ser mais rápida.':
        (Math.ceil(Math.random() * 2) == 2)?'A picareta te faz minerar mais por mineração':'Para vender seus carvões use /fabrica.';
        let msg = new MessageEmbed()
            .setTitle('Mina de Carvão')
            .setColor(0x010101)
            .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
            `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
            `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
            `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
            .setImage(local[2])
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            .setTimestamp()

        const rowButton = new MessageActionRow().addComponents([new MessageButton().setStyle('DANGER').setLabel('Minerar ⛏').setCustomId('Minerar')]);

        if(3000 + (ficha.mina.local * 2000) <= ficha.rewbs && 750 * ficha.mina.local <= ficha.mina.carvoes){
            rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Próximo Local').setCustomId('Local')]);
        }if(ficha.mina.picareta * 1000 <= ficha.mina.carvoes){
            if(ficha.mina.picareta == 3){
                const listaDeBrasas = require('../../utils/brasas/listaDeBrasas');
                if(ficha.bras.brasas.length == listaDeBrasas.length){
                    rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Melhorar Picareta').setCustomId('Picareta')]);}
            }else{rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Melhorar Picareta').setCustomId('Picareta')]);}
        }if(ficha.mina.bewMinerador != null){
            rowButton.addComponents([new MessageButton().setStyle('PRIMARY').setLabel('Tirar Bew').setCustomId('Bew')]);
        }

        let enviada  = null;
        try{enviada = await interaction.reply({embeds:[msg], components: [rowButton], fetchReply: true})}catch(err){enviada = interaction.channel.send({embeds:[msg], components: [rowButton], fetchReply: true});}
        const filter = (i) => {return i.user.id == interaction.member.id};

        const collector = await enviada.createMessageComponentCollector({ filter, time: (5 * 60000) });
        let carvoesMinerados = 0;

        collector.on('collect', async(i) => {
            switch(i.customId){
                case 'Minerar':
                    carvoesMinerados += Math.round(Math.random() * picareta[1]) + 3 * ficha.mina.picareta;
                    rowButton.components[0].setDisabled(true).setLabel(`Minerar ⛏ (${carvoesMinerados})`);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - ${carvoesMinerados} Carvões Minerados`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes + carvoesMinerados} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                        `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
                        `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
                        .setImage(local[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                        .setTimestamp()
                    i.update({embeds: [msg], components: [rowButton], fetchReply: true});

                    setTimeout(() => {
                        rowButton.components[0].setDisabled(false);
                        enviada.edit({embeds: [msg], components: [rowButton], fetchReply: true});
                    }, local[1]);
                break;
                case'Local':
                    ficha.rewbs -= 2000 + (ficha.mina.local * 2000);
                    ficha.mina.carvoes -= 750 * ficha.mina.local;
                    ficha.mina.local++;
                    const novoLocal = listaMinasPicaretas('local', ficha.mina.local);

                    await updateUser(interaction.db, ficha);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - Local Novo!!!`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${novoLocal[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                        `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
                        `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
                        .setImage(novoLocal[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                        .setTimestamp()
                    collector.stop('time')
                break;
                case'Picareta':
                    ficha.mina.carvoes -= ficha.mina.picareta * 1000;
                    ficha.mina.picareta++;
                    const novaPicareta = listaMinasPicaretas('picareta', ficha.mina.picareta);

                    await updateUser(interaction.db, ficha);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - Picareta Melhorada!!!`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${novaPicareta[0]}** \n**Local: ${local[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                        `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
                        `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
                        .setImage(local[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                        .setTimestamp()
                    collector.stop('time')
                break;
                case'Bew':
                    ficha.mina.bewMinerador = null;
                    await updateUser(interaction.db, ficha);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - Bew Descansando!!!`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                        `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
                        `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
                        .setImage(local[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                        .setTimestamp()
                    collector.stop('time')
                break;
            }
        });collector.on('end', async(i) => {
            enviada.edit({embeds: [msg], components: []});
            if(carvoesMinerados != 0){
                const fulano = await checkUser(interaction.db, ficha._id);
                fulano.mina.carvoes += carvoesMinerados;
                await updateUser(interaction.db, fulano);
            }
        })

    }

    contruir = async(interaction, ficha) =>{
        
        if(ficha.rewbs < 3000){
            interaction.reply({content: `Para contruir uma mina é preciso pagar **3000** Rewbs.`, ephemeral: true});    
            return
        }

        let msg = new MessageEmbed()
            .setTitle('Contruir uma mina!')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `Para construir uma mina é preciso **2000** Rewbs.\nVocê tem certeza que quer completar essa compra?`
            + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        const enviada = await interaction.reply({ embeds: [msg], fetchReply: true });
        await enviada.react('⛏');
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '⛏'
        };

        const collector = enviada.createReactionCollector({ filter, time: ( 3 * 60000) });
        collector.on('collect', async(i) => {
            ficha.mina = {
                carvoes: 0,
                local: 1,
                picareta: 1,
                bewMinerador: null
            }
            await updateUser(interaction.db, ficha);
            msg = new MessageEmbed()
                .setTitle('Mina de Carvão')
                .setColor(0x010101)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
                `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nPara começar a minerar mande o comando novamente.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                `Próximo local: **${3000 + (ficha.mina.local * 2000)} Rewbs** e **${750 * ficha.mina.local} Carvões**` +
                `\nPróxima picareta: **${ficha.mina.picareta * 1000} Carvões**${precisaDeBrasas}`)
                .setImage(local[2])
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                .setTimestamp()
            collector.stop();
        })
        collector.on('end', async() => {
            enviada.reactions.removeAll().catch(() => {});
        })
    }
}