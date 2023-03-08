
require('dotenv').config()
const fs = require('fs');

module.exports = async (db, bew, client) =>{
    const jimp = require('jimp');
    const racaDoBew = await db.collection('bewsBase').findOne({_id: bew.raca[0]});

    const pers = await jimp.read(`sprites/pers/${bew.pers}.png`);
    await jimp.read(racaDoBew.link).then(async(img) => {
        img.composite(pers, racaDoBew.xy[0], racaDoBew.xy[1]);

        const cor = (bew.bras[0]).split("");
        var qtd = 0;
        switch(cor[0]){
            case 'A': //Preto
                qtd = 7 + (3 * parseInt(cor[1]));
                img.color([{ apply: 'darken', params: [qtd]}]);
                img.composite(pers, racaDoBew.xy[0], racaDoBew.xy[1]);
                break;
            case 'B': //Branco
                qtd = 7 + (3 * parseInt(cor[1]));
                img.color([{ apply: 'lighten', params: [qtd]}]);
                break;
            case 'C'://Vermelho
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'blue', params: [qtd]}, { apply: 'green', params: [qtd]}]);
                break;
            case 'D'://Amarelo
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'blue', params: [qtd]}]);
                break;
            case 'E'://Verde
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'red', params: [qtd]}, { apply: 'blue', params: [qtd]}]);
                break;
            case 'F'://Ciano
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'red', params: [qtd]}]);
                break;
            case 'G'://Azul
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'green', params: [qtd]}, { apply: 'red', params: [qtd]}]);
                break;
            case 'H'://Lilás
                qtd = (60 + (35 * parseInt(cor[1]))) * -1;
                img.color([{ apply: 'green', params: [qtd]}]);
                break;
        }
        await img.writeAsync(`cache/${bew._id}.png`, write);

        function write(){
            let writeCheck = false;
            do{
            writeSize()
        
            async function rewrite(){
                img.writeAsync(`cache/${bew._id}.png`)
                try {
                    await fs.promises.access(`cache/${bew._id}.png`);
                    writeSize()
                }catch (err) {return}
            }

            function writeSize(){
                try{
                    fs.stat(`cache/${bew._id}.png`, (err, stats) => {
                        if (err) {rewrite()}
                        else if(stats.size == 0){rewrite()}
                        else{ writeCheck = true;}
                    })
                }catch(err) {return}
            }
            }while(writeCheck == false);
        }
    });

    let checkImageUp = false;
    const { MessageAttachment, MessageEmbed} = require('discord.js');
    do{
        const channel = await client.channels.fetch('1001243468435292220') //envar para o chat de bews
        const file = new MessageAttachment(`cache/${bew._id}.png`);
        let msg = new MessageEmbed()
            .setTitle(bew._id)
            .setColor("RANDOM")
            .setImage('attachment://' + `${bew._id}.png`);
        const message = await channel.send({embeds: [msg], files: [file]});
        if(message.embeds[0].image){ // checar se realmente mandou a foto
            checkImageUp = true;
            fs.rm(`cache/${bew._id}.png`, { recursive:true }, (err) => {
                if(err){throw `${err.message}`;return;}
            })//deletar o bew do bot
            return message.embeds[0].image.url;
        }else{message.delete().catch(() => {});}
    }while(checkImageUp == false);

}
