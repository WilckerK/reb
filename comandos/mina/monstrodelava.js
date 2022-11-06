const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'monstrodelava' ,
            desc: 'Oferece carvões para o monstro.',
            requireDatabase: true,
            options: [
                {
                    name: 'quantidade',
                    type:'INTEGER',
                    description: 'Quantos carvões vai oferecer?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const quantidade = interaction.options.getInteger('quantidade');
        const ficha = await checkUser(interaction.db, interaction.user.id);

        if(ficha.mina.carvoes < quantidade){
            await interaction.reply({ content: `Você não tem essa quantidade de carvões para vender.`, ephemeral: true});
            return
        }

        const porcentagem = Math.ceil(Math.random() * 100);
        let txt = ''
        if(porcentagem <= 50){
            ficha.mina.carvoes += Math.floor(quantidade / 2);
            txt = 'O monstro te devolveu tudo o que ofereceu mais metade.' + 
            `\nVocê ganhou ${Math.floor(quantidade / 2)} carvões.`
        }else if(porcentagem <= 60){
            ficha.mina.carvoes += quantidade;
            txt = 'O monstro te devolveu o dobro do que ofereceu.' + 
            `\nVocê ganhou ${quantidade} carvões.`
        }else if(porcentagem <= 80){
            txt = 'O monstro só te devolveu o que ofereceu.' + 
            `\nEle não se interessou pela oferta de carvões.`
        }else if(porcentagem <= 100){
            ficha.mina.carvoes -= quantidade;
            txt = 'O monstro só levou tudo o que ofereceu.' + 
            `\nVocê perdeu os ${quantidade} carvões.`
        }
        
        await updateUser(interaction.db, ficha, interaction.channel);
        txt = txt + '**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n'
        switch(Math.floor(Math.random() * (6 - 1) + 1)){
            case 1:txt = txt + '*Espero que seu dinheiro se multiplique muito.*';
                break;
            case 2:txt = txt + '*Pense bem antes de tomar qualquer decisão.*';
                break;
            case 3:txt = txt + '*Tecnincamente você pode influenciar diretamente na economia.*';
                break;
            case 4:txt = txt + '*Quem não tenta, não chega a lugar nenhum.*';
                break;
            case 5:txt = txt + '*Você pode precisar comprar um novo cofre, pois o atual pode ficar pequeno.*';
                break;
        }
        const msg = new MessageEmbed()
            .setTitle('Carvões vendidos!')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n${txt}`)
            .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1038902779948826734/Gold_Forrest_fire_monster_0cc65c60-540b-4df1-a510-8b3c1126b70d.png')
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        interaction.reply({embeds: [msg]});
    }
}