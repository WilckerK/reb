const comando = require('../../estrutura/Comando')
const checkUser = require('../../utils/checkUser')
const updateUser = require('../../utils/updateUser')

module.exports = class extends comando{
    constructor(client){
        super(client, {
            nome: 'frase' ,
            desc: 'Decide qual a sua frase no /perfil',
            requireDatabase: true,
            options: [
                {
                    name: 'mensagem',
                    type:'STRING',
                    description: 'Qual a mensagem que você quer deixar no seu perfil?',
                    required: true
                }
            ]
        })
    }

    run = async(interaction) => {
        const mensagem = interaction.options.getString('mensagem');

        if(mensagem.length > 160){
            interaction.reply({content: 'A mensagem não pode ter mais de 160 caracteres.', ephemeral: true})
            return
        }

        const ficha = await checkUser(interaction.db, interaction.user.id);
        ficha.frase = mensagem.trim();
        await updateUser(interaction.db,ficha);

        interaction.reply({content: 'Nova frase upada com sucesso.', ephemeral: true})

    }
}