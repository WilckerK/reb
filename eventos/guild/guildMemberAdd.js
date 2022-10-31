const Evento = require('../../estrutura/Evento');
const checkUser = require('../../utils/checkUser');
const invocacao = require('../../utils/bews/criar/invocacao');
const updateUser = require('../../utils/updateUser');
const { MessageEmbed } = require('discord.js');
const presenteDoBew = require('../../utils/economia/presenteDoBew');

module.exports = class extends Evento {
    constructor(client) {
        super(client, {
            nome: 'guildMemberAdd'
        })
    }

    run = async (member) => {
    try{
        if(member.user.bot)
            {return}
        const ficha = await checkUser(this.client.db,member.id);
        if(ficha.bews.length > 1 || ficha.rewbs != 300 || ficha.bras)
            {return}
        
        const bewVazio = {_id: null, raca: [], rank: 0, pers: null, bras:[], habs:[], status: {ATQ: null, VEL: null, ACE: null, RES: null}, equip: "", dono: [member.id], nome: null, link: null, felicidade: 100 }
        //const bewVazio = {}
        await invocacao(this.client.db, member.id, bewVazio, this.client).then( async(bew) =>{
            let colora = '';
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

            ficha.bews.push({bewId: bew._id, nome: bew.nome, raca: bew.raca[2]});
            await updateUser(this.client.db, ficha);
            
            const msg = new MessageEmbed()
                .setTitle(bew.nome)
                .setColor(colora)
                .setImage(bew.link)
                .setDescription(`***Parabéns!!!*** Você acaba de ganhar um Bew! `+ '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + 
                `*Os bews são os "pets" da Rebewllion.*\nPor favor cuide bem deles, pois podem ficar com fome e acabar fungindo se não forem cuidados da maneira correta.`+ 
                '\n**◇◆ ▬▬▬▬▬▬◆◇◆◇▬▬▬▬▬▬ ◆◇**\n' + ` **Cada Bew é unico e só você tem ele.**\n*Para mais informações do seu Bew, envie "/bew ${bew.nome}" na Rebewllion*`);
            const message = await member.send({embeds: [msg]}).catch((err) => {});
            for (let i = 0; i < 3; i++) {
                if(message.attachments|| message.embeds[0].url || message.embeds[0].image){break;}
                else{
                    msg.setImage(bew.link);
                    await message.edit({embeds: [msg], fetchReply: true})
                }
            }
        });

        setTimeout(async() => {
            await presenteDoBew(this.client, member.id);
        }, 2 * 60000);
    }catch(err){}
    }
}