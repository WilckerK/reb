module.exports = async(client, message) =>{
    const fundos = client.db.collection('fundos');
    const painel = await fundos.findOne({"_id": "01"});
    painel.mercador
}