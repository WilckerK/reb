const { MessageEmbed} = require('discord.js');
const comando = require('../../estrutura/Comando');
const listaDeBrasas = require('../../utils/brasas/listaDeBrasas');
const checkUser = require('../../utils/checkUser');
const { indexOf } = require('../../utils/listaDeChannels');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'brasas' ,
            desc: 'Lista de brasas.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        let frase = Math.ceil(Math.random() * 4)
        frase = (frase == 1)?'O ardor de cada chama acendida, viverá na lembrança das cinzas...':
                (frase == 2)?'Aqui se tem as brasas de cada faísca da Rebewllion...':
                (frase == 3)?'Enquanto houver um de nós, a Rebewllion vai arder com a chama da vitória...':
                'O fogo queima a memória de dias ardentes...'
        const ficha = await checkUser(interaction.db, interaction.user.id);
        let txt = ``; var inicio = 0; var fim = 7;
        for (let i = inicio; i <= fim; i++) {
            const element = listaDeBrasas[i];
            if(ficha.bras.brasas.indexOf(element[1]) != -1){txt = txt + '🔥'}
            txt = txt + `**${element[1]}** ~> \`${element[0].join(', ')}\` ~> ***\"${element[2]}\"***\n`;
        }
        let msg = new MessageEmbed()
            .setTitle('Brasas')
            .setColor(0x700000)
            .setDescription(`*${frase}*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txt}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})

        const enviada = await interaction.reply({embeds: [msg],fetchReply: true});
    
        await enviada.react('⏪')
        await enviada.react('⏩')

        const filter = (reaction, user) => {
            return user.id == interaction.member.id && (reaction.emoji.name == '⏪' || reaction.emoji.name == '⏩');
        };
    
        const collector = enviada.createReactionCollector({ filter, time: ( 3 * 60000) });
    
            collector.on('collect', async(i) => {
                await i.users.remove(interaction.member.id).catch(() =>{})
                txt = '';
                switch (i.emoji.name){
                    case'⏪':
                        if(inicio == 0){inicio = 15; fim = 20;}
                        else if(inicio == 8){inicio = 0; fim = 7;}
                        else if(inicio == 15){inicio = 8; fim = 14;}
                    break;
                    case'⏩': 
                        if(inicio == 0){inicio = 8; fim = 14;}
                        else if(inicio == 8){inicio = 15; fim = 20;}
                        else if(inicio == 15){inicio = 0; fim = 7;}
                    break;
                }

                for (let i = inicio; i <= fim; i++) {
                    const element = listaDeBrasas[i];
                    if(ficha.bras.brasas.indexOf(element[1]) != -1){txt = txt + '🔥'}
                    txt = txt + `**${element[1]}** ~> \`${element[0].join(', ')}\` ~> ***\"${element[2]}\"***\n`;
                }
                
                msg = new MessageEmbed()
                    .setTitle('Brasas')
                    .setColor(0x700000)
                    .setDescription(`*${frase}*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txt}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
                    .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                
                await enviada.edit({embeds: [msg], fetchReply:true});
            })
            collector.on('end', async(collected, reason) => {
                if (reason === 'time'){}
            })
    }
}