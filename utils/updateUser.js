module.exports = async(db, ficha, ...args) => {
    
    const users = await db.collection("users");

    try{
        ficha.rewbs = Math.floor(ficha.rewbs);
        if(ficha.rewbs < 0){ficha.rewbs = 0}
        if(!ficha.cofre){ficha.cofre = 1}
        const rewbsMax = 35000 + (ficha.cofre - 1) * 15000;
        if(ficha.rewbs > rewbsMax){
            ficha.rewbs = rewbsMax;
            try{
                if(args[0]){
                    args[0].send({content: `<@${ficha._id}> seu cofre chegou ao máximo, por favor aumente com o comando /cofre.`})
                }
            }catch(err){}
        }
        await users.updateOne({_id: ficha._id}, {$set: ficha});
    }catch(err){
        console.log(`${err}\n${JSON.stringify(ficha)}`)
    }
}