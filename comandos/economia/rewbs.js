const { MessageEmbed } = require('discord.js');
const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');
module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'rewbs' ,
            desc: 'Ganhe Rewbs diáriamente na Rebewllion.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        const ficha = await checkUser(interaction.db, interaction.member.id);
        const horaDoProximoDaily = new Date(ficha.daily);
        const dataAtual = new Date();
        if(dataAtual.getTime() < horaDoProximoDaily.getTime()){
            const diferenca = new Date(horaDoProximoDaily.getTime() - dataAtual.getTime());
            interaction.reply({content: `Você deve esperar o intervalo para receber um outro daily de Rewbs. Ainda faltam ${diferenca.getUTCHours()} horas e ${diferenca.getUTCMinutes()} minutos.`, ephemeral: true});
            return
        }
        const taxaRiqueza = (100 - Math.ceil(ficha.rewbs / 500) < 0)?0:100 - Math.ceil(ficha.rewbs / 500); 
        const valor = 50 + (taxaRiqueza * 2) + Math.floor(Math.random() * (36 + (ficha.bews.length * 5)));

        ficha.rewbs += valor;
        dataAtual.setUTCHours(dataAtual.getUTCHours() + 20);
        ficha.daily = dataAtual;

        await updateUser(interaction.db, ficha, interaction.channel);
        const msg = new MessageEmbed()
            .setTitle('Daily de Rewbs')
            .setColor('RANDOM')
            .setDescription(`Você recebeu **${valor} Rewbs**!!! Seu próximo daily de Rewbs estará disponivel daqui 20 horas.`);
        interaction.reply({embeds: [msg]});

        const felicidade = require('../../utils/bews/editar/felicidade');
        await felicidade(interaction.db, this.client)
    }   
}