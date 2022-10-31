module.exports = async(client) =>{
    const nomesNPCs = ['Guarda','Fazendeiro','Clérigo','Mandraka','Crimson','Slay','Opal','O Chefe']

    let npcEscolhido = ''; let local = ''
    const numDoNpc = Math.ceil(Math.random() * 200);
    if(numDoNpc < 33){npcEscolhido = nomesNPCs[0]; local = 'A região';
    }else if(numDoNpc < 66){npcEscolhido = nomesNPCs[1]; local = 'A Fazenda';
    }else if(numDoNpc < 100){npcEscolhido = nomesNPCs[2]; local = 'A Igreja';
    }else if(numDoNpc < 140){npcEscolhido = nomesNPCs[3]; local = 'A boate';
    }else if(numDoNpc < 180){npcEscolhido = nomesNPCs[4]; local = 'O Castelo';
    }else if(numDoNpc < 190){npcEscolhido = nomesNPCs[5]; local = 'O Inferno';
    }else if(numDoNpc < 200){npcEscolhido = nomesNPCs[6]; local = 'O Céu';
    }else{npcEscolhido = nomesNPCs[7]; local = 'O Fim';
    }
    const numDoInimigo = Math.ceil(Math.random() * 10)
    const inimigo = (numDoInimigo == 1)?'por Bews furiosos.':
    (numDoInimigo == 2)?'pelos nossos inimigos.':
    (numDoInimigo == 3)?'por monstros.':
    (numDoInimigo == 4)?'por mortos vivos.':
    (numDoInimigo == 5)?'pelos áliens.':
    (numDoInimigo == 6)?'por dragões.':
    (numDoInimigo == 7)?'pelos gigantes.':
    (numDoInimigo == 8)?'pelos mercenários.':
    (numDoInimigo == 9)?'por divindades.':
    'pelo Chefe.';

    const numDotxtInfo = Math.ceil(Math.random() * 8)
    const txtInfo = (numDotxtInfo == 1)?`${local} está sendo atacad${local[0].toLocaleLowerCase()} ${inimigo} Precisamos que alguém nos ajude a nos proteger.`:
    (numDotxtInfo == 2)?`${local} foi invadid${local[0].toLocaleLowerCase()} ${inimigo} Vamos recuperar a ordem do lugar.`:
    (numDotxtInfo == 3)?`${local} foi atacad${local[0].toLocaleLowerCase()} ${inimigo} Iremos nos vingar e estamos procurando reforços.`:
    (numDotxtInfo == 4)?`${local} vai ser invadid${local[0].toLocaleLowerCase()} ${inimigo} Queremos apoio para estarmos preparados.`:
    (numDotxtInfo == 5)?`${local} teve uma pessoa sequestrada ${inimigo} Precisamos de alguém para o resgate.`:
    (numDotxtInfo == 6)?`${local} acaba de ter um item muito valioso furtado. Nos ajude a ir recuperar por favor.`:
    (numDotxtInfo == 7)?`${local} sofreu um terrível desastre, precisamos da sua ajuda para reconstruir o local.`:
    `${local} está precisando de pegar recursos, o seu auxílio seria de grande ajuda para nós.`;

    const requisitos = {
        txt: 'RANK: **',
        rank: (numDoNpc >= 160)? 7 + Math.floor(Math.random() * 4):Math.floor(Math.random() * 7),
        atq: (numDotxtInfo < 5)?10 + Math.floor(Math.random() * 11):(Math.ceil(Math.random() * 3) == 3)?10 + Math.floor(Math.random() * 8):0,
        res: (numDotxtInfo > 4)?80 + Math.floor(Math.random() * 41):(Math.ceil(Math.random() * 3) == 3)?80 + Math.floor(Math.random() * 23):0
    }
    requisitos.txt = requisitos.txt + requisitos.rank + '**';

    if(requisitos.atq > 0){requisitos.txt = requisitos.txt + ` // ATQ: **${requisitos.atq}**`;}
    if(requisitos.res > 0){requisitos.txt = requisitos.txt + ` // RES: **${requisitos.res}**`;}
    const custo = Math.ceil(requisitos.rank / 2) * 15;
    
    const channel = await client.channels.fetch('1028819143992025099');
    await channel.setName('『📕』missão');
    const {MessageEmbed} = require('discord.js');
    let msg = new MessageEmbed()
        .setTitle(npcEscolhido)
        .setColor(0x700000)
        .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +`${txtInfo} Envie o nome do Bew que irá enviar para a missão nesse chat.`
        + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `**Requisitos mínimos:** ${requisitos.txt}\n**~Custo: ${custo} Rewbs**\n \n` +
        '*Quanto mais forte o seu Bew for, mais chances ele tem de ser bem sucedido na missão.*')
        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
    const enviada = await channel.send({content : `<@&1031223545382043709>`, embeds: [msg], fetchReply: true})
    
    const filter = m => !m.author.bot && m.content.length < 8 && m.content.length > 2  && 
    'áéíóúàèìòùãõâêîôû.,;:/?][<)(1234567890!@#$%&*-_+="\\|'.indexOf(m.content[0].toLowerCase()) == -1;
    const collector = await channel.createMessageCollector({ filter, time: 5 * 60000 });

    collector.on('collect', async(m) =>{
        const checkUser = require('../../checkUser');
        const ficha = await checkUser(client.db, m.author.id);
        if(ficha.rewbs < custo){
            await m.reply({content: 'Você não tem Rewbs o suficiente para enviar o Bew para a missão.', ephemeral: true});
            return
        }

        let bewDoUser = ficha.bews.filter((element) =>{
            if(!element.nome)
                {return}
            return element.nome.toLowerCase() == m.content.toLowerCase()
        })
        bewDoUser = bewDoUser[0];

        if(!bewDoUser){
            await m.reply({content: 'Você não possui um Bew com esse nome.', ephemeral: true});
            return
        }
        if(ficha.bews.length == 2){
            await m.reply({content: 'Você não pode enviar o unico Bew que você tem no momento.', ephemeral: true});
            return
        }

        const bewDB = await client.db.collection('bews');
        const bew = await bewDB.findOne({"_id": bewDoUser.bewId});

        if(bew.rank < requisitos.rank || bew.status.ATQ < requisitos.atq || bew.status.RES < requisitos.res){
            await m.reply({content: 'O Bew escolhido não atende aos requisitos da missão.', ephemeral: true});
            return
        }
        if(bew.felicidade < 30){
            await m.reply({content: 'O Bew escolhido não aceita ir para a missão.', ephemeral: true});
            return
        }
        await collector.stop('pego');

        ficha.rewbs -= custo;
        bew.felicidade -= 15;
        const indexDoBew = Array.from(ficha.bews).indexOf(bewDoUser);
        ficha.bews.splice(indexDoBew, 1);
        ficha.bews[0]--;
        await bewDB.updateOne({_id: bew._id}, {$set: bew});

        if(Math.ceil(Math.random() * (requisitos.atq * 2)) <= bew.status.ATQ && Math.ceil(Math.random() * (requisitos.res * 2)) <= bew.status.RES){

            const rewbsGanhos = (requisitos.rank + 1) * Math.floor((bew.status.ACE + bew.status.VEL) / 2) + 50
            ficha.rewbs += rewbsGanhos;

            msg = new MessageEmbed()
                .setTitle('Enviado com sucesso.')
                .setColor(0x700000)
                .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `**${bew.nome}** foi e concluiu a missão. Daqui alguns minutos ele deve retornar.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `Você recebeu **${rewbsGanhos} Rewbs** pela missão.`)
                .setTimestamp();

        }else{
            msg = new MessageEmbed()
                .setTitle('Fracassou na missão.')
                .setColor(0x000070)
                .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `**${bew.nome}** partiu para a missão e falhou. Daqui alguns minutos ele deve retornar.` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `Desejo mais sorte na próxima vez.`)
                .setTimestamp();
        }

        await channel.send({embeds:[msg]})

        const updateUser = require('../../updateUser');
        await updateUser(client.db, ficha, channel);     

        setTimeout(async ()=>{
            const fulano = await checkUser(client.db, ficha._id)
            fulano.bews[0]++;
            fulano.bews.splice(indexDoBew, 0, bewDoUser);
            await updateUser(client.db, fulano)
        }, (10 * 60000))

    })
    collector.on('end', async(collected, reason) => {
        if (reason === 'time'){
            msg = new MessageEmbed()
                .setTitle(npcEscolhido + ' - FECHADO')
                .setColor(0x000070)
                .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +`${txtInfo} Envie o nome do Bew que irá enviar para a missão nesse chat.`
                + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `**Requisitos:** ${requisitos.txt}\n \n` +
                '*Quanto mais forte o seu Bew for, mais chances ele tem de ser bem sucedido na missão.*')
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/2sitgi5.gif'});
            await enviada.edit({embeds: [msg]});
        }else if(reason === 'pego'){
            msg = new MessageEmbed()
                .setTitle(npcEscolhido + ` - FEITO`)
                .setColor(0x700000)
                .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +`${txtInfo} Envie o nome do Bew que irá enviar para a missão nesse chat.`
                + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `**Requisitos:** ${requisitos.txt}\n \n` +
                '*Quanto mais forte o seu Bew for, mais chances ele tem de ser bem sucedido na missão.*')
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
            await enviada.edit({embeds: [msg]});
        }

        await channel.setName('『📘』missão');
    })

}