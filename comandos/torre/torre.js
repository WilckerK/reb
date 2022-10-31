const comando = require('../../estrutura/Comando')
const checkUser = require('../../utils/checkUser')
const updateUser = require('../../utils/updateUser')
const {MessageEmbed} = require('discord.js')

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'torre' ,
            desc: 'Mostra sobre a sua torre.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        let user = interaction.options.getUser('user') || interaction.member.user;
        if(user.bot){
            interaction.reply({content: 'Marque apenas usuários humanos por favor.', ephemeral: true});
            return
        }

        const ficha = await checkUser(interaction.db, user.id);
        if(!ficha.torre){
            if(interaction.member.user != user){
                interaction.reply({content: 'Essa pessoa não tem uma torre ainda.', ephemeral: true});
                return
            }
            await this.contruir(interaction, ficha)
            return
        }else if(ficha.torre.nivel == 0){
            if(interaction.member.user != user){
                interaction.reply({content: 'Essa pessoa não tem uma torre ainda.', ephemeral: true});
                return
            }
            await this.contruir(interaction, ficha)
            return
        }
        let txtTorre = `
      [|>>>
       |
_ _   _|_   _ _
||;|_| ; |_|;||
\\\\.       . //
 \\\\:     . //
 (||:    :||)
  ||:.    ||
  ||:.    ||
`
        for (let i = 0; i < ficha.torre.nivel - 1; i++) {
            const baseTorre = `  ||:   . || 
  ||:.    ||
`
            txtTorre = txtTorre + baseTorre;
        }
        const dataAtual = new Date();
        let txtAtaque = 'Você já pode fazer um ataque!';
        if(dataAtual.getTime() < ficha.torre.tempoDeAtaque.getTime()){
            const diferenca = new Date(ficha.torre.tempoDeAtaque.getTime() - dataAtual.getTime())
            txtAtaque = `Ainda faltam ${diferenca.getUTCHours()} horas e ${diferenca.getUTCMinutes()} minutos\npara o próximo ataque.`
        }

        let atacante = ''
        if(ficha.torre.atacado === true){
            atacante = `\n***Sua torre foi derrubada por <@${ficha.torre.atacante}>***`
        }

        let msg = new MessageEmbed()
            .setTitle('Torre')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Nivel: ${ficha.torre.nivel}**\n`+
            `${txtAtaque}\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nA torre está te rendendo **${5 + (ficha.torre.nivel - 1)* 3}%**${atacante}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
            `Requisitos para a melhoria:\n**${2000 + (ficha.torre.nivel * 4000)} Rewbs**\nBrasões: **${ficha.torre.brasoesNecessarios.join(', ')}**`+`\`\`\`${txtTorre}\`\`\``)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            .setTimestamp()
        const enviada  = await interaction.reply({embeds:[msg], fetchReply: true});

        if(interaction.member.user != user)
            {return}

        if(ficha.rewbs < 2000 + (ficha.torre.nivel * 4000))
            {return}

        for (let i = 0; i < ficha.torre.brasoesNecessarios.length; i++) {
            const element = ficha.torre.brasoesNecessarios[i];
            if(ficha.bras.brasoes[element] < 1){return}
            ficha.bras.brasoes[element]--
        }
        
        await enviada.react('🔨');

        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '🔨'
        };

        const collector = enviada.createReactionCollector({ filter, time: (3 * 60000) });

        collector.on('collect', async() => {
            ficha.rewbs -= 2000 + (ficha.torre.nivel * 4000);
            ficha.torre.nivel++;
            const listaDeBrasoes = require('../../utils/bews/listaDeBrasoes');
            ficha.torre.atacado = false;
            ficha.torre.brasoesNecessarios = []
            for (let i = 0; i < ficha.torre.nivel + 1; i++) {
                ficha.torre.brasoesNecessarios.push(await listaDeBrasoes('roletar')[5]);
            }
            txtTorre = `
      [|>>>
       |
_ _   _|_   _ _
||;|_| ; |_|;||
\\\\.       . //
 \\\\:     . //
 (||:    :||)
  ||:.    ||
  ||:.    ||
`
            for (let i = 0; i < ficha.torre.nivel - 1; i++) {
                const baseTorre = `  ||:   . || 
  ||:.    ||
`
                txtTorre = txtTorre + baseTorre;
            }

            await updateUser(interaction.db, ficha);
            msg = new MessageEmbed()
                .setTitle('Torre')
                .setColor(0x700000)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Nivel: ${ficha.torre.nivel}**\n`+
                `${txtAtaque}\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nA torre está te rendendo **${5 + (ficha.torre.nivel - 1)* 3}%**` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                `Requisitos para a melhoria:\n**${2000 + (ficha.torre.nivel * 4000)} Rewbs**\nBrasões: **${ficha.torre.brasoesNecessarios.join(', ')}**`+`\`\`\`${txtTorre}\`\`\``)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                .setTimestamp()
            enviada.edit({embeds: [msg]});
            
            collector.stop();
        })
        collector.on('end', async() => {
            enviada.reactions.removeAll().catch(() => {});
        })

    }

    contruir = async(interaction, ficha) =>{
        
        if(ficha.rewbs < 2000){
            interaction.reply({content: `Para contruir uma torre é preciso pagar **2000** Rewbs.`, ephemeral: true});    
            return
        }
        let atacante = ''
        if(ficha.torre){
            atacante = `\n***Sua torre foi destruída por <@${ficha.torre.atacante}>***\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`
        }
        let msg = new MessageEmbed()
            .setTitle('Contruir uma torre!')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `Para construir uma torre é preciso **2000** Rewbs.\nVocê tem certeza que quer completar essa compra?`
            + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**${atacante}`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        const enviada = await interaction.reply({ embeds: [msg], fetchReply: true });
    
        await enviada.react('🔨');
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '🔨'
        };

        const collector = enviada.createReactionCollector({ filter, time: ( 3 * 60000) });

        collector.on('collect', async() => {
            
            const listaDeBrasoes = require('../../utils/bews/listaDeBrasoes')
            const torreBrasoes = listaDeBrasoes('gerar');
            ficha.torre = {
                nivel: 1,
                tempoDeAtaque: new Date(),
                brasoesNecessarios:[torreBrasoes[1], torreBrasoes[2]],
                atacado: false,
                atacante: null,
                ataquesVencidos: 0
            }

            ficha.rewbs -= 2000;

            await updateUser(interaction.db, ficha);
            const txtTorre = `
      [|>>>
       |
_ _   _|_   _ _
||;|_| ; |_|;||
\\\\.       . //
 \\\\:     . //
 (||:    :||)
  ||:.    ||
  ||:.    ||
`
            msg = new MessageEmbed()
                .setTitle('Torre')
                .setColor(0x700000)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n**Nivel: ${ficha.torre.nivel}**\n`+
                `Você já pode fazer um ataque!\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nA torre está te rendendo **${5 + (ficha.torre.nivel - 1)* 3}%**` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
                `Requisitos para a melhoria:\n**6000 Rewbs**\nBrasões: **${ficha.torre.brasoesNecessarios.join(', ')}**`+`\`\`\`${txtTorre}\`\`\``)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                .setTimestamp()
            enviada.edit({embeds: [msg]});
            
            collector.stop();
        })
        collector.on('end', async() => {
            enviada.reactions.removeAll().catch(() => {});
        })
    }
}