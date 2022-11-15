const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');
const {MessageEmbed} = require('discord.js');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'minerador' ,
            desc: 'Te mostra as informações de um bew.',
            options: [
                {
                    name: 'nome',
                    type:'STRING',
                    description: 'Qual o nome do bew?',
                    required: false
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        let bewDoUser;
        if(ficha.mina.bewMinerador == null){
            const nomeDoBew =  interaction.options.getString('nome')
            if (!nomeDoBew){
                interaction.reply({content: 'Escreva o nome do bew que deseja deixar mineirando.', ephemeral: true});
                return
            }
            if (ficha.bews.length == 2){
                interaction.reply({content: 'Você não pode colocar o seu único bew.', ephemeral: true});
                return
            }
            bewDoUser = ficha.bews.find((currObj) => {
                if(currObj > 0){return}
                return currObj.nome.toLowerCase() === nomeDoBew.toLowerCase()
            });

            if(!bewDoUser){
                interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
                return
            }

            ficha.mina.bewMinerador = bewDoUser;
            const indexDoBew = Array.from(ficha.bews).indexOf(bewDoUser);
            ficha.bews.splice(indexDoBew, 1);
            ficha.bews[0]--;
            
            await updateUser(interaction.db, ficha);
            let msg = new MessageEmbed()
                .setTitle('Bew minerador')
                .setColor(0x101010)
                .setDescription('**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `**${bewDoUser.nome}** foi enviado para a mineradora.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `*Lembre-se sempre de checar a felicidade dele.*`)
                .setTimestamp();
            await interaction.reply({embeds:[msg]})
            return
        }else{
            bewDoUser = ficha.mina.bewMinerador;
        }
        
        const bewDB = await interaction.db.collection('bews');
        let bew = await bewDB.findOne({"_id": ficha.mina.bewMinerador.bewId});
        
        let colora = ''
        switch(bew.bras[0][0]){
            case 'A':colora = '0x000000';break;
            case 'B':colora = '0xFFFFFF';break;
            case 'C':colora = 'RED';break;
            case 'D':colora = 'YELLOW';break;
            case 'E':colora = 'GREEN';break;
            case 'F':colora = 'AQUA';break;
            case 'G':colora = 'DARKBLUE';break;
            case 'H':colora = 'PURPLE';break;
        }

        let txtFelicidade = (bew.felicidade == 100)?`${bew.nome} está no ápice da felicidade.`:
        (bew.felicidade >= 70)?`${bew.nome} é muito feliz de ser seu amigo.`:
        (bew.felicidade >= 40)?`${bew.nome} está satisfeito com a vida.`:
        (bew.felicidade >= 25)?`${bew.nome} está começando a ficar triste com você.`:
        (bew.felicidade >= 10)?`${bew.nome} está pensando em fugir porque você não o dá atenção.`:
        `${bew.nome} está montando as malas para ir embora.`;
        const persData = require('../../utils/bews/personalidades'); 
        const brasData = require('../../utils/bews/listaDeBrasoes');
        const habsData = require('../../utils/bews/habilidades');

        let brasDoBew = brasData('get',bew.bras[1],bew.bras[2]);
        let habsDoBew = (bew.habs[0] != 0)?habsData('getNome', bew.habs):'Sem habilidades';
        let equipDoBew = (!bew.equip)?`${bew.nome} não carrega um equipamento.`:'';
        let msg = new MessageEmbed()
            .setTitle(bew.nome + ' - ' + bew.raca[2])
            .setColor(colora)
            .setDescription('*'+txtFelicidade + ` ~[${bew.felicidade}]`+'*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n***Rank: ' + bew.rank +
            `***\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n***Brasões:*** \n❯ ${brasDoBew.nomes[0]} **${brasDoBew.emoji.alpha}[${bew.bras[1]}]** // ${brasDoBew.nomes[1]} **${brasDoBew.emoji.omega}[${bew.bras[2]}]**` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'
            //+ `~ ***Alpha*** (Eficaz): ${brasDoBew.emoji.alphas[0]}${brasDoBew.alpha[0]} // ${brasDoBew.emoji.alphas[1]}${brasDoBew.alpha[1]} \n *** ~Omega*** (Resiste): ${brasDoBew.emoji.omegas[0]}${brasDoBew.omega[0]} // ${brasDoBew.emoji.omegas[1]}${brasDoBew.omega[1]} \n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n`
            )
            .addFields(
                {name: 'Personalidade:', value: `- ${persData('getNome', bew.pers)} \n`, inline: true},
                {name: 'Genero:', value: '~ '+ bew.raca[3] + ` - (${bew.raca[1]})`, inline: true},
                //{name: 'Equipamento:', value:'~ '+ equipDoBew, inline: false},
                //{name: 'Habilidades:', value: `~ ${habsDoBew.join(', ')}`, inline: true},
                {name: 'Status:', value: `**ATQ: **__${bew.status.ATQ}__ // **VEL: **__${bew.status.VEL}__ // **ACE: **__${bew.status.ACE}__ // **RES: **__${bew.status.RES}__\nPra retirar o bew da mineradora aperte o emoji 🛏`}
            )
            .setImage(bew.link)
            .setFooter({text: bew._id});
        const message = await interaction.reply({embeds: [msg], fetchReply: true});
        for (let i = 0; i < 3; i++){
            if(message.attachments|| message.embeds[0].url || message.embeds[0].image){break;}
            else{
                msg.setImage(bew.link);
                await message.edit({embeds: [msg], fetchReply: true})
            }
        }

        await message.react('🛏')
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '🛏'
        };

        const collector = message.createReactionCollector({ filter, time: ( 3 * 60000) });

        collector.on('collect', async(reaction) => {
            const fulano = await checkUser(interaction.db, ficha._id);
            fulano.mina.bewMinerador = null;
            fulano.bews[0]++;
            fulano.bews.splice(1, 0, bewDoUser);
            await updateUser(interaction.db, fulano);
            collector.stop();
        })
        collector.on('end', async() => {
            msg = new MessageEmbed()
                .setTitle('Bew minerador')
                .setColor(0x101010)
                .setDescription('**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `**${bew.nome}** foi retirado da mineradora.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `*Lembre-se sempre de checar a felicidade dele.*`)
                .setTimestamp();
            await message.edit({embeds:[msg]})
            message.reactions.removeAll().catch(() => {});
        })
    }
}