const comando = require('../../estrutura/Comando');
const checkUser = require('../../utils/checkUser');
const updateUser = require('../../utils/updateUser');

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'meucanal' ,
            desc: 'Cria um chat apenas para você na rebewllion.',
            requireDatabase: true
        })
    }

    run = async(interaction) => {
        if(!interaction.member.roles.cache.get('967147397232853082')){
            interaction.reply({content: 'Para usar esse comando você pelo menos precisa ser Nobre.', ephemeral: true});    
            return
        }

        const ficha = await checkUser(interaction.db, interaction.member.id);
        if(ficha.rewbs < 50000){
            interaction.reply({content: 'Você precisa pagar 50.000 Rewbs para poder criar um canal próprio.', ephemeral: true});    
            return
        }

        ficha.rewbs -= 50000;

        interaction.reply({content: '**Meus parabéns, agora é dono de um chat próprio no servidor!!!**', ephemeral: true});

        interaction.guild.channels.create(`${interaction.member.displayName}`, {type: 'GUILD_TEXT'}).then(async(channel) => {
            channel.setParent('967156388876935178');
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false });
            channel.permissionOverwrites.create(interaction.member, {VIEW_CHANNEL: true,
                SEND_MESSAGES: true, MANAGE_MESSAGES: true, MANAGE_ROLES: true, MANAGE_CHANNELS : true, })

            channel.send(`<@${interaction.member.id}>`);
            
            await updateUser(interaction.db, ficha);
        });
        
    }
}