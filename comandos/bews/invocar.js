const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const invocacao = require('../../utils/bews/criar/invocacao');
const updateUser = require('../../utils/updateUser');
module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'invocar' ,
            desc: 'Invoca um Bew aleatorio.',
            requireDatabase: true
        })
    }

    run = async(interaction, client) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        const custo = 200 * ficha.bews.length;

        if (ficha.rewbs < custo){
            interaction.reply({content: 'Você infelizmente não tem Rewbs o suficiente.', ephemeral: true});
            return
        }
        if (ficha.bews.length - 1 == ficha.bews[0]){
            interaction.reply({content: 'Sua caixa de Bews está cheia, tente comprar mais espaço.', ephemeral: true});
            return
        }

        const {MessageEmbed} = require('discord.js');
            let msg = new MessageEmbed()
                .setTitle("Invocando...")
                .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1008493498573537300/pixil-gif-drawing_2.gif');
                
        await interaction.reply({embeds: [msg], fetchReply: true}).then( async(message) =>{
            
            const bewVazio = {_id: null, raca: [], rank: 0, pers: null, bras:[], habs:[], status: {ATQ: null, VEL: null, ACE: null, RES: null}, equip: "", dono: [interaction.member.id], nome: null, link: null, felicidade: 100 }
            await invocacao(interaction.db, interaction.member.id, bewVazio, client).then( async(bew) =>{
                ficha.rewbs -= custo;
                let colora = '';
                switch(bew.bras[0][0]){
                    case 'A': //Preto
                        colora = '0x000000'
                        break;
                    case 'B': //Branco
                        colora = 0xFFFFFF
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

                ficha.bews.push({bewId: bew._id, nome: bew.nome, raca: bew.raca[2]});
                await updateUser(interaction.db, ficha);
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