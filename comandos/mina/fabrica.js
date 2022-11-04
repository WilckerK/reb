const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'fabrica' ,
            desc: 'Vende seus carvões para a fábrica.',
            requireDatabase: true,
            options: [
                {
                    name: 'quantidade',
                    type:'INTEGER',
                    description: 'Quantos carvões vai oferecer?',
                    required: false
                }
            ]
        })
    }

    valor = async(interaction, preco) => {
        const txtFrase = (Math.ceil(Math.random() * 3) == 3)?'O local faz a mineração ser mais rápida.':
        (Math.ceil(Math.random() * 2) == 2)?'A picareta te faz minerar mais por mineração':'O preço do carvão é decido pela fábrica para cada usuário em relação ao perfil.';
        
        let msg = new MessageEmbed()
            .setTitle('Fábrica')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nAqui é o local onde se vende os carvões obtidos com o comando /mina.\n` +
                `${txtFrase}\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nA fábrica irá te pagar ${preco} por carvão.\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n`)
            .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1038119160976253018/fabrica.png')
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            .setTimestamp()
        interaction.reply({embeds: [msg]});
    }

    run = async(interaction) => {
        const quantidade = interaction.options.getInteger('quantidade');
        const ficha = await checkUser(interaction.db, interaction.user.id);
        const acoes = ficha.fundos.filter((element) =>{return element.qtd != 0})
        let preco = 1 - (((ficha.bews.length - 1) / 80) - (ficha.torre.nivel / 50) - (cofre / 10) - (acoes / 20) + (ficha.mina.local / 10))
        preco = parseFloat(preco.toFixed(2))

        if(!quantidade){
            this.valor(interaction, preco);
            return
        }

        if(ficha.mina.carvoes < quantidade){
            await interaction.reply({ content: `Você não tem essa quantidade de carvões para vender.`, ephemeral: true});
            return
        }
        const valor = Math.round(preco * quantidade)
        ficha.rewbs += valor;
        ficha.mina.carvoes -= quantidade;
        txt = 'Parabéns você vendeu **' + quantidade + '** de carvões!!!\n' + 
        `Você recebeu **${valor} Rewbs**!\n`
        
        await updateUser(interaction.db, ficha, interaction.channel, interaction.channel);
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
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        interaction.reply({embeds: [msg]});
    }
}