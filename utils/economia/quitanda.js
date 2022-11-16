const updateUser = require("../updateUser");
const checkUser = require("../checkUser");

module.exports = async (user, client, message) =>{
try{
    const db = client.db;

    let emojis = Array.from(message.content);
    emojis = emojis.filter(item => {
        return item !== ' '
    });

    if(emojis.length > 1){
        for (let i = 1; i < emojis.length; i++) {
            const element = emojis[i];
            if(element != emojis[0]){
                await message.reply({content: 'Você precisa mandar apenas emojis iguais para comprar vários da mesma opção.'})
                return
            }
        }
    }

    const fundos = await db.collection('fundos');
    const painel = await fundos.findOne({"_id": "01"});
    let painelComidas = painel.comidas.filter(element => {
        return element[0] == emojis[0]
    });
    if(painelComidas.length == 0){
        await message.reply({content: "Essa opção não está a venda. Tente escolher uma das disponíveis."});
        return
    }
    painelComidas = painelComidas[0];

    const ficha = await checkUser(db, user);

    if(ficha.rewbs < emojis.length * painelComidas[2]){
        await message.reply({content: "Você não tem Rewbs o suficiente pra concluir a compra."});
        return
    }

    ficha.rewbs -= emojis.length * painelComidas[2];

    let jaTem = -1;
    for (let i = 0; i < ficha.geladeira.length; i++) {
        const element = ficha.geladeira[i];
        if(element[3] == painelComidas[3]){
            jaTem = i;
            break;       
        }
    }

    if(jaTem != -1){
        ficha.geladeira[jaTem][5] += emojis.length;
    }else{
        painelComidas.push(emojis.length);
        ficha.geladeira.push(painelComidas);
    }
    try{
        ficha.geladeira = await ficha.geladeira.filter( async(element) =>{
        return element[5] >= 1
    })}catch(err){}
    
    
    await updateUser(db, ficha);

    await message.react(emojis[0]);
}catch(err){}
}