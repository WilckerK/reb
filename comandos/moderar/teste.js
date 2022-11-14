const { MessageEmbed } = require('discord.js');
const comando = require('../../estrutura/Comando');
const listaDeChannels = require('../../utils/listaDeChannels');
const presenteDoBew = require('../../utils/economia/presenteDoBew');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'teste' ,
            desc: 'Testeeee.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const client = this.client
        if(interaction.member.id == "367709212320464896"){
        const fundos = await client.db.collection("fundos");
		const painel = await fundos.findOne({"_id": "01"});
        painel.mercador = {trocas: [], tranca: ''}
		let txtMercador = '';
        const listaMercadorias = require('../../utils/economia/listaMercadorias')
		for (let i = 0; i < 5; i++) {
			const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
			await painel.mercador.trocas.push([listaMercadorias('conceder'), listaMercadorias('receber'), false])
			if(i == 3 || i == 4){
				switch(painel.mercador.trocas[i][1][1]){
					case 'Rewbs': painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3) * 500 
					break;
					case 'Brasão':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3)
					break;
					case 'Comida':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 3) + 1
					break;
					case 'Fundo':  painel.mercador.trocas[i][1][0] += Math.ceil(Math.random() * 2)
					break;
				}
				console.log(painel.mercador.trocas[i][1])
			}
			const element = painel.mercador.trocas[i];
			txtMercador = txtMercador + `**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n**Troca ${nums[i]}:** `
			switch(element[0][1]){
				case 'Carvão': txtMercador = txtMercador + `**${element[0][0]} ${element[0][1]}** por `
				break;
				case 'Brasão': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2][4]}[${element[0][2][5]}]** por `
				break;
				case 'Comida': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2][0]} ${element[0][2][3]}** por `
				break;
				case 'Fundo': txtMercador = txtMercador + `**${element[0][0]} ${element[0][2]}** por `
				break;
			}
			switch(element[1][1]){
				case 'Rewbs': txtMercador = txtMercador + `**${element[1][0]} ${element[1][1]}**\n`
				break;
				case 'Brasão': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2][4]}[${element[1][2][5]}]**\n`
				break;
				case 'Comida': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2][0]} ${element[1][2][3]}**\n`
				break;
				case 'Fundo': txtMercador = txtMercador + `**${element[1][0]} ${element[1][2]}**\n`
				break;
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
    }
}