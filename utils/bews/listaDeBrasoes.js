module.exports = (parametro, ...args) =>{
    const lista = { //Bate forte, bate fraco, aguenta
        RE :["Rei", ["EP","RE"],["ET","RO"],["SO","FO"], '👑',"RE",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558645349535884/1.png'],
        EP :["Espada", ["FE","RO"],["LI","MI"],["MU","SO"], '⚔️',"EP",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558645781536868/2.png'],
        MU :["Música", ["SO","MU"],["EP","EN"],["BO","ET"], '🎵',"MU",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558646259687475/3.png'],
        EN :["Engrenagem", ["CI","EP"],["NU","CA"],["FE","MU"], '⚙️',"EN",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558646754623559/4.png'],
        SO :["Sorriso", ["BO","LI"],["RE","EP"],["NU","BO"], '🙂',"SO",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558755869425746/5.png'],
        BO :["Bondade", ["RE","MI"],["MU","SO"],["FE","CA"], '💚',"BO",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558756255318136/6.png'],
        LI :["Livro", ["FO","MU"],["FE","CI"],["EP","MI"], '📙',"LI",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558756607639763/7.png'],
        FE :["Fera", ["AN","FE"],["BO","EN"],["LI","ET"], '🐾',"FE",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558757022875688/8.png'],
        RO :["Rosas", ["SO","NU"],["AN","FO"],["NU","RE"], '🌹',"RO",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558831106863244/9.png'],
        CA :["Catalisador", ["ET","CI"],["CA","BO"],["EN","CA"], '⚗️',"CA",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558831517900930/10.png'],
        MI :["Mistério", ["CA","FO"],["LI","AN"],["CI","EP"], '🌑',"MI",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558831924748308/11.png'],
        ET :["Estrela", ["MI","RO"],["FE","MU"],["AN","RE"], '🌟',"ET",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558832373542992/12.png'],
        NU :["Nuvem", ["EN","ET"],["SO","RO"],["AN","EN"], '☁️',"NU",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558922551070760/13.png'],
        CI :["Cibernético", ["NU","AN"],["CI","MI"],["CI","LI"], '📱',"CI",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558923054383154/14.png'],
        FO :["Fortuna", ["EN","BO"],["FO","RE"],["FO","RO"], '💰',"FO",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558923549311047/15.png'],
        AN :["Ancião", ["LI","CA"],["ET","NU"],["MI","RO"], '⏳',"AN",'https://cdn.discordapp.com/attachments/1030554748664946809/1030558924056825916/16.png'],
    }
    
    if(parametro == "get"){
        let brasArr = {
            nomes: [lista[args[0]][0], lista[args[1]][0]],
            alpha: lista[args[0]][1], 
            omega: lista[args[1]][3],
        }

        brasArr.emoji = {
            alpha: lista[args[0]][4],
            alphas: [lista[brasArr.alpha[0]][4],lista[brasArr.alpha[1]][4]],
            omega: lista[args[1]][4],
            omegas: [lista[brasArr.omega[0]][4],lista[brasArr.omega[1]][4]]
        }
        return brasArr;
    }

    if(parametro == "gerar"){
        const keys = Object.keys(lista);
        return [
            `${String.fromCharCode(65+Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 4)}`,
            keys[keys.length * Math.random() << 0],
            keys[keys.length * Math.random() << 0]
        ]
    }

    if(parametro == "roletar"){
        let bras = Math.ceil(Math.random() * 16);
        switch(bras){
            case 1: bras = 'RE';break;
            case 2: bras = 'EP';break;
            case 3: bras = 'MU';break;
            case 4: bras = 'EN';break;
            case 5: bras = 'SO';break;
            case 6: bras = 'BO';break;
            case 7: bras = 'LI';break;
            case 8: bras = 'FE';break;
            case 9: bras = 'RO';break;
            case 10: bras = 'CA';break;
            case 11: bras = 'MI';break;
            case 12: bras = 'ET';break;
            case 13: bras = 'NU';break;
            case 14: bras = 'CI';break;
            case 15: bras = 'FO';break;
            case 16: bras = 'AN';break;
        }

        return lista[bras];
    }
}