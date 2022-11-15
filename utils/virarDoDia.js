const updateUser = require('./updateUser');
const listaDeChannels = require('./listaDeChannels');
const { MessageEmbed } = require('discord.js');

module.exports = async(client) =>{
    try {
	    const dataAtual = new Date();
	    const fundos = await client.db.collection("fundos");
	    const objetoPrincipal = await fundos.findOne({"_id" : "01"});
	    let horaDoFechamento = new Date(objetoPrincipal.fechamento);
	    if(dataAtual.getTime() >= horaDoFechamento.getTime()){ //olha se é a hr de fechar a bolsa
			dataAtual.setUTCHours(24,0,0,0);
			await fundos.updateOne({"_id" : "01"}, {$set: {fechamento: dataAtual}}, { upsert: true });
	        quitanda(fundos)
	        fecharBolsa(fundos);
			mercador(fundos);
	        impostos();
	        return;
	    }
	
	async function quitanda(fundos){
	    const comidaDB = require('./economia/listaDeComidas');
	    let comidas = [];
	    while(comidas.length < 4){
	        const atual = comidaDB[Math.floor(Math.random()*comidaDB.length)]
	        if (comidas.indexOf(atual) == -1){comidas.push(atual);}
	    }
	    await fundos.updateOne({"_id" : "01"}, {$set: {comidas}}, { upsert: true });
	    const channel = await client.channels.fetch('1028704898247823501');
	    const msg = new MessageEmbed()
	    	.setTitle('Quitanda do Dia!!!')
	    	.setThumbnail(client.user.displayAvatarURL())
	    	.setColor('RANDOM')
	    	.setDescription('***~Ofertas Imperdíveis~***'+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `${comidas[0][0]} ❯ **${comidas[0][3]}** por ${comidas[0][2]} ~ (*${comidas[0][4]}*)`
	    	+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `${comidas[1][0]} ❯ **${comidas[1][3]}** por ${comidas[1][2]} ~ (*${comidas[1][4]}*)` +`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `${comidas[2][0]} ❯ **${comidas[2][3]}** por ${comidas[2][2]} ~ (*${comidas[2][4]}*)` 
	    	+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + `${comidas[3][0]} ❯ **${comidas[3][3]}** por ${comidas[3][2]} ~ (*${comidas[3][4]}*)` +`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n`+'\n*Envie o emoji correspondente para comprar a opção desejada.*\n*Compre apenas um tipo de item por vez.*\n*Você pode comprar vários do mesmo item por repetir o emoji.*')
	    	.setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
	    await channel.send({content: `<@&1031223545382043709>`, embeds: [msg]});
	    channel.setName(`『${comidas[0][0]}${comidas[1][0]}${comidas[2][0]}${comidas[3][0]}』quitanda`)
	}
	
	async function fecharBolsa(fundos){
	    listaDeChannels.forEach(async(channel) => {
	        const channelObjeto = await fundos.findOne({"_id" : channel});
	        if(!channelObjeto)   //se não tiver objeto do canal retorna
	            {return}
	
	        const valorAntigo = channelObjeto.valor || 30;
	        let valor = channelObjeto.valuation * 5;
	        valor = Math.round((((valor + valorAntigo)/2) >= 15)? Math.floor((valor + valorAntigo)/2) : 15);
	        
	        const porcentagem = Math.round((valor * 100)/valorAntigo);
	        await fundos.updateOne({"_id" : channel}, {$set: {valor: valor, valuation: 0, balance: porcentagem}}, { upsert: true });
	    });
	}

	async function mercador(fundos){
		const painel = await fundos.findOne({"_id": "01"});
		let txtMercador = '';
		const listaMercadorias = require('./economia/listaMercadorias')
		painel.mercador.trocas = [];
		for (let i = 0; i < 5; i++) {
			const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
			await painel.mercador.trocas.push([listaMercadorias('conceder'), listaMercadorias('receber'), false])
			if(i == 3 || i == 4){
				switch(painel.mercador.trocas[i][1][1]){
					case 'Rewbs': painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3) * 500 ; break;
					case 'Brasão':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3); break;
					case 'Comida':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3) + 1; break;
					case 'Fundo':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 2); break;
				}
				console.log(painel.mercador.trocas[i][1])
			}
			const element = painel.mercador.trocas[i];
			txtMercador = txtMercador + `**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n**Troca ${nums[i]}:** `
			switch(element[0][1]){
				case 'Carvão': txtMercador = txtMercador + `**${element[0][0]} ${element[0][1]}** por `; break;
				case 'Brasão': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2][4]}[${element[0][2][5]}]** por `; break;
				case 'Comida': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2][0]} ${element[0][2][3]}** por `; break;
				case 'Fundo': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2]}** por `; break;
			}
			switch(element[1][1]){
				case 'Rewbs': txtMercador = txtMercador + `**${element[1][0]} ${element[1][1]}**\n`; break;
				case 'Brasão': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2][4]}[${element[1][2][5]}]**\n`; break;
				case 'Comida': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2][0]} ${element[1][2][3]}**\n`; break;
				case 'Fundo': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2]}**\n`; break;
			}
		}

		painel.mercador.tranca = listaDeChannels[Math.floor(Math.random() * listaDeChannels.length)];
		await fundos.updateOne({"_id": '01' }, {$set: painel}, { upsert: true });
		const channel = await client.channels.fetch('1038861867310923867');
	    const msg = new MessageEmbed()
	    	.setTitle('Mercador Insano!!!')
	    	.setColor('RANDOM')
	    	.setDescription('**Trocas do dia:**\n' + `${txtMercador}` + `**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n*As duas últimas trocas só se tronam disponivéis quando o chat <#${painel.mercador.tranca}> for movimentado.*`)
            .setImage('https://cdn.discordapp.com/attachments/1008488078542917712/1041522335108317204/Gold_Forrest_insane_merchant_in_a_black_outfit_and_a_top_hat_3eff162f-173a-4a0b-a9cc-62cdece6e461.png')
	    	.setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
		await channel.send({content: `<@&1031223545382043709>`, embeds: [msg]});
	}
	
	async function impostos(){
	    cor();
	    feli();
	    torreEMina();
	    
	    async function cor(){
	        const pegarMembrosComCoresVip = async() =>{
	            const serverCache = client.guilds.cache.get("732276333429784707");
	            
	            const dourado = await serverCache.roles.cache.get('966174586267914240').members.map(m=>m.user.id);
	            const esmeralda = await serverCache.roles.cache.get('809847498696818709').members.map(m=>m.user.id);
	            const escarlate = await serverCache.roles.cache.get('809845303515414552').members.map(m=>m.user.id);
	            const cores = dourado.concat(esmeralda, escarlate);
	            return cores
	        }
	                
	        const checkUser = require('./checkUser');
	        const coresVip = await pegarMembrosComCoresVip();
	        coresVip.forEach(async(u) =>{
	            if(u == '367709212320464896'){return}
	            const user = await checkUser(client.db, u);
	            user.rewbs -= user.rewbs * 0.05;
	            await updateUser(client.db, user);
	        })
	    }
	
	    async function feli(){
	        const felicidade = require('./bews/editar/felicidade');
	        for (let i = 0; i < Math.ceil(Math.random() * 20) + 5; i++) {
	            await felicidade(client.db, client)
	        }
	        
	    }
	
	    async function torreEMina(){
	        const userDB = await client.db.collection('users');
	        const escolhidosTorre = await userDB.find({"$and":[{"torre":{"$exists" : true}},{"torre.nivel":{"$ne": 0}}]}).sort({rewbs: -1}).toArray();
	        await escolhidosTorre.forEach(async(element) => {
	            element.rewbs += element.rewbs/ 2 * ((5 + (element.torre.nivel - 1)* 3)/100)
	            await updateUser(client.db, element);
	        });

			const escolhidosMina = await userDB.find({"$and":[{"mina":{"$exists" : true}},{"mina.bewMinerador":{"$ne": null}}]}).sort({rewbs: -1}).toArray();
			await escolhidosMina.forEach(async(element) => {
	            element.mina.carvoes += (element.mina.local * element.mina.picareta * 10); 
	            await updateUser(client.db, element);
	        });
	    }
	
	}
} catch (err) {}
}