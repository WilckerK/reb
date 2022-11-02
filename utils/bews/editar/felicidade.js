const checkUser = require('../../checkUser');
const updateUser = require('../../updateUser')
module.exports = async (db, client) =>{
    try{
        const bewDB = await db.collection('bews');
        const escolhido = await bewDB.aggregate([{"$match":{"_id":{"$not":{"$eq": "INS000H12C1REEPS1S2I115151545"}}}},{"$sample": {"size": 1}}]).toArray();
        const bew = escolhido[0];

        const tristeza = Math.ceil(Math.random() * 7);
        bew.felicidade =(bew.felicidade > 1 && bew.felicidade - tristeza < 1)?1:
                        (bew.felicidade > 10 && bew.felicidade - tristeza < 10)?10:
                        bew.felicidade - tristeza;
        await bewDB.updateOne({_id: bew._id}, {$set: bew});
        
        try {
            const rbw = await client.guilds.cache.get('732276333429784707');
            const member = await rbw.members.cache.get(bew.dono[0]);
            
            if(member.user.bot)
                {return}
            if(member && bew.felicidade <= 20 && bew.felicidade % 10 == 0 && bew.felicidade > 0){
                member.send({content: 'Seu bew '+ bew.nome +' está morrendo de fome, por favor o alimente o mais rápido possível!!!'}).catch((err) => {});
            }
            if(member && bew.felicidade == 1){
                member.send({content: 'Seu bew '+ bew.nome +' está quase fugindo, tente alimenta-lo para que mude de ideia!!!'}).catch((err) => {});
            }
        } catch (err) {}
        
        if(bew.felicidade > 0)
            {return}
        
        await bewDB.deleteOne({"_id": bew._id});
        const ficha = await checkUser(db, bew.dono[0]);
        const arrayBews = [].concat(ficha.bews);
        const index = arrayBews.findIndex((currObj) => {
            if(!element.nome)
                {return}
            return currObj.nome.toLowerCase() === bew.nome.toLowerCase()
        });

        arrayBews.splice(index, 1);
        ficha.bews = arrayBews;
        ficha.rewbs -= Math.ceil(ficha.rewbs / 15);
        
        await updateUser(db, ficha);
    }catch(err){}
}