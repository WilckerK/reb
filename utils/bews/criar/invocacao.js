
module.exports = async(db, userId, bew, client) =>{
    
    if(!bew.pers){
        bew = await producao(db,bew);
    }
    
    bew = await finalizar(db,bew,userId);
    if(!bew.pers){
        bew = await producao(db,bew);
        bew = await finalizar(db,bew,userId);
    }

    const montagem = require('./montagem');
    bew.link = await montagem(db, bew, client); //passando client
    await adicionarADatabase(db, bew);
    return bew;

    async function producao(db, bew){
        /*id, [raçaId, sexo, raça, genero], Rank, personalidade, [cor, brasões], habs, {ATQ, VEL, ACE, RES}, nome, link */
        
        /*Raça*/
        const bewsBase = await db.collection('bewsBase');
        const racaData = await bewsBase.aggregate([{"$match":{"$and" : [{"_id":{"$not":{"$eq": "generos"}}},{"_id":{"$not":{"$eq": "000"}}}]}},{"$sample": {"size": 1}}]).toArray();
        bew.raca = [racaData[0]._id, (Math.ceil(Math.random() * 2) === 1 )?"M":"F"];

        /*Personalidade*/
        const persData = require('../personalidades');
        bew.pers = persData("gerar");

        /*Brasões*/
        const brasoes = require('../listaDeBrasoes');
        bew.bras = brasoes("gerar");
        
        /*Habs*/
        const habilidades = require('../habilidades');
        bew.habs = habilidades("gerar", bew.bras);

        /*Status*/
        bew.status.ATQ = Math.floor(Math.random() * 16);
        bew.status.VEL = Math.floor(Math.random() * 16);
        bew.status.ACE = Math.floor(Math.random() * 16);
        bew.status.RES = Math.floor(Math.random() * 46);

        if(Math.ceil(Math.random() * 10) == 10){
            bew = variar(bew);
        }

        const racaConfirm = await bewsBase.findOne({'_id': bew.raca[0]});
        bew.raca.push(racaConfirm.raca);
        bew.raca.push(racaConfirm.genero);

        return bew

    }

    function variar(bew){
        if(Math.ceil(Math.random() * 100) == 100){
            bew.raca[0] = "000"; //Psytal
            bew.raca[1] = "X";
        }
        if(Math.ceil(Math.random() * 2) == 2){
            bew.pers[0] = "INS"; //Insano
        }

        if(Math.ceil(Math.random() * 10) <= 4){
            bew.bras[2] = bew.bras[1]; // Mesmo brasão
        }
        if(Math.ceil(Math.random() * 5) == 5){
            bew.raca[1] = "H"; //Hermafrodita
        }else if(Math.ceil(Math.random() * 10) <= 3){
            bew.raca[1] = "X"; // Sem Genero
        }
        return bew
    }

    async function finalizar(db, bew, userId){ //rank, id, nome
        bew.rank = Math.floor((bew.status.ATQ + bew.status.VEL + bew.status.ACE)/7) + Math.floor(bew.status.RES / 13) + (bew.habs[0]);
        bew.rank = (bew.rank < 10)?`0${bew.rank}`:`${bew.rank}`;

        bew._id =`${bew.pers}${bew.raca[0]}${bew.raca[1]}${bew.rank}${bew.bras[0]}${bew.bras[1]}${bew.bras[2]}${bew.habs[1]}${bew.habs[2]}${bew.habs[3]}`+
        `${(bew.status.ATQ < 10)? "0" + bew.status.ATQ:bew.status.ATQ}${(bew.status.VEL < 10)? "0" + bew.status.VEL:bew.status.VEL}`+
        `${(bew.status.ACE < 10)? "0" + bew.status.ACE:bew.status.ACE}${(bew.status.RES < 10)? "0" + bew.status.RES:bew.status.RES}`;
        
        const checkin = await db.collection('bews').findOne({_id : bew._id});
        if(checkin)
            {return {_id: null, raca: [], rank: 0, pers: null, bras:[], habs:[], status: {ATQ: null, VEL: null, ACE: null, RES: null}, equip: "", dono: [bew.dono[0]], nome: null, link: null, felicidade: 100 } }
        
        bew.status.ATQ += 10; bew.status.VEL += 10; bew.status.ACE += 10; bew.status.RES += 80;

        const letras = {vogais: "aaeeiioouuy", consoantes:"bcdfghjklmnprstwvxz", final: "hkmnrswvxz"};
        const getLetra = (x) => {
            if(x == 'Consoante')return letras.consoantes[Math.floor(Math.random() * letras.consoantes.length)]
            else if (x == 'Final')return letras.final[Math.floor(Math.random() * letras.final.length)]
            else if (x == 'Vogal')return letras.vogais[Math.floor(Math.random() * letras.vogais.length)]
        }
        
        let letraCheck = false;
        bew.nome = (Math.ceil(Math.random() * 26) <= 6)?getLetra('Vogal').toUpperCase():getLetra('Consoante').toUpperCase();
        do{
            if(bew.nome.length >= 3 && letras.vogais.includes(bew.nome[bew.nome.length - 1])){
                if(Math.ceil(Math.random() * 10) > 7){
                    bew.nome = bew.nome + getLetra('Final'); letraCheck = true;
                }else if(Math.ceil(Math.random() * 8) >= 4){letraCheck = true;}
                else if (bew.nome.length >= 6){letraCheck = true;}
            }
            if(letraCheck == false && letras.vogais.includes(bew.nome[bew.nome.length - 1].toLowerCase())){
                bew.nome = bew.nome + getLetra('Consoante');
            }else if (letraCheck == false){
                bew.nome = bew.nome + getLetra('Vogal');
            }
        }while(letraCheck == false)

        return bew
    }

    async function adicionarADatabase(db, bew){
        const bews = await db.collection('bews');
        await bews.insertOne(bew);
    }
}