const checkUser = require('../checkUser');

module.exports = async(client) =>{
    const db = client.db;
    
    const users = await db.collection('users');
    const escolhido = await users.aggregate([{"$match":{"_id":{"$not":{"$eq": "0"}}}},{"$sample": {"size": 1}}]).toArray();
    const ficha = escolhido[0];

    const rbw = await client.guilds.cache.get('732276333429784707');
    const member = await rbw.members.cache.get(ficha._id);

    if(!member)
        {return}

    const bew = ficha.bews[Math.floor(Math.random() * ficha.bews.length) + 1];

    if(!bew)
        {return}
    const valor = Math.floor(ficha.rewbs / 20);
    ficha.rewbs += valor;
    const updateUser = require('../updateUser');

    await updateUser(db, ficha);
    await member.send({content: `Seu Bew **${bew.nome}** acaba de encontrar **${valor} Rewbs**, não se esqueça de o agradecer.`});
}