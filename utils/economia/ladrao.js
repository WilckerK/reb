const updateUser = require('../updateUser');
module.exports = async(message, client) =>{
    try {
	    const checkUser = require('../checkUser');
	    const ficha = await checkUser(client.db, message.author.id);
	    if(ficha.rewbs <= 300)
	        {return}
	
	    const valor = Math.ceil(ficha.rewbs / 10);
	    ficha.rewbs -= valor;
	    await updateUser(client.db, ficha);     
	
	    const {MessageEmbed} = require('discord.js');
	    let msg = new MessageEmbed()
	        .setColor(0x000070)
	        .setDescription('**Ladrão: **' +`Um ladrão acaba de levar ${valor} de você. Pode tentar enviar um Bew atrás dele.`)
	    const enviada = await message.reply({embeds: [msg], fetchReply: true})
	    
	    const filter = m => !m.author.bot && m.content.length < 8 && m.content.length > 2 && m.author.id == ficha._id;
	    const collector = await message.channel.createMessageCollector({ filter, time: 60000 });
	
	    collector.on('collect', async(m) =>{
	
	        try{let bewDoUser = ficha.bews.filter((element) =>{
	            if(!element.nome)
	                {return}
	            return element.nome.toLowerCase() == m.content.toLowerCase()
	        })
	        if(!bewDoUser)
	            {return}
	        bewDoUser = bewDoUser[0];
	
	        const bewDB = await client.db.collection('bews');
	        const bew = await bewDB.findOne({"_id": bewDoUser.bewId});
	
	        if(Math.ceil(Math.random() * 30) <= bew.status.VEL){
	            await collector.stop('pego');
	            const fulano = await checkUser(client.db, ficha._id)
	            fulano.rewbs += valor;
	            await updateUser(client.db, fulano)
	        }else{
	            await collector.stop('fracasso')
	        }}catch(err){}
	    })
	    collector.on('end', async(collected, reason) => {
	        if (reason === 'time'){
	            msg = new MessageEmbed()
	                .setColor(0x000070)
	                .setDescription('**Ladrão:**' +` O ladrão conseguiu fugir com o seu dinheiro.`)
	        }else if(reason === 'pego'){
	            msg = new MessageEmbed()
	                .setColor(0x700000)
	                .setDescription('**Ladrão:**' +` O seu Bew conseguiu recuperar seu dinheiro.`)
	        }else if(reason === 'fracasso'){
	            msg = new MessageEmbed()
	                .setColor(0x000070)
	                .setDescription('**Ladrão:**' +` O seu Bew não alcançou o ladrão.`)
	        }
	        await enviada.edit({embeds: [msg]});
	    })
    } catch (err) {}
}