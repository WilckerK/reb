const comando = require('../../estrutura/Comando');
const gostoDosGeneros = require('../../utils/bews/gostoDosGeneros');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'alimentar' ,
            desc: 'Alimenta um dos seus bews.',
            options: [
                {
                    name: 'nome',
                    type:'STRING',
                    description: 'Qual o nome do bew?',
                    required: true
                }
            ],
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        if (ficha.bews.length <= 1){
            interaction.reply({content: 'Você ainda não tem nenhum bew.', ephemeral: true});
            return
        }

        const bewDoUser = ficha.bews.find((currObj) => {
            if(currObj > 0){return}
            return currObj.nome.toLowerCase() === interaction.options.getString('nome').toLowerCase()
        });
        if(!bewDoUser){
            interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }

        const bewDB = await interaction.db.collection('bews');
        const bew = await bewDB.findOne({"_id": bewDoUser.bewId});
        
        let colora = ''
        switch(bew.bras[0][0]){
            case 'A': //Preto
                colora = '0x000000'
                break;
            case 'B': //Branco
                colora = '0xFFFFFF'
                break;
            case 'C'://Vermelho
                colora = 'RED'
                break;
            case 'D'://Amarelo
                colora = 'YELLOW'
                break;
            case 'E'://Verde
                colora = 'GREEN'
                break;
            case 'F'://Ciano
                colora = 'AQUA'
                break;
            case 'G'://Azul
                colora = 'DARKBLUE'
                break;
            case 'H'://Lilás
                colora = 'PURPLE'
                break;
        }

        let emEstoque = []
        try{
            const gosto = Array.from(gostoDosGeneros[bew.raca[3]])
            const emEstoque = ficha.geladeira;

            let aceitaveis = [];
            for (let i = 0; i < emEstoque.length; i++) {
                const element = emEstoque[i];
                if(gosto.indexOf(element[1][0]) != -1){
                    aceitaveis.push(element)
                    continue
                }
                try{
                    if(gosto.indexOf(element[1][1]) != -1){
                        aceitaveis.push(element)
                        continue
                    }
                }catch(err){}
            }

            let txtGosto = [];
            if(gosto.indexOf('F') != -1){txtGosto.push('**Frutas**')}
            if(gosto.indexOf('C') != -1){txtGosto .push('**Carnes**')}
            if(gosto.indexOf('S') != -1){txtGosto .push('**Salgados**')}
            if(gosto.indexOf('D') != -1){txtGosto .push('**Doces**')}
            if(gosto.indexOf('B') != -1){txtGosto .push('**Bebidas**')}
            txtGosto = txtGosto.join(', ');

            let txtFelicidade = (bew.felicidade == 100)?`Está de barriga cheia.`:
                (bew.felicidade >= 70)?`Está satisfeito.`:
                (bew.felicidade >= 40)?`Começando a sentir fome.`:
                (bew.felicidade >= 25)?`Está com fome.`:
                (bew.felicidade >= 10)?`Está com muita fome.`:
                `Já está quase decido a ir embora.`;
            
            const {MessageEmbed} = require('discord.js');
            let msg = new MessageEmbed()
                .setTitle('Alimente seu Bew!')
                .setColor(colora)
                .setImage(bew.link)
                .setDescription(`${txtFelicidade}\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\nComidinhas ajudam na ***felicidade*** do seu Bew, assim fazendo ele não ter vontade de fugir.`
                + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + `Essas são as comidas que seu bew aceita comer: ${txtGosto} \n` +
                '*Os Bews se recusam a comer comidas que não gostam ou que não podem comer.*')
                .setFooter({text: bew._id});
            const enviada = await interaction.reply({embeds: [msg], fetchReply: true});
            try{
                const limite = (aceitaveis.length > 6)?6:aceitaveis.length;
                for (let i = 0; i < limite; i++) {
                    await enviada.react(aceitaveis[i][0]);
                }
            }catch(err){}

            const filter = (reaction, user) => {
                return user.id == interaction.member.id;
            };
            const collector = enviada.createReactionCollector({ filter, time: ( 2 * 60000) });

        collector.on('collect', async(reaction, user) => {
            let indexDaReacao = 0;
            for (let i = 0; i < emEstoque.length; i++) {
                if(reaction.emoji.name == emEstoque[i][0]){
                    indexDaReacao = i;
                    break;
                }
            }

            const saciez = Math.floor(emEstoque[indexDaReacao][2] / 2) + 5;

            bew.felicidade = (bew.felicidade + saciez > 100)?100:bew.felicidade + saciez;
            emEstoque[indexDaReacao][5]--;
            if(emEstoque[indexDaReacao][5] < 1){
                emEstoque.splice(indexDaReacao, 1);
            }
            const fulano = await checkUser(interaction.db, interaction.member.id);
            fulano.geladeira = emEstoque;
            await updateUser(interaction.db, fulano);
            await bewDB.updateOne({"_id": bew._id}, {$set: {"felicidade": bew.felicidade}})

            txtFelicidade = (bew.felicidade == 100)?`Está completamente feliz com você.`:
                (bew.felicidade >= 70)?`É muito feliz de ser seu amigo.`:
                (bew.felicidade >= 40)?`Está satisfeito com a vida que tem.`:
                (bew.felicidade >= 25)?`Mas ainda está meio magoado com você.`:
                (bew.felicidade >= 10)?`Mas está planejando em ir embora.`:
                `Já está quase decido a ir embora.`;

            const confirmMsg = new MessageEmbed()
                .setTitle('Alimentou o seu Bew!!!')
                .setColor(colora)
                .setDescription('\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'+`**${bew.nome}** está lhe agradecendo pela comida. `+ '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'
                + `${txtFelicidade} ~[${bew.felicidade}]` + '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n'+`Por favor, não esqueça de alimentar seus bews.`)
            await enviada.edit({embeds: [confirmMsg]});
            
            collector.stop();
        })
        collector.on('end', async(collected, reason) => {
            enviada.reactions.removeAll().catch(() => {});
        })
        }catch(err){}
    }
}