const Evento = require('../../estrutura/Evento');
const virarDoDia = require('../../utils/virarDoDia');

module.exports = class extends Evento {
    constructor(client) {
        super(client, {
            nome: 'messageCreate'
        })
    }

    run = async (message) => {
        try{
            virarDoDia(this.client);
            if(message.author.bot)
                {return}
            //Só de meme =====================================================
            if(message.content.toLowerCase() == '<@753285621514240080>'){
                await message.channel.send({content: '<@753285621514240080>' });
                return
            }
            if(message.content.toLowerCase() == "hype <:rbw_hype:800827734414327828>"){
                const {MessageEmbed} = require('discord.js');
                let msg = new MessageEmbed()
                    .setTitle("Hype")
                    .setColor(0xF8E71C)
                    .setImage("https://cdn.discordapp.com/emojis/800827734414327828.webp");
                    
                await message.channel.send({embeds: [msg]});
                return
            }
            //~~W~~
            if(message.content.toLowerCase().includes('~~w')){
                await message.delete().catch((err) => {})
                const rbw = await this.client.guilds.cache.get('732276333429784707');
                const member = await rbw.members.cache.get(message.author.id);
                member.timeout(15 * 60000, 'Kkkkkkkkkkkkkk corta o w dnv trouxão.').catch((err) => {});
                member.send({content: 'Kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk corta o w dnv trouxão \n**W** Supremacy 🛐\nhttps://tenor.com/view/humiliation-humiliate-have-you-been-humiliated-today-gif-11837502 '}).catch((err) => {});
                
                return
            }

            //drops =================================SPAWN RATE==================================
            if(Math.ceil(Math.random() * 125) == 125){
                const drops = require('../../utils/economia/drops');
                await drops(message, this.client);
            }

            //presente
            if(Math.ceil(Math.random() * 200) == 200){
                const presenteDoBew = require('../../utils/economia/presenteDoBew');
                await presenteDoBew(this.client);
            }

            //missões
            if(Math.ceil(Math.random() * 180) == 180 && message.channelId != '1028819143992025099'){
                const rbw = await this.client.guilds.cache.get('732276333429784707');
                if(await rbw.channels.cache.get('1028819143992025099').name != '『📕』missão'){
                    const missoes = require('../../utils/bews/editar/missoes');
                    await missoes(this.client);
                }
            }

            const listaDeChannels = require('../../utils/listaDeChannels'); 
            //ladrão
            if((listaDeChannels.indexOf(message.channelId) !== -1) && Math.ceil(Math.random() * 190) == 190){
                const ladrao = require('../../utils/economia/ladrao');
                await ladrao(message, this.client);
            }

            //felicicdade
            if(Math.ceil(Math.random() * 40) == 40){
                const felicidade = require('../../utils/bews/editar/felicidade');
                await felicidade(this.client.db, this.client)
            }

            
            //valuation ========================CHATS ESPECIFICOS====================================
            if((listaDeChannels.indexOf(message.channelId) !== -1)){
                const valuation = require('../../utils/economia/valuation');
                await valuation(message.channelId, this.client); 
                return
            }

            //quitanda
            if(message.channelId === '1028704898247823501' && 
                'áéíóúàèìòùãõâêîôû.,;:/?][<)(1234567890!@#$%&*-_+="\\|abcdefghijklmnopqrstuvwxyz'.indexOf(message.content[0].toLowerCase()) == -1){
                const quitanda = require('../../utils/economia/quitanda');
                await quitanda(message.author.id, this.client, message).catch((err) => {console.log(err)});
                return
            }

            //mercador
            if(message.channelId == '1038861867310923867' &&
            'áéíóúàèìòùãõâêîôû.,;:/?][<)(67890!@#$%&*-_+="\\|abcdefghijklmnopqrstuvwxyz'.indexOf(message.content[0].toLowerCase()) == -1){
                const mercador = require('../../utils/economia/mercador');
                await mercador(this.client, message).catch((err) => {console.log(err)});
                return
            }

            //roleta
            if(message.channelId === '1030546622742016020' && (message.content.toLowerCase() === 'br' ||
                message.content.toLowerCase() === 'brasão' || message.content.toLowerCase() === 'brasao')){
                const roletaDeBrasao = require('../../utils/brasas/roletaDeBrasao');
                await roletaDeBrasao(message, this.client);
                return
            }

            //inserção
            const listaDeBase = require('../../utils/listaDeBase');
            if((listaDeBase.indexOf(message.channelId) !== -1)){
                if(message.attachments && message.content){
                    const insercao = require('../../utils/bews/criar/insercao');
                    await insercao(this.client, message); 
                    return
                }
            }
        }catch(err){}
    }

}