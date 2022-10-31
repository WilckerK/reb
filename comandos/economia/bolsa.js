const { MessageEmbed } = require('discord.js');
const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');
const listaDeChannels = require('../../utils/listaDeChannels');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'bolsa' ,
            desc: 'Abre a bolsa de valores da Rebewllion.',
            requireDatabase: true,
            options: [
                {
                    name: 'acao',
                    type:'STRING',
                    description: 'Quer comprar ou vender?',
                    required: false,
                    choices: [
                        {
                            name: 'Comprar',
                            value: 'Comprar'
                        },
                        {
                            name: 'Vender',
                            value: 'Vender'
                        }
                    ]
                },{
                    name: 'fundo',
                    type:'STRING',
                    description: 'Qual fundo você quer comprar?',
                    required: false,
                    choices: [
                        {
                            name: 'GRL10',
                            value: 'GRL10'
                        },
                        {
                            name: 'ANI86',
                            value: 'ANI86'
                        },
                        {
                            name: 'GMS43',
                            value: 'GMS43'
                        },
                        {
                            name: 'FLM94',
                            value: 'FLM94'
                        },
                        {
                            name: 'ESP16',
                            value: 'ESP16'
                        },
                        {
                            name: 'MMB69',
                            value: 'MMB69'
                        },
                        {
                            name: 'PUB23',
                            value: 'PUB23'
                        },
                        {
                            name: 'PRS75',
                            value: 'PRS75'
                        },
                    ]
                },
                {
                    name: 'quantidade',
                    type:'INTEGER',
                    description: 'Quantos?',
                    required: false
                },
            ]
        })
    }

    run = async(interaction) => {
        const fundos = await interaction.db.collection("fundos");
        let valores = [];
        let contar = 0;
        for (const channel of listaDeChannels){
            contar++;
            if(channel === "972932688728174605" || channel === "01")
                {continue}
            const channelObjeto = await fundos.findOne({_id : `${channel}`});
            const frase = (channelObjeto.balance > 100)
            ?`↗️ O valor aumentou em ${channelObjeto.balance - 100}% \n`
            :(100 - channelObjeto.balance == 0)?`⏺ O valor se manteve o mesmo \n`:
            `↘️ O valor diminuiu em ${100 - channelObjeto.balance}% \n`;

            valores.push([channelObjeto.valor, frase]);
            if(contar === listaDeChannels.length)
                {this.executar(interaction, valores)}
        }

    }

    executar = async(interaction, valores) =>{
        
        const acao = interaction.options.getString('acao');
        const fundo = interaction.options.getString('fundo');
        const quantidade = interaction.options.getInteger('quantidade');

        if(!acao && !fundo && !quantidade){
            const embed = new MessageEmbed()
                .setTitle('Bolsa de Valores')
                .setTimestamp()
                .setColor(0x700000)
                .setDescription(
                    `**Valores das Ações:**`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n`+
`**•GRL10 (Geral): ${valores[0][0]} Rewbs**
${valores[0][1]}
**•ANI86 (Animangá): ${valores[1][0]} Rewbs**
${valores[1][1]}
**•GMS43 (Games): ${valores[2][0]} Rewbs**
${valores[2][1]}
**•FLM94 (Filmes): ${valores[3][0]} Rewbs**
${valores[3][1]}
**•ESP16 (Esportes): ${valores[4][0]} Rewbs**
${valores[4][1]}
**•MMB69 (Membros): ${valores[5][0]} Rewbs**
${valores[5][1]}
**•PUB23 (Bar): ${valores[6][0]} Rewbs**
${valores[6][1]}
**•PRS75 (Prisão): ${valores[7][0]} Rewbs**
${valores[7][1]}` + 
`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            await interaction.reply({ embeds: [embed] })
    
        }else{
            if(!acao){
                await interaction.reply({ content: `Você precisa informar se precisa comprar ou vender.`, ephemeral: true});
                return
            }

            if(!fundo){
                await interaction.reply({ content: `Você precisa colocar qual fundo deseja comprar ou vender.`, ephemeral: true});
                return
            }

            if(!quantidade){
                await interaction.reply({ content: `Você precisa colocar uma quantidade, sobre aquilo que você quer comprar ou vender.`, ephemeral: true});
                return
            }
                let preco;
            switch(fundo){
                case 'GRL10':preco = valores[0][0] * quantidade;
                    break;
                case 'ANI86':preco = valores[1][0] * quantidade;
                    break;
                case 'GMS43':preco = valores[2][0] * quantidade;
                    break;
                case 'FLM94':preco = valores[3][0] * quantidade;
                    break;
                case 'ESP16':preco = valores[4][0] * quantidade;
                    break;
                case 'MMB69':preco = valores[5][0] * quantidade;
                    break;
                case 'PUB23':preco = valores[6][0] * quantidade;
                    break;
                case 'PRS75':preco = valores[7][0] * quantidade;
                    break;
                default:return;
            }

            let ficha = await checkUser(interaction.db, interaction.member.id);
            let index;
            for(const x of ficha.fundos){
                if(x.nome == fundo){
                    index = ficha.fundos.indexOf(x)
                    break;
                }
            }

            let txt;

            if(acao === 'Comprar'){
                if(ficha.rewbs < preco){
                    await interaction.reply({ content: `Você não tem rewbs o bastante para comprar essa quantidade.`, ephemeral: true});
                    return
                }
                if(ficha.fundos[index].qtd + quantidade > 500){
                    await interaction.reply({ content: `Você não pode comprar mais de 500 ações do mesmo fundo.`, ephemeral: true});
                    return
                }

                ficha.rewbs -= preco;
                ficha.fundos[index].qtd += quantidade;
                txt = '💰 Parabéns você comprou **' + quantidade + '** de ações do **' + fundo + '**!!! 💰 \n' + 
                `Você investiu **${preco} Rewbs**!\n`

            }else if(acao === 'Vender'){
                if(ficha.fundos[index].qtd < quantidade){
                    await interaction.reply({ content: `Você não tem essa quantidade de fundos para vender.`, ephemeral: true});
                    return
                }

                ficha.rewbs += preco;
                ficha.fundos[index].qtd -= quantidade;
                txt = '💰 Parabéns você vendeu **' + quantidade + '** de ações do **' + fundo + '**!!! 💰\n' + 
                `Você faturou **${preco} Rewbs**!\n`

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
                .setTitle('Bolsa')
                .setColor(0x700000)
                .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n${txt}`)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
            interaction.reply({embeds: [msg]});

        }
    }
}
