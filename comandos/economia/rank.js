const comando = require('../../estrutura/Comando')

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'rank' ,
            desc: 'Mostra o rank de Rewbs.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const userDB = await interaction.db.collection('users');
        const escolhidos = await userDB.find({"$and":[{"_id":{"$ne": "367709212320464896"}}, {"_id":{"$ne": "645786337282228234"}}]}).sort({rewbs: -1}).limit(7).toArray();
        var txtRank = ''; let memberIdList = [];
        await escolhidos.forEach(async(element) => {
            memberIdList.push([element._id, element.rewbs]);
        });
        async function preencher(id, index){
            await interaction.guild.members.fetch(id[0]).then((mem) =>{
                if(index == 0){
                    txtRank = txtRank + `🥇`
                }else if(index == 1){
                    txtRank = txtRank + `🥈`
                }else if(index == 2){
                    txtRank = txtRank + `🥉`
                }else{
                    txtRank = txtRank + `**${index + 1}**`
                }
                txtRank = txtRank + `❯ ${mem.user.username}: **${id[1]}**\n`

                if(index == 2){txtRank = txtRank + '**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' }
            })
        }

        const member = await interaction.guild.members.fetch(escolhidos[0]._id)

        await preencher(memberIdList[0], 0)
        await preencher(memberIdList[1], 1)
        await preencher(memberIdList[2], 2)
        await preencher(memberIdList[3], 3)
        await preencher(memberIdList[4], 4)
        await preencher(memberIdList[5], 5)
        await preencher(memberIdList[6], 6).then(async() =>{
            const {MessageEmbed} = require('discord.js');
            let msg = new MessageEmbed()
                .setTitle("Rank de Rewbs")
                .setColor(0x700000)
                .setThumbnail(member.user.displayAvatarURL({format: "png"}))
                .setDescription(`**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtRank}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                .setTimestamp()
                
        await interaction.reply({embeds: [msg]});
        })
    }
}