module.exports = async (channelId, client) => {  //Valor dos chats para os fundos
    const dataAtual = new Date();
    const fundos = await client.db.collection("fundos");
    const objetoPrincipal = await fundos.findOne({"_id" : "01"});
    let horaDoFechamento = new Date(objetoPrincipal.fechamento);

    if (!objetoPrincipal.fechamento){ //caso n tenha hora ainda (se for a primeira vez)
        horaDoFechamento = dataAtual;
        horaDoFechamento.setUTCHours(24,0,0,0) //seta para o dia seguinte
        await fundos.updateOne({"_id" : "01"}, {$set: {fechamento: horaDoFechamento}}, { upsert: true });
    } 

    const filterChannel = {"_id" : channelId };
    const channelObjeto = await fundos.findOne(filterChannel);
    if(!channelObjeto){
        dataAtual.setUTCMinutes(dataAtual.getUTCMinutes() + 10);
        await fundos.updateOne(filterChannel, {$set: {valuation: 1, delay: dataAtual}}, { upsert: true });
        return
    }

    const dataDelay = new Date(channelObjeto.delay);
    if((dataAtual.getTime() < dataDelay.getTime()))
        {return}

    let contar = channelObjeto.valuation;
    contar++;
    dataAtual.setUTCMinutes(dataAtual.getUTCMinutes() + 10);
    await fundos.updateOne(filterChannel, {$set: {valuation: contar, delay: dataAtual}}, { upsert: true });
}