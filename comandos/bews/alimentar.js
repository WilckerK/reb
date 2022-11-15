const comando = require('../../estrutura/Comando');
const gostoDosGeneros = require('../../utils/bews/gostoDosGeneros');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');
const {MessageEmbed} = require('discord.js');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'alimentar' ,
            desc: 'Alimenta seus bews.',
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
    set saciez(int){this._saciez = Math.floor(int / 2) + 5}
    get saciez() {return this._saciez}

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
            if(interaction.options.getString('nome').toLowerCase() == 'todos'){this.todos(interaction, ficha); return}
            interaction.reply({content: 'Você não tem nenhum bew com esse nome.', ephemeral: true});
            return
        }

        const bewDB = await interaction.db.collection('bews');
        const bew = await bewDB.findOne({"_id": bewDoUser.bewId});
        
        let colora = ''
        switch(bew.bras[0][0]){
            case 'A':colora = '0x000000';break;
            case 'B':colora = '0xFFFFFF';break;
            case 'C':colora = 'RED';break;
            case 'D':colora = 'YELLOW';break;
            case 'E':colora = 'GREEN';break;
            case 'F':colora = 'AQUA';break;
            case 'G':colora = 'DARKBLUE';break;
            case 'H':colora = 'PURPLE';break;
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
                const limite = (aceitaveis.length > 5)?5:aceitaveis.length;
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

            this.saciez = emEstoque[indexDaReacao][2];
            bew.felicidade = (bew.felicidade + this.saciez > 100)?100:bew.felicidade + this.saciez;

            emEstoque[indexDaReacao][5]--;
            if(emEstoque[indexDaReacao][5] < 1){emEstoque.splice(indexDaReacao, 1);}
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

    todos = async(interaction, ficha) => {
        let txtAlimentados = '';
        const bewDB = await interaction.db.collection('bews');
        const limite = (ficha.bews.length > 15)?15:ficha.bews.length - 1;
        let colora, link = (ficha.bews.length > 4)?Math.ceil(Math.random() * 4):Math.ceil(Math.random() * ficha.bews.length);
        for (let i = 1; i < limite; i++) {
            const element = ficha.bews[i];
            const bew = await bewDB.findOne({"_id": element.bewId});
            if(link == i){link = bew.link; colora = bew.bras[0][0]}
            if(bew.felicidade === 100){
                txtAlimentados = txtAlimentados + `~[${bew.felicidade}] | **${bew.nome} já está cheio**, não comeu nada.\n`
                continue;
            }
            if(ficha.geladeira.length == 0){
                txtAlimentados = txtAlimentados + `~[${bew.felicidade}] | **${bew.nome} não se alimentou**, compre comida.\n`
                continue;
            }
            const gosto = Array.from(gostoDosGeneros[bew.raca[3]])
            let comidaIndex = await ficha.geladeira.findIndex(element => {return gosto.findIndex(e => e == element[1][0]) != -1})
            if(comidaIndex == -1){
                try{
                    comidaIndex = ficha.geladeira.findIndex(element => {return gosto.findIndex(e => e == element[1][1]) != -1})
                }
                catch(err){}
            }
            if(comidaIndex == -1){
                txtAlimentados = txtAlimentados + `~[${bew.felicidade}] | **${bew.nome} não se alimentou**, compre comida.\n`
                continue;
            }
            ficha.geladeira[comidaIndex][5]--;
            const comida = ficha.geladeira[comidaIndex];
            this.saciez = ficha.geladeira[comidaIndex][2]
            if(ficha.geladeira[comidaIndex][5] == 0){ficha.geladeira.splice(comidaIndex, 1);}
            bew.felicidade = (bew.felicidade + this.saciez > 100)?100: bew.felicidade + this.saciez;
            await bewDB.updateOne({"_id": bew._id}, {$set: {"felicidade": bew.felicidade}})
            txtAlimentados = txtAlimentados + `~[${bew.felicidade}] | **${bew.nome}** alimentado, **${comida[0]} ${comida[3]}**.\n`
        }

        await updateUser(interaction.db,ficha)

        switch(colora){
            case 'A':colora = '0x000000';break;
            case 'B':colora = '0xFFFFFF';break;
            case 'C':colora = 'RED';break;
            case 'D':colora = 'YELLOW';break;
            case 'E':colora = 'GREEN';break;
            case 'F':colora = 'AQUA';break;
            case 'G':colora = 'DARKBLUE';break;
            case 'H':colora = 'PURPLE';break;
        }

        let msg = new MessageEmbed()
            .setTitle('Bews alimentados!')
            .setColor(colora)
            .setImage(link)
            .setDescription(`*Os Bews se recusam a comer comidas que não gostam ou que não podem comer.*\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n${txtAlimentados}**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**`)
            .setFooter({text: 'WK Company', iconURL: 'https://i.imgur.com/B73wyqP.gif'})
            .setTimestamp()
        return interaction.reply({embeds: [msg]});
    }
}