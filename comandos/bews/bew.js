const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'bew' ,
            desc: 'Te mostra as informações de um bew.',
            options: [
                {
                    name: 'nome',
                    type:'STRING',
                    description: 'Qual o nome do bew?',
                    required: true
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);

        if (ficha.bews.length <= 1){
            interaction.reply({content: 'Você ainda não tem nenhum bew.', ephemeral: true});
            return
        }
        let indexBew;
        let bewDoUser = ficha.bews.find((currObj, index) => {
            if(currObj > 0){return}
            if(currObj.nome.toLowerCase() === interaction.options.getString('nome').toLowerCase()){
                indexBew = index;
            }
            return currObj.nome.toLowerCase() === interaction.options.getString('nome').toLowerCase()
        });

        if(!bewDoUser){
            interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }
        const bewDB = await interaction.db.collection('bews');
        let bew = await bewDB.findOne({"_id": bewDoUser.bewId});
        
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
        
        const {MessageEmbed} = require('discord.js');
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
                {name: 'Status:', value: `**ATQ: **__${bew.status.ATQ}__ // **VEL: **__${bew.status.VEL}__ // **ACE: **__${bew.status.ACE}__ // **RES: **__${bew.status.RES}__`}
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

        await message.react('⏪')
        await message.react('⏩')
        const filter = (reaction, user) => {
            return user.id == interaction.member.id && (reaction.emoji.name === '⏪' || reaction.emoji.name === '⏩')
        };

        const collector = message.createReactionCollector({ filter, time: ( 3 * 60000) });

        collector.on('collect', async(reaction) => {
            await reaction.users.remove(interaction.member.id).catch(() =>{})
            switch(reaction.emoji.name){
                case'⏪':
                    if(indexBew == 1){indexBew = ficha.bews.length}
                    indexBew--;
                break;
                case'⏩': 
                    if(indexBew == ficha.bews.length - 1){indexBew = 0}
                    indexBew++;
                break;
            }

            bewDoUser = ficha.bews[indexBew];
            bew = await bewDB.findOne({"_id": bewDoUser.bewId});
        
            colora = ''
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
            txtFelicidade = (bew.felicidade == 100)?`${bew.nome} está no ápice da felicidade.`:
                (bew.felicidade >= 70)?`${bew.nome} é muito feliz de ser seu amigo.`:
                (bew.felicidade >= 40)?`${bew.nome} está satisfeito com a vida.`:
                (bew.felicidade >= 25)?`${bew.nome} está começando a ficar triste com você.`:
                (bew.felicidade >= 10)?`${bew.nome} está pensando em fugir porque você não o dá atenção.`:
                `${bew.nome} está montando as malas para ir embora.`;

            let brasDoBew = brasData('get',bew.bras[1],bew.bras[2]);
            let habsDoBew = (bew.habs[0] != 0)?habsData('getNome', bew.habs):'Sem habilidades';
            let equipDoBew = (!bew.equip)?`${bew.nome} não carrega um equipamento.`:'';

            msg = new MessageEmbed()
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
                    {name: 'Status:', value: `**ATQ: **__${bew.status.ATQ}__ // **VEL: **__${bew.status.VEL}__ // **ACE: **__${bew.status.ACE}__ // **RES: **__${bew.status.RES}__`}
                )
                .setImage(bew.link)
                .setFooter({text: bew._id});
            await message.edit({embeds: [msg], fetchReply: true});
            for (let i = 0; i < 3; i++) {
                if(message.attachments|| message.embeds[0].url || message.embeds[0].image){break;}
                else{
                    msg.setImage(bew.link);
                    await message.edit({embeds: [msg], fetchReply: true})
                }
            }
        })
        collector.on('end', async() => {
            message.reactions.removeAll().catch(() => {});
        })
    }
}