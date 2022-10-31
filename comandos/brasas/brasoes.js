const { MessageEmbed} = require('discord.js');
const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'brasoes' ,
            desc: 'Lista dos seus brasoes coletados.',
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Qual membro?',
                    required: false
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        let user = interaction.options.getUser('user') || interaction.member.user;
        if(user.bot){
            interaction.reply({content: 'Marque apenas usuários humanos por favor.', ephemeral: true});
            return
        }
        let frase = Math.ceil(Math.random() * 4); let ativo = 1;
        frase = (frase == 1)?'O ardor de cada chama acendida, viverá na \nlembrança das cinzas...':
                (frase == 2)?'Aqui se tem as brasas de cada faísca da Rebewllion...':
                (frase == 3)?'Enquanto houver um de nós, a Rebewllion vai \narder com a chama da vitória...':
                'O fogo queima a memória de dias ardentes...'

        const ficha = await checkUser(interaction.db, user.id);
        if(!ficha.bras){
            ficha.bras = {
                roletas: 4,
                roletasMax: 4,
                brasoes:{
                    RE: 0,EP: 0,MU: 0,EN: 0,SO: 0,BO: 0,LI: 0,FE: 0,RO: 0,CA: 0,MI: 0,ET: 0,NU: 0,CI: 0,FO: 0,AN: 0,
                },
                brasas:[],
                pego: false
            }
        }

        let txt = `**👑[RE]**: \`${ficha.bras.brasoes.RE}\`  //  **⚔️[EP]**: \`${ficha.bras.brasoes.EP}\`\n` +
            `**🎵[MU]**: \`${ficha.bras.brasoes.MU}\`  //  **⚙️[EN]**: \`${ficha.bras.brasoes.EN}\`\n` +
            `**🙂[SO]**: \`${ficha.bras.brasoes.SO}\`  //  **💚[BO]**: \`${ficha.bras.brasoes.BO}\`\n` +
            `**📙[LI]**: \`${ficha.bras.brasoes.LI}\`  //  **🐾[FE]**: \`${ficha.bras.brasoes.FE}\`\n` +
            `**🌹[RO]**: \`${ficha.bras.brasoes.RO}\`  //  **⚗️[CA]**: \`${ficha.bras.brasoes.CA}\`\n` +
            `**🌑[MI]**: \`${ficha.bras.brasoes.MI}\`  //  **🌟[ET]**: \`${ficha.bras.brasoes.ET}\`\n` +
            `**☁️[NU]**: \`${ficha.bras.brasoes.NU}\`  //  **📱[CI]**: \`${ficha.bras.brasoes.CI}\`\n` +
            `**💰[FO]**: \`${ficha.bras.brasoes.FO}\`  //  **⏳[AN]**: \`${ficha.bras.brasoes.AN}\`\n`;

        let msg = new MessageEmbed()
            .setTitle('Brasões')
            .setColor(0x700000)
            .setThumbnail(user.displayAvatarURL({format: "png"}))
            .setDescription(`*${frase}*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txt}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})

        const enviada = await interaction.reply({embeds: [msg], fetchReply: true});
        await enviada.react('⏩')
    
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name == '⏩';
        };
    
        const collector = enviada.createReactionCollector({ filter, time: ( 3 * 60000) });
    
        collector.on('collect', async(i) => {
            await i.users.remove(interaction.member.id).catch(() =>{})
            txt = ''; let titulo = '';

            if(ativo == 1){titulo = 'Brasas Acendidas';
                if(ficha.bras.brasas.length > 0){txt = `**${ficha.bras.brasas.join(', ')}**\n`;}
                else{txt = 'Você ainda não acendeu nenhuma brasa.\n'; }
                ativo = 2;
            }else if (ativo == 2){
                titulo = 'Seus Brasões';
                txt = `**👑[RE]**: \`${ficha.bras.brasoes.RE}\`  //  **⚔️[EP]**: \`${ficha.bras.brasoes.EP}\`\n` +
                    `**🎵[MU]**: \`${ficha.bras.brasoes.MU}\`  //  **⚙️[EN]**: \`${ficha.bras.brasoes.EN}\`\n` +
                    `**🙂[SO]**: \`${ficha.bras.brasoes.SO}\`  //  **💚[BO]**: \`${ficha.bras.brasoes.BO}\`\n` +
                    `**📙[LI]**: \`${ficha.bras.brasoes.LI}\`  //  **🐾[FE]**: \`${ficha.bras.brasoes.FE}\`\n` +
                    `**🌹[RO]**: \`${ficha.bras.brasoes.RO}\`  //  **⚗️[CA]**: \`${ficha.bras.brasoes.CA}\`\n` +
                    `**🌑[MI]**: \`${ficha.bras.brasoes.MI}\`  //  **🌟[ET]**: \`${ficha.bras.brasoes.ET}\`\n` +
                    `**☁️[NU]**: \`${ficha.bras.brasoes.NU}\`  //  **📱[CI]**: \`${ficha.bras.brasoes.CI}\`\n` +
                    `**💰[FO]**: \`${ficha.bras.brasoes.FO}\`  //  **⏳[AN]**: \`${ficha.bras.brasoes.AN}\`\n` ;
                ativo = 1;
            }
            
            msg = new MessageEmbed()
                .setTitle(titulo)
                .setColor(0x700000)
                .setThumbnail(interaction.member.user.displayAvatarURL({format: "png"}))
                .setDescription(`*${frase}*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txt}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            await enviada.edit({embeds: [msg]});
        })
        collector.on('end', async(collected, reason) => {
            if (reason === 'time'){}
        })
    }
}
/*
**👑[RE]**: \`${ficha.bras.brasoes.RE}\`  //  **⚔️[EP]**: \`${ficha.bras.brasoes.EP}\`
**🎵[MU]**: \`${ficha.bras.brasoes.MU}\`  //  **⚙️[EN]**: \`${ficha.bras.brasoes.EN}\`
**🙂[SO]**: \`${ficha.bras.brasoes.SO}\`  //  **💚[BO]**: \`${ficha.bras.brasoes.BO}\`
**📙[LI]**: \`${ficha.bras.brasoes.LI}\`  //  **🐾[FE]**: \`${ficha.bras.brasoes.FE}\`
**🌹[RO]**: \`${ficha.bras.brasoes.RO}\`  //  **⚗️[CA]**: \`${ficha.bras.brasoes.CA}\`
**🌑[MI]**: \`${ficha.bras.brasoes.MI}\`  //  **🌟[ET]**: \`${ficha.bras.brasoes.ET}\`
**☁️[NU]**: \`${ficha.bras.brasoes.NU}\`  //  **📱[CI]**: \`${ficha.bras.brasoes.CI}\`
**💰[FO]**: \`${ficha.bras.brasoes.FO}\`  //  **⏳[AN]**: \`${ficha.bras.brasoes.AN}\`
*/