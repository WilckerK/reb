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
    set localPreco(nivel){this._localPreco = 3000 + (nivel * 2000);} 
    get localPreco(){return this._localPreco}
    set picaretaPreco(nivel){this._picaretaPreco = nivel * 1500;} 
    get picaretaPreco(){return this._picaretaPreco}

    run = async(interaction) => {
        let user = interaction.member.user;
        const ficha = await checkUser(interaction.db, user.id);
        if(ficha.mina.local == 0){await this.contruir(interaction, ficha);return}

        this.localPreco = ficha.mina.local; this.picaretaPreco = ficha.mina.picareta;
        const local = listaMinasPicaretas('local', ficha.mina.local);
        const picareta = listaMinasPicaretas('picareta', ficha.mina.picareta)
        const precisaDeBrasas = (ficha.mina.picareta == 3)?'\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nPara melhorar a Picareta de Diamante para uma Picareta de Brasas, é preciso que você ofereça todas as brasas existentes e torne suas brasas acendidas em cinzas.':'';
        let bewFrase = '';
        if(ficha.mina.bewMinerador !== null){
            const bewDB = await interaction.db.collection('bews');
            const bew = await bewDB.findOne({"_id": ficha.mina.bewMinerador.bewId});
            bewFrase = `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nSeu bew ${bew.nome} ainda está mineirando. ~[${bew.felicidade}]`;
        }
        let txtLocal = (ficha.mina.local == 4)?'':`\nPróximo local: **${this.localPreco} Rewbs** e **${Math.ceil(this.localPreco / 2)} Carvões**`;
        let txtPicareta = (ficha.mina.picareta == 4)?'':`\nPróxima picareta: **${this.picaretaPreco} Carvões**`
        const txtFrase = (Math.ceil(Math.random() * 3) == 3)?'O local faz a mineração ser mais rápida.':
        (Math.ceil(Math.random() * 2) == 2)?'A picareta te faz minerar mais por mineração':'Para vender seus carvões use /fabrica.';
        
        let msg = new MessageEmbed()
            .setTitle('Mina de Carvão')
            .setColor(0x010101)
            .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
            `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**' +
            txtLocal + `${txtPicareta}${precisaDeBrasas}`)
            .setImage(local[2])
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'}).setTimestamp()

        const rowButton = new MessageActionRow().addComponents([new MessageButton().setStyle('DANGER').setLabel('Minerar ⛏').setCustomId('Minerar')]);

        if(this.localPreco <= ficha.rewbs && Math.ceil(this.localPreco / 2) <= ficha.mina.carvoes && ficha.mina.local < 4){
            rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Próximo Local').setCustomId('Local')]);
        }if(ficha.mina.picareta * 1000 <= ficha.mina.carvoes && ficha.mina.picareta < 4){
            if(ficha.mina.picareta == 3){
                const listaDeBrasas = require('../../utils/brasas/listaDeBrasas');
                if(ficha.bras.brasas.length == listaDeBrasas.length){
                    rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Melhorar Picareta').setCustomId('Picareta')]);}
            }else{rowButton.addComponents([new MessageButton().setStyle('SECONDARY').setLabel('Melhorar Picareta').setCustomId('Picareta')]);}
        }

        let enviada;
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
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**' +
                        txtLocal + `${txtPicareta}${precisaDeBrasas}`)
                        .setImage(local[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'}).setTimestamp()
                    i.update({embeds: [msg], components: [rowButton], fetchReply: true});

                    setTimeout(() => {
                        rowButton.components[0].setDisabled(false);
                        enviada.edit({embeds: [msg], components: [rowButton], fetchReply: true});
                    }, local[1]);
                break;
                case'Local':
                    ficha.rewbs -= this.localPreco;
                    ficha.mina.carvoes -= Math.ceil(this.localPreco / 2);
                    ficha.mina.local++;
                    const novoLocal = listaMinasPicaretas('local', ficha.mina.local);

                    await updateUser(interaction.db, ficha);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - Local Novo!!!`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${novoLocal[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**' +
                        `${txtPicareta}${precisaDeBrasas}`)
                        .setImage(novoLocal[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'}).setTimestamp()
                    collector.stop('time')
                break;
                case'Picareta':
                    ficha.mina.carvoes -= this.picaretaPreco;
                    ficha.mina.picareta++;
                    const novaPicareta = listaMinasPicaretas('picareta', ficha.mina.picareta);
                    if(ficha.mina.picareta){
                        ficha.bras.brasas = []
                    }

                    await updateUser(interaction.db, ficha);
                    msg = new MessageEmbed()
                        .setTitle('Mina de Carvão' + ` - Picareta Melhorada!!!`)
                        .setColor(0x010101)
                        .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${novaPicareta[0]}** \n**Local: ${local[0]}**`+
                        `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtFrase}` + `${bewFrase}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**' +
                        txtLocal )
                        .setImage(local[2])
                        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'}).setTimestamp()
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
        
        if(ficha.rewbs < 1000){
            interaction.reply({content: `Para contruir uma mina é preciso pagar **1000** Rewbs.`, ephemeral: true});    
            return
        }

        let msg = new MessageEmbed()
            .setTitle('Contruir uma mina!')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `Para construir uma mina é preciso **1000** Rewbs.\nVocê tem certeza que quer completar essa compra?`
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
            ficha.rewbs -= 1000;
            this.localPreco = ficha.mina.local; this.picaretaPreco = ficha.mina.picareta;

            const local = listaMinasPicaretas('local', ficha.mina.local);
            const picareta = listaMinasPicaretas('picareta', ficha.mina.picareta);
            await updateUser(interaction.db, ficha);
            msg = new MessageEmbed()
                .setTitle('Mina de Carvão')
                .setColor(0x010101)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Carvões:** ${ficha.mina.carvoes} // **Picareta:** ${picareta[0]} \n**Local: ${local[0]}**`+
                `\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nPara começar a minerar mande o comando novamente.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**' +
                `\nPróximo local: **${this.localPreco} Rewbs** e **${Math.ceil(this.localPreco / 2)} Carvões**` +
                `\nPróxima picareta: **${this.picaretaPreco} Carvões**.`)
                .setImage(local[2])
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'}).setTimestamp()
            await enviada.edit({embeds: [msg]})
            collector.stop();
        })
        collector.on('end', async() => {
            enviada.reactions.removeAll().catch(() => {});
        })
    }
}