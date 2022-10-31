module.exports = async(message, client) =>{
    try {
	    const db = client.db;
	    const corDaBolinha = Math.ceil(Math.random() * 100);
	    if(corDaBolinha < 34){ await message.react('🟣');
	    }else if(corDaBolinha < 58){await message.react('🔵');
	    }else if(corDaBolinha < 79){await message.react('🟢');
	    }else if(corDaBolinha < 94){await message.react('🟡');
	    }else if(corDaBolinha < 100){await message.react('🟠');
	    }else{await message.react('🔴');}
	
	    const filter = (reaction, user) => {
	        return (!user.bot && (reaction.emoji.name === '🟣' || reaction.emoji.name === '🔵' || reaction.emoji.name === '🟢'||
	        reaction.emoji.name === '🟡' || reaction.emoji.name === '🟠' || reaction.emoji.name === '🔴'))
	    };
	    const collector = message.createReactionCollector({ filter, time: ( 2 * 60000) });
	    
	    collector.on('collect', async(reaction, user) => {
	        collector.stop();
	        let valor = 0;
	        switch(reaction.emoji.name){
	            case'🟣': valor = 30;
	                break;
	            case'🔵': valor = 50;
	                break;
	            case'🟢': valor = 75;
	                break;
	            case'🟡': valor = 100;
	                break;
	            case'🟠': valor = 150;
	                break;
	            case'🔴': valor = 200;
	                break;
	        }
	
	        const checkUser = require('../checkUser');
	        const ficha = await checkUser(db, user.id);
	        ficha.rewbs += valor;
	        const updateUser = require('../updateUser');
	        await updateUser(db, ficha, message.channel);
	        const {MessageEmbed} = require('discord.js');
	        const msg = new MessageEmbed()
	            .setColor('RANDOM')
	            .setDescription(`**Drops:** <@${user.id}> achou **${valor} Rewbs!!!**`);
	        await message.channel.send({embeds: [msg]});
	    });
	
	    const felicidade = require('../bews/editar/felicidade');
	    await felicidade(db, client)
    }catch (err) {}
}