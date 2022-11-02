module.exports = async(db, userID) => {
    
    let user;
    const users = await db.collection("users");
    try{
        user = await users.findOne({"_id" : userID});
        if(user === null)
            {throw "null"}
        if(!user.cofre)
            {user.cofre = 1}
        if(!user.bras){
            user.bras = {
                roletas: 4,
                roletasMax: 4,
                brasoes:{
                    RE: 0,EP: 0,MU: 0,EN: 0,SO: 0,BO: 0,LI: 0,FE: 0,RO: 0,CA: 0,MI: 0,ET: 0,NU: 0,CI: 0,FO: 0,AN: 0,
                },
                brasas:[],
                pego: false,
                tempoParaRoletar: new Date(Date.UTC(2000, 01, 01))
            }
        }
        if(!user.torre){
            user.torre = {
                nivel: 0,
                tempoDeAtaque: new Date(),
                brasoesNecessarios:[torreBrasoes[1], torreBrasoes[2]],
                atacado: false,
                atacante: null,
                ataquesVencidos: 0
            }
        }
    }catch{
        await users.insertOne({
            "_id": userID,
            "rewbs": 300,
            "cofre": 1,
            "frase":'Olha que frase insana 😎, mas você pode alterar ela com o comando /frase.',
            "daily": new Date(Date.UTC(2000,01,01)),
            "fundos":[
                {"nome": "GRL10", "qtd" : 0},
                {"nome": "ANI86", "qtd" : 0},
                {"nome": "GMS43", "qtd" : 0},
                {"nome": "FLM94", "qtd" : 0},
                {"nome": "ESP16", "qtd" : 0},
                {"nome": "MMB69", "qtd" : 0},
                {"nome": "PUB23", "qtd" : 0},
                {"nome": "PRS75", "qtd" : 0}
            ],
            "bews": [6],
            "geladeira":[],
            "bras": {
                "roletas": 4,
                "roletasMax": 4,
                "brasoes":{
                    RE: 0,EP: 0,MU: 0,EN: 0,SO: 0,BO: 0,LI: 0,FE: 0,RO: 0,CA: 0,MI: 0,ET: 0,NU: 0,CI: 0,FO: 0,AN: 0,
                },
                "brasas":[],
                "pego": false,
                "tempoParaRoletar": new Date(Date.UTC(2000, 01, 01))
            },
            "torre": {
                "nivel": 0,
                "tempoDeAtaque": new Date(),
                "brasoesNecessarios":[],
                "atacado": false,
                "atacante": null,
                "ataquesVencidos": 0
            },
            "mina": {
                "carvoes": 0,
                "local": 0,
                "picareta": 0,
                "bewMinerador": null
            }
        });

        user = await users.findOne({"_id" : userID});
    }
    
    return user
}