const { MessageEmbed } = require('discord.js');
const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'perfil' ,
            desc: 'Mostra o seu perfil ou o perfil de outra pessoa.',
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Qual membro?',
                    required: false
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        let user = interaction.options.getUser('user') || interaction.member.user;
        if(user.bot){
            interaction.reply({content: 'Marque apenas usuários humanos por favor.', ephemeral: true});
            return
        }
        
        let cargos = [];
            let member = interaction.guild.members.cache.get(user.id);
            if(member.roles.cache.has('732588871724040303')){cargos.push('MASTER')}
            else if(member.roles.cache.has('817201260071616553')){cargos.push('RAINHA')} 
            if(member.roles.cache.has('847171834838646794')){cargos.push('ENGENHEIRO')}
            if(member.roles.cache.has('764964143819915264')){cargos.push('LORD')}
            else if(member.roles.cache.has('732589718251896893')){cargos.push('ADM')}
            if(member.roles.cache.has('903602409396371506')){cargos.push('STAFF')}
            if(member.roles.cache.has('967147397232853082')){cargos.push('Nobre')}
            else if(member.roles.cache.has('816356944796975145')){cargos.push('Membro')}
            else if(member.roles.cache.has('967147345550659704')){cargos.push('Novato')}
            else if(member.roles.cache.has('821196581201772554')){cargos.push('Visitante')}
            if(member.roles.cache.has('798909343738888193')){cargos.push('Fallen Warrior')}

        const ficha = await checkUser(interaction.db, user.id);
        let geladeira = [];
        for (let i = 0; i < ficha.geladeira.length; i++) {
            if(i == 5){geladeira[4] = '**...**';break;}
            geladeira.push(`**${ficha.geladeira[i][5]}**❯${ficha.geladeira[i][0]}`);
        }
        
        let fundos = [
            ["GRL10",ficha.fundos[0].qtd], ["ANI86",ficha.fundos[1].qtd],
            ["GMS43",ficha.fundos[2].qtd], ["FLM94",ficha.fundos[3].qtd],
            ["ESP16",ficha.fundos[4].qtd], ["MMB69",ficha.fundos[5].qtd],
            ["PUB23",ficha.fundos[6].qtd], ["PRS75",ficha.fundos[7].qtd]
        ]
        let txtFundos = '';
        for (let i = 0; i < fundos.length; i++) {
            if(fundos[i][1] > 0){
                if(txtFundos.length >= 5){txtFundos = txtFundos + '/ '}
                if(txtFundos.length >= 50){txtFundos = txtFundos + '\n'}
                txtFundos = txtFundos + `**${fundos[i][0]}:** *${fundos[i][1]}*`;
            }
        }
        if(txtFundos != ''){txtFundos = '**Fundos: **\n' + txtFundos + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n';}

        let brasas = '';
        if(ficha.bras){
            if(ficha.bras.brasas.length > 0){
                const listaDeBrasas = require('../../utils/brasas/listaDeBrasas');
                brasas = '**Brasas: **' + `${ficha.bras.brasas.length}/${listaDeBrasas.length}🔥`;
            }
        }
        let torres = '';
        if(ficha.torre){
            if(ficha.torre.ataquesVencidos > 0){
                torres = `**Torres Derrubadas: ${ficha.torre.ataquesVencidos}**\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n`;
            }
        }

        let txtFrase = ficha.frase.split('');
        if(txtFrase.length > 50){
            for (let i = 45; i < ficha.frase.length; i++) {
                if(txtFrase[i] == ' '){ txtFrase[i] = '\n';break;}
        }}if(txtFrase.length > 95){
            for (let i = 90; i < ficha.frase.length; i++) {
                if(txtFrase[i] == ' '){txtFrase[i] = '\n';break;}
        }}if(txtFrase.length > 145){
            for (let i = 135; i < ficha.frase.length; i++) {
                if(txtFrase[i] == ' '){txtFrase[i] = '\n'; break;}
        }}
        
        let msg = new MessageEmbed()
            .setTitle(`${user.username} - Perfil`)
            .setColor(0x700000)
            .setThumbnail(user.displayAvatarURL({format: "png"}))
            .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `**Rewbs: ${ficha.rewbs}**\n` + `** Cargos: ${cargos.join(', ') || null}**` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' +
            `**Bews:** ${ficha.bews.length - 1} // ${brasas}\n**Geladeira:** ${geladeira.join(', ') || 'Vazia'}` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `${txtFundos}`+ `${torres}` + `${txtFrase.join('')}`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            .setTimestamp()
        interaction.reply({embeds:[msg]});
    }
}