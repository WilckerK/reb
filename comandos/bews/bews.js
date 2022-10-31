const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'bews' ,
            desc: 'Te mostra a sua caixa de bews.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);

        if (ficha.bews.length <= 1){
            interaction.reply({content: 'Você ainda não tem nenhum bew.', ephemeral: true});
            return
        }

        var listaDeBewsTopo = ''; var listaDeBewsBaixo = '';
        
        const bewDB = await interaction.db.collection('bews');
        for (let index = 1; index < ficha.bews.length; index++) {
            const element = ficha.bews[index];
            if(index <= 4){  //quatro primeiros destacados
                const bewLista = await bewDB.findOne({"_id": element.bewId});
                listaDeBewsTopo = listaDeBewsTopo + `**❯ ${index}:** ${element.nome} | *Rank: ${bewLista.rank}* | *Fel: ${bewLista.felicidade}* \n`;
            }
            else if(index != ficha.bews.length - 1){  //com barra se não for o ultimo
                listaDeBewsBaixo = listaDeBewsBaixo + `~**${index}**: ${element.nome} // `;
            }
            else{ //sem barra
                listaDeBewsBaixo = listaDeBewsBaixo + `~**${index}**: ${element.nome}`;
            }
            if(index == 4){listaDeBewsTopo = listaDeBewsTopo + `**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n`}
        }
        const imagemNumero = (ficha.bews.length > 4)?4:ficha.bews.length - 1;
        let urlBew = ficha.bews[(Math.floor(Math.random() * imagemNumero + 1))].bewId;
        urlBew = await bewDB.findOne({"_id": urlBew});
        const frase = 
            (Math.ceil(Math.random() * 4) == 4)?'**❖Lembre-se de sempre dar amor e carinho.':
            (Math.ceil(Math.random() * 3) == 3)?'**❖Seus Bews te amam e vão tentar sempre te animar.':
            (Math.ceil(Math.random() * 2) == 2)?'**❖Nunca se esqueça de cuidar bem dos seus Bews.':
                                                '**❖Não os deixe sozinhos, eles amam a sua atenção.';

        let colora = ''
        switch(urlBew.bras[0][0]){
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
        
        const {MessageEmbed} = require('discord.js');
            let msg = new MessageEmbed()
                .setTitle("Bews")
                .setColor(colora)
                .setDescription(`${frase}**\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${listaDeBewsTopo + listaDeBewsBaixo}`)
                .addFields({name: '❖Imagem', value: '```' + urlBew.nome + '```',inline: true})
                .setImage(urlBew.link);
                
        const message = await interaction.reply({embeds: [msg], fetchReply: true});
        for (let i = 0; i < 3; i++) {
            if(message.attachments|| message.embeds[0].url || message.embeds[0].image){break;}
            else{
                msg.setImage(bew.link);
                await message.edit({embeds: [msg], fetchReply: true})
            }
        }
    }
    
}

