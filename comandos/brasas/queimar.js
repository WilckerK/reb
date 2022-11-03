const comando = require('../../estrutura/Comando');
const {MessageEmbed} = require('discord.js');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'queimar' ,
            desc: 'Queima seus brasões.',
            requireDatabase: true,
            options: [
                {
                    name: 'bras1',
                    type:'STRING',
                    description: 'Qual brasão?',
                    required: true
                },
                {
                    name: 'bras2',
                    type:'STRING',
                    description: 'Qual brasão?',
                    required: false
                },
                {
                    name: 'bras3',
                    type:'STRING',
                    description: 'Qual brasão?',
                    required: false
                },
                {
                    name: 'bras4',
                    type:'STRING',
                    description: 'Qual brasão?',
                    required: false
                },
                {
                    name: 'bras5',
                    type:'STRING',
                    description: 'Qual brasão?',
                    required: false
                }
            ]
        })
    }

    run = async(interaction) => {
        let brasAceitaveis = ['RE','EP','MU','EN','SO','BO','LI','FE','RO','CA','MI','ET','NU','CI','FO','AN']
        let brasDoCMD = [
            interaction.options.getString('bras1'),
            interaction.options.getString('bras2'),
            interaction.options.getString('bras3'),
            interaction.options.getString('bras4'),
            interaction.options.getString('bras5')
        ]

        brasDoCMD = brasDoCMD.filter((element)=>{
            return element !== null;
        })

        for (let i = 0; i < brasDoCMD.length; i++) {
            brasDoCMD[i] = brasDoCMD[i].toUpperCase();
            const element = brasDoCMD[i];
            if(brasAceitaveis.indexOf(element) === -1){
                if(element.length > 2){
                    interaction.reply({content: `Você deve escrever a sigla do brasão. Exemplo, Rei você deve enviar "RE"`, ephemeral: true});
                }else{
                    interaction.reply({content: `Você escreveu a sigla errada "${element}"`, ephemeral: true});
                }
                return
            }
        }
        
        const checkUser = require('../../utils/checkUser');
        const updateUser = require('../../utils/updateUser');
        const ficha = await checkUser(interaction.db, interaction.member.id);

        for (let i = 0; i < brasDoCMD.length; i++) {
            const element = brasDoCMD[i];
            if(ficha.bras.brasoes[element] < 1){
                interaction.reply({content: `Você não pode queimar um brasão que não tem: "${element}"`, ephemeral: true});
                return
            }else{
                ficha.bras.brasoes[element]--;
            }
        }
        let frase = Math.ceil(Math.random() * 3);
        frase = (frase == 3)?'Lembre que a ordem dos brasões deve estar \ncorreta para a brasa ser acendida.':
                (frase == 2)?'Cada brasa é baseada em algo, alguém, grupo ou \nmomento da Rebewllion.':
                'Você consegue dizer o que cada brasa significa?'

        const listaDeBrasas = require('../../utils/brasas/listaDeBrasas');
        try{
            if(!brasDoCMD[1]){throw 'fora'}

            let brasasPossiveis = listaDeBrasas.filter((element)=>{
                return element[0][0] === brasDoCMD[0]
            })
            if(!brasasPossiveis){throw 'fora'}
            let brasaEscolhida = null;

            for (let i = 0; i < brasasPossiveis.length; i++) {
                const element = brasasPossiveis[i];
                switch(element[0].length){
                    case 2: 
                        if(element[0][1] == brasDoCMD[1]){brasaEscolhida = element}
                    break;
                    case 3:
                        if(element[0][1] == brasDoCMD[1] && element[0][2] == brasDoCMD[2]){brasaEscolhida = element}
                    break;
                    case 4:
                        if(element[0][1] == brasDoCMD[1] && element[0][2] == brasDoCMD[2] && element[0][3] == brasDoCMD[3]){brasaEscolhida = element}
                    break;
                    case 5:
                        if(element[0][1] == brasDoCMD[1] && element[0][2] == brasDoCMD[2] && element[0][3] == brasDoCMD[3]  && element[0][4] == brasDoCMD[4]){brasaEscolhida = element}
                    break;
                }
            }
            
            if(brasaEscolhida == null){throw 'fora'}
            ficha.rewbs += brasaEscolhida[1];
            if(ficha.bras.brasas.indexOf(brasaEscolhida[2]) == -1){
                ficha.bras.brasas.push(brasaEscolhida[2]);
            }
            await updateUser(interaction.db, ficha);
            const msg = new MessageEmbed()
                .setTitle('Brasa Acesa!')
                .setColor(0x700000)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nVocê acendeu a brasa **${brasaEscolhida[2]}**\n`+
                `Com isso ganhou **${brasaEscolhida[1]} Rewbs.**` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'+ `*${frase}*`)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
            await interaction.reply({embeds: [msg]});

        }catch(err){
            const valor = (Math.floor(Math.random() * 26) + 30) * brasDoCMD.length;
            ficha.rewbs += valor;
            await updateUser(interaction.db, ficha, interaction.channel);

            const msg = new MessageEmbed()
                .setTitle('Queimar!')
                .setColor(0x700000)
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nQueimou o(s) brasão(ões) **${brasDoCMD.join(', ')}**\n` +
                `E ganhou **${valor} Rewbs**`+ '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'+ `*${frase}*`)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
            await interaction.reply({embeds: [msg]});
        }
    }
}