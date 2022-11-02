const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'atacartorre' ,
            desc: 'Realiza um ataque a outro usuário.',
            requireDatabase: true,
            options: [
                {
                    name: 'user',
                    type:'USER',
                    description: 'Quem deseja atacar?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const userA = interaction.member.id;
        const userB = (interaction.options.getUser('user')).id;
        if(userA === userB){
            interaction.reply({content: 'Você não pode atacar a própria torre. Procure tratamento médico, isso pode ser TDI.', ephemeral: true})
            return
        }
        const fichaA = await checkUser(interaction.db, userA);
        if(!fichaA.torre){
            interaction.reply({content: 'Para atacar outras torres você primeiro precisa ter uma.', ephemeral: true})
            return
        }else if(fichaA.torre.nivel == 0){
            interaction.reply({content: 'Para atacar outras torres você primeiro precisa ter uma.', ephemeral: true})
            return
        }

        const dataAtual = new Date();
        if(dataAtual.getTime() < fichaA.torre.tempoDeAtaque.getTime()){
            const diferenca = new Date(fichaA.torre.tempoDeAtaque.getTime() - dataAtual.getTime())
            interaction.reply({content: `Ainda faltam ${diferenca.getUTCHours()} horas e ${diferenca.getUTCMinutes()} minutos para o próximo ataque.`, ephemeral: true})
            return
        }

        const fichaB = await checkUser(interaction.db, userB);
        if(!fichaB.torre){
            interaction.reply({content: 'Essa pessoa não tem uma torre ainda.', ephemeral: true})
            return
        }else if(fichaB.torre.nivel == 0){
            interaction.reply({content: 'Essa pessoa não tem uma torre ainda.', ephemeral: true})
            return
        }
        let frase = Math.ceil(Math.random() * 3);
        frase = (frase == 3)?`Ao vencer o ataque você leva um terço dos rewbs dessa pessoa.`:
        (frase == 2)?`Quanto mais forte os seus bews, mais chances tem de ganhar.`:
        `Ao atacar uma torre você faz ela perder dois niveis.`

        const {MessageEmbed} = require('discord.js');
        let msg = new MessageEmbed()
            .setTitle('Atacar Torre!')
            .setColor(0x700000)
            .setDescription(`**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\nNivel da torre: ${fichaB.torre.nivel}` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + 
            `O ataque leva em consideração os seus 4 primeiros bews. \n*(Você pode mudar a ordem com o comando /posicao)*` + `\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\n` + 
            `${frase}\nQuanto maior o nivel, mais difícil é de vencer.\n**◇◆ ▬▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬▬ ◆◇**\nO custo do ataque é **${fichaB.torre.nivel * 200}** Rewbs`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'});
            const enviada  = await interaction.reply({embeds:[msg], fetchReply: true});

        if(fichaA.rewbs < fichaB.torre.nivel * 200)
            {return}
        if(fichaA.bews.length < 2)
            {return}
            
        await enviada.react('⚔');

        const filter = (reaction, user) => {
            return user.id == interaction.member.id && reaction.emoji.name === '⚔'
        };

        const collector = enviada.createReactionCollector({ filter, time: (3 * 60000) });

        collector.on('collect', async() => {
            let mediaRank = 0;
            for (let i = 0; i < 4; i++) {
                try{
                    const element = fichaA.bews[i + 1];
                    const bewDB = await interaction.db.collection('bews');
                    let bew = await bewDB.findOne({"_id": element.bewId});
                    if(bew.felicidade <= 35){            
                        interaction.reply({content: 'Seus bews estão muito famintos, para poderem ir atacar uma torre.', ephemeral: true})
                        collector.stop('time') //Time pq ai ele só retorna, gambiarra :) 
                        return
                    }
                    bew.felicidade -= 10
                    bewDB.updateOne({"_id":bew._id}, {$set: {"felicidade": bew.felicidade}});
                    mediaRank += bew.rank;
                }catch(err){}
            }

            mediaRank = Math.round(mediaRank/4);
            if(Math.ceil(Math.random() * (10 + fichaB.torre.nivel * 2)) <= mediaRank){
                collector.stop('Venceu')
            }else{
                collector.stop('Perdeu')
            }
        })
        collector.on('end', async(collected, reason) => {
            enviada.reactions.removeAll().catch(() => {});
            if(reason === 'time')
                {return}
            fichaA.rewbs -= fichaB.torre.nivel * 200;
            dataAtual.setUTCHours(dataAtual.getUTCHours() + 2);
            fichaA.torre.tempoDeAtaque = dataAtual;
            if(reason === 'Venceu'){
                fichaB.torre.nivel = (fichaB.torre.nivel - 2 <= 0)?0:fichaB.torre.nivel - 2;
                const valorPegue = Math.ceil(fichaB.rewbs/4);
                fichaB.rewbs -= valorPegue;
                fichaB.torre.atacado = true;
                fichaB.torre.atacante = fichaA._id;
                fichaA.rewbs += valorPegue;
                fichaA.torre.ataquesVencidos++;

                msg = new MessageEmbed()
                .setTitle('Torre Atacada')
                .setColor(0x700000)
                .setDescription('**Vitória!!!**' + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `Você **derrubou** a torre de <@${fichaB._id}> e venceu.\nNão se esqueça de dedicar essa vitória aos seus bews!!!`+
                '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `Você levou **${valorPegue} Rewbs** dessa pessoa.\n*Não se esqueça que ela pode tentar se **vingar***` +'\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**')
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
                .setTimestamp();

                await updateUser(interaction.db,  fichaB);
            }
            else if(reason === 'Perdeu'){
                msg = new MessageEmbed()
                .setTitle('Torre Atacada')
                .setColor(0x000070)
                .setDescription('**Derrota...**' + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `Você atacou a torre de <@${fichaB._id}> e perdeu.\nInfelizmente não foi dessa vez...`+
                '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `Tente voltar com bews mais fortes.\n*Não se esqueça que a pessoa pode tentar se vingar*` +'\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**')
                .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/2sitgi5.gif'})
                .setTimestamp()  
            }

            await updateUser(interaction.db,  fichaA, interaction.channel);

            await enviada.edit({embeds: [msg]});
        })
    }
}