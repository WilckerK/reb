const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'pagar' ,
            desc: 'Realiza pagamento para outro usuário.',
            requireDatabase: true,
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Quem deseja pagar?',
                    required: true
                },
                
                {
                    name: 'quantia',
                    type:'INTEGER',
                    description: 'Quanto vai pagar?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const userA = interaction.member.id;
        const userB = (interaction.options.getUser('user')).id;
        if(userA === userB){
            interaction.reply({content: 'Você não pode efetuar um pagamento para si mesmo. Procure tratamento médico, isso pode ser TDI.', ephemeral: true})
            return
        }

        const quantia = interaction.options.getInteger('quantia');
        const fichaA = await checkUser(interaction.db, userA);

        if(fichaA.rewbs < quantia){
            interaction.reply({content: 'Você não tem esse dinheiro para pagar.', ephemeral: true})
            return
        }

        fichaA.rewbs -= quantia;

        const fichaB = await checkUser(interaction.db, userB);
        fichaB.rewbs += quantia;
        await updateUser(interaction.db,  fichaA);
        await updateUser(interaction.db,  fichaB, interaction.channel);

        const {MessageEmbed} = require('discord.js');
        const msg = new MessageEmbed()
            .setTitle('Pagamento em Rewbs!')
            .setColor(0x700000)
            .setDescription(`**Boleto:**\n<@${userA}> acaba de pagar para <@${userB}>.\n**Rewbs Transferidos** ~> **${quantia}**`+`\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` +
            `**<@${userA}> Rewbs:** \`${fichaA.rewbs}\`\n**<@${userB}> Rewbs:** \`${fichaB.rewbs}\`` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
        await interaction.reply({embeds: [msg]});

        const felicidade = require('../../utils/bews/editar/felicidade');
        await felicidade(interaction.db, this.client)
    }
}