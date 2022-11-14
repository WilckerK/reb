const listaMercadorias = require("./listaMercadorias");

module.exports = async(client, message) =>{
    const fundos = client.db.collection('fundos');
    const painel = await fundos.findOne({"_id": "01"});
    
    
}