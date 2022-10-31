const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const invocacao = require('../../utils/bews/criar/invocacao');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'cruzar' ,
            desc: 'Faz dois bews se reproduzirem. O custo é 550 rewbs.',
            requireDatabase: true, options: [
                {
                    name: 'primeiro',
                    type:'STRING',
                    description: 'Qual o nome do primeiro bew?',
                    required: true
                },
                {
                    name: 'segundo',
                    type:'STRING',
                    description: 'Qual o nome do segundo bew?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction, client) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);

        if (ficha.rewbs < 550){
            interaction.reply({content: 'Você infelizmente não tem Rewbs o suficiente.', ephemeral: true});
            return
        }

        if (ficha.bews.length - 1 == ficha.bews[0]){
            interaction.reply({content: 'Sua caixa de Bews está cheia, tente comprar mais espaço.', ephemeral: true});
            return
        }

        const bewPrimeiro = ficha.bews.find((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('primeiro').toLowerCase()
        });

        const bewSegundo = ficha.bews.find((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('segundo').toLowerCase();
        });  

        if(!bewPrimeiro || !bewSegundo){
            interaction.reply({content: 'Você errou ou não tem nenhum bew com o nome informado.', ephemeral: true});
            return
        }

        const bewDB = await interaction.db.collection('bews');
        const bewP = await bewDB.findOne({"_id": bewPrimeiro.bewId});
        const bewS = await bewDB.findOne({"_id": bewSegundo.bewId});

        if ((bewP.raca[1] === 'X' || bewS.raca[1] === 'X') || (bewP.raca[1] === 'M' && bewS.raca[1] === 'M') || (bewP.raca[1] === 'F' && bewS.raca[1] === 'F')){
            interaction.reply({content: 'Esses bews não podem reproduzir, os sexos não são compatíveis.', ephemeral: true});
            return
        }
        
        const racaDB = await interaction.db.collection('bewsBase');
        const racaDoBewP = await racaDB.findOne({"_id": bewP.raca[0]});
        const racaDoBewS = await racaDB.findOne({"_id": bewS.raca[0]});

        if(!(racaDoBewP.genero === racaDoBewS.genero)){
            interaction.reply({content: 'Esses bews não podem reproduzir, o genero das espécies não são compatíveis. Um é ' + racaDoBewP.raca + ' enquanto outro é ' + racaDoBewS.raca + '.', ephemeral: true});
            return
        }
        const racaPaiOuMae = Math.ceil(Math.random() * 2) == 1
        const bewFilho  = {_id: null,
            raca:[
                (racaPaiOuMae == 1)?bewP.raca[0]:bewS.raca[0], 
                (Math.ceil(Math.random() * 2) == 1)?'M':'F',
                (racaPaiOuMae == 1)?bewP.raca[2]:bewS.raca[2],
                (racaPaiOuMae == 1)?bewP.raca[3]:bewS.raca[3] 
            ], 
            rank: 0, 
            pers: (Math.ceil(Math.random() * 2) == 1)?bewP.pers:bewS.pers, 
            bras:[
                (Math.ceil(Math.random() * 2) == 1)?bewP.bras[0]:bewS.bras[0],
                (Math.ceil(Math.random() * 2) == 1)?bewP.bras[1]:bewS.bras[1],
                (Math.ceil(Math.random() * 2) == 1)?bewP.bras[2]:bewS.bras[2]
            ],
            habs: (Math.ceil(Math.random() * 2) == 1)?bewP.habs:bewS.habs,
            status: {
                ATQ: ((Math.ceil(Math.random() * 2) == 1)?bewP.status.ATQ:bewS.status.ATQ) - 10, 
                VEL: ((Math.ceil(Math.random() * 2) == 1)?bewP.status.VEL:bewS.status.VEL) - 10,
                ACE: ((Math.ceil(Math.random() * 2) == 1)?bewP.status.ACE:bewS.status.ACE) - 10, 
                RES: ((Math.ceil(Math.random() * 2) == 1)?bewP.status.RES:bewS.status.RES) - 80}, 
            equip: "", dono: [interaction.member.id], nome: null, link: null, felicidade: 100 }

        const {MessageEmbed} = require('discord.js');
            let msg = new MessageEmbed()
                .setTitle("Reproduzindo...")
                .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1008493498573537300/pixil-gif-drawing_2.gif');
                
        await interaction.reply({embeds: [msg], fetchReply: true}).then( async(message) =>{
            
            await invocacao(interaction.db, interaction.member.id, bewFilho, client).then( async(bew) =>{
                ficha.rewbs -= 550;
                let colora = '';
                switch(bew.bras[0][0]){
                    case 'A': //Preto
                        colora = '0x000000'
                        break;
                    case 'B': //Branco
                        colora = '0xFFFFFF'
                        break;
                    case 'C'://Vermelho
                        colora = 'RED'
                        break;
                    case 'D'://Amarelo
                        colora = 'YELLOW'
                        break;
                    case 'E'://Verde
                        colora = 'GREEN'
                        break;
                    case 'F'://Ciano
                        colora = 'AQUA'
                        break;
                    case 'G'://Azul
                        colora = 'DARKBLUE'
                        break;
                    case 'H'://Lilás
                        colora = 'PURPLE'
                        break;
                }

                const position = ficha.bews.length;
                ficha.bews.push({bewId: bew._id, nome: bew.nome, pos: position});
                await updateUser(interaction.db, ficha);
                let checkImage = false;
                msg = new MessageEmbed()
                    .setTitle(bew.nome)
                    .setColor(colora)
                    .setImage(bew.link)
                    .setDescription(`**Parabéns!!!**`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` +`Um novo bew invocado com sucesso! **Rank: ${bew.rank}**`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + 
                    `**ATQ:**${bew.status.ATQ} // **VEL:**${bew.status.VEL} // **ACE:**${bew.status.ACE} // **RES:**${bew.status.RES}`)
                    .setFooter({text: bew._id})
                    .setTimestamp()
                await message.edit({embeds: [msg]});
                for (let i = 0; i < 3; i++) {
                    if(message.attachments|| message.embeds[0].url || message.embeds[0].image){break;}
                    else{
                        msg.setImage(bew.link);
                        await message.edit({embeds: [msg], fetchReply: true})
                    }
                }
            });
        });
    }
}