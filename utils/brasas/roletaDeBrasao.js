const brasoes = require("../bews/listaDeBrasoes")
const checkUser = require("../checkUser");
const { MessageEmbed } = require('discord.js');

module.exports = async(message, client)=>{
try {
	const ficha = await checkUser(client.db, message.author.id);
	    if(!ficha.bras){
	        ficha.bras = {
	            roletas: 4,
	            roletasMax: 4,
	            brasoes:{
	                RE: 0,EP: 0,MU: 0,EN: 0,SO: 0,BO: 0,LI: 0,FE: 0,RO: 0,CA: 0,MI: 0,ET: 0,NU: 0,CI: 0,FO: 0,AN: 0,
	            },
	            brasas:[],
	            pego: false,
	            tempoParaRoletar: new Date(Date.UTC(2000, 01, 01))
	        }
	    }
	
	    const dataAtual = new Date()
	    if(dataAtual.getTime() < ficha.bras.tempoParaRoletar.getTime() && (ficha.bras.roletas === 0 || ficha.bras.pego === true)){
	        const diferenca = new Date(ficha.bras.tempoParaRoletar.getTime() - dataAtual.getTime());
	        message.reply({content:  `Você ainda terá que esperar ${diferenca.getUTCHours() } horas e ${diferenca.getUTCMinutes()} minutos.`, ephemeral: true});
	        return
	    }else if(dataAtual.getTime() > ficha.bras.tempoParaRoletar.getTime()){
	        dataAtual.setUTCHours(dataAtual.getUTCHours() + 3);
	        ficha.bras.tempoParaRoletar = dataAtual;
	        ficha.bras.roletasMax = 4;
	        ficha.bras.roletas = ficha.bras.roletasMax;
	        ficha.bras.pego = false;
	    }
	
	    ficha.bras.roletas--;
	    const updateUser = require("../updateUser");
	    await updateUser(client.db, ficha);
	
	    const bras = brasoes('roletar');
	    let msg = new MessageEmbed()
	        .setTitle(`${bras[0]}`)
	        .setColor(0x700000)
	        .setDescription(`**${bras[4]}[${bras[5]}]** *~ Ainda faltam ${ficha.bras.roletas} sumons.*\nVocê tem ${ficha.bras.brasoes[bras[5]]} desse brasão.\n*30 segundos para decidir.*`)
	        .setImage(bras[6])
	        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
	        .setTimestamp()
	    const enviada = await message.reply({embeds: [msg], fetchReply: true});
	    await enviada.react(bras[4]);
	
	    const filter = (reaction, user) => {
	        return reaction.emoji.name == bras[4] && !user.bot;
	    };
	
	    const collector = enviada.createReactionCollector({filter, time: (30000)});
	
	        collector.on('collect', async(reaction, user) => {
	
	            const fulano = await checkUser(client.db, user.id);
	            if(!fulano.bras){
	                fulano.bras = {
	                    roletas: 4,
	                    roletasMax: 4,
	                    brasoes:{
	                        RE: 0,EP: 0,MU: 0,EN: 0,SO: 0,BO: 0,LI: 0,FE: 0,RO: 0,CA: 0,MI: 0,ET: 0,NU: 0,CI: 0,FO: 0,AN: 0,
	                    },
	                    brasas:[],
	                    pego: false,
	                    tempoParaRoletar: new Date(Date.UTC(2000, 01, 01))
	                }
	            }
	            const dataAtualDois = new Date()
	            if(dataAtualDois.getTime() > fulano.bras.tempoParaRoletar.getTime()){
	                dataAtualDois.setUTCHours(dataAtualDois.getUTCHours() + 3);
	                fulano.bras.tempoParaRoletar = dataAtualDois;
	                fulano.bras.pego = false;
	            }
	
	            if(fulano.bras.pego == true)
	                {return}
	            
	            collector.stop('pego')
	            fulano.bras.brasoes[bras[5]]++;
	            fulano.bras.pego = true;
	            await updateUser(client.db, fulano);
	
	            msg = new MessageEmbed()
	                .setTitle(`${bras[0]} - Pego`)
	                .setColor(0x000070)
	                .setDescription(`**${bras[4]}[${bras[5]}]**\nVocê tem ${fulano.bras.brasoes[bras[5]]} desse brasão.\n*Pego por **${user.username}.***`)
	                .setImage(bras[6])
	                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/2sitgi5.gif'})
	                .setTimestamp()  
	            await enviada.edit({embeds: [msg]})
	            
	        })
	        collector.on('end', async(collected, reason) => {
	            if (reason === 'time'){}
	            if (reason === 'pego'){}
	        })
} catch (err) {}
}