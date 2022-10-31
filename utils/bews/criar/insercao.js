
module.exports = async(client, message) =>{
    const listaDeBase = require('../../listaDeBase');
    const db = client.db;
    let stringSeparada = message.content.split('//');


    if(message.channelId == listaDeBase[0]){ //gerando um novo bew pela bews-base
        const bewsBase = await db.collection('bewsBase');
        const generos = await bewsBase.findOne({_id:"generos"});
        
        if(!generos.array.includes(stringSeparada[1])){
            message.reply({content: 'Esse genero não existe.'})
            return
        }  // checar se o nome do genero tá certo
        
        stringSeparada[2] = parseInt(stringSeparada[2]);stringSeparada[3] = parseInt(stringSeparada[3]);// x e y para numeros
        const link = message.attachments.first().url;

        let idDoNovoBew = '';
        const existe = await bewsBase.findOne({"raca": stringSeparada[0]});
        if(!existe){
            const bewsExistentes = (await bewsBase.countDocuments()) - 1;
            idDoNovoBew = (bewsExistentes < 10)? `00${bewsExistentes}`:(bewsExistentes < 100)?`0${bewsExistentes}`:`${bewsExistentes}`;
        }else{
            idDoNovoBew = existe._id;
        }
        const info = {"_id": idDoNovoBew,"raca": stringSeparada[0], "genero": stringSeparada[1] , "xy": [(stringSeparada[2]), stringSeparada[3]], "link": link};

        const jimp = require('jimp');                           //montando a imagem do bew
        const pers = await jimp.read('sprites/pers/VIO.png');
        await jimp.read(info.link).then(img => {
            img.composite(pers, info.xy[0], info.xy[1]);
            img.write(`cache/imagemCache.png`);
        });

        avaliar(info, message.channel, client);
        
    }


    async function avaliar (info, channel, client) { //para saber se as informações estão corretas
        const {MessageEmbed, MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
        const file = new MessageAttachment('cache/imagemCache.png');
        const msg = new MessageEmbed()
            .setTitle(info._id)
            .setImage('attachment://imagemCache.png')
            .setDescription(`${Object.entries(info)} \n \nConfirma?`);

        const RowItem = new MessageActionRow().addComponents([
            new MessageButton().setStyle('PRIMARY').setLabel('APROVADO').setCustomId('A'),
            new MessageButton().setStyle('DANGER').setLabel('REPROVADO').setCustomId('R')
        ]);

        const enviada = await channel.send({ embeds: [msg], files: [file], components:[RowItem], fetchReply: true });
        const filter = (b) => b.user.id === "367709212320464896";
        const collector = enviada.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: ( 5 * 60000) });

        collector.on('collect', async(i) => {
            switch(i.customId){
                case 'A':
                    const confirmMsg = new MessageEmbed()
                        .setTitle('Aprovada')
                        .setDescription(`A inserção foi Concluida. \n${Object.entries(info)}`)
                        .setImage(info.link)
                    await enviada.channel.send({embeds: [confirmMsg]});

                    adicionarADatabase(client, info);
                break;

                case 'R':
                    const cancelMsg = new MessageEmbed()
                        .setTitle('Reprovado')
                        .setDescription(`A inserção foi cancelada. Por favor refaça a inserção`);
                    await enviada.channel.send({embeds: [cancelMsg]});
                break;
            }
            collector.stop();
            setTimeout(() => enviada.delete().catch(() => {}), 4500);
        })
        collector.on('end', async(collected, reason) => {
            if (reason === 'time'){
                const timeMsg = new MessageEmbed()
                    .setTitle('Seção Finalizada')
                    .setDescription(`Demora no tempo de resposta a ação foi cancelada.`);
                await enviada.edit({embeds: [timeMsg]});
            }
            setTimeout(() => enviada.delete().catch(() => {}), (10 * 60000));
        })
    }



    async function adicionarADatabase(client, info){
        const db = client.db;

        if(info.hasOwnProperty('raca')){
            const bewsBase = await db.collection('bewsBase');
            await bewsBase.updateOne({_id: info._id}, {$set: info}, { upsert: true });
            const channel = client.channels.cache.find(channel => channel.name == 'console')
            channel.send({content: `Novo Bew adicionado, **${info.raca}** do gênero ${info.genero} com o id **${info._id}**`, files: [info.link]})
        }
        
    }

}