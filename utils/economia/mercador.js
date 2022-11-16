const checkUser = require("../checkUser");
const updateUser = require("../updateUser");
const listaMercadorias = require("./listaMercadorias");

module.exports = async(client, message) =>{
    let emoji = Array.from(message.content);
    emoji = emoji.filter(item => {
        return item !== ' '
    });

    if(emoji.length != 3)
        {return}
    const fundos = client.db.collection('fundos');
    const painel = await fundos.findOne({"_id": "01"});
    const mercador = painel.mercador;
    const tranca = await fundos.findOne({"_id": mercador.tranca});
    
    let index = emoji[0]-1
    if(isNaN(index))
        {return}

    if(tranca.valuation < 3 && (index == 3 || index == 4)){
        await message.reply({content: 'Para que essa troca seja efetuada é necessário que o chat ' + `<#${mercador.tranca}> seja movimentado.`})
        return
    }
    
    const mercadoria = mercador.trocas[index];
    if(mercadoria[2] == true){
        await message.reply({content: 'Essa troca já foi realizada, somente uma pessoa e uma vez pode fazer cada troca.'})
        return
    }

    const ficha = await checkUser(client.db, message.author.id);

    switch(mercadoria[0][1]){
        case 'Carvão': 
            if(mercadoria[0][0] > ficha.mina.carvoes){
                await message.reply({content: 'Você não tem o item ou a quantidade para realizar a troca.'}); 
                return
            }
            ficha.mina.carvoes -= mercadoria[0][0];
        break;
        case 'Brasão': 
            if(mercadoria[0][0] > ficha.bras.brasoes[mercadoria[0][2][5]]){
                await message.reply({content: 'Você não tem o item ou a quantidade para realizar a troca.'}); 
                return
            }
            ficha.bras.brasoes[mercadoria[0][2][5]] -= mercadoria[0][0];
        break;
        case 'Comida': 
            const comidaNaGeladeira = ficha.geladeira.find(e => {return e[0] == mercadoria[0][2][0]});
            if(!comidaNaGeladeira){
                await message.reply({content: 'Você não tem o item ou a quantidade para realizar a troca.'}); 
                return
            }else if(mercadoria[0][0] > comidaNaGeladeira[5]){
                await message.reply({content: 'Você não tem o item ou a quantidade para realizar a troca.'}); 
                return
            }
            ficha.geladeira.find(e => {return e[0] == mercadoria[0][2][0]})[5] -= mercadoria[0][0];
        break;
        case 'Fundo':
            if(mercadoria[0][0] > ficha.fundos.find(e =>{return e.nome === mercadoria[0][2]}).qtd){
                await message.reply({content: 'Você não tem o item ou a quantidade para realizar a troca.'}); 
                return
            }
            ficha.fundos.find(e =>{return e.nome === mercadoria[0][2]}).qtd -= mercadoria[0][0];
        break;
    }
    switch(mercadoria[1][1]){
        case 'Rewbs': ficha.rewbs += mercadoria[1][0]
        break;
        case 'Brasão': ficha.bras.brasoes[mercadoria[1][2][5]] += mercadoria[1][0]
        break;
        case 'Comida': let index;
            index = ficha.geladeira.findIndex(e => {return e[0] == mercadoria[1][2][0]})
            if(index != -1){
                ficha.geladeira[index][5] += mercadoria[1][0];
            }else{
                mercadoria[1][2][5] = mercadoria[1][0]
                ficha.geladeira.push(mercadoria[1][2])
            }
        break;
        case 'Fundo': ficha.fundos.find(e =>{return e.nome === mercadoria[1][2]}).qtd += mercadoria[1][0];
        break;
    }
    await updateUser(client.db, ficha, message.channel);
    mercador.trocas[index][2] = true;
    
	await fundos.updateOne({"_id": '01' }, {$set: painel}, { upsert: true });
    
    const {MessageEmbed} = require('discord.js');
    const msg = new MessageEmbed()
        .setTitle('Troca Concluída!')
        .setColor(0x700000)
        .setDescription(`**Troca número ${emoji[0]}**:\n<@${message.author.id}> acaba de trocar com o mercador.`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` +
        `O mercador aperta sua mão e agradece pela troca. ` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n*Cada troca é única e só pode ser feita uma vez por dia \ne por um usuário.*`)
        .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
    await message.reply({embeds: [msg]});

}